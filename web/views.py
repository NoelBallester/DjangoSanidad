from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.urls import reverse
from django.contrib import messages

from api.models import Cassette, Muestra, Imagen, Citologia, MuestraCitologia, ImagenCitologia, Tecnico
from .forms import (CassetteForm, MuestraForm, InformeForm, ImagenForm,
                    CitologiaForm, MuestraCitologiaForm, ImagenCitologiaForm)


# ── Auth ─────────────────────────────────────────────────────────────────────

def login_view(request):
    if request.user.is_authenticated:
        return redirect('cassettes')
    error = None
    if request.method == 'POST':
        tecnico_id = request.POST.get('tecnico_id', '').strip()
        password = request.POST.get('password', '')
        try:
            tecnico = Tecnico.objects.get(pk=tecnico_id)
            if (tecnico.check_password(password) or tecnico.password == password) and tecnico.is_active:
                tecnico.backend = 'django.contrib.auth.backends.ModelBackend'
                login(request, tecnico)
                return redirect(request.GET.get('next', 'cassettes'))
        except (Tecnico.DoesNotExist, ValueError, TypeError):
            pass
        error = 'ID o contraseña incorrectos.'
    return render(request, 'web/login.html', {'error': error})


@require_POST
def logout_view(request):
    logout(request)
    return redirect('login')


# ── Cassettes (lista + detalle) ───────────────────────────────────────────────

def cassette_list(request):
    qs = Cassette.objects.order_by('-fecha')

    organo = request.GET.get('organo', '').strip()
    numero = request.GET.get('numero', '').strip()
    inicio = request.GET.get('inicio', '').strip()
    fin    = request.GET.get('fin', '').strip()
    sel_pk = request.GET.get('cassette', '').strip()

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

    if sel_pk:
        try:
            selected = Cassette.objects.get(pk=sel_pk)
            try:
                muestras_con_imagenes = [
                    {'muestra': m, 'imagenes': Imagen.objects.filter(muestra=m)}
                    for m in Muestra.objects.filter(cassette=selected)
                ]
            except Exception:
                muestras_con_imagenes = []
        except Cassette.DoesNotExist:
            pass

    return render(request, 'web/cassettes.html', {
        'cassettes':             qs,
        'selected':              selected,
        'muestras_con_imagenes': muestras_con_imagenes,
        'cassette_form':         CassetteForm(instance=selected) if selected else CassetteForm(),
        'nuevo_cassette_form':   CassetteForm(),
        'muestra_form':          MuestraForm(),
        'informe_form': InformeForm(initial={
            'informe_descripcion':   selected.informe_descripcion   if selected else '',
            'informe_fecha':         selected.informe_fecha          if selected else '',
            'informe_tincion':       selected.informe_tincion        if selected else '',
            'informe_observaciones': selected.informe_observaciones  if selected else '',
        }) if selected else None,
        'filtros': {'organo': organo, 'numero': numero, 'inicio': inicio, 'fin': fin},
    })


# ── Cassette CRUD ─────────────────────────────────────────────────────────────

@require_POST
def cassette_create(request):
    form = CassetteForm(request.POST)
    if form.is_valid():
        tecnico = request.user if request.user.is_authenticated else None
        c = form.save(tecnico=tecnico)
        return redirect(reverse('cassettes') + f'?cassette={c.pk}')
    messages.error(request, 'Error al crear el cassette. Revisa los campos.')
    return redirect('cassettes')


@require_POST
def cassette_update(request, pk):
    cassette = get_object_or_404(Cassette, pk=pk)
    form = CassetteForm(request.POST, instance=cassette)
    if form.is_valid():
        form.save()
        return redirect(reverse('cassettes') + f'?cassette={pk}')
    messages.error(request, 'Error al modificar el cassette.')
    return redirect(reverse('cassettes') + f'?cassette={pk}')


@require_POST
def cassette_delete(request, pk):
    get_object_or_404(Cassette, pk=pk).delete()
    return redirect('cassettes')


@require_POST
def cassette_informe(request, pk):
    cassette = get_object_or_404(Cassette, pk=pk)
    form = InformeForm(request.POST, request.FILES)
    if form.is_valid():
        cassette.informe_descripcion   = form.cleaned_data['informe_descripcion']
        cassette.informe_fecha         = form.cleaned_data['informe_fecha']
        cassette.informe_tincion       = form.cleaned_data['informe_tincion']
        cassette.informe_observaciones = form.cleaned_data['informe_observaciones']
        img = form.cleaned_data.get('informe_imagen')
        if img:
            cassette.informe_imagen = img.read()
        cassette.save()
    return redirect(reverse('cassettes') + f'?cassette={pk}')


# ── Muestras ──────────────────────────────────────────────────────────────────

@require_POST
def muestra_create(request, cassette_pk):
    cassette = get_object_or_404(Cassette, pk=cassette_pk)
    form = MuestraForm(request.POST)
    if form.is_valid():
        form.save(cassette=cassette)
    return redirect(reverse('cassettes') + f'?cassette={cassette_pk}')


@require_POST
def muestra_update(request, pk):
    muestra = get_object_or_404(Muestra, pk=pk)
    form = MuestraForm(request.POST, instance=muestra)
    if form.is_valid():
        form.save()
    return redirect(reverse('cassettes') + f'?cassette={muestra.cassette_id}')


@require_POST
def muestra_delete(request, pk):
    muestra = get_object_or_404(Muestra, pk=pk)
    cid = muestra.cassette_id
    muestra.delete()
    return redirect(reverse('cassettes') + f'?cassette={cid}')


# ── Imágenes ──────────────────────────────────────────────────────────────────

@require_POST
def imagen_upload(request, muestra_pk):
    muestra = get_object_or_404(Muestra, pk=muestra_pk)
    form = ImagenForm(request.POST, request.FILES)
    if form.is_valid():
        img = form.save(commit=False)
        img.muestra = muestra
        img.save()
    return redirect(reverse('cassettes') + f'?cassette={muestra.cassette_id}')


@require_POST
def imagen_delete(request, pk):
    imagen = get_object_or_404(Imagen, pk=pk)
    cid = imagen.muestra.cassette_id
    imagen.imagen.delete(save=False)
    imagen.delete()
    return redirect(reverse('cassettes') + f'?cassette={cid}')


# ── Citologías (lista + detalle) ──────────────────────────────────────────────

def citologia_list(request):
    qs = Citologia.objects.select_related('tecnico').order_by('-fecha')

    organo = request.GET.get('organo', '').strip()
    numero = request.GET.get('numero', '').strip()
    inicio = request.GET.get('inicio', '').strip()
    fin    = request.GET.get('fin', '').strip()
    sel_pk = request.GET.get('citologia', '').strip()

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

    if sel_pk:
        try:
            selected = Citologia.objects.select_related('tecnico').get(pk=sel_pk)
            muestras_con_imagenes = [
                {'muestra': m, 'imagenes': ImagenCitologia.objects.filter(muestra=m)}
                for m in MuestraCitologia.objects.filter(citologia=selected)
            ]
        except Citologia.DoesNotExist:
            pass

    return render(request, 'web/citologias.html', {
        'citologias':            qs,
        'selected':              selected,
        'muestras_con_imagenes': muestras_con_imagenes,
        'citologia_form':        CitologiaForm(instance=selected) if selected else CitologiaForm(),
        'nueva_citologia_form':  CitologiaForm(),
        'muestra_form':          MuestraCitologiaForm(),
        'informe_form': None,
        'filtros': {'organo': organo, 'numero': numero, 'inicio': inicio, 'fin': fin},
    })


# ── Citología CRUD ────────────────────────────────────────────────────────────

@require_POST
def citologia_create(request):
    form = CitologiaForm(request.POST)
    if form.is_valid():
        tecnico = request.user if request.user.is_authenticated else None
        c = form.save(tecnico=tecnico)
        return redirect(reverse('citologias') + f'?citologia={c.pk}')
    messages.error(request, 'Error al crear la citología. Revisa los campos.')
    return redirect('citologias')


@require_POST
def citologia_update(request, pk):
    citologia = get_object_or_404(Citologia, pk=pk)
    form = CitologiaForm(request.POST, instance=citologia)
    if form.is_valid():
        form.save()
        return redirect(reverse('citologias') + f'?citologia={pk}')
    messages.error(request, 'Error al modificar la citología.')
    return redirect(reverse('citologias') + f'?citologia={pk}')


@require_POST
def citologia_delete(request, pk):
    get_object_or_404(Citologia, pk=pk).delete()
    return redirect('citologias')


@require_POST
def citologia_informe(request, pk):
    citologia = get_object_or_404(Citologia, pk=pk)
    form = InformeForm(request.POST, request.FILES)
    if form.is_valid():
        citologia.informe_descripcion   = form.cleaned_data['informe_descripcion']
        citologia.informe_fecha         = form.cleaned_data['informe_fecha']
        citologia.informe_tincion       = form.cleaned_data['informe_tincion']
        citologia.informe_observaciones = form.cleaned_data['informe_observaciones']
        img = form.cleaned_data.get('informe_imagen')
        if img:
            citologia.informe_imagen = img.read()
        citologia.save()
    return redirect(reverse('citologias') + f'?citologia={pk}')


# ── Muestras Citología ────────────────────────────────────────────────────────

@require_POST
def muestra_citologia_create(request, citologia_pk):
    citologia = get_object_or_404(Citologia, pk=citologia_pk)
    form = MuestraCitologiaForm(request.POST)
    if form.is_valid():
        form.save(citologia=citologia)
    return redirect(reverse('citologias') + f'?citologia={citologia_pk}')


@require_POST
def muestra_citologia_update(request, pk):
    muestra = get_object_or_404(MuestraCitologia, pk=pk)
    form = MuestraCitologiaForm(request.POST, instance=muestra)
    if form.is_valid():
        form.save()
    return redirect(reverse('citologias') + f'?citologia={muestra.citologia_id}')


@require_POST
def muestra_citologia_delete(request, pk):
    muestra = get_object_or_404(MuestraCitologia, pk=pk)
    cid = muestra.citologia_id
    muestra.delete()
    return redirect(reverse('citologias') + f'?citologia={cid}')


# ── Imágenes Citología ────────────────────────────────────────────────────────

@require_POST
def imagen_citologia_upload(request, muestra_pk):
    muestra = get_object_or_404(MuestraCitologia, pk=muestra_pk)
    form = ImagenCitologiaForm(request.POST, request.FILES)
    if form.is_valid():
        img = form.save(commit=False)
        img.muestra = muestra
        img.save()
    return redirect(reverse('citologias') + f'?citologia={muestra.citologia_id}')


@require_POST
def imagen_citologia_delete(request, pk):
    imagen = get_object_or_404(ImagenCitologia, pk=pk)
    cid = imagen.muestra.citologia_id
    imagen.imagen.delete(save=False)
    imagen.delete()
    return redirect(reverse('citologias') + f'?citologia={cid}')
