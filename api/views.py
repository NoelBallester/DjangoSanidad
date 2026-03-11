from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from datetime import datetime
import base64
import uuid
import random
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

def generar_qr(prefijo):
    """Genera un código QR único con formato: prefijo + 12 caracteres"""
    random_part = str(uuid.uuid4()).replace('-', '') + str(random.randint(0, 999999))
    return f"{prefijo}{str(random_part)[:12]}"

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
        try:
            tecnico = Tecnico.objects.get(email=mail)
            return Response(TecnicoSerializer(tecnico).data)
        except Tecnico.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

class CassetteViewSet(viewsets.ModelViewSet):
    queryset = Cassette.objects.all().order_by('-fecha')
    serializer_class = CassetteSerializer
    
    def create(self, request):
        data = request.data.copy()
        # Generar QR automáticamente si no existe
        if 'qr_casette' not in data or not data['qr_casette']:
            data['qr_casette'] = generar_qr('--c--')
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def index(self, request):
        """Carga los últimos 10 cassettes"""
        cassettes = self.get_queryset()[:10]
        return Response(CassetteSerializer(cassettes, many=True).data)
    
    @action(detail=False, methods=['get'])
    def todos(self, request):
        """Carga todos los cassettes"""
        cassettes = self.get_queryset()
        return Response(CassetteSerializer(cassettes, many=True).data)

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
    
    @action(detail=False, methods=['get'])
    def rango_fechas(self, request):
        """Filtra cassettes por rango de fechas"""
        fecha_inicio = request.query_params.get('inicio')
        fecha_fin = request.query_params.get('fin')
        if not fecha_inicio or not fecha_fin:
            return Response({'error': 'Se requieren inicio y fin'}, status=status.HTTP_400_BAD_REQUEST)
        cassettes = Cassette.objects.filter(fecha__gte=fecha_inicio, fecha__lte=fecha_fin).order_by('-fecha')
        return Response(CassetteSerializer(cassettes, many=True).data)
    
    @action(detail=True, methods=['post'])
    def actualizar_informe(self, request, pk=None):
        """Actualiza el informe médico de un cassette"""
        cassette = self.get_object()
        data = request.data
        
        if 'informe_descripcion' in data:
            cassette.informe_descripcion = data['informe_descripcion']
        if 'informe_fecha' in data:
            cassette.informe_fecha = data['informe_fecha']
        if 'informe_tincion' in data:
            cassette.informe_tincion = data['informe_tincion']
        if 'informe_observaciones' in data:
            cassette.informe_observaciones = data['informe_observaciones']
        if 'informe_imagen' in data:
            # Convertir base64 a bytes si viene como string
            imagen_data = data['informe_imagen']
            if isinstance(imagen_data, str) and imagen_data.startswith('data:image'):
                imagen_data = imagen_data.split(',')[1]
            cassette.informe_imagen = base64.b64decode(imagen_data) if isinstance(imagen_data, str) else imagen_data
        
        cassette.save()
        return Response(CassetteSerializer(cassette).data)

class CitologiaViewSet(viewsets.ModelViewSet):
    queryset = Citologia.objects.all().order_by('-fecha')
    serializer_class = CitologiaSerializer
    
    def create(self, request):
        data = request.data.copy()
        # Generar QR automáticamente si no existe
        if 'qr_citologia' not in data or not data['qr_citologia']:
            data['qr_citologia'] = generar_qr('--c--')
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def index(self, request):
        """Carga las últimas 10 citologías"""
        citologias = self.get_queryset()[:10]
        return Response(CitologiaSerializer(citologias, many=True).data)
    
    @action(detail=False, methods=['get'])
    def todos(self, request):
        """Carga todas las citologías"""
        citologias = self.get_queryset()
        return Response(CitologiaSerializer(citologias, many=True).data)

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
    
    @action(detail=False, methods=['get'])
    def rango_fechas(self, request):
        """Filtra citologías por rango de fechas"""
        fecha_inicio = request.query_params.get('inicio')
        fecha_fin = request.query_params.get('fin')
        if not fecha_inicio or not fecha_fin:
            return Response({'error': 'Se requieren inicio y fin'}, status=status.HTTP_400_BAD_REQUEST)
        citologias = Citologia.objects.filter(fecha__gte=fecha_inicio, fecha__lte=fecha_fin).order_by('-fecha')
        return Response(CitologiaSerializer(citologias, many=True).data)
    
    @action(detail=True, methods=['post'])
    def actualizar_informe(self, request, pk=None):
        """Actualiza el informe médico de una citología"""
        citologia = self.get_object()
        data = request.data
        
        if 'informe_descripcion' in data:
            citologia.informe_descripcion = data['informe_descripcion']
        if 'informe_fecha' in data:
            citologia.informe_fecha = data['informe_fecha']
        if 'informe_tincion' in data:
            citologia.informe_tincion = data['informe_tincion']
        if 'informe_observaciones' in data:
            citologia.informe_observaciones = data['informe_observaciones']
        if 'informe_imagen' in data:
            # Convertir base64 a bytes si viene como string
            imagen_data = data['informe_imagen']
            if isinstance(imagen_data, str) and imagen_data.startswith('data:image'):
                imagen_data = imagen_data.split(',')[1]
            citologia.informe_imagen = base64.b64decode(imagen_data) if isinstance(imagen_data, str) else imagen_data
        
        citologia.save()
        return Response(CitologiaSerializer(citologia).data)

class NecropsiaViewSet(viewsets.ModelViewSet):
    queryset = Necropsia.objects.all().order_by('-fecha')
    serializer_class = NecropsiaSerializer

    def create(self, request):
        data = request.data.copy()
        if 'qr_necropsia' not in data or not data['qr_necropsia']:
            data['qr_necropsia'] = generar_qr('--n--')
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def index(self, request):
        necropsias = self.get_queryset()[:10]
        return Response(NecropsiaSerializer(necropsias, many=True).data)

    @action(detail=False, methods=['get'])
    def todos(self, request):
        necropsias = self.get_queryset()
        return Response(NecropsiaSerializer(necropsias, many=True).data)

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

    @action(detail=False, methods=['get'])
    def rango_fechas(self, request):
        fecha_inicio = request.query_params.get('inicio')
        fecha_fin = request.query_params.get('fin')
        if not fecha_inicio or not fecha_fin:
            return Response({'error': 'Se requieren inicio y fin'}, status=status.HTTP_400_BAD_REQUEST)
        necropsias = Necropsia.objects.filter(fecha__gte=fecha_inicio, fecha__lte=fecha_fin).order_by('-fecha')
        return Response(NecropsiaSerializer(necropsias, many=True).data)

    @action(detail=True, methods=['post'])
    def actualizar_informe(self, request, pk=None):
        necropsia = self.get_object()
        data = request.data

        if 'informe_descripcion' in data:
            necropsia.informe_descripcion = data['informe_descripcion']
        if 'informe_fecha' in data:
            necropsia.informe_fecha = data['informe_fecha']
        if 'informe_tincion' in data:
            necropsia.informe_tincion = data['informe_tincion']
        if 'informe_observaciones' in data:
            necropsia.informe_observaciones = data['informe_observaciones']
        if 'informe_imagen' in data:
            imagen_data = data['informe_imagen']
            if isinstance(imagen_data, str) and imagen_data.startswith('data:image'):
                imagen_data = imagen_data.split(',')[1]
            necropsia.informe_imagen = base64.b64decode(imagen_data) if isinstance(imagen_data, str) else imagen_data

        necropsia.save()
        return Response(NecropsiaSerializer(necropsia).data)

class MuestraViewSet(viewsets.ModelViewSet):
    queryset = Muestra.objects.all()
    serializer_class = MuestraSerializer
    
    def create(self, request):
        data = request.data.copy()
        # Generar QR automáticamente si no existe
        if 'qr_muestra' not in data or not data['qr_muestra']:
            data['qr_muestra'] = generar_qr('--m--')
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

class MuestraCitologiaViewSet(viewsets.ModelViewSet):
    queryset = MuestraCitologia.objects.all()
    serializer_class = MuestraCitologiaSerializer
    
    def create(self, request):
        data = request.data.copy()
        # Generar QR automáticamente si no existe
        if 'qr_muestra' not in data or not data['qr_muestra']:
            data['qr_muestra'] = generar_qr('--m--')
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

class MuestraNecropsiaViewSet(viewsets.ModelViewSet):
    queryset = MuestraNecropsia.objects.all()
    serializer_class = MuestraNecropsiaSerializer

    def create(self, request):
        data = request.data.copy()
        if 'qr_muestra' not in data or not data['qr_muestra']:
            data['qr_muestra'] = generar_qr('--m--')
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

class ImagenViewSet(viewsets.ModelViewSet):
    queryset = Imagen.objects.all()
    serializer_class = ImagenSerializer

    def create(self, request):
        imagen_file = request.FILES.get('imagen', None)
        muestra_id = request.data.get('muestra')

        if not imagen_file:
            return Response({'error': 'No se proporcionó imagen'}, status=status.HTTP_400_BAD_REQUEST)
        if not muestra_id:
            return Response({'error': 'No se proporcionó ID de muestra'}, status=status.HTTP_400_BAD_REQUEST)

        imagen_obj = Imagen.objects.create(
            imagen=imagen_file,
            muestra_id=muestra_id
        )
        return Response(ImagenSerializer(imagen_obj).data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], url_path='muestra/(?P<id>[^/.]+)')
    def por_muestra(self, request, id=None):
        """Obtiene todas las imágenes de una muestra en base64"""
        imagenes = Imagen.objects.filter(muestra_id=id)
        return Response(ImagenSerializer(imagenes, many=True).data)

class ImagenCitologiaViewSet(viewsets.ModelViewSet):
    queryset = ImagenCitologia.objects.all()
    serializer_class = ImagenCitologiaSerializer

    def create(self, request):
        imagen_file = request.FILES.get('imagen', None)
        muestra_id = request.data.get('muestra')

        if not imagen_file:
            return Response({'error': 'No se proporcionó imagen'}, status=status.HTTP_400_BAD_REQUEST)
        if not muestra_id:
            return Response({'error': 'No se proporcionó ID de muestra'}, status=status.HTTP_400_BAD_REQUEST)

        imagen_obj = ImagenCitologia.objects.create(
            imagen=imagen_file,
            muestra_id=muestra_id
        )
        return Response(ImagenCitologiaSerializer(imagen_obj).data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], url_path='muestra/(?P<id>[^/.]+)')
    def por_muestra(self, request, id=None):
        """Obtiene todas las imágenes de una muestra en base64"""
        imagenes = ImagenCitologia.objects.filter(muestra_id=id)
        resultado = []
        for img in imagenes:
            img_data = ImagenCitologiaSerializer(img).data
            if img.imagen:
                img_data['imagen_base64'] = base64.b64encode(bytes(img.imagen)).decode('utf-8')
            resultado.append(img_data)
        return Response(resultado)

class ImagenNecropsiaViewSet(viewsets.ModelViewSet):
    queryset = ImagenNecropsia.objects.all()
    serializer_class = ImagenNecropsiaSerializer

    def create(self, request):
        imagen_file = request.FILES.get('imagen', None)
        muestra_id = request.data.get('muestra')

        if not imagen_file:
            return Response({'error': 'No se proporcionó imagen'}, status=status.HTTP_400_BAD_REQUEST)
        if not muestra_id:
            return Response({'error': 'No se proporcionó ID de muestra'}, status=status.HTTP_400_BAD_REQUEST)

        imagen_obj = ImagenNecropsia.objects.create(
            imagen=imagen_file,
            muestra_id=muestra_id
        )
        return Response(ImagenNecropsiaSerializer(imagen_obj).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='muestra/(?P<id>[^/.]+)')
    def por_muestra(self, request, id=None):
        imagenes = ImagenNecropsia.objects.filter(muestra_id=id)
        resultado = []
        for img in imagenes:
            img_data = ImagenNecropsiaSerializer(img).data
            if img.imagen:
                img_data['imagen_base64'] = base64.b64encode(bytes(img.imagen)).decode('utf-8')
            resultado.append(img_data)
        return Response(resultado)

class TuboViewSet(viewsets.ModelViewSet):
    queryset = Tubo.objects.all().order_by('-fecha')
    serializer_class = TuboSerializer
    
    def create(self, request):
        data = request.data.copy()
        # Generar QR automáticamente si no existe
        if 'qr_tubo' not in data or not data['qr_tubo']:
            data['qr_tubo'] = generar_qr('--t--')
        
        # Generar número de tubo si no existe
        if 'tubo' not in data or not data['tubo']:
            if 'muestra' in data and data['muestra']:
                data['tubo'] = data['muestra']
            else:
                import time
                data['tubo'] = f"T-{int(time.time())}"
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def index(self, request):
        """Carga los últimos 10 tubos"""
        tubos = self.get_queryset()[:10]
        return Response(TuboSerializer(tubos, many=True).data)
    
    @action(detail=False, methods=['get'])
    def todos(self, request):
        """Carga todos los tubos"""
        tubos = self.get_queryset()
        return Response(TuboSerializer(tubos, many=True).data)

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
    
    @action(detail=False, methods=['get'])
    def rango_fechas(self, request):
        """Filtra tubos por rango de fechas"""
        fecha_inicio = request.query_params.get('inicio')
        fecha_fin = request.query_params.get('fin')
        if not fecha_inicio or not fecha_fin:
            return Response({'error': 'Se requieren inicio y fin'}, status=status.HTTP_400_BAD_REQUEST)
        tubos = Tubo.objects.filter(fecha__gte=fecha_inicio, fecha__lte=fecha_fin).order_by('-fecha')
        return Response(TuboSerializer(tubos, many=True).data)
    
    @action(detail=True, methods=['post'])
    def actualizar_informe(self, request, pk=None):
        """Actualiza el informe médico de un tubo"""
        tubo = self.get_object()
        data = request.data
        
        if 'informe_descripcion' in data:
            tubo.informe_descripcion = data['informe_descripcion']
        if 'informe_fecha' in data:
            tubo.informe_fecha = data['informe_fecha']
        if 'informe_tincion' in data:
            tubo.informe_tincion = data['informe_tincion']
        if 'informe_observaciones' in data:
            tubo.informe_observaciones = data['informe_observaciones']
        if 'informe_imagen' in data:
            # Convertir base64 a bytes si viene como string
            imagen_data = data['informe_imagen']
            if isinstance(imagen_data, str) and imagen_data.startswith('data:image'):
                imagen_data = imagen_data.split(',')[1]
            tubo.informe_imagen = base64.b64decode(imagen_data) if isinstance(imagen_data, str) else imagen_data
        
        tubo.save()
        return Response(TuboSerializer(tubo).data)

class MuestraTuboViewSet(viewsets.ModelViewSet):
    queryset = MuestraTubo.objects.all()
    serializer_class = MuestraTuboSerializer
    
    def create(self, request):
        data = request.data.copy()
        # Generar QR automáticamente si no existe
        if 'qr_muestra' not in data or not data['qr_muestra']:
            data['qr_muestra'] = generar_qr('--mt--')
        
        # Separar la imagen de los datos si existe
        imagen_file = request.FILES.get('imagen', None)
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        muestra = serializer.save()
        
        # Si hay imagen, crear el registro en ImagenTubo con datos binarios
        if imagen_file:
            imagen_bytes = imagen_file
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

class ImagenTuboViewSet(viewsets.ModelViewSet):
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
        
        # Leer el archivo y convertirlo a bytes
        imagen_bytes = imagen_file
        
        # Crear el objeto ImagenTubo
        imagen_tubo = ImagenTubo.objects.create(
            imagen=imagen_bytes,
            muestra_id=muestra_id
        )
        
        return Response(ImagenTuboSerializer(imagen_tubo).data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], url_path='muestra/(?P<id>[^/.]+)')
    def por_muestra(self, request, id=None):
        """Obtiene todas las imágenes de una muestra de tubo en base64"""
        imagenes = ImagenTubo.objects.filter(muestra_id=id)
        resultado = []
        for img in imagenes:
            img_data = ImagenTuboSerializer(img).data
            # El serializer ya incluye imagen_base64
            resultado.append(img_data)
        return Response(resultado)

class HematologiaViewSet(viewsets.ModelViewSet):
    queryset = Hematologia.objects.all().order_by('-fecha')
    serializer_class = HematologiaSerializer
    
    def create(self, request):
        data = request.data.copy()
        # Generar QR automáticamente si no existe
        if 'qr_hematologia' not in data or not data['qr_hematologia']:
            data['qr_hematologia'] = generar_qr('--h--')
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def index(self, request):
        """Carga las últimas 10 hematologías"""
        hematologias = self.get_queryset()[:10]
        return Response(HematologiaSerializer(hematologias, many=True).data)
    
    @action(detail=False, methods=['get'])
    def todos(self, request):
        """Carga todas las hematologías"""
        hematologias = self.get_queryset()
        return Response(HematologiaSerializer(hematologias, many=True).data)

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
    
    @action(detail=False, methods=['get'])
    def rango_fechas(self, request):
        """Filtra hematologías por rango de fechas"""
        fecha_inicio = request.query_params.get('inicio')
        fecha_fin = request.query_params.get('fin')
        if not fecha_inicio or not fecha_fin:
            return Response({'error': 'Se requieren inicio y fin'}, status=status.HTTP_400_BAD_REQUEST)
        hematologias = Hematologia.objects.filter(fecha__gte=fecha_inicio, fecha__lte=fecha_fin).order_by('-fecha')
        return Response(HematologiaSerializer(hematologias, many=True).data)
    
    @action(detail=True, methods=['post'])
    def actualizar_informe(self, request, pk=None):
        """Actualiza el informe médico de una hematología"""
        hematologia = self.get_object()
        data = request.data
        
        if 'informe_descripcion' in data:
            hematologia.informe_descripcion = data['informe_descripcion']
        if 'informe_fecha' in data:
            hematologia.informe_fecha = data['informe_fecha']
        if 'informe_tincion' in data:
            hematologia.informe_tincion = data['informe_tincion']
        if 'informe_observaciones' in data:
            hematologia.informe_observaciones = data['informe_observaciones']
        if 'informe_imagen' in data:
            # Convertir base64 a bytes si viene como string
            imagen_data = data['informe_imagen']
            if isinstance(imagen_data, str) and imagen_data.startswith('data:image'):
                imagen_data = imagen_data.split(',')[1]
            hematologia.informe_imagen = base64.b64decode(imagen_data) if isinstance(imagen_data, str) else imagen_data
        
        hematologia.save()
        return Response(HematologiaSerializer(hematologia).data)

class MuestraHematologiaViewSet(viewsets.ModelViewSet):
    queryset = MuestraHematologia.objects.all()
    serializer_class = MuestraHematologiaSerializer
    
    def create(self, request):
        data = request.data.copy()
        # Generar QR automáticamente si no existe
        if 'qr_muestra' not in data or not data['qr_muestra']:
            data['qr_muestra'] = generar_qr('--mh--')
        
        # Separar la imagen de los datos si existe
        imagen_file = request.FILES.get('imagen', None)
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        muestra = serializer.save()
        
        # Si hay imagen, crear el registro en ImagenHematologia
        if imagen_file:
            ImagenHematologia.objects.create(
                imagen=imagen_file,
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


class ImagenHematologiaViewSet(viewsets.ModelViewSet):
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
        
        imagen_hematologia = ImagenHematologia.objects.create(
            imagen=imagen_file,
            muestra_id=muestra_id
        )
        
        return Response(ImagenHematologiaSerializer(imagen_hematologia).data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], url_path='muestra/(?P<id>[^/.]+)')
    def por_muestra(self, request, id=None):
        """Obtiene todas las imágenes de una muestra de hematología en base64"""
        imagenes = ImagenHematologia.objects.filter(muestra_id=id)
        resultado = []
        for img in imagenes:
            img_data = ImagenHematologiaSerializer(img).data
            if img.imagen:
                try:
                    img_data['imagen_base64'] = base64.b64encode(bytes(img.imagen)).decode('utf-8')
                except Exception:
                    img_data['imagen_base64'] = None
            resultado.append(img_data)
        return Response(resultado)

class MicrobiologiaViewSet(viewsets.ModelViewSet):
    queryset = Microbiologia.objects.all().order_by('-fecha')
    serializer_class = MicrobiologiaSerializer
    
    def create(self, request):
        data = request.data.copy()
        # Generar QR automáticamente si no existe
        if 'qr_microbiologia' not in data or not data['qr_microbiologia']:
            data['qr_microbiologia'] = generar_qr('--mb--')
        
        # Generar número de tubo si no existe
        if 'microbiologia' not in data or not data['microbiologia']:
            if 'muestra' in data and data['muestra']:
                data['microbiologia'] = data['muestra']
            else:
                import time
                data['microbiologia'] = f"MB-{int(time.time())}"
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def index(self, request):
        """Carga los últimos 10 de microbiología"""
        microbiologias = self.get_queryset()[:10]
        return Response(MicrobiologiaSerializer(microbiologias, many=True).data)
    
    @action(detail=False, methods=['get'])
    def todos(self, request):
        """Carga todos"""
        microbiologias = self.get_queryset()
        return Response(MicrobiologiaSerializer(microbiologias, many=True).data)

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
    
    @action(detail=False, methods=['get'])
    def rango_fechas(self, request):
        """Filtra por rango de fechas"""
        fecha_inicio = request.query_params.get('inicio')
        fecha_fin = request.query_params.get('fin')
        if not fecha_inicio or not fecha_fin:
            return Response({'error': 'Se requieren inicio y fin'}, status=status.HTTP_400_BAD_REQUEST)
        microbiologias = Microbiologia.objects.filter(fecha__gte=fecha_inicio, fecha__lte=fecha_fin).order_by('-fecha')
        return Response(MicrobiologiaSerializer(microbiologias, many=True).data)
    
    @action(detail=True, methods=['post'])
    def actualizar_informe(self, request, pk=None):
        """Actualiza el informe médico"""
        microbiologia = self.get_object()
        data = request.data
        
        if 'informe_descripcion' in data:
            microbiologia.informe_descripcion = data['informe_descripcion']
        if 'informe_fecha' in data:
            microbiologia.informe_fecha = data['informe_fecha']
        if 'informe_tincion' in data:
            microbiologia.informe_tincion = data['informe_tincion']
        if 'informe_observaciones' in data:
            microbiologia.informe_observaciones = data['informe_observaciones']
        if 'informe_imagen' in data:
            imagen_data = data['informe_imagen']
            if isinstance(imagen_data, str) and imagen_data.startswith('data:image'):
                imagen_data = imagen_data.split(',')[1]
            microbiologia.informe_imagen = base64.b64decode(imagen_data) if isinstance(imagen_data, str) else imagen_data
        
        microbiologia.save()
        return Response(MicrobiologiaSerializer(microbiologia).data)

class MuestraMicrobiologiaViewSet(viewsets.ModelViewSet):
    queryset = MuestraMicrobiologia.objects.all()
    serializer_class = MuestraMicrobiologiaSerializer
    
    def create(self, request):
        data = request.data.copy()
        if 'qr_muestra' not in data or not data['qr_muestra']:
            data['qr_muestra'] = generar_qr('--mmb--')
        
        imagen_file = request.FILES.get('imagen', None)
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        muestra = serializer.save()
        
        if imagen_file:
            ImagenMicrobiologia.objects.create(
                imagen=imagen_file,
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

class ImagenMicrobiologiaViewSet(viewsets.ModelViewSet):
    queryset = ImagenMicrobiologia.objects.all()
    serializer_class = ImagenMicrobiologiaSerializer
    
    def create(self, request):
        imagen_file = request.FILES.get('imagen', None)
        muestra_id = request.data.get('muestra')
        
        if not imagen_file:
            return Response({'error': 'No se proporcionó imagen'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not muestra_id:
            return Response({'error': 'No se proporcionó ID de muestra'}, status=status.HTTP_400_BAD_REQUEST)
        
        imagen_microbiologia = ImagenMicrobiologia.objects.create(
            imagen=imagen_file,
            muestra_id=muestra_id
        )
        
        return Response(ImagenMicrobiologiaSerializer(imagen_microbiologia).data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], url_path='muestra/(?P<id>[^/.]+)')
    def por_muestra(self, request, id=None):
        imagenes = ImagenMicrobiologia.objects.filter(muestra_id=id)
        resultado = []
        for img in imagenes:
            img_data = ImagenMicrobiologiaSerializer(img).data
            if img.imagen:
                try:
                    img_data['imagen_base64'] = base64.b64encode(bytes(img.imagen)).decode('utf-8')
                except Exception:
                    pass
            resultado.append(img_data)
        return Response(resultado)


class InformeResultadoViewSet(viewsets.ModelViewSet):
    queryset = InformeResultado.objects.all().order_by('-fecha', '-id_informe')
    serializer_class = InformeResultadoSerializer

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
            if imagen_data.startswith('data:image'):
                imagen_data = imagen_data.split(',')[1]
            try:
                imagen_bytes = base64.b64decode(imagen_data, validate=True)
            except Exception:
                return Response({'error': 'La imagen no es base64 válido.'}, status=status.HTTP_400_BAD_REQUEST)

        if 'imagen' in data:
            data.pop('imagen')

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        informe = serializer.save()

        if imagen_bytes:
            informe.imagen = imagen_bytes
            informe.save(update_fields=['imagen'])

        return Response(self.get_serializer(informe).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='tubo/(?P<id>[^/.]+)')
    def por_tubo(self, request, id=None):
        informes = InformeResultado.objects.filter(tubo_id=id).order_by('-fecha', '-id_informe')
        return Response(InformeResultadoSerializer(informes, many=True).data)

    @action(detail=False, methods=['get'], url_path='hematologia/(?P<id>[^/.]+)')
    def por_hematologia(self, request, id=None):
        informes = InformeResultado.objects.filter(hematologia_id=id).order_by('-fecha', '-id_informe')
        return Response(InformeResultadoSerializer(informes, many=True).data)

    @action(detail=False, methods=['get'], url_path='microbiologia/(?P<id>[^/.]+)')
    def por_microbiologia(self, request, id=None):
        informes = InformeResultado.objects.filter(microbiologia_id=id).order_by('-fecha', '-id_informe')
        return Response(InformeResultadoSerializer(informes, many=True).data)

    @action(detail=False, methods=['get'], url_path='cassette/(?P<id>[^/.]+)')
    def por_cassette(self, request, id=None):
        informes = InformeResultado.objects.filter(cassette_id=id).order_by('-fecha', '-id_informe')
        return Response(InformeResultadoSerializer(informes, many=True).data)

    @action(detail=False, methods=['get'], url_path='citologia/(?P<id>[^/.]+)')
    def por_citologia(self, request, id=None):
        informes = InformeResultado.objects.filter(citologia_id=id).order_by('-fecha', '-id_informe')
        return Response(InformeResultadoSerializer(informes, many=True).data)
