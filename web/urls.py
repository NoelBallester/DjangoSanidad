from django.urls import path
from . import views

urlpatterns = [
    path('login/',   views.login_view,  name='login'),
    path('logout/',  views.logout_view, name='logout'),

    # Cassettes
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

    # Citologías
    path('citologias/',                                             views.citologia_list,            name='citologias'),
    path('citologias/crear/',                                       views.citologia_create,          name='citologia_create'),
    path('citologias/<int:pk>/editar/',                             views.citologia_update,          name='citologia_update'),
    path('citologias/<int:pk>/eliminar/',                           views.citologia_delete,          name='citologia_delete'),
    path('citologias/<int:pk>/informe/',                            views.citologia_informe,         name='citologia_informe'),
    path('citologias/<int:citologia_pk>/muestras/crear/',           views.muestra_citologia_create,  name='muestra_citologia_create'),
    path('muestras-citologia/<int:pk>/editar/',                     views.muestra_citologia_update,  name='muestra_citologia_update'),
    path('muestras-citologia/<int:pk>/eliminar/',                   views.muestra_citologia_delete,  name='muestra_citologia_delete'),
    path('muestras-citologia/<int:muestra_pk>/imagenes/subir/',     views.imagen_citologia_upload,   name='imagen_citologia_upload'),
    path('imagenes-citologia/<int:pk>/eliminar/',                   views.imagen_citologia_delete,   name='imagen_citologia_delete'),

    # Usuarios
    path('usuarios/',                          views.usuario_list,   name='usuarios'),
    path('usuarios/crear/',                    views.usuario_create, name='usuario_create'),
    path('usuarios/<int:pk>/editar/',          views.usuario_update, name='usuario_update'),
    path('usuarios/<int:pk>/eliminar/',        views.usuario_delete, name='usuario_delete'),
]
