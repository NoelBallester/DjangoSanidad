"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView, RedirectView
from django.views.decorators.cache import cache_control, never_cache
from django.views.static import serve as static_serve
import os

handler404 = 'core.error_views.custom_404'
handler500 = 'core.error_views.custom_500'

@never_cache
@login_required
def render_html(request, page):
    return TemplateView.as_view(template_name=f"{page}.html")(request)

@cache_control(no_cache=True, no_store=True, must_revalidate=True, max_age=0)
def serve_static(request, path, document_root):
    return static_serve(request, path, document_root=document_root)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('', include('web.urls')),          # Django template views (cassettes, login…)
    path('', RedirectView.as_view(url='/index.html')),
    re_path(r'^(?P<page>[\w\-]+)\.html$', render_html),
    re_path(r'^css/(?P<path>.*)$', serve_static, {'document_root': os.path.join(settings.BASE_DIR, 'css')}),
    re_path(r'^js/(?P<path>.*)$', serve_static, {'document_root': os.path.join(settings.BASE_DIR, 'js')}),
    re_path(r'^assets/(?P<path>.*)$', serve_static, {'document_root': os.path.join(settings.BASE_DIR, 'assets')}),
    # Alias /static/css|js|assets → mismas carpetas (necesario en producción DEBUG=False)
    re_path(r'^static/css/(?P<path>.*)$', serve_static, {'document_root': os.path.join(settings.BASE_DIR, 'css')}),
    re_path(r'^static/js/(?P<path>.*)$', serve_static, {'document_root': os.path.join(settings.BASE_DIR, 'js')}),
    re_path(r'^static/assets/(?P<path>.*)$', serve_static, {'document_root': os.path.join(settings.BASE_DIR, 'assets')}),
]

# Servir media siempre (app standalone/portable local)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
