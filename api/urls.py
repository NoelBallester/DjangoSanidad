from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TecnicoViewSet, CassetteViewSet, MuestraViewSet, ImagenViewSet,
    CitologiaViewSet, MuestraCitologiaViewSet, ImagenCitologiaViewSet,
    TuboViewSet, MuestraTuboViewSet, ImagenTuboViewSet
)

router = DefaultRouter()
router.register(r'tecnicos', TecnicoViewSet, basename='tecnico')
router.register(r'cassettes', CassetteViewSet, basename='cassette')
router.register(r'muestras', MuestraViewSet, basename='muestra')
router.register(r'imagenes', ImagenViewSet, basename='imagen')
router.register(r'citologias', CitologiaViewSet, basename='citologia')
router.register(r'muestrascitologia', MuestraCitologiaViewSet, basename='muestracitologia')
router.register(r'imagenescitologia', ImagenCitologiaViewSet, basename='imagencitologia')
router.register(r'tubos', TuboViewSet, basename='tubo')
router.register(r'muestrastubo', MuestraTuboViewSet, basename='muestratubo')
router.register(r'imagenestubo', ImagenTuboViewSet, basename='imagentubo')

urlpatterns = [
    path('', include(router.urls)),
]
