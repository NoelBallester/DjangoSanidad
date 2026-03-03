from django.urls import path
from . import views

urlpatterns = [
    path('login/',   views.login_view,  name='login'),
    path('logout/',  views.logout_view, name='logout'),

    path('cassettes/',                                        views.cassette_list,    name='cassettes'),
    path('cassettes/crear/',                                  views.cassette_create,  name='cassette_create'),
    path('cassettes/<int:pk>/editar/',                        views.cassette_update,  name='cassette_update'),
    path('cassettes/<int:pk>/eliminar/',                      views.cassette_delete,  name='cassette_delete'),
    path('cassettes/<int:pk>/informe/',                       views.cassette_informe, name='cassette_informe'),
    path('cassettes/<int:cassette_pk>/muestras/crear/',       views.muestra_create,   name='muestra_create'),
    path('muestras/<int:pk>/editar/',                         views.muestra_update,   name='muestra_update'),
    path('muestras/<int:pk>/eliminar/',                       views.muestra_delete,   name='muestra_delete'),
    path('muestras/<int:muestra_pk>/imagenes/subir/',         views.imagen_upload,    name='imagen_upload'),
    path('imagenes/<int:pk>/eliminar/',                       views.imagen_delete,    name='imagen_delete'),
]
