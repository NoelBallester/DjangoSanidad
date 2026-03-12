from django.shortcuts import redirect
from django.contrib import messages

# ── Secciones por rol ─────────────────────────────────────────────────────────

_URLS_ANATOMIA = frozenset({
    # Cassettes
    'cassettes', 'cassette_create', 'cassette_update', 'cassette_delete',
    'cassette_informe', 'cassette_informe_delete',
    'muestra_create', 'muestra_update', 'muestra_delete',
    'imagen_upload', 'imagen_delete',
    # Citologías
    'citologias', 'citologia_create', 'citologia_update', 'citologia_delete',
    'citologia_informe', 'citologia_informe_delete',
    'muestra_citologia_create', 'muestra_citologia_update', 'muestra_citologia_delete',
    'imagen_citologia_upload', 'imagen_citologia_delete',
    # Necropsias
    'necropsias', 'necropsia_create', 'necropsia_update', 'necropsia_delete',
    'necropsia_informe', 'necropsia_informe_delete',
    'muestra_necropsia_create', 'muestra_necropsia_update', 'muestra_necropsia_delete',
    'imagen_necropsia_upload', 'imagen_necropsia_delete',
    # Volantes
    'descargar_volante_cassette', 'descargar_volante_citologia', 'descargar_volante_necropsia',
})

_URLS_LABORATORIO = frozenset({
    # Hematología
    'hematologias', 'hematologia_create', 'hematologia_update', 'hematologia_delete',
    'hematologia_informe', 'hematologia_informe_delete',
    'muestra_hematologia_create', 'muestra_hematologia_update', 'muestra_hematologia_delete',
    'imagen_hematologia_upload', 'imagen_hematologia_delete',
    # Volantes Laboratorio
    'descargar_volante_hematologia', 'descargar_volante_tubo', 'descargar_volante_microbiologia',
})

# Páginas .html servidas por render_html (core/urls.py)
_PAGES_ANATOMIA = frozenset({'anatomia', 'cassettes', 'citologias', 'necropsias'})
_PAGES_LABORATORIO = frozenset({'laboratorio', 'hematologia', 'microbiologia', 'bioquimica'})

_ROL_ANATOMIA = 'anatomia_patologica'
_ROL_LABORATORIO = 'laboratorio'
_ROL_PROFESOR = 'profesor'


class RolAccesoMiddleware:
    """
    Controla el acceso a secciones según el rol del usuario:
    - Profesor y is_staff: acceso completo.
    - Anatomía Patológica: solo cassettes, citologías y necropsias.
    - Laboratorio: solo hematología, microbiología y bioquímica.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_view(self, request, view_func, view_args, view_kwargs):
        if not request.user.is_authenticated:
            return None  # login_required se encarga

        # Admin y Profesor tienen acceso completo
        if request.user.is_staff or getattr(request.user, 'rol', None) == _ROL_PROFESOR:
            return None

        rol = getattr(request.user, 'rol', None)
        url_name = getattr(request.resolver_match, 'url_name', None)

        denied = False

        if url_name in _URLS_ANATOMIA and rol != _ROL_ANATOMIA:
            denied = True
        elif url_name in _URLS_LABORATORIO and rol != _ROL_LABORATORIO:
            denied = True
        elif 'page' in view_kwargs:
            page = view_kwargs['page']
            if page in _PAGES_ANATOMIA and rol != _ROL_ANATOMIA:
                denied = True
            elif page in _PAGES_LABORATORIO and rol != _ROL_LABORATORIO:
                denied = True

        if denied:
            messages.error(request, 'No tienes acceso a esta sección.')
            return redirect('/index.html')

        return None
