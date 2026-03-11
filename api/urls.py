from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TecnicoViewSet, CassetteViewSet, MuestraViewSet, ImagenViewSet,
    CitologiaViewSet, MuestraCitologiaViewSet, ImagenCitologiaViewSet,
    NecropsiaViewSet, MuestraNecropsiaViewSet, ImagenNecropsiaViewSet,
    TuboViewSet, MuestraTuboViewSet, ImagenTuboViewSet,
    HematologiaViewSet, MuestraHematologiaViewSet, ImagenHematologiaViewSet,
    MicrobiologiaViewSet, MuestraMicrobiologiaViewSet, ImagenMicrobiologiaViewSet,
    InformeResultadoViewSet, proxy_file
)

router = DefaultRouter()
router.register(r'tecnicos', TecnicoViewSet, basename='tecnico')
router.register(r'cassettes', CassetteViewSet, basename='cassette')
router.register(r'muestras', MuestraViewSet, basename='muestra')
router.register(r'imagenes', ImagenViewSet, basename='imagen')
router.register(r'citologias', CitologiaViewSet, basename='citologia')
router.register(r'muestrascitologia', MuestraCitologiaViewSet, basename='muestracitologia')
router.register(r'imagenescitologia', ImagenCitologiaViewSet, basename='imagencitologia')
router.register(r'necropsias', NecropsiaViewSet, basename='necropsia')
router.register(r'muestrasnecropsia', MuestraNecropsiaViewSet, basename='muestranecropsia')
router.register(r'imagenesnecropsia', ImagenNecropsiaViewSet, basename='imagennecropsia')
router.register(r'tubos', TuboViewSet, basename='tubo')
router.register(r'muestrastubo', MuestraTuboViewSet, basename='muestratubo')
router.register(r'imagenestubo', ImagenTuboViewSet, basename='imagentubo')
router.register(r'hematologia', HematologiaViewSet, basename='hematologia')
router.register(r'muestrashematologia', MuestraHematologiaViewSet, basename='muestrahematologia')
router.register(r'imageneshematologia', ImagenHematologiaViewSet, basename='imagenhematologia')

router.register(r'microbiologias', MicrobiologiaViewSet, basename='microbiologia')
router.register(r'muestrasmicrobiologia', MuestraMicrobiologiaViewSet, basename='muestramicrobiologia')
router.register(r'imagenesmicrobiologia', ImagenMicrobiologiaViewSet, basename='imagenmicrobiologia')
router.register(r'informesresultado', InformeResultadoViewSet, basename='informeresultado')

urlpatterns = [
    path('archivo/<str:model_name>/<int:pk>/<str:field_name>/', proxy_file, name='api-file-proxy'),
    path('', include(router.urls)),
]
