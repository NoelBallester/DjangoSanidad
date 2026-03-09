from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.views.decorators.cache import never_cache
from django.urls import reverse
from django.contrib import messages
from urllib.parse import urlparse, parse_qs
import base64

from api.models import Cassette, Muestra, Imagen, Citologia, MuestraCitologia, ImagenCitologia, Tecnico, Hematologia, MuestraHematologia, ImagenHematologia, InformeResultado, Tubo, MuestraTubo, Microbiologia, MuestraMicrobiologia
from django.contrib.auth.hashers import make_password
from .forms import (CassetteForm, MuestraForm, InformeForm, ImagenForm,
                    CitologiaForm, MuestraCitologiaForm, ImagenCitologiaForm,
                    HematologiaForm, MuestraHematologiaForm, ImagenHematologiaForm,
                    TecnicoForm)


def _imagen_bytes_a_base64(imagen_bytes):
    if not imagen_bytes:
        return ''
    try:
        return base64.b64encode(bytes(imagen_bytes)).decode('utf-8')
    except Exception:
        return ''


def _build_qr_link(request, code):
    if not code:
        return ''
    return request.build_absolute_uri(reverse('qr_resolver') + f'?code={code}')


# ── Auth ─────────────────────────────────────────────────────────────────────

def login_view(request):
    if request.user.is_authenticated:
        return redirect('/index.html')
    error = None
    if request.method == 'POST':
        tecnico_id = request.POST.get('tecnico_id', '').strip()
        password = request.POST.get('password', '')
        # Intentar con authenticate primero (para contraseñas hasheadas)
        user = authenticate(request, id_tecnico=tecnico_id, password=password)
        
        if user is not None:
            login(request, user)
            return redirect(request.GET.get('next', '/index.html'))
        else:
            # Fallback para contraseñas en plano (si existen en la BD antigua)
            try:
                tecnico = Tecnico.objects.get(pk=tecnico_id)
                if tecnico.password == password and tecnico.is_active:
                    tecnico.backend = 'django.contrib.auth.backends.ModelBackend'
                    login(request, tecnico)
                    return redirect(request.GET.get('next', '/index.html'))
            except (Tecnico.DoesNotExist, ValueError):
                pass
        error = 'ID o contraseña incorrectos.'
    return render(request, 'web/login.html', {'error': error})


@require_POST
def logout_view(request):
    logout(request)
    return redirect('login')


# ── Cassettes (lista + detalle) ───────────────────────────────────────────────

@never_cache
@login_required
def cassette_list(request):
    qs = Cassette.objects.order_by('-fecha')

    organo = request.GET.get('organo', '').strip()
    numero = request.GET.get('numero', '').strip()
    inicio = request.GET.get('inicio', '').strip()
    fin    = request.GET.get('fin', '').strip()
    sel_pk = request.GET.get('cassette', '').strip()
    informe_pk = request.GET.get('informe', '').strip()

    if organo and organo != '*':
        qs = qs.filter(organo__icontains=organo)
    if numero:
        qs = qs.filter(cassette__icontains=numero)
    if inicio and fin:
        qs = qs.filter(fecha__gte=inicio, fecha__lte=fin)

    if not any([organo, numero, inicio, fin]):
        qs = qs[:10]

    selected = None
    muestras_con_imagenes = []
    informes_resultado = []
    informe_activo = None
    informe_imagen_base64 = ''

    selected_qr_url = ''

    if sel_pk:
        try:
            selected = Cassette.objects.get(pk=sel_pk)
            try:
                muestras_con_imagenes = [
                    {
                        'muestra': m,
                        'imagenes': Imagen.objects.filter(muestra=m),
                        'qr_url': _build_qr_link(request, m.qr_muestra),
                    }
                    for m in Muestra.objects.filter(cassette=selected)
                ]
            except Exception:
                muestras_con_imagenes = []

            selected_qr_url = _build_qr_link(request, selected.qr_casette)

            informes_resultado = list(
                InformeResultado.objects.filter(cassette=selected).order_by('-fecha', '-creado_en', '-id_informe')
            )

            if informe_pk and informe_pk != 'nuevo':
                informe_activo = next((item for item in informes_resultado if str(item.pk) == informe_pk), None)

            if informe_activo and informe_activo.imagen:
                informe_imagen_base64 = _imagen_bytes_a_base64(informe_activo.imagen)
            elif selected.informe_imagen:
                informe_imagen_base64 = _imagen_bytes_a_base64(selected.informe_imagen)
        except Cassette.DoesNotExist:
            pass

    informe_initial = None
    if selected:
        if informe_activo:
            informe_initial = {
                'informe_descripcion': informe_activo.descripcion or '',
                'informe_fecha': informe_activo.fecha,
                'informe_tincion': informe_activo.tincion or '',
                'informe_observaciones': informe_activo.observaciones or '',
            }
        else:
            informe_initial = {
                'informe_descripcion': selected.informe_descripcion or '',
                'informe_fecha': selected.informe_fecha,
                'informe_tincion': selected.informe_tincion or '',
                'informe_observaciones': selected.informe_observaciones or '',
            }

    return render(request, 'web/cassettes.html', {
        'cassettes':             qs,
        'selected':              selected,
        'muestras_con_imagenes': muestras_con_imagenes,
        'cassette_form':         CassetteForm(instance=selected) if selected else CassetteForm(),
        'nuevo_cassette_form':   CassetteForm(),
        'muestra_form':          MuestraForm(),
        'informe_form': InformeForm(initial=informe_initial) if selected else None,
        'informes_resultado': informes_resultado,
        'informe_activo': informe_activo,
        'informe_imagen_base64': informe_imagen_base64,
        'selected_qr_url': selected_qr_url,
        'filtros': {'organo': organo, 'numero': numero, 'inicio': inicio, 'fin': fin},
    })


# ── Cassette CRUD ─────────────────────────────────────────────────────────────

@login_required
@require_POST
def cassette_create(request):
    form = CassetteForm(request.POST)
    if form.is_valid():
        tecnico = request.user if request.user.is_authenticated else None
        try:
            c = form.save(tecnico=tecnico)
            return redirect(reverse('cassettes') + f'?cassette={c.pk}')
        except Exception as e:
            messages.error(request, f'Error al guardar el cassette: {e}')
            return redirect('cassettes')
    error_detail = '; '.join(
        f'{form.fields[k].label or k}: {", ".join(v)}' if k != '__all__' else ', '.join(v)
        for k, v in form.errors.items()
    )
    messages.error(request, f'Error al crear el cassette — {error_detail}')
    return redirect('cassettes')


@login_required
@require_POST
def cassette_update(request, pk):
    cassette = get_object_or_404(Cassette, pk=pk)
    form = CassetteForm(request.POST, instance=cassette)
    if form.is_valid():
        form.save()
        return redirect(reverse('cassettes') + f'?cassette={pk}')
    messages.error(request, 'Error al modificar el cassette.')
    return redirect(reverse('cassettes') + f'?cassette={pk}')


@login_required
@require_POST
def cassette_delete(request, pk):
    get_object_or_404(Cassette, pk=pk).delete()
    return redirect('cassettes')


@login_required
@require_POST
def cassette_informe(request, pk):
    cassette = get_object_or_404(Cassette, pk=pk)
    form = InformeForm(request.POST, request.FILES)
    if form.is_valid():
        informe_id = request.POST.get('informe_id', '').strip()
        informe = None

        if informe_id:
            informe = InformeResultado.objects.filter(pk=informe_id, cassette=cassette).first()

        if informe is None:
            informe = InformeResultado(cassette=cassette)

        informe.descripcion = form.cleaned_data['informe_descripcion']
        informe.fecha = form.cleaned_data['informe_fecha']
        informe.tincion = form.cleaned_data['informe_tincion']
        informe.observaciones = form.cleaned_data['informe_observaciones']

        img = form.cleaned_data.get('informe_imagen')
        if img:
            informe.imagen = img.read()

        informe.save()
        messages.success(request, 'Informe de resultados guardado correctamente.')
        return redirect(reverse('cassettes') + f'?cassette={pk}&tab=informe&informe={informe.pk}')
    else:
        messages.error(request, 'No se pudo guardar el informe. Revisa los campos e inténtalo de nuevo.')
    return redirect(reverse('cassettes') + f'?cassette={pk}&tab=informe')


@login_required
@require_POST
def cassette_informe_delete(request, pk, informe_pk):
    cassette = get_object_or_404(Cassette, pk=pk)
    informe = get_object_or_404(InformeResultado, pk=informe_pk, cassette=cassette)
    informe.delete()
    messages.success(request, 'Informe eliminado correctamente.')
    return redirect(reverse('cassettes') + f'?cassette={pk}&tab=informe')


# ── Muestras ──────────────────────────────────────────────────────────────────

@login_required
@require_POST
def muestra_create(request, cassette_pk):
    cassette = get_object_or_404(Cassette, pk=cassette_pk)
    form = MuestraForm(request.POST)
    if form.is_valid():
        form.save(cassette=cassette)
    return redirect(reverse('cassettes') + f'?cassette={cassette_pk}')


@login_required
@require_POST
def muestra_update(request, pk):
    muestra = get_object_or_404(Muestra, pk=pk)
    form = MuestraForm(request.POST, instance=muestra)
    if form.is_valid():
        form.save()
    return redirect(reverse('cassettes') + f'?cassette={muestra.cassette_id}')


@login_required
@require_POST
def muestra_delete(request, pk):
    muestra = get_object_or_404(Muestra, pk=pk)
    cid = muestra.cassette_id
    muestra.delete()
    return redirect(reverse('cassettes') + f'?cassette={cid}')


# ── Imágenes ──────────────────────────────────────────────────────────────────

@login_required
@require_POST
def imagen_upload(request, muestra_pk):
    muestra = get_object_or_404(Muestra, pk=muestra_pk)
    form = ImagenForm(request.POST, request.FILES)
    if form.is_valid():
        img = form.save(commit=False)
        img.muestra = muestra
        img.save()
    return redirect(reverse('cassettes') + f'?cassette={muestra.cassette_id}')


@login_required
@require_POST
def imagen_delete(request, pk):
    imagen = get_object_or_404(Imagen, pk=pk)
    cid = imagen.muestra.cassette_id
    imagen.imagen.delete(save=False)
    imagen.delete()
    return redirect(reverse('cassettes') + f'?cassette={cid}')


# ── Citologías (lista + detalle) ──────────────────────────────────────────────

@never_cache
@login_required
def citologia_list(request):
    qs = Citologia.objects.select_related('tecnico').order_by('-fecha')

    organo = request.GET.get('organo', '').strip()
    numero = request.GET.get('numero', '').strip()
    inicio = request.GET.get('inicio', '').strip()
    fin    = request.GET.get('fin', '').strip()
    sel_pk = request.GET.get('citologia', '').strip()
    informe_pk = request.GET.get('informe', '').strip()

    if organo and organo != '*':
        qs = qs.filter(organo__icontains=organo)
    if numero:
        qs = qs.filter(citologia__icontains=numero)
    if inicio and fin:
        qs = qs.filter(fecha__gte=inicio, fecha__lte=fin)

    if not any([organo, numero, inicio, fin]):
        qs = qs[:10]

    selected = None
    muestras_con_imagenes = []
    informes_resultado = []
    informe_activo = None
    informe_imagen_base64 = ''

    selected_qr_url = ''

    if sel_pk:
        try:
            selected = Citologia.objects.select_related('tecnico').get(pk=sel_pk)
            muestras_con_imagenes = [
                {
                    'muestra': m,
                    'imagenes': ImagenCitologia.objects.filter(muestra=m),
                    'qr_url': _build_qr_link(request, m.qr_muestra),
                }
                for m in MuestraCitologia.objects.filter(citologia=selected)
            ]

            selected_qr_url = _build_qr_link(request, selected.qr_citologia)

            informes_resultado = list(
                InformeResultado.objects.filter(citologia=selected).order_by('-fecha', '-creado_en', '-id_informe')
            )

            if informe_pk and informe_pk != 'nuevo':
                informe_activo = next((item for item in informes_resultado if str(item.pk) == informe_pk), None)

            if informe_activo and informe_activo.imagen:
                informe_imagen_base64 = _imagen_bytes_a_base64(informe_activo.imagen)
        except Citologia.DoesNotExist:
            pass

    informe_initial = None
    if selected:
        if informe_activo:
            informe_initial = {
                'informe_descripcion': informe_activo.descripcion or '',
                'informe_fecha': informe_activo.fecha,
                'informe_tincion': informe_activo.tincion or '',
                'informe_observaciones': informe_activo.observaciones or '',
            }
        else:
            informe_initial = {
                'informe_descripcion': '',
                'informe_fecha': '',
                'informe_tincion': '',
                'informe_observaciones': '',
            }

    return render(request, 'web/citologias.html', {
        'citologias':            qs,
        'selected':              selected,
        'muestras_con_imagenes': muestras_con_imagenes,
        'citologia_form':        CitologiaForm(instance=selected) if selected else CitologiaForm(),
        'nueva_citologia_form':  CitologiaForm(),
        'muestra_form':          MuestraCitologiaForm(),
        'informe_form': InformeForm(initial=informe_initial) if selected else None,
        'informes_resultado': informes_resultado,
        'informe_activo': informe_activo,
        'informe_imagen_base64': informe_imagen_base64,
        'selected_qr_url': selected_qr_url,
        'filtros': {'organo': organo, 'numero': numero, 'inicio': inicio, 'fin': fin},
    })


@never_cache
@login_required
def qr_resolver(request):
    payload = (request.GET.get('code') or '').strip()
    if not payload:
        messages.error(request, 'No se recibió ningún código QR.')
        return redirect('cassettes')

    # Si escanean una URL completa del sistema, extraemos el parámetro code cuando exista.
    if payload.startswith('http://') or payload.startswith('https://'):
        try:
            parsed = urlparse(payload)
            code_candidates = parse_qs(parsed.query).get('code', [])
            if code_candidates and code_candidates[0].strip():
                payload = code_candidates[0].strip()
        except Exception:
            pass

    cassette = Cassette.objects.filter(qr_casette=payload).first()
    if cassette:
        return redirect(reverse('cassettes') + f'?cassette={cassette.pk}')

    citologia = Citologia.objects.filter(qr_citologia=payload).first()
    if citologia:
        return redirect(reverse('citologias') + f'?citologia={citologia.pk}')

    muestra_cassette = Muestra.objects.filter(qr_muestra=payload).select_related('cassette').first()
    if muestra_cassette:
        return redirect(reverse('cassettes') + f'?cassette={muestra_cassette.cassette_id}&muestra={muestra_cassette.pk}')

    muestra_citologia = MuestraCitologia.objects.filter(qr_muestra=payload).select_related('citologia').first()
    if muestra_citologia:
        return redirect(reverse('citologias') + f'?citologia={muestra_citologia.citologia_id}&muestra={muestra_citologia.pk}')

    hematologia = Hematologia.objects.filter(qr_hematologia=payload).first()
    if hematologia:
        return redirect(reverse('hematologias') + f'?hematologia={hematologia.pk}')

    muestra_hematologia = MuestraHematologia.objects.filter(qr_muestra=payload).select_related('hematologia').first()
    if muestra_hematologia:
        return redirect(reverse('hematologias') + f'?hematologia={muestra_hematologia.hematologia_id}&muestra={muestra_hematologia.pk}')

    tubo = Tubo.objects.filter(qr_tubo=payload).first()
    if tubo:
        return redirect(f'/bioquimica.html?tubo={tubo.pk}')

    muestra_tubo = MuestraTubo.objects.filter(qr_muestra=payload).select_related('tubo').first()
    if muestra_tubo:
        return redirect(f'/bioquimica.html?tubo={muestra_tubo.tubo_id}&muestra={muestra_tubo.pk}')

    microbiologia = Microbiologia.objects.filter(qr_microbiologia=payload).first()
    if microbiologia:
        return redirect(f'/microbiologia.html?microbiologia={microbiologia.pk}')

    muestra_microbiologia = MuestraMicrobiologia.objects.filter(qr_muestra=payload).select_related('microbiologia').first()
    if muestra_microbiologia:
        return redirect(f'/microbiologia.html?microbiologia={muestra_microbiologia.microbiologia_id}&muestra={muestra_microbiologia.pk}')

    messages.error(request, 'No se encontró ninguna muestra, citología o cassette para ese QR.')
    return redirect('cassettes')


# ── Citología CRUD ────────────────────────────────────────────────────────────

@login_required
@require_POST
def citologia_create(request):
    form = CitologiaForm(request.POST)
    if form.is_valid():
        tecnico = request.user if request.user.is_authenticated else None
        try:
            c = form.save(tecnico=tecnico)
            return redirect(reverse('citologias') + f'?citologia={c.pk}')
        except Exception as e:
            messages.error(request, f'Error al guardar la citología: {e}')
            return redirect('citologias')
    error_detail = '; '.join(
        f'{form.fields[k].label or k}: {", ".join(v)}' if k != '__all__' else ', '.join(v)
        for k, v in form.errors.items()
    )
    messages.error(request, f'Error al crear la citología — {error_detail}')
    return redirect('citologias')


@login_required
@require_POST
def citologia_update(request, pk):
    citologia = get_object_or_404(Citologia, pk=pk)
    form = CitologiaForm(request.POST, instance=citologia)
    if form.is_valid():
        form.save()
        return redirect(reverse('citologias') + f'?citologia={pk}')
    messages.error(request, 'Error al modificar la citología.')
    return redirect(reverse('citologias') + f'?citologia={pk}')


@login_required
@require_POST
def citologia_delete(request, pk):
    get_object_or_404(Citologia, pk=pk).delete()
    return redirect('citologias')


@login_required
@require_POST
def citologia_informe(request, pk):
    citologia = get_object_or_404(Citologia, pk=pk)
    form = InformeForm(request.POST, request.FILES)
    if form.is_valid():
        informe_id = request.POST.get('informe_id', '').strip()
        informe = None

        if informe_id:
            informe = InformeResultado.objects.filter(pk=informe_id, citologia=citologia).first()

        if informe is None:
            informe = InformeResultado(citologia=citologia)

        informe.descripcion = form.cleaned_data['informe_descripcion']
        informe.fecha = form.cleaned_data['informe_fecha']
        informe.tincion = form.cleaned_data['informe_tincion']
        informe.observaciones = form.cleaned_data['informe_observaciones']

        img = form.cleaned_data.get('informe_imagen')
        if img:
            informe.imagen = img.read()

        informe.save()
        messages.success(request, 'Informe de resultados guardado correctamente.')
        return redirect(reverse('citologias') + f'?citologia={pk}&tab=informe&informe={informe.pk}')
    else:
        messages.error(request, 'No se pudo guardar el informe. Revisa los campos e inténtalo de nuevo.')
    return redirect(reverse('citologias') + f'?citologia={pk}&tab=informe')


@login_required
@require_POST
def citologia_informe_delete(request, pk, informe_pk):
    citologia = get_object_or_404(Citologia, pk=pk)
    informe = get_object_or_404(InformeResultado, pk=informe_pk, citologia=citologia)
    informe.delete()
    messages.success(request, 'Informe eliminado correctamente.')
    return redirect(reverse('citologias') + f'?citologia={pk}&tab=informe')


# ── Muestras Citología ────────────────────────────────────────────────────────

@login_required
@require_POST
def muestra_citologia_create(request, citologia_pk):
    citologia = get_object_or_404(Citologia, pk=citologia_pk)
    form = MuestraCitologiaForm(request.POST)
    if form.is_valid():
        form.save(citologia=citologia)
    return redirect(reverse('citologias') + f'?citologia={citologia_pk}')


@login_required
@require_POST
def muestra_citologia_update(request, pk):
    muestra = get_object_or_404(MuestraCitologia, pk=pk)
    form = MuestraCitologiaForm(request.POST, instance=muestra)
    if form.is_valid():
        form.save()
    return redirect(reverse('citologias') + f'?citologia={muestra.citologia_id}')


@login_required
@require_POST
def muestra_citologia_delete(request, pk):
    muestra = get_object_or_404(MuestraCitologia, pk=pk)
    cid = muestra.citologia_id
    muestra.delete()
    return redirect(reverse('citologias') + f'?citologia={cid}')


# ── Imágenes Citología ────────────────────────────────────────────────────────

@login_required
@require_POST
def imagen_citologia_upload(request, muestra_pk):
    muestra = get_object_or_404(MuestraCitologia, pk=muestra_pk)
    form = ImagenCitologiaForm(request.POST, request.FILES)
    if form.is_valid():
        img = form.save(commit=False)
        img.muestra = muestra
        img.save()
    return redirect(reverse('citologias') + f'?citologia={muestra.citologia_id}')


@login_required
@require_POST
def imagen_citologia_delete(request, pk):
    imagen = get_object_or_404(ImagenCitologia, pk=pk)
    cid = imagen.muestra.citologia_id
    imagen.imagen.delete(save=False)
    imagen.delete()
    return redirect(reverse('citologias') + f'?citologia={cid}')


# ── Hematologías (lista + detalle) ──────────────────────────────────────────────

@never_cache
@login_required
def hematologia_list(request):
    qs = Hematologia.objects.select_related('tecnico').order_by('-fecha')

    organo = request.GET.get('organo', '').strip()
    numero = request.GET.get('numero', '').strip()
    inicio = request.GET.get('inicio', '').strip()
    fin    = request.GET.get('fin', '').strip()
    sel_pk = request.GET.get('hematologia', '').strip()

    if organo and organo != '*':
        qs = qs.filter(organo__icontains=organo)
    if numero:
        qs = qs.filter(hematologia__icontains=numero)
    if inicio and fin:
        qs = qs.filter(fecha__gte=inicio, fecha__lte=fin)

    if not any([organo, numero, inicio, fin]):
        qs = qs[:10]

    selected = None
    muestras_con_imagenes = []
    selected_qr_url = ''

    if sel_pk:
        try:
            selected = Hematologia.objects.select_related('tecnico').get(pk=sel_pk)
            muestras_con_imagenes = [
                {
                    'muestra': m,
                    'imagenes': ImagenHematologia.objects.filter(muestra=m),
                    'qr_url': _build_qr_link(request, m.qr_muestra),
                }
                for m in MuestraHematologia.objects.filter(hematologia=selected)
            ]
            selected_qr_url = _build_qr_link(request, selected.qr_hematologia)
        except Hematologia.DoesNotExist:
            pass

    return render(request, 'web/hematologias.html', {
        'hematologias':          qs,
        'selected':              selected,
        'muestras_con_imagenes': muestras_con_imagenes,
        'hematologia_form':      HematologiaForm(instance=selected) if selected else HematologiaForm(),
        'nueva_hematologia_form': HematologiaForm(),
        'muestra_form':          MuestraHematologiaForm(),
        'informe_form': None,
        'selected_qr_url': selected_qr_url,
        'filtros': {'organo': organo, 'numero': numero, 'inicio': inicio, 'fin': fin},
    })


# ── Hematología CRUD ────────────────────────────────────────────────────────────

@login_required
@require_POST
def hematologia_create(request):
    form = HematologiaForm(request.POST)
    if form.is_valid():
        tecnico = request.user if request.user.is_authenticated else None
        h = form.save(tecnico=tecnico)
        return redirect(reverse('hematologias') + f'?hematologia={h.pk}')
    messages.error(request, 'Error al crear la hematología. Revisa los campos.')
    return redirect('hematologias')


@login_required
@require_POST
def hematologia_update(request, pk):
    hematologia = get_object_or_404(Hematologia, pk=pk)
    form = HematologiaForm(request.POST, instance=hematologia)
    if form.is_valid():
        form.save()
        return redirect(reverse('hematologias') + f'?hematologia={pk}')
    messages.error(request, 'Error al modificar la hematología.')
    return redirect(reverse('hematologias') + f'?hematologia={pk}')


@login_required
@require_POST
def hematologia_delete(request, pk):
    get_object_or_404(Hematologia, pk=pk).delete()
    return redirect('hematologias')


@login_required
@require_POST
def hematologia_informe(request, pk):
    hematologia = get_object_or_404(Hematologia, pk=pk)
    form = InformeForm(request.POST, request.FILES)
    if form.is_valid():
        hematologia.informe_descripcion   = form.cleaned_data['informe_descripcion']
        hematologia.informe_fecha         = form.cleaned_data['informe_fecha']
        hematologia.informe_tincion       = form.cleaned_data['informe_tincion']
        hematologia.informe_observaciones = form.cleaned_data['informe_observaciones']
        img = form.cleaned_data.get('informe_imagen')
        if img:
            hematologia.informe_imagen = img.read()
        hematologia.save()
    return redirect(reverse('hematologias') + f'?hematologia={pk}')


# ── Muestras Hematología ────────────────────────────────────────────────────────

@login_required
@require_POST
def muestra_hematologia_create(request, hematologia_pk):
    hematologia = get_object_or_404(Hematologia, pk=hematologia_pk)
    form = MuestraHematologiaForm(request.POST)
    if form.is_valid():
        form.save(hematologia=hematologia)
    return redirect(reverse('hematologias') + f'?hematologia={hematologia_pk}')


@login_required
@require_POST
def muestra_hematologia_update(request, pk):
    muestra = get_object_or_404(MuestraHematologia, pk=pk)
    form = MuestraHematologiaForm(request.POST, instance=muestra)
    if form.is_valid():
        form.save()
    return redirect(reverse('hematologias') + f'?hematologia={muestra.hematologia_id}')


@login_required
@require_POST
def muestra_hematologia_delete(request, pk):
    muestra = get_object_or_404(MuestraHematologia, pk=pk)
    hid = muestra.hematologia_id
    muestra.delete()
    return redirect(reverse('hematologias') + f'?hematologia={hid}')


# ── Imágenes Hematología ────────────────────────────────────────────────────────

@login_required
@require_POST
def imagen_hematologia_upload(request, muestra_pk):
    muestra = get_object_or_404(MuestraHematologia, pk=muestra_pk)
    form = ImagenHematologiaForm(request.POST, request.FILES)
    if form.is_valid():
        img_file = form.cleaned_data.get('imagen')
        if img_file:
            ImagenHematologia.objects.create(
                muestra=muestra,
                imagen=img_file.read()
            )
    return redirect(reverse('hematologias') + f'?hematologia={muestra.hematologia_id}')


@login_required
@require_POST
def imagen_hematologia_delete(request, pk):
    imagen = get_object_or_404(ImagenHematologia, pk=pk)
    hid = imagen.muestra.hematologia_id
    imagen.delete()
    return redirect(reverse('hematologias') + f'?hematologia={hid}')


# ── Usuarios ──────────────────────────────────────────────────────────────────

@never_cache
@login_required
def usuario_list(request):
    tecnicos = Tecnico.objects.order_by('nombre', 'apellidos')
    form = TecnicoForm()
    return render(request, 'web/usuarios.html', {'tecnicos': tecnicos, 'form': form})


@login_required
def usuario_create(request):
    if not request.user.is_staff:
        messages.error(request, 'No tienes permisos para crear usuarios.')
        return redirect('usuarios')
    if request.method == 'POST':
        form = TecnicoForm(request.POST)
        if form.is_valid():
            tecnico = form.save(commit=False)
            pwd = form.cleaned_data.get('password')
            if pwd:
                tecnico.password = make_password(pwd)
            else:
                tecnico.set_unusable_password()
            tecnico.save()
            messages.success(request, f'Técnico "{tecnico.nombre} {tecnico.apellidos}" creado.')
    return redirect('usuarios')


@login_required
def usuario_update(request, pk):
    if not request.user.is_staff:
        messages.error(request, 'No tienes permisos para editar usuarios.')
        return redirect('usuarios')
    tecnico = get_object_or_404(Tecnico, pk=pk)
    if request.method == 'POST':
        form = TecnicoForm(request.POST, instance=tecnico)
        if form.is_valid():
            t = form.save(commit=False)
            pwd = form.cleaned_data.get('password')
            if pwd:
                t.password = make_password(pwd)
            t.save()
            messages.success(request, f'Técnico "{t.nombre} {t.apellidos}" actualizado.')
    return redirect('usuarios')


@login_required
@require_POST
def usuario_delete(request, pk):
    if not request.user.is_staff:
        messages.error(request, 'No tienes permisos para eliminar usuarios.')
        return redirect('usuarios')
    tecnico = get_object_or_404(Tecnico, pk=pk)
    if tecnico.pk == request.user.pk:
        messages.error(request, 'No puedes eliminarte a ti mismo.')
        return redirect('usuarios')
    nombre = f'{tecnico.nombre} {tecnico.apellidos}'
    tecnico.delete()
    messages.success(request, f'Técnico "{nombre}" eliminado.')
    return redirect('usuarios')
