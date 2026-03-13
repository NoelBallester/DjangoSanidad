from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.views.decorators.cache import never_cache
from django.urls import reverse
from django.contrib import messages
from django.conf import settings
from django.core.files.storage import default_storage
from django.contrib.contenttypes.models import ContentType
from django.db import connection
from django.db.utils import OperationalError, ProgrammingError
from django.utils import timezone
from django.utils.http import url_has_allowed_host_and_scheme
from urllib.parse import urlparse, parse_qs
import base64
import logging
import os
import re

from api.models import Cassette, Muestra, Imagen, Citologia, MuestraCitologia, ImagenCitologia, Necropsia, MuestraNecropsia, ImagenNecropsia, Tecnico, Hematologia, MuestraHematologia, ImagenHematologia, InformeResultado, Tubo, MuestraTubo, Microbiologia, MuestraMicrobiologia
from django.contrib.auth.hashers import make_password
from .forms import (CassetteForm, MuestraForm, InformeForm, ImagenForm,
                    CitologiaForm, MuestraCitologiaForm, ImagenCitologiaForm,
                    NecropsiaForm, MuestraNecropsiaForm, ImagenNecropsiaForm,
                    HematologiaForm, MuestraHematologiaForm, ImagenHematologiaForm,
                    TecnicoForm)

logger = logging.getLogger('web')


def _email_desde_username(username):
    slug = re.sub(r'[^a-z0-9._-]+', '.', (username or '').strip().lower()).strip('._-')
    if not slug:
        slug = 'tecnico'
    return f'{slug}@local.invalid'


def _email_unico_para_username(username, exclude_pk=None):
    base_email = _email_desde_username(username)
    local, domain = base_email.split('@', 1)
    idx = 0
    while True:
        candidato = f'{local}@{domain}' if idx == 0 else f'{local}.{idx}@{domain}'
        qs = Tecnico.objects.filter(email=candidato)
        if exclude_pk is not None:
            qs = qs.exclude(pk=exclude_pk)
        if not qs.exists():
            return candidato
        idx += 1


def _rol_valido(valor):
    permitidos = {k for k, _ in Tecnico.ROL_CHOICES}
    return valor if valor in permitidos else Tecnico.ROL_LABORATORIO


def _imagen_bytes_a_base64(imagen_bytes):
    raw = _leer_imagen_bytes(imagen_bytes)
    if not raw:
        return ''
    try:
        return base64.b64encode(raw).decode('utf-8')
    except Exception:
        return ''


def _leer_imagen_bytes(imagen_value):
    if not imagen_value:
        return b''

    if isinstance(imagen_value, memoryview):
        return imagen_value.tobytes()

    if isinstance(imagen_value, (bytes, bytearray)):
        return bytes(imagen_value)

    try:
        if hasattr(imagen_value, 'open'):
            imagen_value.open('rb')
        if hasattr(imagen_value, 'read'):
            contenido = imagen_value.read()
            if contenido:
                return bytes(contenido)
    except Exception:
        pass
    finally:
        try:
            if hasattr(imagen_value, 'close'):
                imagen_value.close()
        except Exception:
            pass

    ruta = getattr(imagen_value, 'path', None)
    if ruta and os.path.exists(ruta):
        try:
            with open(ruta, 'rb') as archivo:
                return archivo.read()
        except Exception:
            return b''

    return b''


def _mime_tipo_desde_bytes(imagen_bytes):
    raw = _leer_imagen_bytes(imagen_bytes)
    if not raw:
        return 'image/jpeg'

    if raw.startswith(b'\xff\xd8\xff'):
        return 'image/jpeg'
    if raw.startswith(b'\x89PNG\r\n\x1a\n'):
        return 'image/png'
    if raw.startswith((b'GIF87a', b'GIF89a')):
        return 'image/gif'
    if raw.startswith(b'BM'):
        return 'image/bmp'
    if raw.startswith(b'RIFF') and raw[8:12] == b'WEBP':
        return 'image/webp'
    return 'image/jpeg'


def _guardar_volante_peticion(archivo, instancia):
    """Guarda un archivo de volante de petición en la base de datos"""
    if not archivo:
        return
    
    instancia.volante_peticion = archivo.read()
    instancia.volante_peticion_nombre = archivo.name
    # No se almacena el Content-Type declarado por el cliente (SEC-16).
    # El tipo real se detecta por magic bytes al servir el archivo.


def _detectar_tipo_volante(content: bytes) -> str:
    """Detecta el Content-Type real de un volante por magic bytes."""
    if content[:4] == b'%PDF':
        return 'application/pdf'
    if content[:2] == b'PK':
        return 'application/octet-stream'  # docx/odt zip-based
    if content[:8] == b'\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1':
        return 'application/msword'  # legacy .doc
    if content[:3] == b'\xff\xd8\xff':
        return 'image/jpeg'
    if content[:8] == b'\x89PNG\r\n\x1a\n':
        return 'image/png'
    if content[:6] in (b'GIF87a', b'GIF89a'):
        return 'image/gif'
    return 'application/octet-stream'


def _build_qr_link(request, code):
    if not code:
        return ''
    return request.build_absolute_uri(reverse('qr_resolver') + f'?code={code}')


def _tabla_tiene_columnas(tabla, *columnas):
    try:
        with connection.cursor() as cursor:
            descripcion = connection.introspection.get_table_description(cursor, tabla)
    except Exception:
        return False

    disponibles = {getattr(columna, 'name', columna[0]) for columna in descripcion}
    return all(columna in disponibles for columna in columnas)


def _informes_genericos_disponibles():
    return _tabla_tiene_columnas('informesresultado', 'content_type_id', 'object_id')


def _columna_fk_legacy_informe(modelo):
    legacy_map = {
        Cassette: 'cassette_id',
        Citologia: 'citologia_id',
        Necropsia: 'necropsia_id',
        Hematologia: 'hematologia_id',
        Tubo: 'tubo_id',
        Microbiologia: 'microbiologia_id',
    }
    return legacy_map.get(modelo)


def _informes_legacy_disponibles(modelo):
    columna_fk = _columna_fk_legacy_informe(modelo)
    if not columna_fk:
        return False
    return _tabla_tiene_columnas('informesresultado', columna_fk)


def _guardar_archivo_informe(archivo):
    if not archivo:
        return None
    return default_storage.save(f'informes/{archivo.name}', archivo)


def _informes_por_registro(registro):
    if _informes_genericos_disponibles():
        ct = ContentType.objects.get_for_model(registro.__class__)
        try:
            return list(InformeResultado.objects.filter(content_type=ct, object_id=registro.pk).order_by('-fecha', '-creado_en', '-id_informe'))
        except (OperationalError, ProgrammingError):
            return []

    if not _informes_legacy_disponibles(registro.__class__):
        return []

    columna_fk = _columna_fk_legacy_informe(registro.__class__)
    try:
        query = (
            f"SELECT id AS id_informe, descripcion, fecha, tincion, observaciones, imagen, creado_en "
            f"FROM informesresultado WHERE {columna_fk} = %s "
            f"ORDER BY fecha DESC, creado_en DESC, id DESC"
        )
        return list(InformeResultado.objects.raw(query, [registro.pk]))
    except Exception:
        return []


# ── Auth ─────────────────────────────────────────────────────────────────────

def login_view(request):
    if request.user.is_authenticated:
        return redirect('/index.html')
    error = None
    if request.method == 'POST':
        tecnico_id = request.POST.get('tecnico_id', '').strip()
        password = request.POST.get('password', '')
        # El login solo permite contraseñas hasheadas por seguridad.
        user = authenticate(request, id_tecnico=tecnico_id, password=password)
        
        if user is not None:
            login(request, user)
            next_url = request.GET.get('next', '').strip()
            if next_url and url_has_allowed_host_and_scheme(next_url, allowed_hosts={request.get_host()}):
                return redirect(next_url)
            return redirect('/index.html')
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
    muestra_pk = request.GET.get('muestra', '').strip()
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
    selected_muestra_item = None
    informes_resultado = []
    informe_activo = None
    informe_imagen_base64 = ''

    selected_qr_url = ''

    if sel_pk:
        try:
            selected = Cassette.objects.get(pk=sel_pk)
            try:
                muestras_con_imagenes = []
                for m in Muestra.objects.filter(cassette=selected):
                    imagenes = []
                    for im in Imagen.objects.filter(muestra=m):
                        imagenes.append({
                            'pk': im.pk,
                            'mime_type': _mime_tipo_desde_bytes(im.imagen),
                            'imagen_base64': _imagen_bytes_a_base64(im.imagen),
                        })
                    muestras_con_imagenes.append({
                        'muestra': m,
                        'imagenes': imagenes,
                        'qr_url': _build_qr_link(request, m.qr_muestra),
                    })

                if muestra_pk:
                    selected_muestra_item = next(
                        (item for item in muestras_con_imagenes if str(item['muestra'].pk) == muestra_pk),
                        None,
                    )
                if selected_muestra_item is None and muestras_con_imagenes:
                    selected_muestra_item = muestras_con_imagenes[0]
            except Exception:
                muestras_con_imagenes = []

            selected_qr_url = _build_qr_link(request, selected.qr_casette)

            informes_resultado = _informes_por_registro(selected)

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
        'selected_muestra_item': selected_muestra_item,
        'cassette_form':         CassetteForm(instance=selected) if selected else CassetteForm(),
        'nuevo_cassette_form':   CassetteForm(),
        'muestra_form':          MuestraForm(),
        'informe_form': InformeForm(initial=informe_initial) if selected else None,
        'informes_resultado': informes_resultado,
        'informe_activo': informe_activo,
        'informe_imagen_base64': informe_imagen_base64,
        'selected_qr_url': selected_qr_url,
        'filtros': {'organo': organo, 'numero': numero, 'inicio': inicio, 'fin': fin},
        'todos_numeros': list(Cassette.objects.values_list('cassette', flat=True).order_by('cassette').distinct()),
    })


# ── Cassette CRUD ─────────────────────────────────────────────────────────────

@login_required
@require_POST
def cassette_create(request):
    form = CassetteForm(request.POST, request.FILES)
    if form.is_valid():
        tecnico = request.user if request.user.is_authenticated else None
        try:
            c = form.save(commit=False, tecnico=tecnico)
            # Manejar archivo de volante de petición
            volante_file = request.FILES.get('volante_peticion')
            if volante_file:
                _guardar_volante_peticion(volante_file, c)
            c.save()
            return redirect(reverse('cassettes') + f'?cassette={c.pk}')
        except Exception as e:
            logger.exception('Error al guardar cassette user=%s', request.user.pk)
            messages.error(request, 'Error interno al guardar el cassette. Contacta con el administrador.')
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
    form = CassetteForm(request.POST, request.FILES, instance=cassette)
    if form.is_valid():
        c = form.save(commit=False)
        # Manejar archivo de volante de petición
        volante_file = request.FILES.get('volante_peticion')
        if volante_file:
            _guardar_volante_peticion(volante_file, c)
        c.save()
        return redirect(reverse('cassettes') + f'?cassette={pk}')
    messages.error(request, 'Error al modificar el cassette.')
    return redirect(reverse('cassettes') + f'?cassette={pk}')


@login_required
@require_POST
def cassette_delete(request, pk):
    get_object_or_404(Cassette, pk=pk).delete()
    return redirect('cassettes')


def _guardar_informe(request, pk, modelo, fk_campo, redirect_name):
    registro = get_object_or_404(modelo, pk=pk)

    form = InformeForm(request.POST, request.FILES)
    if form.is_valid():
        informe_id = request.POST.get('informe_id', '').strip()
        if _informes_genericos_disponibles():
            ct = ContentType.objects.get_for_model(modelo)
            try:
                informe = InformeResultado.objects.filter(
                    pk=informe_id,
                    content_type=ct,
                    object_id=registro.pk,
                ).first() if informe_id else None
            except (OperationalError, ProgrammingError):
                messages.error(request, 'Error al guardar el informe con el esquema actual.')
                return redirect(reverse(redirect_name) + f'?{fk_campo}={pk}&tab=informe')

            if informe is None:
                informe = InformeResultado(content_type=ct, object_id=registro.pk)
            informe.descripcion = form.cleaned_data['informe_descripcion']
            informe.fecha = form.cleaned_data['informe_fecha']
            informe.tincion = form.cleaned_data['informe_tincion']
            informe.observaciones = form.cleaned_data['informe_observaciones']
            img = form.cleaned_data.get('informe_imagen')
            if img:
                informe.imagen = img.read()
            informe.save()
            messages.success(request, 'Informe de resultados guardado correctamente.')
            return redirect(reverse(redirect_name) + f'?{fk_campo}={pk}&tab=informe&informe={informe.pk}')

        if _informes_legacy_disponibles(modelo):
            columna_fk = _columna_fk_legacy_informe(modelo)
            img = form.cleaned_data.get('informe_imagen')
            img_path = _guardar_archivo_informe(img) if img else None

            try:
                with connection.cursor() as cursor:
                    if informe_id:
                        if img_path:
                            cursor.execute(
                                f"""
                                UPDATE informesresultado
                                SET descripcion=%s, fecha=%s, tincion=%s, observaciones=%s, imagen=%s
                                WHERE id=%s AND {columna_fk}=%s
                                """,
                                [
                                    form.cleaned_data['informe_descripcion'],
                                    form.cleaned_data['informe_fecha'],
                                    form.cleaned_data['informe_tincion'],
                                    form.cleaned_data['informe_observaciones'],
                                    img_path,
                                    informe_id,
                                    registro.pk,
                                ],
                            )
                        else:
                            cursor.execute(
                                f"""
                                UPDATE informesresultado
                                SET descripcion=%s, fecha=%s, tincion=%s, observaciones=%s
                                WHERE id=%s AND {columna_fk}=%s
                                """,
                                [
                                    form.cleaned_data['informe_descripcion'],
                                    form.cleaned_data['informe_fecha'],
                                    form.cleaned_data['informe_tincion'],
                                    form.cleaned_data['informe_observaciones'],
                                    informe_id,
                                    registro.pk,
                                ],
                            )
                        informe_pk = informe_id
                    else:
                        cursor.execute(
                            f"""
                            INSERT INTO informesresultado
                            (descripcion, fecha, tincion, observaciones, imagen, creado_en, {columna_fk})
                            VALUES (%s, %s, %s, %s, %s, CURRENT_TIMESTAMP, %s)
                            """,
                            [
                                form.cleaned_data['informe_descripcion'],
                                form.cleaned_data['informe_fecha'],
                                form.cleaned_data['informe_tincion'],
                                form.cleaned_data['informe_observaciones'],
                                img_path,
                                registro.pk,
                            ],
                        )
                        informe_pk = cursor.lastrowid
            except Exception:
                logger.exception('Error al guardar informe (esquema legacy) user=%s', request.user.pk)
                messages.error(request, 'Error interno al guardar el informe. Contacta con el administrador.')
                return redirect(reverse(redirect_name) + f'?{fk_campo}={pk}&tab=informe')

            messages.success(request, 'Informe de resultados guardado correctamente.')
            return redirect(reverse(redirect_name) + f'?{fk_campo}={pk}&tab=informe&informe={informe_pk}')

        messages.error(request, 'La base de datos actual no soporta informes vinculados para este módulo.')
        return redirect(reverse(redirect_name) + f'?{fk_campo}={pk}&tab=informe')
    messages.error(request, 'No se pudo guardar el informe. Revisa los campos e inténtalo de nuevo.')
    return redirect(reverse(redirect_name) + f'?{fk_campo}={pk}&tab=informe')


def _eliminar_informe(request, pk, informe_pk, modelo, fk_campo, redirect_name):
    registro = get_object_or_404(modelo, pk=pk)
    if _informes_genericos_disponibles():
        ct = ContentType.objects.get_for_model(modelo)
        try:
            informe = get_object_or_404(InformeResultado, pk=informe_pk, content_type=ct, object_id=registro.pk)
        except (OperationalError, ProgrammingError):
            messages.error(request, 'Error al eliminar el informe con el esquema actual.')
            return redirect(reverse(redirect_name) + f'?{fk_campo}={pk}&tab=informe')
        informe.delete()
        messages.success(request, 'Informe eliminado correctamente.')
        return redirect(reverse(redirect_name) + f'?{fk_campo}={pk}&tab=informe')

    if _informes_legacy_disponibles(modelo):
        columna_fk = _columna_fk_legacy_informe(modelo)
        with connection.cursor() as cursor:
            cursor.execute(
                f"DELETE FROM informesresultado WHERE id=%s AND {columna_fk}=%s",
                [informe_pk, registro.pk],
            )
        messages.success(request, 'Informe eliminado correctamente.')
        return redirect(reverse(redirect_name) + f'?{fk_campo}={pk}&tab=informe')

    messages.error(request, 'La base de datos actual no soporta informes vinculados para este módulo.')
    return redirect(reverse(redirect_name) + f'?{fk_campo}={pk}&tab=informe')


@login_required
@require_POST
def cassette_informe(request, pk):
    return _guardar_informe(request, pk, Cassette, 'cassette', 'cassettes')


@login_required
@require_POST
def cassette_informe_delete(request, pk, informe_pk):
    return _eliminar_informe(request, pk, informe_pk, Cassette, 'cassette', 'cassettes')


# ── Muestras ──────────────────────────────────────────────────────────────────

@login_required
@require_POST
def muestra_create(request, cassette_pk):
    cassette = get_object_or_404(Cassette, pk=cassette_pk)
    form = MuestraForm(request.POST)
    if form.is_valid():
        muestra = form.save(cassette=cassette)
        archivo_imagen = request.FILES.get('imagen')
        if archivo_imagen:
            Imagen.objects.create(muestra=muestra, imagen=archivo_imagen.read())
        return redirect(reverse('cassettes') + f'?cassette={cassette_pk}&muestra={muestra.pk}')
    return redirect(reverse('cassettes') + f'?cassette={cassette_pk}')


@login_required
@require_POST
def muestra_update(request, pk):
    muestra = get_object_or_404(Muestra, pk=pk)
    form = MuestraForm(request.POST, instance=muestra)
    if form.is_valid():
        form.save()
    return redirect(reverse('cassettes') + f'?cassette={muestra.cassette_id}&muestra={pk}')


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
    archivo_imagen = request.FILES.get('imagen')
    if archivo_imagen:
        Imagen.objects.create(muestra=muestra, imagen=archivo_imagen.read())
    return redirect(reverse('cassettes') + f'?cassette={muestra.cassette_id}&muestra={muestra.pk}')


@login_required
@require_POST
def imagen_delete(request, pk):
    imagen = get_object_or_404(Imagen, pk=pk)
    cid = imagen.muestra.cassette_id
    muestra_id = imagen.muestra_id
    imagen.delete()
    return redirect(reverse('cassettes') + f'?cassette={cid}&muestra={muestra_id}')


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
    muestra_pk = request.GET.get('muestra', '').strip()
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
    selected_muestra_item = None
    informes_resultado = []
    informe_activo = None
    informe_imagen_base64 = ''

    selected_qr_url = ''

    if sel_pk:
        try:
            selected = Citologia.objects.select_related('tecnico').get(pk=sel_pk)
            muestras_con_imagenes = []
            for m in MuestraCitologia.objects.filter(citologia=selected):
                imagenes = []
                for im in ImagenCitologia.objects.filter(muestra=m):
                    imagenes.append({
                        'pk': im.pk,
                        'mime_type': _mime_tipo_desde_bytes(im.imagen),
                        'imagen_base64': _imagen_bytes_a_base64(im.imagen),
                    })
                muestras_con_imagenes.append({
                    'muestra': m,
                    'imagenes': imagenes,
                    'qr_url': _build_qr_link(request, m.qr_muestra),
                })

            if muestra_pk:
                selected_muestra_item = next(
                    (item for item in muestras_con_imagenes if str(item['muestra'].pk) == muestra_pk),
                    None,
                )
            if selected_muestra_item is None and muestras_con_imagenes:
                selected_muestra_item = muestras_con_imagenes[0]

            selected_qr_url = _build_qr_link(request, selected.qr_citologia)

            informes_resultado = _informes_por_registro(selected)

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
        'selected_muestra_item': selected_muestra_item,
        'citologia_form':        CitologiaForm(instance=selected) if selected else CitologiaForm(),
        'nueva_citologia_form':  CitologiaForm(),
        'muestra_form':          MuestraCitologiaForm(),
        'informe_form': InformeForm(initial=informe_initial) if selected else None,
        'informes_resultado': informes_resultado,
        'informe_activo': informe_activo,
        'informe_imagen_base64': informe_imagen_base64,
        'selected_qr_url': selected_qr_url,
        'filtros': {'organo': organo, 'numero': numero, 'inicio': inicio, 'fin': fin},
        'todos_numeros': list(Citologia.objects.values_list('citologia', flat=True).order_by('citologia').distinct()),
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

    necropsia = Necropsia.objects.filter(qr_necropsia=payload).first()
    if necropsia:
        return redirect(reverse('necropsias') + f'?necropsia={necropsia.pk}')

    muestra_cassette = Muestra.objects.filter(qr_muestra=payload).select_related('cassette').first()
    if muestra_cassette:
        return redirect(reverse('cassettes') + f'?cassette={muestra_cassette.cassette_id}&muestra={muestra_cassette.pk}')

    muestra_citologia = MuestraCitologia.objects.filter(qr_muestra=payload).select_related('citologia').first()
    if muestra_citologia:
        return redirect(reverse('citologias') + f'?citologia={muestra_citologia.citologia_id}&muestra={muestra_citologia.pk}')

    muestra_necropsia = MuestraNecropsia.objects.filter(qr_muestra=payload).select_related('necropsia').first()
    if muestra_necropsia:
        return redirect(reverse('necropsias') + f'?necropsia={muestra_necropsia.necropsia_id}&muestra={muestra_necropsia.pk}')

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

    messages.error(request, 'No se encontró ninguna muestra, citología, necropsia o cassette para ese QR.')
    return redirect('cassettes')


# ── Citología CRUD ────────────────────────────────────────────────────────────

@login_required
@require_POST
def citologia_create(request):
    form = CitologiaForm(request.POST, request.FILES)
    if form.is_valid():
        tecnico = request.user if request.user.is_authenticated else None
        try:
            c = form.save(commit=False, tecnico=tecnico)
            # Manejar archivo de volante de petición
            volante_file = request.FILES.get('volante_peticion')
            if volante_file:
                _guardar_volante_peticion(volante_file, c)
            c.save()
            return redirect(reverse('citologias') + f'?citologia={c.pk}')
        except Exception as e:
            logger.exception('Error al guardar citologia user=%s', request.user.pk)
            messages.error(request, 'Error interno al guardar la citología. Contacta con el administrador.')
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
    form = CitologiaForm(request.POST, request.FILES, instance=citologia)
    if form.is_valid():
        c = form.save(commit=False)
        # Manejar archivo de volante de petición
        volante_file = request.FILES.get('volante_peticion')
        if volante_file:
            _guardar_volante_peticion(volante_file, c)
        c.save()
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
    return _guardar_informe(request, pk, Citologia, 'citologia', 'citologias')


@login_required
@require_POST
def citologia_informe_delete(request, pk, informe_pk):
    return _eliminar_informe(request, pk, informe_pk, Citologia, 'citologia', 'citologias')


# ── Muestras Citología ────────────────────────────────────────────────────────

@login_required
@require_POST
def muestra_citologia_create(request, citologia_pk):
    citologia = get_object_or_404(Citologia, pk=citologia_pk)
    form = MuestraCitologiaForm(request.POST)
    if form.is_valid():
        muestra = form.save(citologia=citologia)
        archivo_imagen = request.FILES.get('imagen')
        if archivo_imagen:
            ImagenCitologia.objects.create(muestra=muestra, imagen=archivo_imagen.read())
        return redirect(reverse('citologias') + f'?citologia={citologia_pk}&muestra={muestra.pk}')
    return redirect(reverse('citologias') + f'?citologia={citologia_pk}')


@login_required
@require_POST
def muestra_citologia_update(request, pk):
    muestra = get_object_or_404(MuestraCitologia, pk=pk)
    form = MuestraCitologiaForm(request.POST, instance=muestra)
    if form.is_valid():
        form.save()
    return redirect(reverse('citologias') + f'?citologia={muestra.citologia_id}&muestra={pk}')


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
    archivo_imagen = request.FILES.get('imagen')
    if archivo_imagen:
        ImagenCitologia.objects.create(muestra=muestra, imagen=archivo_imagen.read())
    return redirect(reverse('citologias') + f'?citologia={muestra.citologia_id}&muestra={muestra.pk}')


@login_required
@require_POST
def imagen_citologia_delete(request, pk):
    imagen = get_object_or_404(ImagenCitologia, pk=pk)
    cid = imagen.muestra.citologia_id
    muestra_id = imagen.muestra_id
    imagen.delete()
    return redirect(reverse('citologias') + f'?citologia={cid}&muestra={muestra_id}')


# ── Necropsias (lista + detalle) ────────────────────────────────────────────

@never_cache
@login_required
def necropsia_list(request):
    qs = Necropsia.objects.select_related('tecnico').order_by('-fecha')

    tipo_autopsia = request.GET.get('tipo_autopsia', '').strip()
    numero = request.GET.get('numero', '').strip()
    inicio = request.GET.get('inicio', '').strip()
    fin    = request.GET.get('fin', '').strip()
    sel_pk = request.GET.get('necropsia', '').strip()
    muestra_pk = request.GET.get('muestra', '').strip()
    informe_pk = request.GET.get('informe', '').strip()

    if tipo_autopsia and tipo_autopsia != '*':
        qs = qs.filter(tipo_necropsia=tipo_autopsia)
    if numero:
        qs = qs.filter(necropsia__icontains=numero)
    if inicio and fin:
        qs = qs.filter(fecha__gte=inicio, fecha__lte=fin)

    if not any([tipo_autopsia, numero, inicio, fin]):
        qs = qs[:10]

    selected = None
    muestras_con_imagenes = []
    selected_muestra_item = None
    informes_resultado = []
    informe_activo = None
    informe_imagen_base64 = ''
    selected_qr_url = ''

    if sel_pk:
        try:
            selected = Necropsia.objects.select_related('tecnico').get(pk=sel_pk)
            muestras_con_imagenes = []
            for m in MuestraNecropsia.objects.filter(necropsia=selected):
                imagenes = []
                for im in ImagenNecropsia.objects.filter(muestra=m):
                    imagenes.append({
                        'pk': im.pk,
                        'mime_type': _mime_tipo_desde_bytes(im.imagen),
                        'imagen_base64': _imagen_bytes_a_base64(im.imagen),
                    })
                muestras_con_imagenes.append({
                    'muestra': m,
                    'imagenes': imagenes,
                    'qr_url': _build_qr_link(request, m.qr_muestra),
                })

            if muestra_pk:
                selected_muestra_item = next(
                    (item for item in muestras_con_imagenes if str(item['muestra'].pk) == muestra_pk),
                    None,
                )
            if selected_muestra_item is None and muestras_con_imagenes:
                selected_muestra_item = muestras_con_imagenes[0]

            selected_qr_url = _build_qr_link(request, selected.qr_necropsia)

            informes_resultado = _informes_por_registro(selected)

            if informe_pk and informe_pk != 'nuevo':
                informe_activo = next((item for item in informes_resultado if str(item.pk) == informe_pk), None)

            if informe_activo and informe_activo.imagen:
                informe_imagen_base64 = _imagen_bytes_a_base64(informe_activo.imagen)
        except Necropsia.DoesNotExist:
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

    return render(request, 'web/necropsias.html', {
        'necropsias':            qs,
        'selected':              selected,
        'muestras_con_imagenes': muestras_con_imagenes,
        'selected_muestra_item': selected_muestra_item,
        'necropsia_form':        NecropsiaForm(instance=selected) if selected else NecropsiaForm(),
        'nueva_necropsia_form':  NecropsiaForm(),
        'muestra_form':          MuestraNecropsiaForm(),
        'informe_form': InformeForm(initial=informe_initial) if selected else None,
        'informes_resultado': informes_resultado,
        'informe_activo': informe_activo,
        'informe_imagen_base64': informe_imagen_base64,
        'selected_qr_url': selected_qr_url,
        'filtros': {'tipo_autopsia': tipo_autopsia, 'numero': numero, 'inicio': inicio, 'fin': fin},
        'tipos_autopsia': [choice for choice in NecropsiaForm().fields['tipo_necropsia'].choices if choice[0]],
        'todos_numeros': list(Necropsia.objects.values_list('necropsia', flat=True).order_by('necropsia').distinct()),
    })


@login_required
@require_POST
def necropsia_create(request):
    form = NecropsiaForm(request.POST, request.FILES)
    if form.is_valid():
        tecnico = request.user if request.user.is_authenticated else None
        try:
            n = form.save(commit=False, tecnico=tecnico)
            volante_file = request.FILES.get('volante_peticion')
            if volante_file:
                _guardar_volante_peticion(volante_file, n)
            n.save()
            return redirect(reverse('necropsias') + f'?necropsia={n.pk}')
        except Exception as e:
            logger.exception('Error al guardar autopsia user=%s', request.user.pk)
            messages.error(request, 'Error interno al guardar la autopsia. Contacta con el administrador.')
            return redirect('necropsias')
    error_detail = '; '.join(
        f'{form.fields[k].label or k}: {", ".join(v)}' if k != '__all__' else ', '.join(v)
        for k, v in form.errors.items()
    )
    messages.error(request, f'Error al crear la autopsia — {error_detail}')
    return redirect('necropsias')


@login_required
@require_POST
def necropsia_update(request, pk):
    necropsia = get_object_or_404(Necropsia, pk=pk)
    form = NecropsiaForm(request.POST, request.FILES, instance=necropsia)
    if form.is_valid():
        n = form.save(commit=False)
        volante_file = request.FILES.get('volante_peticion')
        if volante_file:
            _guardar_volante_peticion(volante_file, n)
        n.save()
        return redirect(reverse('necropsias') + f'?necropsia={pk}')
    messages.error(request, 'Error al modificar la autopsia.')
    return redirect(reverse('necropsias') + f'?necropsia={pk}')


@login_required
@require_POST
def necropsia_delete(request, pk):
    get_object_or_404(Necropsia, pk=pk).delete()
    return redirect('necropsias')


@login_required
@require_POST
def necropsia_informe(request, pk):
    return _guardar_informe(request, pk, Necropsia, 'necropsia', 'necropsias')


@login_required
@require_POST
def necropsia_informe_delete(request, pk, informe_pk):
    return _eliminar_informe(request, pk, informe_pk, Necropsia, 'necropsia', 'necropsias')


@login_required
@require_POST
def muestra_necropsia_create(request, necropsia_pk):
    necropsia = get_object_or_404(Necropsia, pk=necropsia_pk)
    form = MuestraNecropsiaForm(request.POST)
    if form.is_valid():
        muestra = form.save(necropsia=necropsia)
        archivo_imagen = request.FILES.get('imagen')
        if archivo_imagen:
            ImagenNecropsia.objects.create(muestra=muestra, imagen=archivo_imagen.read())
        return redirect(reverse('necropsias') + f'?necropsia={necropsia_pk}&muestra={muestra.pk}')
    return redirect(reverse('necropsias') + f'?necropsia={necropsia_pk}')


@login_required
@require_POST
def muestra_necropsia_update(request, pk):
    muestra = get_object_or_404(MuestraNecropsia, pk=pk)
    form = MuestraNecropsiaForm(request.POST, instance=muestra)
    if form.is_valid():
        form.save()
    return redirect(reverse('necropsias') + f'?necropsia={muestra.necropsia_id}&muestra={pk}')


@login_required
@require_POST
def muestra_necropsia_delete(request, pk):
    muestra = get_object_or_404(MuestraNecropsia, pk=pk)
    nid = muestra.necropsia_id
    muestra.delete()
    return redirect(reverse('necropsias') + f'?necropsia={nid}')


@login_required
@require_POST
def imagen_necropsia_upload(request, muestra_pk):
    muestra = get_object_or_404(MuestraNecropsia, pk=muestra_pk)
    archivo_imagen = request.FILES.get('imagen')
    if archivo_imagen:
        ImagenNecropsia.objects.create(muestra=muestra, imagen=archivo_imagen.read())
    return redirect(reverse('necropsias') + f'?necropsia={muestra.necropsia_id}&muestra={muestra.pk}')


@login_required
@require_POST
def imagen_necropsia_delete(request, pk):
    imagen = get_object_or_404(ImagenNecropsia, pk=pk)
    nid = imagen.muestra.necropsia_id
    muestra_id = imagen.muestra_id
    imagen.delete()
    return redirect(reverse('necropsias') + f'?necropsia={nid}&muestra={muestra_id}')


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
    muestra_pk = request.GET.get('muestra', '').strip()
    informe_pk = request.GET.get('informe', '').strip()

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
    selected_muestra_item = None
    informes_resultado = []
    informe_activo = None
    informe_imagen_base64 = ''
    selected_qr_url = ''

    if sel_pk:
        try:
            selected = Hematologia.objects.select_related('tecnico').get(pk=sel_pk)
            muestras_con_imagenes = [
                {
                    'muestra': m,
                    'imagenes': [
                        {
                            'pk': im.pk,
                            'mime_type': _mime_tipo_desde_bytes(im.imagen),
                            'imagen_base64': _imagen_bytes_a_base64(im.imagen),
                        }
                        for im in ImagenHematologia.objects.filter(muestra=m)
                    ],
                    'qr_url': _build_qr_link(request, m.qr_muestra),
                }
                for m in MuestraHematologia.objects.filter(hematologia=selected)
            ]
            if muestra_pk:
                selected_muestra_item = next((item for item in muestras_con_imagenes if str(item['muestra'].pk) == muestra_pk), None)
            if not selected_muestra_item and muestras_con_imagenes:
                selected_muestra_item = muestras_con_imagenes[0]

            informes_resultado = _informes_por_registro(selected)
            if informe_pk:
                informe_activo = next((item for item in informes_resultado if str(item.pk) == informe_pk), None)
            if not informe_activo and informes_resultado:
                informe_activo = informes_resultado[0]
            if informe_activo and informe_activo.imagen:
                informe_imagen_base64 = _imagen_bytes_a_base64(informe_activo.imagen)
            selected_qr_url = _build_qr_link(request, selected.qr_hematologia)
        except Hematologia.DoesNotExist:
            pass

    informe_initial = {}
    if selected:
        if informe_activo:
            informe_initial = {
                'informe_descripcion': informe_activo.descripcion or '',
                'informe_fecha': informe_activo.fecha,
                'informe_tincion': informe_activo.tincion or '',
                'informe_observaciones': informe_activo.observaciones or '',
            }
        else:
            informe_initial = {'informe_fecha': timezone.localdate()}

    return render(request, 'web/hematologias.html', {
        'hematologias':          qs,
        'selected':              selected,
        'muestras_con_imagenes': muestras_con_imagenes,
        'selected_muestra_item': selected_muestra_item,
        'informes_resultado': informes_resultado,
        'informe_activo': informe_activo,
        'informe_imagen_base64': informe_imagen_base64,
        'hematologia_form':      HematologiaForm(instance=selected) if selected else HematologiaForm(),
        'nueva_hematologia_form': HematologiaForm(),
        'muestra_form':          MuestraHematologiaForm(),
        'informe_form': InformeForm(initial=informe_initial) if selected else None,
        'selected_qr_url': selected_qr_url,
        'filtros': {'organo': organo, 'numero': numero, 'inicio': inicio, 'fin': fin},
    })


# ── Hematología CRUD ────────────────────────────────────────────────────────────

@login_required
@require_POST
def hematologia_create(request):
    form = HematologiaForm(request.POST, request.FILES)
    if form.is_valid():
        tecnico = request.user if request.user.is_authenticated else None
        h = form.save(commit=False, tecnico=tecnico)
        # Manejar archivo de volante de petición
        volante_file = request.FILES.get('volante_peticion')
        if volante_file:
            _guardar_volante_peticion(volante_file, h)
        h.save()
        return redirect(reverse('hematologias') + f'?hematologia={h.pk}')
    messages.error(request, 'Error al crear la hematología. Revisa los campos.')
    return redirect('hematologias')


@login_required
@require_POST
def hematologia_update(request, pk):
    hematologia = get_object_or_404(Hematologia, pk=pk)
    form = HematologiaForm(request.POST, request.FILES, instance=hematologia)
    if form.is_valid():
        h = form.save(commit=False)
        # Manejar archivo de volante de petición
        volante_file = request.FILES.get('volante_peticion')
        if volante_file:
            _guardar_volante_peticion(volante_file, h)
        h.save()
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
    return _guardar_informe(request, pk, Hematologia, 'hematologia', 'hematologias')


@login_required
@require_POST
def hematologia_informe_delete(request, pk, informe_pk):
    return _eliminar_informe(request, pk, informe_pk, Hematologia, 'hematologia', 'hematologias')


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
        username = (request.POST.get('username') or '').strip()
        nombre = (request.POST.get('nombre') or '').strip()
        apellidos = (request.POST.get('apellidos') or '').strip()
        email = (request.POST.get('email') or '').strip()
        centro = (request.POST.get('centro') or '').strip() or None
        rol = _rol_valido(request.POST.get('rol'))
        is_staff = (request.POST.get('is_staff') == 'on')
        password = request.POST.get('password') or ''

        if not username:
            # Mantiene compatibilidad con tests/API legacy que enviaban nombre+apellidos sin username.
            if nombre and apellidos:
                username = f'{nombre}.{apellidos}'.strip('.').replace(' ', '').lower()
            else:
                messages.error(request, 'Usuario: este campo es obligatorio.')
                return redirect('usuarios')
        if not username:
            messages.error(request, 'Usuario: este campo es obligatorio.')
            return redirect('usuarios')
        if not password:
            messages.error(request, 'Contraseña: este campo es obligatorio.')
            return redirect('usuarios')
        if Tecnico.objects.filter(username=username).exists():
            messages.error(request, 'Usuario: ya existe un técnico con ese nombre de usuario.')
            return redirect('usuarios')

        if not email:
            email = _email_unico_para_username(username)
        elif Tecnico.objects.filter(email=email).exists():
            messages.error(request, 'Email: ya existe un técnico con ese email.')
            return redirect('usuarios')

        tecnico = Tecnico(
            username=username,
            nombre=nombre or username,
            apellidos=apellidos or 'Tecnico',
            email=email,
            centro=centro,
            rol=rol,
            is_staff=is_staff,
        )
        tecnico.password = make_password(password)
        tecnico.save()
        messages.success(request, f'Técnico "{tecnico.username}" creado.')
    return redirect('usuarios')


@login_required
def usuario_update(request, pk):
    if not request.user.is_staff:
        messages.error(request, 'No tienes permisos para editar usuarios.')
        return redirect('usuarios')
    tecnico = get_object_or_404(Tecnico, pk=pk)
    if request.method == 'POST':
        username = (request.POST.get('username') or '').strip()
        nombre = (request.POST.get('nombre') or '').strip()
        apellidos = (request.POST.get('apellidos') or '').strip()
        email = (request.POST.get('email') or '').strip()
        centro = (request.POST.get('centro') or '').strip() or None
        rol = _rol_valido(request.POST.get('rol'))
        is_staff = (request.POST.get('is_staff') == 'on')
        password = request.POST.get('password') or ''

        # Compatibilidad legacy: permitir update sin username.
        username = username if username else tecnico.username

        if username and Tecnico.objects.filter(username=username).exclude(pk=tecnico.pk).exists():
            messages.error(request, 'Usuario: ya existe un técnico con ese nombre de usuario.')
            return redirect('usuarios')

        if email and Tecnico.objects.filter(email=email).exclude(pk=tecnico.pk).exists():
            messages.error(request, 'Email: ya existe un técnico con ese email.')
            return redirect('usuarios')

        tecnico.username = username
        tecnico.centro = centro
        tecnico.rol = rol
        tecnico.is_staff = is_staff
        if nombre:
            tecnico.nombre = nombre
        if apellidos:
            tecnico.apellidos = apellidos
        if email:
            tecnico.email = email

        # Compatibilidad con registros legacy incompletos.
        if not tecnico.nombre:
            tecnico.nombre = username or 'Tecnico'
        if not tecnico.apellidos:
            tecnico.apellidos = 'Tecnico'
        if not tecnico.email:
            tecnico.email = _email_unico_para_username(username, exclude_pk=tecnico.pk)

        if password:
            tecnico.password = make_password(password)
        tecnico.save()
        messages.success(request, f'Técnico "{tecnico.username}" actualizado.')
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


@login_required
@require_POST
def usuario_bulk_delete(request):
    if not request.user.is_staff:
        messages.error(request, 'No tienes permisos para realizar esta acción.')
        return redirect('usuarios')

    # Eliminar todos los usuarios excepto IDs 1 y 2
    queryset = Tecnico.objects.exclude(id_tecnico__in=[1, 2])
    count = queryset.count()
    queryset.delete()

    # Resetear secuencia de IDs para que el siguiente empiece en 3
    with connection.cursor() as cursor:
        cursor.execute("UPDATE sqlite_sequence SET seq = 2 WHERE name = 'tecnicos'")

    messages.success(request, f'Limpieza completada: {count} usuarios eliminados. Se han conservado los usuarios con ID 1 y 2, y el siguiente ID empezará en 3.')
    return redirect('usuarios')


# ── Descargar archivos desde BD ───────────────────────────────────────────────

def _descargar_volante(instancia):
    if not instancia.volante_peticion:
        return HttpResponse('No hay archivo disponible', status=404)
    content = bytes(instancia.volante_peticion)
    content_type = _detectar_tipo_volante(content)
    response = HttpResponse(content, content_type=content_type)
    response['Content-Disposition'] = f'inline; filename="{instancia.volante_peticion_nombre or "volante.pdf"}"'
    return response


@login_required
def descargar_volante_cassette(request, pk):
    return _descargar_volante(get_object_or_404(Cassette, pk=pk))


@login_required
def descargar_volante_citologia(request, pk):
    return _descargar_volante(get_object_or_404(Citologia, pk=pk))


@login_required
def descargar_volante_necropsia(request, pk):
    return _descargar_volante(get_object_or_404(Necropsia, pk=pk))


@login_required
def descargar_volante_hematologia(request, pk):
    return _descargar_volante(get_object_or_404(Hematologia, pk=pk))


@login_required
def descargar_volante_tubo(request, pk):
    return _descargar_volante(get_object_or_404(Tubo, pk=pk))


@login_required
def descargar_volante_microbiologia(request, pk):
    return _descargar_volante(get_object_or_404(Microbiologia, pk=pk))

@login_required
def descargar_informe_resultado(request, informe_pk):
    from api.models import InformeResultado
    informe = get_object_or_404(InformeResultado, pk=informe_pk)
    if not informe.imagen:
        return HttpResponse('No hay archivo disponible', status=404)

    content = None
    ext = 'bin'
    content_type = 'application/octet-stream'

    # Legacy BinaryField payload.
    if isinstance(informe.imagen, (bytes, bytearray, memoryview)):
        content = bytes(informe.imagen)
    else:
        # FileField path payload.
        try:
            informe.imagen.open('rb')
            content = informe.imagen.read()
            informe.imagen.close()
            ext = os.path.splitext(getattr(informe.imagen, 'name', '') or '')[1].lstrip('.') or 'bin'
        except Exception:
            content = None

    if not content:
        return HttpResponse('No hay archivo disponible', status=404)

    if content.startswith(b'%PDF'):
        content_type = 'application/pdf'
        ext = 'pdf'
    elif ext.lower() in ('jpg', 'jpeg'):
        content_type = 'image/jpeg'
    elif ext.lower() == 'png':
        content_type = 'image/png'
    elif ext.lower() == 'gif':
        content_type = 'image/gif'

    response = HttpResponse(content, content_type=content_type)
    response['Content-Disposition'] = f'inline; filename="informe_{informe.pk}.{ext}"'
    return response
