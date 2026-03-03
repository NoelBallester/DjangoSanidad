from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TecnicoViewSet, CassetteViewSet, MuestraViewSet, ImagenViewSet,
    CitologiaViewSet, MuestraCitologiaViewSet, ImagenCitologiaViewSet
)

router = DefaultRouter()
router.register(r'tecnicos', TecnicoViewSet, basename='tecnico')
router.register(r'cassettes', CassetteViewSet, basename='cassette')
router.register(r'muestras', MuestraViewSet, basename='muestra')
router.register(r'imagenes', ImagenViewSet, basename='imagen')
router.register(r'citologias', CitologiaViewSet, basename='citologia')
router.register(r'muestrascitologia', MuestraCitologiaViewSet, basename='muestracitologia')
router.register(r'imagenescitologia', ImagenCitologiaViewSet, basename='imagencitologia')

urlpatterns = [
    path('', include(router.urls)),
]
