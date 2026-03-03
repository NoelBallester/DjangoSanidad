from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Tecnico, Cassette, Muestra, Imagen, Citologia, MuestraCitologia, ImagenCitologia
from .serializers import (
    TecnicoSerializer, CassetteSerializer, MuestraSerializer, ImagenSerializer,
    CitologiaSerializer, MuestraCitologiaSerializer, ImagenCitologiaSerializer
)

class TecnicoViewSet(viewsets.ModelViewSet):
    queryset = Tecnico.objects.all()
    serializer_class = TecnicoSerializer
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        try:
            tecnico = Tecnico.objects.get(email=email)
            if tecnico.check_password(password) or tecnico.password == password: # fallback to plaintext if needed
                return Response(TecnicoSerializer(tecnico).data)
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except Tecnico.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
            
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
    
    @action(detail=False, methods=['get'])
    def index(self, request):
        cassettes = self.get_queryset()[:20]
        return Response(CassetteSerializer(cassettes, many=True).data)

    @action(detail=False, methods=['get'], url_path='cassetteqr/(?P<qr>[^/.]+)')
    def get_by_qr(self, request, qr=None):
        cassettes = Cassette.objects.filter(qr_casette=qr)
        return Response(CassetteSerializer(cassettes, many=True).data)

class MuestraViewSet(viewsets.ModelViewSet):
    queryset = Muestra.objects.all()
    serializer_class = MuestraSerializer

    @action(detail=False, methods=['get'], url_path='cassette/(?P<id>[^/.]+)')
    def get_by_cassette(self, request, id=None):
        muestras = Muestra.objects.filter(cassette_id=id)
        return Response(MuestraSerializer(muestras, many=True).data)

class ImagenViewSet(viewsets.ModelViewSet):
    queryset = Imagen.objects.all()
    serializer_class = ImagenSerializer

class CitologiaViewSet(viewsets.ModelViewSet):
    queryset = Citologia.objects.all()
    serializer_class = CitologiaSerializer

class MuestraCitologiaViewSet(viewsets.ModelViewSet):
    queryset = MuestraCitologia.objects.all()
    serializer_class = MuestraCitologiaSerializer

class ImagenCitologiaViewSet(viewsets.ModelViewSet):
    queryset = ImagenCitologia.objects.all()
    serializer_class = ImagenCitologiaSerializer
