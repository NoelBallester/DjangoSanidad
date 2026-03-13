from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.db.models import Q
from django.db import connection
from django.contrib.contenttypes.models import ContentType
from django.http import FileResponse, Http404, HttpResponse
from datetime import datetime
import base64
import mimetypes
import os
import uuid
from django.contrib.auth import authenticate
from .models import Tecnico, Cassette, Muestra, Imagen, Citologia, MuestraCitologia, ImagenCitologia, Necropsia, MuestraNecropsia, ImagenNecropsia, Tubo, MuestraTubo, ImagenTubo, Hematologia, MuestraHematologia, ImagenHematologia, Microbiologia, MuestraMicrobiologia, ImagenMicrobiologia, InformeResultado
from .serializers import (
    TecnicoSerializer, CassetteSerializer, MuestraSerializer, ImagenSerializer,
    CitologiaSerializer, MuestraCitologiaSerializer, ImagenCitologiaSerializer,
    NecropsiaSerializer, MuestraNecropsiaSerializer, ImagenNecropsiaSerializer,
    TuboSerializer, MuestraTuboSerializer, ImagenTuboSerializer,
    HematologiaSerializer, MuestraHematologiaSerializer, ImagenHematologiaSerializer,
    MicrobiologiaSerializer, MuestraMicrobiologiaSerializer, ImagenMicrobiologiaSerializer,
    InformeResultadoSerializer
)


FILE_PROXY_MODELS = {
    'imagen': (Imagen, {'imagen'}),
    'imagencitologia': (ImagenCitologia, {'imagen'}),
    'imagennecropsia': (ImagenNecropsia, {'imagen'}),
    'imagentubo': (ImagenTubo, {'imagen'}),
    'imagenhematologia': (ImagenHematologia, {'imagen'}),
    'imagenmicrobiologia': (ImagenMicrobiologia, {'imagen'}),
    'tubo': (Tubo, {'informe_imagen', 'volante_peticion'}),
    'hematologia': (Hematologia, {'informe_imagen'}),
    'microbiologia': (Microbiologia, {'informe_imagen', 'volante_peticion'}),
    'informeresultado': (InformeResultado, {'imagen'}),
}

# Roles autorizados por modelo de archivo (SEC-2 IDOR)
_ROLES_POR_MODELO = {
    Imagen:              {Tecnico.ROL_PROFESOR, Tecnico.ROL_ANATOMIA},
    ImagenCitologia:     {Tecnico.ROL_PROFESOR, Tecnico.ROL_ANATOMIA},
    ImagenNecropsia:     {Tecnico.ROL_PROFESOR, Tecnico.ROL_ANATOMIA},
    Cassette:            {Tecnico.ROL_PROFESOR, Tecnico.ROL_ANATOMIA},
    Citologia:           {Tecnico.ROL_PROFESOR, Tecnico.ROL_ANATOMIA},
    Necropsia:           {Tecnico.ROL_PROFESOR, Tecnico.ROL_ANATOMIA},
    ImagenTubo:          {Tecnico.ROL_PROFESOR, Tecnico.ROL_LABORATORIO},
    ImagenHematologia:   {Tecnico.ROL_PROFESOR, Tecnico.ROL_LABORATORIO},
    ImagenMicrobiologia: {Tecnico.ROL_PROFESOR, Tecnico.ROL_LABORATORIO},
    Tubo:                {Tecnico.ROL_PROFESOR, Tecnico.ROL_LABORATORIO},
    Hematologia:         {Tecnico.ROL_PROFESOR, Tecnico.ROL_LABORATORIO},
    Microbiologia:       {Tecnico.ROL_PROFESOR, Tecnico.ROL_LABORATORIO},
}

IMAGE_MODELS = (
    Imagen,
    ImagenCitologia,
    ImagenNecropsia,
    ImagenTubo,
    ImagenHematologia,
    ImagenMicrobiologia,
)

_EXTENSIONES_IMAGEN_PERMITIDAS = frozenset({
    '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tif', '.tiff',
})
_MAX_IMAGE_UPLOAD_BYTES = 20 * 1024 * 1024


def _extract_validation_error_message(exc):
    detail = getattr(exc, 'detail', exc)
    if isinstance(detail, dict):
        for value in detail.values():
            if isinstance(value, list) and value:
                return str(value[0])
            return str(value)
    if isinstance(detail, list) and detail:
        return str(detail[0])
    return str(detail)


def _validar_imagen_api(imagen_file):
    nombre = getattr(imagen_file, 'name', '') or ''
    ext = os.path.splitext(nombre)[1].lower()
    if ext not in _EXTENSIONES_IMAGEN_PERMITIDAS:
        raise ValidationError(f'Extension no permitida: {ext or "(sin extension)"}')

    size = getattr(imagen_file, 'size', None)
    if size is not None and int(size) > _MAX_IMAGE_UPLOAD_BYTES:
        raise ValidationError('La imagen supera el limite de 20 MB.')

    cabecera = imagen_file.read(16) or b''
    if hasattr(imagen_file, 'seek'):
        imagen_file.seek(0)

    es_webp = cabecera.startswith(b'RIFF') and cabecera[8:12] == b'WEBP'
    es_imagen = (
        cabecera.startswith(b'\xff\xd8\xff') or
        cabecera.startswith(b'\x89PNG\r\n\x1a\n') or
        cabecera.startswith((b'GIF87a', b'GIF89a')) or
        cabecera.startswith(b'BM') or
        es_webp or
        cabecera.startswith((b'II*\x00', b'MM\x00*'))
    )
    if not es_imagen:
        raise ValidationError('El archivo no es una imagen valida.')


def _read_file_bytes(file_value):
    def _decode_text_reference(text):
        text = (text or '').strip()
        if not text:
            return b''

        # Compatibilidad legacy: data URL almacenada en texto.
        if text.startswith('data:') and ';base64,' in text:
            try:
                return base64.b64decode(text.split(';base64,', 1)[1], validate=True)
            except Exception:
                return b''

        # Compatibilidad legacy: ruta de fichero relativa a MEDIA_ROOT o absoluta.
        candidate_paths = [text]
        if not os.path.isabs(text):
            candidate_paths.append(str(settings.MEDIA_ROOT / text))
        for path in candidate_paths:
            if os.path.exists(path):
                try:
                    with open(path, 'rb') as f:
                        return f.read()
                except Exception:
                    continue

        # Compatibilidad legacy: base64 sin prefijo data URL.
        try:
            return base64.b64decode(text, validate=True)
        except Exception:
            return b''

    if not file_value:
        return b''
    if isinstance(file_value, memoryview):
        raw = file_value.tobytes()
        try:
            maybe_text = raw.decode('utf-8')
            resolved = _decode_text_reference(maybe_text)
            return resolved or raw
        except Exception:
            return raw
    if isinstance(file_value, (bytes, bytearray)):
        raw = bytes(file_value)
        # Algunos registros legacy guardan la ruta como texto dentro del BinaryField.
        try:
            maybe_text = raw.decode('utf-8')
            resolved = _decode_text_reference(maybe_text)
            return resolved or raw
        except Exception:
            return raw
    if isinstance(file_value, str):
        return _decode_text_reference(file_value)
    try:
        if hasattr(file_value, 'open'):
            file_value.open('rb')
        if hasattr(file_value, 'read'):
            content = file_value.read()
            if hasattr(file_value, 'seek'):
                file_value.seek(0)
            if content:
                return bytes(content)
    except Exception:
        pass
    return b''


def _detect_content_type(file_value):
    raw = _read_file_bytes(file_value)[:16]
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
    if raw.startswith(b'%PDF'):
        return 'application/pdf'

    guess_name = file_value if isinstance(file_value, str) else getattr(file_value, 'name', '')
    guessed, _ = mimetypes.guess_type(guess_name)
    return guessed or 'application/octet-stream'


def _roles_permitidos_para_proxy(model, instance=None):
    """Devuelve los roles permitidos para leer archivos de un modelo concreto."""
    if model is InformeResultado and instance is not None:
        target_model = instance.content_type.model_class() if instance.content_type_id else None
        return _ROLES_POR_MODELO.get(target_model, set())
    return _ROLES_POR_MODELO.get(model, set())


@login_required
def proxy_file(request, model_name, pk, field_name):
    config = FILE_PROXY_MODELS.get(model_name)
    if not config:
        raise Http404('Modelo no soportado.')

    model, allowed_fields = config
    if field_name not in allowed_fields:
        raise Http404('Campo no soportado.')

    try:
        instance = model.objects.get(pk=pk)
    except model.DoesNotExist as exc:
        raise Http404('Archivo no encontrado.') from exc

    # SEC-2: verificar rol del usuario según el tipo real de recurso.
    if not request.user.is_staff:
        rol = getattr(request.user, 'rol', None)
        roles_permitidos = _roles_permitidos_para_proxy(model, instance)
        if rol not in roles_permitidos:
            raise Http404('Archivo no encontrado.')

    file_value = getattr(instance, field_name, None)
    if not file_value:
        raise Http404('Archivo no encontrado.')

    content_type = _detect_content_type(file_value)
    if isinstance(file_value, str):
        filename = os.path.basename(file_value) or f'{model_name}-{pk}'
    else:
        filename = os.path.basename(getattr(file_value, 'name', '') or f'{model_name}-{pk}')

    if isinstance(file_value, (bytes, bytearray, memoryview)):
        response = HttpResponse(_read_file_bytes(file_value), content_type=content_type)
        response['Content-Disposition'] = f'inline; filename="{filename}"'
        return response

    try:
        if hasattr(file_value, 'open'):
            file_value.open('rb')
        response = FileResponse(file_value, content_type=content_type)
        response['Content-Disposition'] = f'inline; filename="{filename}"'
        return response
    except Exception:
        raw = _read_file_bytes(file_value)
        if not raw:
            raise Http404('Archivo no encontrado.')
        response = HttpResponse(raw, content_type=content_type)
        response['Content-Disposition'] = f'inline; filename="{filename}"'
        return response

def generar_qr(prefijo):
    """Genera un código base QR con formato: prefijo + 12 caracteres."""
    return f"{prefijo}{uuid.uuid4().hex[:12]}"


def generar_qr_unico(prefijo, modelo, campo, max_intentos=50):
    """Genera un QR y verifica colisiones contra base de datos."""
    manager = getattr(modelo, 'all_objects', modelo.objects)
    for _ in range(max_intentos):
        candidato = generar_qr(prefijo)
        if not manager.filter(**{campo: candidato}).exists():
            return candidato
    raise RuntimeError(f'No se pudo generar QR unico para {modelo.__name__}.{campo}')


def _soft_delete_related_images(instance):
    for relation in instance._meta.related_objects:
        if relation.related_model not in IMAGE_MODELS:
            continue
        accessor = relation.get_accessor_name()
        related_manager = getattr(instance, accessor, None)
        if related_manager is not None:
            related_manager.all().update(is_deleted=True)


# ─── Mixins y ViewSet base ────────────────────────────────────────────────────

class ActualizarInformeMixin:
    """
    Mixin que expone el action `actualizar_informe` para todos los registros
    que heredan de RegistroConInforme.  Las subclases solo necesitan definir
    `serializer_class`.
    """
    @action(detail=True, methods=['post'])
    def actualizar_informe(self, request, pk=None):
        instance = self.get_object()
        data = request.data

        campos_simples = ('informe_descripcion', 'informe_fecha', 'informe_tincion', 'informe_observaciones')
        for campo in campos_simples:
            if campo in data:
                setattr(instance, campo, data[campo])

        if 'informe_imagen' in data:
            imagen_data = data['informe_imagen']
            if isinstance(imagen_data, str) and imagen_data.startswith('data:image'):
                imagen_data = imagen_data.split(',')[1]
            instance.informe_imagen = base64.b64decode(imagen_data) if isinstance(imagen_data, str) else imagen_data

        instance.save()
        return Response(self.get_serializer(instance).data)


class RegistroViewSet(ActualizarInformeMixin, viewsets.ModelViewSet):
    """
    ViewSet base para los modelos principales (Cassette, Citologia, Tubo…).
    Implementa `create` con generación automática de QR mediante Template Method:
    las subclases declaran `qr_prefix` y `qr_field`.
    """
    qr_prefix: str = None
    qr_field: str = None

    def create(self, request):
        data = request.data.copy()
        if self.qr_field and not data.get(self.qr_field):
            data[self.qr_field] = generar_qr_unico(
                self.qr_prefix, self.queryset.model, self.qr_field
            )
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def index(self, request):
        qs = self.get_queryset()[:10]
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=False, methods=['get'])
    def todos(self, request):
        qs = self.get_queryset()
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=False, methods=['get'])
    def rango_fechas(self, request):
        fecha_inicio = request.query_params.get('inicio')
        fecha_fin = request.query_params.get('fin')
        if not fecha_inicio or not fecha_fin:
            return Response({'error': 'Se requieren inicio y fin'}, status=status.HTTP_400_BAD_REQUEST)
        qs = self.get_queryset().filter(fecha__gte=fecha_inicio, fecha__lte=fecha_fin)
        return Response(self.get_serializer(qs, many=True).data)


class SoftDeleteDestroyMixin:
    def perform_destroy(self, instance):
        instance.delete()


class MuestraSoftDeleteDestroyMixin(SoftDeleteDestroyMixin):
    def perform_destroy(self, instance):
        _soft_delete_related_images(instance)
        super().perform_destroy(instance)


class TecnicoViewSet(viewsets.ModelViewSet):
    queryset = Tecnico.objects.all()
    serializer_class = TecnicoSerializer

    def get_permissions(self):
        if self.action == 'login':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        tecnico_id = request.data.get('tecnico_id')
        password = request.data.get('password')
        
        # El login solo permite contraseñas hasheadas por seguridad.
        user = authenticate(id_tecnico=tecnico_id, password=password)
        if user:
            return Response(TecnicoSerializer(user).data)
            
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
            
    @action(detail=False, methods=['get'])
    def me(self, request):
        if request.user.is_authenticated:
            return Response(TecnicoSerializer(request.user).data)
        return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
            
    @action(detail=False, methods=['get'], url_path='mail/(?P<mail>[^/.]+)')
    def get_by_mail(self, request, mail=None):
        if not request.user.is_staff:
            return Response({'error': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
        try:
            tecnico = Tecnico.objects.get(email=mail)
            return Response(TecnicoSerializer(tecnico).data)
        except Tecnico.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

class CassetteViewSet(RegistroViewSet):
    queryset = Cassette.objects.all().order_by('-fecha')
    serializer_class = CassetteSerializer
    qr_prefix = '--c--'
    qr_field = 'qr_casette'

    @action(detail=False, methods=['get'], url_path='qr/(?P<qr>.+)')
    def por_qr(self, request, qr=None):
        """Busca cassette por código QR"""
        cassettes = Cassette.objects.filter(qr_casette=qr)
        return Response(CassetteSerializer(cassettes, many=True).data)
    
    @action(detail=False, methods=['get'], url_path='organo/(?P<organo>.+)')
    def por_organo(self, request, organo=None):
        """Filtra cassettes por órgano"""
        if organo == '*':
            cassettes = self.get_queryset()
        else:
            cassettes = Cassette.objects.filter(organo=organo).order_by('-fecha')
        return Response(CassetteSerializer(cassettes, many=True).data)
    
    @action(detail=False, methods=['get'], url_path='numero/(?P<numero>.+)')
    def por_numero(self, request, numero=None):
        """Filtra cassettes por número"""
        cassettes = Cassette.objects.filter(cassette=numero).order_by('-fecha')
        return Response(CassetteSerializer(cassettes, many=True).data)
    
    @action(detail=False, methods=['get'], url_path='fecha/(?P<fecha>[^/.]+)')
    def por_fecha(self, request, fecha=None):
        """Filtra cassettes por fecha específica"""
        cassettes = Cassette.objects.filter(fecha=fecha).order_by('-fecha')
        return Response(CassetteSerializer(cassettes, many=True).data)

class CitologiaViewSet(RegistroViewSet):
    queryset = Citologia.objects.all().order_by('-fecha')
    serializer_class = CitologiaSerializer
    qr_prefix = '--cit--'
    qr_field = 'qr_citologia'

    @action(detail=False, methods=['get'], url_path='qr/(?P<qr>.+)')
    def por_qr(self, request, qr=None):
        """Busca citología por código QR"""
        citologias = Citologia.objects.filter(qr_citologia=qr)
        return Response(CitologiaSerializer(citologias, many=True).data)
    
    @action(detail=False, methods=['get'], url_path='organo/(?P<organo>.+)')
    def por_organo(self, request, organo=None):
        """Filtra citologías por órgano"""
        if organo == '*':
            citologias = self.get_queryset()
        else:
            citologias = Citologia.objects.filter(organo=organo).order_by('-fecha')
        return Response(CitologiaSerializer(citologias, many=True).data)
    
    @action(detail=False, methods=['get'], url_path='numero/(?P<numero>.+)')
    def por_numero(self, request, numero=None):
        """Filtra citologías por número"""
        citologias = Citologia.objects.filter(citologia=numero).order_by('-fecha')
        return Response(CitologiaSerializer(citologias, many=True).data)
    
    @action(detail=False, methods=['get'], url_path='fecha/(?P<fecha>[^/.]+)')
    def por_fecha(self, request, fecha=None):
        """Filtra citologías por fecha específica"""
        citologias = Citologia.objects.filter(fecha=fecha).order_by('-fecha')
        return Response(CitologiaSerializer(citologias, many=True).data)

class NecropsiaViewSet(RegistroViewSet):
    queryset = Necropsia.objects.all().order_by('-fecha')
    serializer_class = NecropsiaSerializer
    qr_prefix = '--nec--'
    qr_field = 'qr_necropsia'

    @action(detail=False, methods=['get'], url_path='qr/(?P<qr>.+)')
    def por_qr(self, request, qr=None):
        necropsias = Necropsia.objects.filter(qr_necropsia=qr)
        return Response(NecropsiaSerializer(necropsias, many=True).data)

    @action(detail=False, methods=['get'], url_path='organo/(?P<organo>.+)')
    def por_organo(self, request, organo=None):
        if organo == '*':
            necropsias = self.get_queryset()
        else:
            necropsias = Necropsia.objects.filter(organo=organo).order_by('-fecha')
        return Response(NecropsiaSerializer(necropsias, many=True).data)

    @action(detail=False, methods=['get'], url_path='numero/(?P<numero>.+)')
    def por_numero(self, request, numero=None):
        necropsias = Necropsia.objects.filter(necropsia=numero).order_by('-fecha')
        return Response(NecropsiaSerializer(necropsias, many=True).data)

    @action(detail=False, methods=['get'], url_path='fecha/(?P<fecha>[^/.]+)')
    def por_fecha(self, request, fecha=None):
        necropsias = Necropsia.objects.filter(fecha=fecha).order_by('-fecha')
        return Response(NecropsiaSerializer(necropsias, many=True).data)

class MuestraViewSet(MuestraSoftDeleteDestroyMixin, viewsets.ModelViewSet):
    queryset = Muestra.objects.all()
    serializer_class = MuestraSerializer
    
    def create(self, request):
        data = request.data.copy()
        # Generar QR automáticamente si no existe
        if 'qr_muestra' not in data or not data['qr_muestra']:
            data['qr_muestra'] = generar_qr_unico('--m--', Muestra, 'qr_muestra')
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='cassette/(?P<id>[^/.]+)')
    def por_cassette(self, request, id=None):
        """Obtiene todas las muestras de un cassette"""
        muestras = Muestra.objects.filter(cassette_id=id)
        return Response(MuestraSerializer(muestras, many=True).data)
    
    @action(detail=False, methods=['get'], url_path='qr/(?P<qr>[^/.]+)')
    def por_qr(self, request, qr=None):
        """Busca muestra por código QR"""
        muestras = Muestra.objects.filter(qr_muestra=qr)
        return Response(MuestraSerializer(muestras, many=True).data)

class MuestraCitologiaViewSet(MuestraSoftDeleteDestroyMixin, viewsets.ModelViewSet):
    queryset = MuestraCitologia.objects.all()
    serializer_class = MuestraCitologiaSerializer
    
    def create(self, request):
        data = request.data.copy()
        # Generar QR automáticamente si no existe
        if 'qr_muestra' not in data or not data['qr_muestra']:
            data['qr_muestra'] = generar_qr_unico('--mc--', MuestraCitologia, 'qr_muestra')
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='citologia/(?P<id>[^/.]+)')
    def por_citologia(self, request, id=None):
        """Obtiene todas las muestras de una citología"""
        muestras = MuestraCitologia.objects.filter(citologia_id=id)
        return Response(MuestraCitologiaSerializer(muestras, many=True).data)
    
    @action(detail=False, methods=['get'], url_path='qr/(?P<qr>[^/.]+)')
    def por_qr(self, request, qr=None):
        """Busca muestra por código QR"""
        muestras = MuestraCitologia.objects.filter(qr_muestra=qr)
        return Response(MuestraCitologiaSerializer(muestras, many=True).data)

class MuestraNecropsiaViewSet(MuestraSoftDeleteDestroyMixin, viewsets.ModelViewSet):
    queryset = MuestraNecropsia.objects.all()
    serializer_class = MuestraNecropsiaSerializer

    def create(self, request):
        data = request.data.copy()
        if 'qr_muestra' not in data or not data['qr_muestra']:
            data['qr_muestra'] = generar_qr_unico('--mn--', MuestraNecropsia, 'qr_muestra')
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='necropsia/(?P<id>[^/.]+)')
    def por_necropsia(self, request, id=None):
        muestras = MuestraNecropsia.objects.filter(necropsia_id=id)
        return Response(MuestraNecropsiaSerializer(muestras, many=True).data)

    @action(detail=False, methods=['get'], url_path='qr/(?P<qr>[^/.]+)')
    def por_qr(self, request, qr=None):
        muestras = MuestraNecropsia.objects.filter(qr_muestra=qr)
        return Response(MuestraNecropsiaSerializer(muestras, many=True).data)

class ImagenViewSet(SoftDeleteDestroyMixin, viewsets.ModelViewSet):
    queryset = Imagen.objects.all()
    serializer_class = ImagenSerializer

    def create(self, request):
        imagen_file = request.FILES.get('imagen', None)
        muestra_id = request.data.get('muestra')

        if not imagen_file:
            return Response({'error': 'No se proporcionó imagen'}, status=status.HTTP_400_BAD_REQUEST)
        if not muestra_id:
            return Response({'error': 'No se proporcionó ID de muestra'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            _validar_imagen_api(imagen_file)
        except ValidationError as exc:
            return Response({'error': _extract_validation_error_message(exc)}, status=status.HTTP_400_BAD_REQUEST)

        imagen_obj = Imagen.objects.create(
            imagen=imagen_file.read(),
            muestra_id=muestra_id
        )
        return Response(self.get_serializer(imagen_obj).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='muestra/(?P<id>[^/.]+)')
    def por_muestra(self, request, id=None):
        """Obtiene todas las imágenes de una muestra mediante URL directa."""
        imagenes = Imagen.objects.filter(muestra_id=id)
        return Response(self.get_serializer(imagenes, many=True).data)

class ImagenCitologiaViewSet(SoftDeleteDestroyMixin, viewsets.ModelViewSet):
    queryset = ImagenCitologia.objects.all()
    serializer_class = ImagenCitologiaSerializer

    def create(self, request):
        imagen_file = request.FILES.get('imagen', None)
        muestra_id = request.data.get('muestra')

        if not imagen_file:
            return Response({'error': 'No se proporcionó imagen'}, status=status.HTTP_400_BAD_REQUEST)
        if not muestra_id:
            return Response({'error': 'No se proporcionó ID de muestra'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            _validar_imagen_api(imagen_file)
        except ValidationError as exc:
            return Response({'error': _extract_validation_error_message(exc)}, status=status.HTTP_400_BAD_REQUEST)

        imagen_obj = ImagenCitologia.objects.create(
            imagen=imagen_file.read(),
            muestra_id=muestra_id
        )
        return Response(self.get_serializer(imagen_obj).data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], url_path='muestra/(?P<id>[^/.]+)')
    def por_muestra(self, request, id=None):
        """Obtiene todas las imágenes de una muestra mediante URL directa."""
        imagenes = ImagenCitologia.objects.filter(muestra_id=id)
        return Response(self.get_serializer(imagenes, many=True).data)

class ImagenNecropsiaViewSet(SoftDeleteDestroyMixin, viewsets.ModelViewSet):
    queryset = ImagenNecropsia.objects.all()
    serializer_class = ImagenNecropsiaSerializer

    def create(self, request):
        imagen_file = request.FILES.get('imagen', None)
        muestra_id = request.data.get('muestra')

        if not imagen_file:
            return Response({'error': 'No se proporcionó imagen'}, status=status.HTTP_400_BAD_REQUEST)
        if not muestra_id:
            return Response({'error': 'No se proporcionó ID de muestra'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            _validar_imagen_api(imagen_file)
        except ValidationError as exc:
            return Response({'error': _extract_validation_error_message(exc)}, status=status.HTTP_400_BAD_REQUEST)

        imagen_obj = ImagenNecropsia.objects.create(
            imagen=imagen_file.read(),
            muestra_id=muestra_id
        )
        return Response(self.get_serializer(imagen_obj).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='muestra/(?P<id>[^/.]+)')
    def por_muestra(self, request, id=None):
        """Obtiene todas las imágenes de una muestra mediante URL directa."""
        imagenes = ImagenNecropsia.objects.filter(muestra_id=id)
        return Response(self.get_serializer(imagenes, many=True).data)

class TuboViewSet(RegistroViewSet):
    queryset = Tubo.objects.all().order_by('-fecha')
    serializer_class = TuboSerializer
    qr_prefix = '--t--'
    qr_field = 'qr_tubo'

    def create(self, request):
        """Extiende el create base añadiendo generación de número de tubo."""
        import time
        data = request.data.copy()
        if not data.get('qr_tubo'):
            data['qr_tubo'] = generar_qr_unico(self.qr_prefix, Tubo, self.qr_field)
        if not data.get('tubo'):
            data['tubo'] = data.get('muestra') or f"T-{int(time.time())}"
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='qr/(?P<qr>.+)')
    def por_qr(self, request, qr=None):
        """Busca tubo por código QR"""
        tubos = Tubo.objects.filter(qr_tubo=qr)
        return Response(TuboSerializer(tubos, many=True).data)
    
    @action(detail=False, methods=['get'], url_path='organo/(?P<organo>.+)')
    def por_organo(self, request, organo=None):
        """Filtra tubos por órgano"""
        if organo == '*':
            tubos = self.get_queryset()
        else:
            tubos = Tubo.objects.filter(organo=organo).order_by('-fecha')
        return Response(TuboSerializer(tubos, many=True).data)
    
    @action(detail=False, methods=['get'], url_path='numero/(?P<numero>.+)')
    def por_numero(self, request, numero=None):
        """Filtra tubos por número"""
        tubos = Tubo.objects.filter(tubo=numero).order_by('-fecha')
        return Response(TuboSerializer(tubos, many=True).data)
    
    @action(detail=False, methods=['get'], url_path='fecha/(?P<fecha>[^/.]+)')
    def por_fecha(self, request, fecha=None):
        """Filtra tubos por fecha específica"""
        tubos = Tubo.objects.filter(fecha=fecha).order_by('-fecha')
        return Response(TuboSerializer(tubos, many=True).data)

class MuestraTuboViewSet(MuestraSoftDeleteDestroyMixin, viewsets.ModelViewSet):
    queryset = MuestraTubo.objects.all()
    serializer_class = MuestraTuboSerializer
    
    def create(self, request):
        data = request.data.copy()
        # Generar QR automáticamente si no existe
        if 'qr_muestra' not in data or not data['qr_muestra']:
            data['qr_muestra'] = generar_qr_unico('--mt--', MuestraTubo, 'qr_muestra')
        
        # Separar la imagen de los datos si existe
        imagen_file = request.FILES.get('imagen', None)
        if imagen_file:
            try:
                _validar_imagen_api(imagen_file)
            except ValidationError as exc:
                return Response({'error': _extract_validation_error_message(exc)}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        muestra = serializer.save()
        
        # Si hay imagen, crear el registro en ImagenTubo con datos binarios
        if imagen_file:
            imagen_bytes = imagen_file.read()
            ImagenTubo.objects.create(
                imagen=imagen_bytes,
                muestra=muestra
            )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='tubo/(?P<id>[^/.]+)')
    def por_tubo(self, request, id=None):
        """Obtiene todas las muestras de un tubo"""
        muestras = MuestraTubo.objects.filter(tubo_id=id)
        return Response(MuestraTuboSerializer(muestras, many=True).data)
    
    @action(detail=False, methods=['get'], url_path='qr/(?P<qr>[^/.]+)')
    def por_qr(self, request, qr=None):
        """Busca muestra por código QR"""
        muestras = MuestraTubo.objects.filter(qr_muestra=qr)
        return Response(MuestraTuboSerializer(muestras, many=True).data)

class ImagenTuboViewSet(SoftDeleteDestroyMixin, viewsets.ModelViewSet):
    queryset = ImagenTubo.objects.all()
    serializer_class = ImagenTuboSerializer
    
    def create(self, request):
        """Crea una imagen guardando el archivo como binario en la BD"""
        imagen_file = request.FILES.get('imagen', None)
        muestra_id = request.data.get('muestra')
        
        if not imagen_file:
            return Response({'error': 'No se proporcionó imagen'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not muestra_id:
            return Response({'error': 'No se proporcionó ID de muestra'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            _validar_imagen_api(imagen_file)
        except ValidationError as exc:
            return Response({'error': _extract_validation_error_message(exc)}, status=status.HTTP_400_BAD_REQUEST)
        
        imagen_bytes = imagen_file.read()
        imagen_tubo = ImagenTubo.objects.create(
            imagen=imagen_bytes,
            muestra_id=muestra_id
        )

        return Response(self.get_serializer(imagen_tubo).data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], url_path='muestra/(?P<id>[^/.]+)')
    def por_muestra(self, request, id=None):
        """Obtiene todas las imágenes de una muestra de tubo mediante URL directa."""
        imagenes = ImagenTubo.objects.filter(muestra_id=id)
        return Response(self.get_serializer(imagenes, many=True).data)

class HematologiaViewSet(RegistroViewSet):
    queryset = Hematologia.objects.all().order_by('-fecha')
    serializer_class = HematologiaSerializer
    qr_prefix = '--h--'
    qr_field = 'qr_hematologia'

    @action(detail=False, methods=['get'], url_path='qr/(?P<qr>.+)')
    def por_qr(self, request, qr=None):
        """Busca hematología por código QR"""
        hematologias = Hematologia.objects.filter(qr_hematologia=qr)
        return Response(HematologiaSerializer(hematologias, many=True).data)
    
    @action(detail=False, methods=['get'], url_path='organo/(?P<organo>.+)')
    def por_organo(self, request, organo=None):
        """Filtra hematologías por órgano"""
        if organo == '*':
            hematologias = self.get_queryset()
        else:
            hematologias = Hematologia.objects.filter(organo=organo).order_by('-fecha')
        return Response(HematologiaSerializer(hematologias, many=True).data)
    
    @action(detail=False, methods=['get'], url_path='numero/(?P<numero>.+)')
    def por_numero(self, request, numero=None):
        """Filtra hematologías por número"""
        hematologias = Hematologia.objects.filter(hematologia=numero).order_by('-fecha')
        return Response(HematologiaSerializer(hematologias, many=True).data)
    
    @action(detail=False, methods=['get'], url_path='fecha/(?P<fecha>[^/.]+)')
    def por_fecha(self, request, fecha=None):
        """Filtra hematologías por fecha específica"""
        hematologias = Hematologia.objects.filter(fecha=fecha).order_by('-fecha')
        return Response(HematologiaSerializer(hematologias, many=True).data)

class MuestraHematologiaViewSet(MuestraSoftDeleteDestroyMixin, viewsets.ModelViewSet):
    queryset = MuestraHematologia.objects.all()
    serializer_class = MuestraHematologiaSerializer
    
    def create(self, request):
        data = request.data.copy()
        # Generar QR automáticamente si no existe
        if 'qr_muestra' not in data or not data['qr_muestra']:
            data['qr_muestra'] = generar_qr_unico('--mh--', MuestraHematologia, 'qr_muestra')
        
        # Separar la imagen de los datos si existe
        imagen_file = request.FILES.get('imagen', None)
        if imagen_file:
            try:
                _validar_imagen_api(imagen_file)
            except ValidationError as exc:
                return Response({'error': _extract_validation_error_message(exc)}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        muestra = serializer.save()
        
        # Si hay imagen, crear el registro en ImagenHematologia
        if imagen_file:
            ImagenHematologia.objects.create(
                imagen=imagen_file.read(),
                muestra=muestra
            )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='hematologia/(?P<id>[^/.]+)')
    def por_hematologia(self, request, id=None):
        """Obtiene todas las muestras de una hematología"""
        muestras = MuestraHematologia.objects.filter(hematologia_id=id)
        return Response(MuestraHematologiaSerializer(muestras, many=True).data)
    
    @action(detail=False, methods=['get'], url_path='qr/(?P<qr>[^/.]+)')
    def por_qr(self, request, qr=None):
        """Busca muestra por código QR"""
        muestras = MuestraHematologia.objects.filter(qr_muestra=qr)
        return Response(MuestraHematologiaSerializer(muestras, many=True).data)


class ImagenHematologiaViewSet(SoftDeleteDestroyMixin, viewsets.ModelViewSet):
    queryset = ImagenHematologia.objects.all()
    serializer_class = ImagenHematologiaSerializer
    
    def create(self, request):
        """Crea una imagen para una sub-muestra de hematología"""
        imagen_file = request.FILES.get('imagen', None)
        muestra_id = request.data.get('muestra')
        
        if not imagen_file:
            return Response({'error': 'No se proporcionó imagen'}, status=status.HTTP_400_BAD_REQUEST)
        if not muestra_id:
            return Response({'error': 'No se proporcionó ID de muestra'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            _validar_imagen_api(imagen_file)
        except ValidationError as exc:
            return Response({'error': _extract_validation_error_message(exc)}, status=status.HTTP_400_BAD_REQUEST)
        
        imagen_hematologia = ImagenHematologia.objects.create(
            imagen=imagen_file.read(),
            muestra_id=muestra_id
        )

        return Response(self.get_serializer(imagen_hematologia).data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], url_path='muestra/(?P<id>[^/.]+)')
    def por_muestra(self, request, id=None):
        """Obtiene todas las imágenes de una muestra de hematología mediante URL directa."""
        imagenes = ImagenHematologia.objects.filter(muestra_id=id)
        return Response(self.get_serializer(imagenes, many=True).data)

class MicrobiologiaViewSet(RegistroViewSet):
    queryset = Microbiologia.objects.all().order_by('-fecha')
    serializer_class = MicrobiologiaSerializer
    qr_prefix = '--mb--'
    qr_field = 'qr_microbiologia'

    def create(self, request):
        """Extiende el create base añadiendo generación de número de microbiología."""
        import time
        data = request.data.copy()
        if not data.get('qr_microbiologia'):
            data['qr_microbiologia'] = generar_qr_unico(self.qr_prefix, Microbiologia, self.qr_field)
        if not data.get('microbiologia'):
            data['microbiologia'] = data.get('muestra') or f"MB-{int(time.time())}"
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='qr/(?P<qr>.+)')
    def por_qr(self, request, qr=None):
        """Busca por código QR"""
        microbiologias = Microbiologia.objects.filter(qr_microbiologia=qr)
        return Response(MicrobiologiaSerializer(microbiologias, many=True).data)
    
    @action(detail=False, methods=['get'], url_path='organo/(?P<organo>.+)')
    def por_organo(self, request, organo=None):
        """Filtra por órgano"""
        if organo == '*':
            microbiologias = self.get_queryset()
        else:
            microbiologias = Microbiologia.objects.filter(organo=organo).order_by('-fecha')
        return Response(MicrobiologiaSerializer(microbiologias, many=True).data)
    
    @action(detail=False, methods=['get'], url_path='numero/(?P<numero>.+)')
    def por_numero(self, request, numero=None):
        """Filtra por número"""
        microbiologias = Microbiologia.objects.filter(microbiologia=numero).order_by('-fecha')
        return Response(MicrobiologiaSerializer(microbiologias, many=True).data)
    
    @action(detail=False, methods=['get'], url_path='fecha/(?P<fecha>[^/.]+)')
    def por_fecha(self, request, fecha=None):
        """Filtra por fecha específica"""
        microbiologias = Microbiologia.objects.filter(fecha=fecha).order_by('-fecha')
        return Response(MicrobiologiaSerializer(microbiologias, many=True).data)

class MuestraMicrobiologiaViewSet(MuestraSoftDeleteDestroyMixin, viewsets.ModelViewSet):
    queryset = MuestraMicrobiologia.objects.all()
    serializer_class = MuestraMicrobiologiaSerializer
    
    def create(self, request):
        data = request.data.copy()
        if 'qr_muestra' not in data or not data['qr_muestra']:
            data['qr_muestra'] = generar_qr_unico('--mmb--', MuestraMicrobiologia, 'qr_muestra')
        
        imagen_file = request.FILES.get('imagen', None)
        if imagen_file:
            try:
                _validar_imagen_api(imagen_file)
            except ValidationError as exc:
                return Response({'error': _extract_validation_error_message(exc)}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        muestra = serializer.save()
        
        if imagen_file:
            ImagenMicrobiologia.objects.create(
                imagen=imagen_file.read(),
                muestra=muestra
            )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='microbiologia/(?P<id>[^/.]+)')
    def por_microbiologia(self, request, id=None):
        muestras = MuestraMicrobiologia.objects.filter(microbiologia_id=id)
        return Response(MuestraMicrobiologiaSerializer(muestras, many=True).data)
    
    @action(detail=False, methods=['get'], url_path='qr/(?P<qr>[^/.]+)')
    def por_qr(self, request, qr=None):
        muestras = MuestraMicrobiologia.objects.filter(qr_muestra=qr)
        return Response(MuestraMicrobiologiaSerializer(muestras, many=True).data)

class ImagenMicrobiologiaViewSet(SoftDeleteDestroyMixin, viewsets.ModelViewSet):
    queryset = ImagenMicrobiologia.objects.all()
    serializer_class = ImagenMicrobiologiaSerializer
    
    def create(self, request):
        imagen_file = request.FILES.get('imagen', None)
        muestra_id = request.data.get('muestra')
        
        if not imagen_file:
            return Response({'error': 'No se proporcionó imagen'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not muestra_id:
            return Response({'error': 'No se proporcionó ID de muestra'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            _validar_imagen_api(imagen_file)
        except ValidationError as exc:
            return Response({'error': _extract_validation_error_message(exc)}, status=status.HTTP_400_BAD_REQUEST)
        
        imagen_microbiologia = ImagenMicrobiologia.objects.create(
            imagen=imagen_file.read(),
            muestra_id=muestra_id
        )

        return Response(self.get_serializer(imagen_microbiologia).data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], url_path='muestra/(?P<id>[^/.]+)')
    def por_muestra(self, request, id=None):
        """Obtiene todas las imágenes de una muestra de microbiología mediante URL directa."""
        imagenes = ImagenMicrobiologia.objects.filter(muestra_id=id)
        return Response(self.get_serializer(imagenes, many=True).data)


class InformeResultadoViewSet(viewsets.ModelViewSet):
    queryset = InformeResultado.objects.all().order_by('-fecha', '-id_informe')
    serializer_class = InformeResultadoSerializer

    @staticmethod
    def _tabla_tiene_columnas(tabla, *columnas):
        try:
            with connection.cursor() as cursor:
                descripcion = connection.introspection.get_table_description(cursor, tabla)
        except Exception:
            return False
        disponibles = {getattr(col, 'name', col[0]) for col in descripcion}
        return all(col in disponibles for col in columnas)

    @classmethod
    def _modo_generico(cls):
        return cls._tabla_tiene_columnas('informesresultado', 'content_type_id', 'object_id')

    @staticmethod
    def _legacy_fk_col_for_model(modelo):
        return {
            Cassette: 'cassette_id',
            Citologia: 'citologia_id',
            Necropsia: 'necropsia_id',
            Tubo: 'tubo_id',
            Hematologia: 'hematologia_id',
            Microbiologia: 'microbiologia_id',
        }.get(modelo)

    @classmethod
    def _legacy_parse_target(cls, data):
        targets = [
            ('cassette', Cassette, 'cassette_id'),
            ('citologia', Citologia, 'citologia_id'),
            ('necropsia', Necropsia, 'necropsia_id'),
            ('tubo', Tubo, 'tubo_id'),
            ('hematologia', Hematologia, 'hematologia_id'),
            ('microbiologia', Microbiologia, 'microbiologia_id'),
        ]
        provided = []
        for key, model, col in targets:
            value = data.get(key)
            if value not in (None, ''):
                provided.append((key, model, col, value))
        if len(provided) != 1:
            return None
        return provided[0]

    @staticmethod
    def _decode_base64_image(imagen_data):
        if not imagen_data:
            return None
        if not isinstance(imagen_data, str):
            raise ValueError('Formato de imagen invalido.')
        value = imagen_data.strip()
        if value.startswith('data:') and ';base64,' in value:
            value = value.split(',', 1)[1]
        return base64.b64decode(value, validate=True)

    @staticmethod
    def _legacy_row_to_payload(row, target_model=None, target_id=None):
        image_value = row.get('imagen')
        image_bytes = None
        if isinstance(image_value, memoryview):
            image_bytes = image_value.tobytes()
        elif isinstance(image_value, (bytes, bytearray)):
            image_bytes = bytes(image_value)

        return {
            'id_informe': row.get('id'),
            'descripcion': row.get('descripcion'),
            'fecha': row.get('fecha'),
            'tincion': row.get('tincion'),
            'observaciones': row.get('observaciones'),
            'imagen_base64': base64.b64encode(image_bytes).decode('utf-8') if image_bytes else None,
            'target_model': target_model,
            'target_id': int(target_id) if target_id not in (None, '') else None,
            'creado_en': row.get('creado_en'),
        }

    @staticmethod
    def _filtrar_por_modelo(modelo, object_id):
        if InformeResultadoViewSet._modo_generico():
            ct = ContentType.objects.get_for_model(modelo)
            return InformeResultado.objects.filter(content_type=ct, object_id=object_id).order_by('-fecha', '-id_informe')

        fk_col = InformeResultadoViewSet._legacy_fk_col_for_model(modelo)
        if not fk_col:
            return []

        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    f"""
                    SELECT id, descripcion, fecha, tincion, observaciones, imagen, creado_en
                    FROM informesresultado
                    WHERE {fk_col} = %s
                    ORDER BY fecha DESC, id DESC
                    """,
                    [object_id],
                )
                cols = [col[0] for col in cursor.description]
                rows = [dict(zip(cols, item)) for item in cursor.fetchall()]
        except Exception:
            return []

        model_name = modelo.__name__.lower()
        return [InformeResultadoViewSet._legacy_row_to_payload(row, model_name, object_id) for row in rows]

    def create(self, request):
        if request.FILES.get('imagen'):
            return Response(
                {'error': 'Las imágenes del informe deben enviarse en base64 y se almacenan en base de datos.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = request.data.copy()
        imagen_bytes = None

        imagen_data = data.get('imagen')
        if imagen_data:
            if not isinstance(imagen_data, str):
                return Response({'error': 'Formato de imagen inválido.'}, status=status.HTTP_400_BAD_REQUEST)
            if imagen_data.startswith('data:') and ';base64,' in imagen_data:
                imagen_data = imagen_data.split(',', 1)[1]
            try:
                imagen_bytes = base64.b64decode(imagen_data, validate=True)
            except Exception:
                return Response({'error': 'La imagen no es base64 válido.'}, status=status.HTTP_400_BAD_REQUEST)

        if 'imagen' in data:
            data.pop('imagen')

        if self._modo_generico():
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            informe = serializer.save()

            if imagen_bytes:
                informe.imagen = imagen_bytes
                informe.save(update_fields=['imagen'])

            return Response(self.get_serializer(informe).data, status=status.HTTP_201_CREATED)

        target = self._legacy_parse_target(data)
        if not target:
            return Response({'error': 'Debe indicar exactamente un destino para el informe.'}, status=status.HTTP_400_BAD_REQUEST)

        target_key, _target_model, target_fk_col, target_id = target
        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    f"""
                    INSERT INTO informesresultado
                    (descripcion, fecha, tincion, observaciones, imagen, creado_en, {target_fk_col})
                    VALUES (%s, %s, %s, %s, %s, CURRENT_TIMESTAMP, %s)
                    """,
                    [
                        data.get('descripcion'),
                        data.get('fecha'),
                        data.get('tincion'),
                        data.get('observaciones'),
                        imagen_bytes,
                        target_id,
                    ],
                )
                new_id = cursor.lastrowid
        except Exception as exc:
            return Response({'error': f'Error guardando informe: {exc}'}, status=status.HTTP_400_BAD_REQUEST)

        payload = {
            'id': new_id,
            'descripcion': data.get('descripcion'),
            'fecha': data.get('fecha'),
            'tincion': data.get('tincion'),
            'observaciones': data.get('observaciones'),
            'imagen': imagen_bytes,
            'creado_en': None,
        }
        return Response(self._legacy_row_to_payload(payload, target_key, target_id), status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        if self._modo_generico():
            return super().update(request, *args, **kwargs)

        informe_id = kwargs.get('pk')
        data = request.data.copy()

        try:
            imagen_bytes = self._decode_base64_image(data.get('imagen')) if 'imagen' in data and data.get('imagen') else None
        except Exception:
            return Response({'error': 'La imagen no es base64 valido.'}, status=status.HTTP_400_BAD_REQUEST)

        target = self._legacy_parse_target(data)
        target_fk_col = target[2] if target else None
        target_id = target[3] if target else None

        try:
            with connection.cursor() as cursor:
                if target_fk_col:
                    set_target_sql = f", {target_fk_col} = %s"
                    target_params = [target_id]
                else:
                    set_target_sql = ""
                    target_params = []

                if imagen_bytes is not None:
                    cursor.execute(
                        f"""
                        UPDATE informesresultado
                        SET descripcion=%s, fecha=%s, tincion=%s, observaciones=%s, imagen=%s {set_target_sql}
                        WHERE id=%s
                        """,
                        [
                            data.get('descripcion'),
                            data.get('fecha'),
                            data.get('tincion'),
                            data.get('observaciones'),
                            imagen_bytes,
                            *target_params,
                            informe_id,
                        ],
                    )
                else:
                    cursor.execute(
                        f"""
                        UPDATE informesresultado
                        SET descripcion=%s, fecha=%s, tincion=%s, observaciones=%s {set_target_sql}
                        WHERE id=%s
                        """,
                        [
                            data.get('descripcion'),
                            data.get('fecha'),
                            data.get('tincion'),
                            data.get('observaciones'),
                            *target_params,
                            informe_id,
                        ],
                    )
        except Exception as exc:
            return Response({'error': f'Error actualizando informe: {exc}'}, status=status.HTTP_400_BAD_REQUEST)

        payload = {
            'id': int(informe_id),
            'descripcion': data.get('descripcion'),
            'fecha': data.get('fecha'),
            'tincion': data.get('tincion'),
            'observaciones': data.get('observaciones'),
            'imagen': imagen_bytes,
            'creado_en': None,
        }
        target_model = target[0] if target else None
        return Response(self._legacy_row_to_payload(payload, target_model, target_id), status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    @action(detail=False, methods=['get'], url_path='tubo/(?P<id>[^/.]+)')
    def por_tubo(self, request, id=None):
        informes = self._filtrar_por_modelo(Tubo, id)
        if self._modo_generico():
            return Response(InformeResultadoSerializer(informes, many=True).data)
        return Response(informes)

    @action(detail=False, methods=['get'], url_path='hematologia/(?P<id>[^/.]+)')
    def por_hematologia(self, request, id=None):
        informes = self._filtrar_por_modelo(Hematologia, id)
        if self._modo_generico():
            return Response(InformeResultadoSerializer(informes, many=True).data)
        return Response(informes)

    @action(detail=False, methods=['get'], url_path='microbiologia/(?P<id>[^/.]+)')
    def por_microbiologia(self, request, id=None):
        informes = self._filtrar_por_modelo(Microbiologia, id)
        if self._modo_generico():
            return Response(InformeResultadoSerializer(informes, many=True).data)
        return Response(informes)

    @action(detail=False, methods=['get'], url_path='cassette/(?P<id>[^/.]+)')
    def por_cassette(self, request, id=None):
        informes = self._filtrar_por_modelo(Cassette, id)
        if self._modo_generico():
            return Response(InformeResultadoSerializer(informes, many=True).data)
        return Response(informes)

    @action(detail=False, methods=['get'], url_path='citologia/(?P<id>[^/.]+)')
    def por_citologia(self, request, id=None):
        informes = self._filtrar_por_modelo(Citologia, id)
        if self._modo_generico():
            return Response(InformeResultadoSerializer(informes, many=True).data)
        return Response(informes)
