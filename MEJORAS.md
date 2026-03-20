# MEJORAS PENDIENTES — DjangoSanidad

> **Contexto:** Intranet veterinaria, red privada clase A (10.0.0.0/8), usuarios internos autenticados.
> Despliegue en Ubuntu Server para uso interno del centro (prioridad en estabilidad y mantenimiento).

---

## Índice

1. [🔴 Bloqueantes para producción](#1--bloqueantes-para-producción)
2. [🔴 Seguridad alta](#2--seguridad-alta)
3. [🟠 Despliegue (resto)](#3--despliegue-resto)
4. [🟠 Seguridad media](#4--seguridad-media)
5. [🟡 Rendimiento](#5--rendimiento)
6. [🟡 Calidad del código](#6--calidad-del-código)
7. [⚪ Nuevas funcionalidades](#7--nuevas-funcionalidades)
8. [⚪ Operación y mantenimiento](#8--operación-y-mantenimiento)

---

## 1. 🔴 Bloqueantes para producción

Sin estos puntos la aplicación no funciona con `DEBUG=False` en Ubuntu Server.

---

### DEP-1 — Sin `STATIC_ROOT` ni `collectstatic`
### 15. Sin borrado suave (soft delete) HECHO
- **Problema:** Al borrar una muestra se eliminan permanentemente sus imágenes e informes. Sin trazabilidad ni recuperación.
- **Solución:** Campo `is_deleted = BooleanField(default=False)` con manager personalizado.
- **Afecta:** `api/models.py`, `api/views.py`

### 16. Sin logging HECHO
- **Problema:** No hay registro de errores ni operaciones importantes. Imposible depurar en producción.
- **Solución:** Configurar `LOGGING` en `settings.py` para errores a fichero.
- **Afecta:** `core/settings.py`

### 18. CORS configurable a "allow all" HECHO
- **Problema:** `DJANGO_CORS_ALLOW_ALL` puede permitir peticiones desde cualquier origen.
- **Solución:** Eliminar la opción y requerir lista explícita de orígenes.
- **Afecta:** `core/settings.py`

### 26. Archivo `.env` en el historial de git HECHO
- **Problema:** El fichero `.env` está committed en el repositorio. Aunque contenga valores de desarrollo, expone la estructura de secretos y crea el hábito de commitear credenciales. Si en algún momento se usa una secret key real, quedará en el historial.
- **Solución:** Añadir `.env` a `.gitignore` y eliminarlo del historial con `git rm --cached .env`.
- **Afecta:** `.gitignore`, `.env`

### 27. Logging sin rotación de ficheros HECHO
- **Problema:** `core/settings.py` configura `FileHandler` para los logs. El fichero crece indefinidamente sin límite de tamaño ni rotación automática, pudiendo llenar el disco en producción.
- **Solución:** Sustituir `FileHandler` por `RotatingFileHandler` con `maxBytes` y `backupCount`.
- **Afecta:** `core/settings.py`

### 19. Sin manejo de zona horaria HECHO
- **Problema:** `TIME_ZONE = 'UTC'` puede causar problemas de fechas en España.
- **Solución:** Activar `USE_TZ = True` con `TIME_ZONE = 'Europe/Madrid'`.
- **Afecta:** `core/settings.py`

### 20. Sin manejo de errores personalizado HECHO
- **Problema:** Los errores devuelven páginas 500 genéricas sin formato consistente.
- **Solución:** Handler de excepciones personalizado en DRF y páginas 404/500 propias.
- **Afecta:** `api/views.py`, `core/settings.py`

### 25. Cobertura de tests incompleta HECHO
- **Problema:** Faltan tests para acciones personalizadas de ViewSets y casos límite.
- **Solución:** Ampliar `api/tests.py` y `web/tests.py`.
- **Afecta:** `api/tests.py`, `web/tests.py`

---

## Fases de implementación

### Fase 1 - Seguridad (completada)
- [x] Fix `STATICFILES_DIRS` (#3)
- [x] Proteger `SECRET_KEY` (#4)
- [x] Crear `.env.example` (#5)
- [x] Crear `requirements.txt` (#9)
- [x] Eliminar rutas duplicadas (#7)

### Fase 2 - Calidad del código (completada)
- [x] Modelos abstractos base (#6)
- [x] Rediseñar `InformeResultado` (#10)
- [x] Unicidad de QR (#11)
- [x] Mover opciones hardcodeadas a BD (#8)
- [x] Validación en serializers (#12)

### Fase 3 - Estabilidad (completada)
- [x] Paginación (#2)
- [x] Borrado suave (#15)
- [x] Logging (#16)
- [x] Zona horaria (#19)
- [x] Manejo de errores (#20)
- [x] Ampliar tests (#25)

### Fase 4 - Seguridad (pendiente)
> Vulnerabilidades evaluadas para entorno de **intranet en red privada clase A** con usuarios autenticados.

- [x] IDOR entre roles — acceso a datos de otros departamentos (#SEC-2)
- [x] Mass Assignment en serializers (#SEC-4)
- [x] DEBUG=True por defecto (#SEC-6)
- [x] Logout roto — sesión no destruida en servidor (#SEC-11)
- [x] Fuga de información en mensajes de error (#SEC-12)
- [x] Stored XSS via Content-Type controlado por el usuario (#SEC-16)
- [x] Open Redirect en login — phishing interno (#SEC-1)
- [x] Enumeración de usuarios en get_by_mail (#SEC-10)
- [x] Carga de archivos sin validación en endpoints API (#SEC-3)
- [x] SQL con nombre de columna interpolado por f-string (#SEC-5)
- [x] BasicAuthentication habilitada — credenciales en claro en red interna (#SEC-13)
- [x] Archivo `.env` en el historial de git (#26)
- [x] Logging sin rotación de ficheros (#27)

---

## 🔴 Seguridad — Vulnerabilidades detectadas (Informe 13/03/2026)

> **Contexto:** Aplicación desplegada en intranet, red privada clase A, usuarios internos autenticados.
> Las vulnerabilidades que solo aplican a exposición pública en internet han sido descartadas.

### Estado de verificación práctica (13/03/2026)
- **SEC-1 Open Redirect:** ✅ **Mitigada**. `login_view` valida `next` con `url_has_allowed_host_and_scheme()` y rechaza destinos externos redirigiendo a `/index.html`.
- **SEC-2 IDOR entre roles en `proxy_file`:** ✅ **Confirmada (riesgo real)**. Hay `@login_required`, pero no validación de rol/propiedad antes de acceder al objeto por `pk`.
- **SEC-3 Carga de archivos sin validación en API:** ✅ **Mitigada**. Se valida extensión permitida, tamaño máximo (20 MB) y magic bytes en los 9 endpoints `create()` afectados.
- **SEC-4 Mass Assignment (`fields='__all__'`):** ✅ **Confirmada (riesgo real)**. `NecropsiaSerializer` y `MuestraNecropsiaSerializer` exponen `__all__`.
- **SEC-6 DEBUG por defecto:** ✅ **Mitigada**. `DJANGO_DEBUG` ahora tiene default `'false'` en `settings.py`.
- **SEC-11 Logout roto en frontend:** ✅ **Mitigada**. `auth.js` hace `POST` a `/logout/` con CSRF y limpia sesión local redirigiendo a `/login/`.
- **SEC-12 Fuga de errores internos:** ✅ **Confirmada (riesgo real)**. Se encontraron `messages.error(... {e})` mostrando excepción al usuario.
- **SEC-13 BasicAuthentication habilitada:** ✅ **Mitigada**. `REST_FRAMEWORK` usa solo `SessionAuthentication` y se eliminó `BasicAuthentication`.
- **SEC-16 Stored XSS por Content-Type:** ✅ **Mitigada**. El tipo de volante se detecta por magic bytes y se sirve con `X-Content-Type-Options: nosniff`.
- **SEC-10 Enumeración en `get_by_mail`:** ⚠️ **Riesgo latente (no explotable hoy)**. Con usuarios actuales y ruta actual devuelve `404` tanto para email existente como inexistente. Motivo: el patrón de URL `[^/.]+` no acepta emails normales con punto (`.`). Si se corrige la ruta para aceptar email real, la enumeración reaparece.

**Leyenda:**
- ✅ Confirmada (explotable/riesgo real): reproducida o verificada directamente en el estado actual del código.
- ⚠️ Riesgo latente: no se reproduce hoy por una limitación actual, pero reaparece al corregir esa limitación.

---

### SEC-2. IDOR entre roles — acceso a datos de otros departamentos — ALTA
- **Tipo:** Insecure Direct Object Reference (CWE-639)
- **Archivo:** `api/views.py` — `proxy_file`
- **Problema:** Un técnico de `laboratorio` puede acceder a imágenes médicas, informes y volantes de `anatomia_patologica` (y viceversa) iterando PKs en la URL `/api/archivo/<modelo>/<pk>/<campo>/`. El middleware de rol protege las vistas web pero no este endpoint de ficheros.
- **Solución:** Verificar el rol del usuario antes de servir el archivo, según el tipo de modelo solicitado.
```python
# ❌ Vulnerable — cualquier usuario autenticado accede a cualquier archivo
instance = model.objects.get(pk=pk)

# ✅ Seguro — verificar rol según el modelo
ROLES_POR_MODELO = {
    Imagen:            {'profesor', 'anatomia_patologica'},
    ImagenCitologia:   {'profesor', 'anatomia_patologica'},
    ImagenNecropsia:   {'profesor', 'anatomia_patologica'},
    ImagenHematologia: {'profesor', 'laboratorio'},
    ImagenMicrobiologia: {'profesor', 'laboratorio'},
    ImagenTubo:        {'profesor', 'laboratorio'},
}
rol = getattr(request.user, 'rol', None)
if not request.user.is_staff and rol not in ROLES_POR_MODELO.get(model, set()):
    raise Http404()
instance = get_object_or_404(model, pk=pk)
```

---

### SEC-4. Mass Assignment por `fields = '__all__'` — ALTA
- **Tipo:** Mass Assignment (CWE-915)
- **Archivo:** `api/serializers.py` — `NecropsiaSerializer`, `MuestraNecropsiaSerializer`
- **Problema:** Exponer `'__all__'` permite a un usuario enviar `{"is_deleted": false}` para restaurar registros borrados, o `{"tecnico": <id_ajeno>}` para reasignar datos de otros técnicos.
- **Solución:** Declarar `fields` explícitamente y marcar como `read_only_fields` los campos sensibles (`id`, `QR`, `tecnico`, `is_deleted`) para que no puedan sobrescribirse por entrada del cliente.
```python
# ❌ Vulnerable
class NecropsiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Necropsia
        fields = '__all__'

# ✅ Seguro
class NecropsiaSerializer(QrUnicoValidatorMixin, serializers.ModelSerializer):
    class Meta:
        model = Necropsia
        fields = ['id_necropsia', 'necropsia', 'tipo_necropsia', 'fecha',
                  'descripcion', 'caracteristicas', 'observaciones', 'organo',
                  'qr_necropsia', 'tecnico', 'volante_peticion_nombre', 'volante_peticion_tipo']
        read_only_fields = ['id_necropsia', 'qr_necropsia', 'tecnico']

class MuestraNecropsiaSerializer(QrUnicoValidatorMixin, serializers.ModelSerializer):
    class Meta:
        model = MuestraNecropsia
        fields = ['id_muestra', 'descripcion', 'fecha', 'observaciones', 'tincion',
                  'qr_muestra', 'qr_imagen', 'examen_interno_cadaver',
                  'tecnica_apertura', 'datos_relevantes_region', 'necropsia', 'is_deleted']
        read_only_fields = ['id_muestra', 'qr_muestra', 'is_deleted']
```

---

### SEC-6. DEBUG=True por defecto — MEDIA HECHO
- **Archivo:** `core/settings.py`
- **Problema:** No existe `STATIC_ROOT`. Con `DEBUG=False`, Django deja de servir CSS/JS y la interfaz queda completamente rota. `collectstatic` falla.
- **Solución:**
```python
STATIC_ROOT = BASE_DIR / 'staticfiles'
```
```bash
python manage.py collectstatic --noinput
```

---

### DEP-3 — Media files inaccesibles con `DEBUG=False`
- **Archivo:** `core/urls.py`
- **Problema:** El handler `/media/` está dentro de `if settings.DEBUG:`. En producción todas las imágenes médicas devuelven 404.
- **Solución:** Configurar el servidor web frontal del centro para servir `/media/` desde disco y mantener Django solo para vistas/API.

---

### DEP-6 — Django sirve estáticos en producción (todos los requests)
- **Archivo:** `core/urls.py`
- **Problema:** Las rutas `css/`, `js/`, `assets/` están registradas con `django.views.static.serve` **de forma incondicional** (no dentro de `if DEBUG:`). Cada fichero CSS/JS pasa por todo el middleware de Django y degrada el rendimiento.
- **Solución:** Envolver en `if settings.DEBUG:` y dejar que el servidor web frontal del centro sirva los estáticos.
```python
if settings.DEBUG:
    urlpatterns += [
        re_path(r'^css/(?P<path>.*)$', serve_static, {'document_root': ...}),
        re_path(r'^js/(?P<path>.*)$', serve_static, {'document_root': ...}),
        re_path(r'^assets/(?P<path>.*)$', serve_static, {'document_root': ...}),
    ]
```

---

### HTTPS-3 — URLs `http://localhost:3000` hardcodeadas en JS
- **Archivos:** `js/cassettes.js:1056`, `js/citologias.js:1065`, `js/necropsias.js:1056`, `js/muestra.js:13`
- **Problema:** Cuatro ficheros JS tienen URLs absolutas apuntando a un backend Node.js inexistente. Con HTTPS el navegador las bloquea como *mixed content*. En HTTP simplemente fallan.
- **Solución:** Sustituir por rutas relativas.
```javascript
// ❌ Roto
fetch("http://localhost:3000/api/tecnicos/" + userId, { ... })

// ✅
fetch("/api/tecnicos/" + userId + "/", { ... })
```
También `js/usuarios.js`, `js/bioquimica.js`, `js/microbiologia.js` llaman a `"modelo/tecnicos/tecnicos.php"` — sustituir por el endpoint Django `/api/tecnicos/`.

---

## 2. 🔴 Seguridad alta

Vulnerabilidades con impacto real en usuarios internos autenticados.

---

### SEC-14 — Login API no crea sesión Django
- **Archivo:** `api/views.py` — `TecnicoViewSet.login` (línea 373)
- **Problema:** El endpoint llama a `authenticate()` pero **nunca llama a `login(request, user)`**. No se crea la cookie `sessionid`. El frontend guarda `isLoggedIn=true` en `sessionStorage`, pero todas las vistas protegidas con `@login_required` redirigen al login de nuevo porque no hay sesión real. El login funcional es únicamente el formulario web (`web/views.py`).
- **Solución A:** Añadir `login(request, user)`:
```python
from django.contrib.auth import authenticate, login as auth_login

@action(detail=False, methods=['post'], permission_classes=[AllowAny])
def login(self, request):
    tecnico_id = request.data.get('tecnico_id')
    password = request.data.get('password')
    user = authenticate(id_tecnico=tecnico_id, password=password)
    if user:
        auth_login(request, user)
        return Response(TecnicoSerializer(user).data)
    return Response({'error': 'Credenciales incorrectas'}, status=status.HTTP_401_UNAUTHORIZED)
```
- **Solución B:** Eliminar el endpoint y redirigir `loginregistro.js` al formulario web `/login/`.

---

### SEC-20 — Path traversal en `_read_file_bytes`
- **Archivo:** `api/views.py` — función `_read_file_bytes` (línea 114)
- **Problema:** Para compatibilidad legacy, la función abre rutas de fichero arbitrarias con `open(path, 'rb')`. Si un registro en BD contiene `../../etc/passwd`, el servidor lo lee y devuelve al cliente.
- **Solución:** Validar que la ruta resuelta esté dentro de `MEDIA_ROOT` antes de abrir.
```python
import pathlib

def _safe_open_path(text):
    """Solo permite rutas dentro de MEDIA_ROOT. Devuelve None si hay path traversal."""
    if os.path.isabs(text):
        candidate = pathlib.Path(text).resolve()
    else:
        candidate = (settings.MEDIA_ROOT / text).resolve()
    media_root = pathlib.Path(settings.MEDIA_ROOT).resolve()
    if not str(candidate).startswith(str(media_root) + os.sep):
        return None
    return candidate
```
Sustituir el bloque `for path in candidate_paths: if os.path.exists(path): open(path)` por una llamada a `_safe_open_path`.

---

### SEC-15 — Formulario de registro roto y sin efecto
- **Archivos:** `js/loginregistro.js`, `registro.html`
- **Problema:** El formulario de registro JS envía `POST /api/tecnicos/` con email falso (`nombre.timestamp@example.com`) sin CSRF. El serializer ignora la contraseña silenciosamente — el usuario se crearía sin contraseña y nunca podría autenticarse. En la práctica el endpoint rechaza la petición por falta de CSRF. El alta de usuarios real es solo vía `web/views.py:usuario_create` (solo `is_staff`).
- **Solución:** Ocultar o eliminar el formulario de registro de `registro.html`. La gestión de usuarios corresponde al administrador.

---

### HTTPS-1 — Ajustes Django para TLS ausentes
- **Archivo:** `core/settings.py`
- **Problema:** Sin estas directivas, aunque el servidor frontal use HTTPS las cookies de sesión pueden viajar por HTTP plano y no hay redirección HTTP→HTTPS.
- **Solución:**
```python
_HTTPS_ENABLED = os.getenv('DJANGO_HTTPS', 'false').strip().lower() == 'true'
if _HTTPS_ENABLED:
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_SSL_REDIRECT = True
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_HSTS_SECONDS = 31_536_000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
```
Añadir a `.env.example`: `DJANGO_HTTPS=true`

---

## 3. 🟠 Despliegue (resto)

---

### DEP-4 — Parche de versión PyMySQL manual
- **Archivo:** `core/settings.py` líneas 13-16
- **Problema:** Se fuerza `pymysql.version_info = (2, 2, 4, ...)` manualmente. Enmascara incompatibilidades reales con el servidor MySQL de producción.
- **Solución:** Eliminar las dos líneas de parche y verificar compatibilidad real entre `requirements.txt` y el MySQL instalado en el servidor.

---

### DEP-5 — Base de datos no configurable por entorno
- **Archivo:** `core/settings.py`
- **Problema:** SQLite está hardcodeado. No hay forma de apuntar a MySQL sin editar el código fuente.
- **Solución:**
```python
_db_engine = os.getenv('DJANGO_DB_ENGINE', 'sqlite3')
if _db_engine == 'mysql':
    DATABASES = {'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME':     os.getenv('DJANGO_DB_NAME', 'djangosanidad'),
        'USER':     os.getenv('DJANGO_DB_USER', 'django'),
        'PASSWORD': os.getenv('DJANGO_DB_PASSWORD', ''),
        'HOST':     os.getenv('DJANGO_DB_HOST', '127.0.0.1'),
        'PORT':     os.getenv('DJANGO_DB_PORT', '3306'),
        'OPTIONS':  {'charset': 'utf8mb4'},
    }}
else:
    DATABASES = {'default': {'ENGINE': 'django.db.backends.sqlite3', 'NAME': BASE_DIR / 'db.sqlite3'}}
```
Añadir a `.env.example`:
```
DJANGO_DB_ENGINE=mysql
DJANGO_DB_NAME=djangosanidad
DJANGO_DB_USER=django
DJANGO_DB_PASSWORD=
DJANGO_DB_HOST=127.0.0.1
DJANGO_DB_PORT=3306
```

---

### DEP-7 — SQL específico de SQLite en `usuario_bulk_delete`
- **Archivo:** `web/views.py` línea 1496
- **Problema:** `UPDATE sqlite_sequence SET seq = 2 WHERE name = 'tecnicos'` falla en MySQL con error 500.
- **Solución:**
```python
db_engine = django_settings.DATABASES['default']['ENGINE']
if 'sqlite3' in db_engine:
    cursor.execute("UPDATE sqlite_sequence SET seq = 2 WHERE name = 'tecnicos'")
elif 'mysql' in db_engine:
    cursor.execute("ALTER TABLE tecnicos AUTO_INCREMENT = 3")
```

---

### DEP-8 — Reset de contraseña llama a PHP inexistente
- **Archivo:** `js/loginregistro.js` línea 117
- **Problema:** `fetch("modelo/tecnicos/tecnicos.php", ...)` — este fichero no existe en Django. El reset de contraseña está completamente roto.
- **Solución:** Implementar endpoint Django para reset, o eliminar el botón "Olvidé mi contraseña" (en intranet controlada el admin resetea manualmente via Django Admin).

---

### DEP-9 — Script de despliegue automatizado
- **Nuevo archivo:** `scripts/deploy.sh`
```bash
#!/bin/bash
set -e
git pull
pip install -r requirements.txt
python manage.py migrate --run-syncdb
python manage.py collectstatic --noinput
systemctl restart djangosanidad
echo "Despliegue completado: $(date)"
```

---

### DEP-10 — Backup automatizado de base de datos
- **Nuevo archivo:** `scripts/backup_db.sh`
```bash
#!/bin/bash
FECHA=$(date +%Y%m%d_%H%M)
DESTINO=/backups/djangosanidad
mysqldump -u django -p"$DJANGO_DB_PASSWORD" djangosanidad | gzip > "$DESTINO/db_$FECHA.sql.gz"
tar -czf "$DESTINO/media_$FECHA.tar.gz" /ruta/proyecto/media/
find "$DESTINO" -name "*.gz" -mtime +30 -delete
```
Cron diario a las 2:00:
```
0 2 * * * /usr/local/bin/backup_db.sh >> /var/log/backup_sanidad.log 2>&1
```

---

## 4. 🟠 Seguridad media

---

### SEC-17 — XSS vía `innerHTML` en tabla de usuarios
- **Archivo:** `js/usuarios.js` línea 66
- **Problema:** La tabla se construye con `tr.innerHTML` interpolando `user.id_tecnico` y `user.centro` sin sanitizar. Si un campo contiene `<img src=x onerror=alert(1)>`, se ejecuta JavaScript en el navegador de quien vea la lista.
- **Solución:** Usar `textContent` y APIs DOM.
```javascript
const tr = document.createElement('tr');
const tdId = tr.insertCell();
tdId.textContent = user.id_tecnico;
const tdCentro = tr.insertCell();
tdCentro.textContent = user.centro;
// Botones con addEventListener en lugar de onclick inline
```

---

### SEC-18 — Fuga de errores internos en API de informes
- **Archivo:** `api/views.py` líneas 1191 y 1263
- **Problema:**
```python
return Response({'error': f'Error guardando informe: {exc}'}, status=400)
return Response({'error': f'Error actualizando informe: {exc}'}, status=400)
```
Exponen mensajes internos de MySQL/Python (nombres de tablas, rutas, etc.) al cliente.
- **Solución:**
```python
logger.exception('Error guardando informe user=%s', request.user.pk)
return Response({'error': 'Error interno al procesar el informe.'}, status=400)
```

---

### SEC-19 — `proxy_file` sin cabeceras de seguridad
- **Archivo:** `api/views.py` — función `proxy_file`
- **Problema:** Las respuestas de imágenes médicas no incluyen cabeceras de seguridad. Las imágenes médicas no deben cachearse en disco del navegador.
- **Solución:** Añadir antes del `return response`:
```python
response['X-Content-Type-Options'] = 'nosniff'
response['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
response['X-Frame-Options'] = 'DENY'
```

---

### SEC-21 — `Content-Disposition` sin sanitizar
- **Archivos:** `web/views.py` línea 1512, `api/views.py` — `proxy_file`
- **Problema:** El nombre de fichero se inserta directamente en la cabecera HTTP sin escapar. Si contiene comillas dobles rompe la estructura de la cabecera.
- **Solución:**
```python
import re
safe_name = re.sub(r'[^\w\s.\-]', '_', nombre_original or 'volante.pdf')
response['Content-Disposition'] = f'inline; filename="{safe_name}"'
```

---

### SES-1 — Flags de seguridad en cookies ausentes
- **Archivo:** `core/settings.py`
- **Problema:** Las cookies `sessionid` y `csrftoken` no tienen `HttpOnly` ni `SameSite`. Sin `HttpOnly`, un XSS puede leer la cookie de sesión.
- **Solución:**
```python
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_HTTPONLY = False   # JS necesita leerla para fetch
CSRF_COOKIE_SAMESITE = 'Lax'
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
```

---

### SES-2 — Sin throttling en la API
- **Archivo:** `core/settings.py`
- **Problema:** Sin límite de peticiones. Un bucle accidental en el frontend puede saturar el servidor.
- **Solución:**
```python
REST_FRAMEWORK = {
    # ... configuración existente ...
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'user': '500/hour',
    },
}
```

---

### HTTPS-4 — Librerías CDN sin versión fija
- **Archivos:** `hematologia.html`, `microbiologia.html`, `bioquimica.html`, `web/templates/web/*.html`
- **Problema:** `html5-qrcode` se carga como `https://unpkg.com/html5-qrcode` sin versión. Si el CDN actualiza la librería puede romper el escáner QR sin aviso. Además requiere acceso a internet desde los equipos del aula.
- **Solución recomendada para intranet:** Descargar a `assets/vendor/` y servir localmente.
```html
<!-- ❌ CDN sin versión -->
<script src="https://unpkg.com/html5-qrcode"></script>

<!-- ✅ Local con versión fija -->
<script src="/assets/vendor/html5-qrcode-2.3.8.min.js"></script>
```

---

### HTTPS-5 — Sin cabecera Content-Security-Policy
- **Archivo:** `core/settings.py` o nuevo `core/middleware.py`
- **Problema:** Sin CSP, un XSS exitoso puede cargar scripts externos. Si se migran los CDN a local (HTTPS-4), la CSP se simplifica enormemente.
- **Solución:**
```python
class ContentSecurityPolicyMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    def __call__(self, request):
        response = self.get_response(request)
        response['Content-Security-Policy'] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: blob:; "
            "frame-ancestors 'none'; "
            "base-uri 'self';"
        )
        return response
```
Registrar en `MIDDLEWARE` de `settings.py`.

---

### SEC-22 — `random.choices` en generación de QR (formularios web)
- **Archivo:** `web/forms.py` línea 115
- **Problema:** `random.choices()` usa Mersenne Twister (predecible). La versión API usa `uuid.uuid4()` que es criptográficamente segura. Inconsistencia.
- **Solución:**
```python
import secrets, string
return prefix + ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(12))
```

---

## 5. 🟡 Rendimiento

---

### PERF-3 — BinaryField cargado en listados
- **Archivos:** `web/views.py`, `api/views.py`
- **Problema:** Los listados hacen `SELECT *`, cargando los campos `BinaryField` (volantes, imágenes) a memoria aunque solo se muestren nombres y fechas. Con 200 registros de 5-15 MB → posibles GB de RAM por petición.
- **Solución:** `.defer()` en querysets de listado.
```python
# web/views.py — cassette_list
qs = Cassette.objects.defer('volante_peticion').order_by('-fecha')

# api/views.py — RegistroViewSet
def get_queryset(self):
    if self.action in ('list', 'todos', 'index'):
        return self.queryset.model.objects.defer('volante_peticion').order_by('-fecha')
    return self.queryset
```

---

### PERF-5 — Acción `todos` salta la paginación
- **Archivo:** `api/views.py` líneas 338-340
- **Problema:**
```python
def todos(self, request):
    qs = self.get_queryset()
    return Response(self.get_serializer(qs, many=True).data)  # Sin límite
```
Devuelve todos los registros sin paginación, ignorando `PAGE_SIZE = 50`.
- **Solución:**
```python
def todos(self, request):
    qs = self.get_queryset()
    page = self.paginate_queryset(qs)
    if page is not None:
        return self.get_paginated_response(self.get_serializer(page, many=True).data)
    return Response(self.get_serializer(qs, many=True).data)
```

---

### PERF-2 — Sin `select_related` en `cassette_list`
- **Archivo:** `web/views.py` línea 264
- **Problema:** `cassette_list` accede a `cassette.tecnico` en el template sin JOIN. El resto de vistas (`citologia_list`, `necropsia_list`, `hematologia_list`) ya tienen `select_related('tecnico')`.
- **Solución:**
```python
qs = Cassette.objects.select_related('tecnico').order_by('-fecha')
```

---

### PERF-4 — Sin índices en `qr_muestra` y `fecha`
- **Archivo:** `api/models.py`
- **Problema:** `qr_muestra` en `MuestraBase` se consulta frecuentemente para búsquedas y validación de unicidad pero no tiene `unique=True` ni índice. `fecha` se usa para ordenación sin índice.
- **Solución:**
```python
class MuestraBase(models.Model):
    qr_muestra = models.CharField(max_length=255, unique=True)
    # ...
    class Meta:
        abstract = True
        indexes = [models.Index(fields=['-fecha'], name='idx_%(class)s_fecha')]
```
Requiere nueva migración.

---

### PERF-1 — N+1 queries en serializers con imágenes relacionadas
- **Archivos:** `api/serializers.py`, `api/views.py`
- **Problema:** Los ViewSets no tienen `prefetch_related` para las imágenes. En listados, si el template o serializer accede a `obj.imagenXxx_set`, se genera una consulta extra por registro.
- **Solución:** Añadir `prefetch_related` en `get_queryset` de los ViewSets que listen sub-muestras con imágenes.

---

## 6. 🟡 Calidad del código

---

### COD-2 — URLs PHP legacy en JavaScript
- **Archivos:** `js/auth.js`, `js/usuarios.js`, `js/bioquimica.js`, `js/microbiologia.js`, `js/loginregistro.js`
- **Problema:**
  - `js/auth.js` detecta la página de login con `window.location.pathname.endsWith('registro.html')` (ruta PHP inexistente en Django)
  - `js/usuarios.js`, `js/bioquimica.js`, `js/microbiologia.js` llaman a `"modelo/tecnicos/tecnicos.php"` — fichero PHP que no existe
  - Variable `const token = sessionStorage.getItem("token")` aparece en varios módulos: siempre devuelve `null` (el sistema usa cookies `sessionid`)
- **Solución:** Sustituir las llamadas PHP por los endpoints Django correspondientes; eliminar la variable `token`; corregir la detección de página de login en `auth.js`.

---

### COD-1 — `LANGUAGE_CODE` en inglés
- **Archivo:** `core/settings.py` línea 146: `LANGUAGE_CODE = 'en-us'`
- **Problema:** Los mensajes de validación de formularios Django (campo requerido, longitud máxima, etc.) se muestran en inglés.
- **Solución:** `LANGUAGE_CODE = 'es'`

---

### COD-3 — Sin CI local
- **Problema:** No hay forma estándar de ejecutar los tests antes de un despliegue.
- **Solución:** `Makefile` mínimo en la raíz:
```makefile
.PHONY: test lint check

test:
python manage.py test api web --verbosity=2

lint:
python -m py_compile api/views.py api/models.py api/serializers.py web/views.py

check:
python manage.py check --deploy
```
`manage.py check --deploy` audita automáticamente la configuración Django para producción.

---

### COD-4 — Acciones de filtrado duplicadas en 6 ViewSets
- **Archivo:** `api/views.py`
- **Problema:** Cada ViewSet (Cassette, Citología, Necropsia, Tubo, Hematología, Microbiología) redefine `por_qr`, `por_organo`, `por_numero`, `por_fecha` con código prácticamente idéntico (~120 líneas repetidas).
- **Solución:** Factorizar en `RegistroViewSet` usando el atributo `qr_field` ya existente y un nuevo atributo `numero_field`.

---

## 7. ⚪ Nuevas funcionalidades

---

### FUNC-1 — Endpoint de estadísticas `/api/estadisticas/`
- **Archivos:** `api/views.py`, `api/urls.py`
- Solo accesible para rol `profesor`. Devuelve:
  - Conteo de muestras por tipo en mes/trimestre/año
  - Top 10 órganos más frecuentes en cassettes
  - Distribución por técnico
- **Herramientas:** `annotate()`, `Count()`, `TruncMonth`, `values()`
- **Frontend:** Chart.js en `index.html` (nuevo `js/dashboard.js`)

---

### FUNC-2 — Búsqueda global `/api/buscar/?q=texto`
- **Archivos:** `api/views.py`, `api/urls.py`
- Busca en los 6 tipos de muestra sobre `descripcion`, `diagnostico_final`, `informacion_clinica` usando `Q objects`. Resultados agrupados por tipo (máx. 5 por grupo). Conectar con el campo del header (actualmente inactivo).

---

### FUNC-3 — Sistema de auditoría con Django Signals
- **Nuevos archivos:** `api/signals.py`, nuevo modelo `AuditLog`
- `AuditLog(usuario, accion, modelo, objeto_id, cambios_json, ip_origen, timestamp)`
- Registrar con `post_save` / `post_delete` toda creación, modificación y borrado.
- Endpoint `GET /api/auditoria/` solo para `profesor`.

---

### FUNC-4 — Exportación a Excel
- **Nueva dependencia:** `openpyxl`
- Acción `GET /api/cassettes/exportar/?inicio=&fin=` que genere `.xlsx`.
- Verificar que rol `laboratorio` no puede exportar datos de anatomía.

---

### FUNC-5 — Restauración de soft-deleted desde la API
- Acción `POST /api/cassettes/<id>/restaurar/` que llame a `instance.restore()`. Solo rol `profesor`.
- Vista de "papelera" con los últimos 30 borrados lógicos.

---

### FUNC-6 — Documentación automática con `drf-spectacular`
- **Nueva dependencia:** `drf-spectacular`
- Configurar `/api/schema/swagger-ui/`, decorar ViewSets con `@extend_schema`.

---

### FUNC-7 — QR Scanner universal
- Extraer la lógica del scanner (`html5-qrcode`) de `js/hematologia.js` a `js/qr-scanner.js` como clase reutilizable.
- El endpoint `/qr/resolver/?code=X` ya existe — detecta el tipo por prefijo del QR y redirige automáticamente.

---

### FUNC-8 — Dashboard de estadísticas en `index.html`
- Consumir FUNC-1 y renderizar con Chart.js: línea temporal por mes, donut por tipo, barras de top órganos.
- Respetar el modo oscuro ya implementado.

---

## 8. ⚪ Operación y mantenimiento

---

### OPS-1 — Health check endpoint
- **Archivo:** `core/urls.py`
- Sin `/health/` no hay forma de monitorizar la aplicación sin autenticarse.
```python
from django.http import JsonResponse
def health_check(request):
    return JsonResponse({'status': 'ok'})
urlpatterns = [path('health/', health_check, name='health'), ...]
```

---

### OPS-2 — Squash de migraciones antes del primer despliegue
- **Directorio:** `api/migrations/`
- 27 ficheros con ramas paralelas (`0006_*` × 2, `0007_*` × 2). Ralentiza el primer despliegue en producción.
- **Ejecutar antes de desplegar por primera vez:**
```bash
python manage.py squashmigrations api 0001 0027
```

---

### OPS-4 — Validación de integridad de imágenes en base de datos
- **Nuevo archivo:** `api/management/commands/verificar_imagenes.py`
- **Problema:** Las imágenes y PDFs se almacenan como `BinaryField` en la BD. No hay ningún mecanismo que detecte registros con datos corruptos (cabeceras de fichero inválidas, campos vacíos inesperados, truncados por error de escritura).
- **Solución:** Comando de gestión que recorra todos los modelos con `BinaryField` (`Imagen*`, `volante_peticion`, `informe_imagen`) y verifique los magic bytes de cada fichero:
```python
MAGIC_BYTES = {
    'jpeg': b'\xff\xd8\xff',
    'png':  b'\x89PNG',
    'pdf':  b'%PDF',
}

def check_bytes(data, nombre_campo, obj_id, model_name):
    if not data:
        return  # campo vacío — puede ser válido (nullable)
    raw = bytes(data[:8])
    if not any(raw.startswith(m) for m in MAGIC_BYTES.values()):
        print(f"[CORRUPTO] {model_name} id={obj_id} campo={nombre_campo} cabecera={raw.hex()}")
```
- **Uso:**
```bash
python manage.py verificar_imagenes            # muestra registros corruptos
python manage.py verificar_imagenes --modelo Cassette  # filtra por modelo
python manage.py verificar_imagenes --csv reporte.csv  # exporta resultados
```
- **Cuándo ejecutar:** Tras migraciones masivas, importaciones de datos legacy o restauraciones de backup.

---

### OPS-3 — Cobertura de tests al 80%
- **Herramienta:** `coverage.py`
- Tests a añadir: permisos por rol, soft delete end-to-end, validación de imágenes (magic bytes, tamaño), IDOR en `proxy_file`.
```bash
pip install coverage
coverage run manage.py test api web
coverage report
coverage html
```

---

Plan: Migrar imágenes de BinaryField a FileField (disco + URLs)
Situación actual
19 columnas BinaryField repartidas en 13 tablas almacenan bytes crudos (JPEG, PNG, PDF) directamente en la base de datos:

Clase abstracta / Modelo	Campo	Tablas afectadas
DetalleBase	volante_peticion	cassettes, citologias, necropsias, tubos, hematologias, microbiologias
RegistroConInforme	informe_imagen	cassettes, citologias, necropsias, tubos, hematologias, microbiologias
ImagenBase	imagen	imagenes, imagenescitologia, imagenesnecropsia, imagenestubo, imageneshematologia, imagenesmicrobiologia
Citologia	qr_imagen	citologias
InformeResultado	imagen	informesresultado
Fases de implementación
Fase 0 — Preparación (sin tocar código de producción)
#	Tarea	Detalle
0.1	Backup de la BD	cp db.sqlite3 db.sqlite3.bak — punto de restauración antes de cualquier cambio
0.2	Crear estructura de directorios en media	Subdirectorios por tipo: media/volantes/, informes, media/imagenes/cassettes/, media/imagenes/citologias/, media/imagenes/necropsias/, media/imagenes/tubos/, media/imagenes/hematologia/, media/imagenes/microbiologia/, media/qr/, media/informes_resultado/
0.3	Verificar MEDIA_ROOT y MEDIA_URL	Ya existen en settings.py. Confirmar que MEDIA_ROOT = BASE_DIR / 'media' y MEDIA_URL = '/media/'
Fase 1 — Modelos: BinaryField → FileField
#	Archivo	Cambio
1.1	models.py — DetalleBase	volante_peticion: BinaryField → FileField(upload_to='volantes/', ...). Mantener volante_peticion_nombre y volante_peticion_tipo como están
1.2	models.py — RegistroConInforme	informe_imagen: BinaryField → ImageField(upload_to=ruta_dinámica_informe, ...) con función que genere ruta por tipo (cassette/citologia/etc.)
1.3	models.py — ImagenBase	imagen: BinaryField → ImageField(upload_to=ruta_dinámica_imagen, ...). Cada subclase usará un subdirectorio distinto
1.4	models.py — Citologia	qr_imagen: BinaryField → ImageField(upload_to='qr/', ...)
1.5	models.py — InformeResultado	imagen: BinaryField → ImageField(upload_to='informes_resultado/', ...)
Funciones upload_to dinámicas (para organizar por tipo):

Fase 2 — Migración de datos (lo más crítico)
#	Tarea	Detalle
2.1	Crear migración de esquema	python manage.py makemigrations — genera la migración que cambia los tipos de columna
2.2	Crear data migration	python manage.py makemigrations api --empty -n migrate_binary_to_files — script que recorre cada tabla, lee los bytes, los escribe a disco y guarda la ruta relativa en el nuevo campo
2.3	Ordenar migraciones	La data migration debe ejecutarse entre el add del nuevo campo y el remove del viejo (patrón de 3 pasos)
Patrón de migración en 3 pasos (seguro y reversible):

Lógica del data migration (Paso 2):

Fase 3 — Backend: Actualizar views y serializers
#	Archivo	Cambio
3.1	views.py — proxy_file	Simplificar drásticamente: ya no necesita _read_file_bytes() ni detección de MIME. Con FileField, Django da .url y .path directamente. Servir con FileResponse o redirigir a la URL del fichero
3.2	views.py — _read_file_bytes	Eliminar o reducir a fallback mínimo para datos legacy
3.3	views.py — _detect_content_type	Se puede simplificar usando mimetypes.guess_type() sobre el nombre de fichero
3.4	views.py — ViewSets create()	Cambiar imagen=imagen_file.read() → imagen=imagen_file (Django FileField gestiona el guardado)
3.5	serializers.py — FileUrlSerializerMixin	Simplificar _file_url() para devolver instance.imagen.url si el campo tiene fichero, en vez de generar URL de proxy
3.6	views.py — uploads	Cambiar archivo.read() → asignar directamente el UploadedFile al campo. Eliminar _leer_imagen_bytes() y _imagen_bytes_a_base64()
3.7	views.py — templates/display	Usar .url del FileField en vez de convertir a base64
3.8	views.py — _validar_imagen_api	Mantener validación de magic bytes y tamaño — sigue siendo necesaria antes de guardar a disco
Fase 4 — Frontend: Ajustes JavaScript (mínimos)
El frontend ya usa URLs de proxy (/api/files/modelo/pk/campo/). Los cambios son mínimos:

#	Archivo	Cambio
4.1	Todos los JS	Si proxy_file se mantiene (recomendado para control de acceso), no hay cambios en frontend. Las URLs siguen funcionando igual
4.2	JS con fallback base64	Eliminar los fallbacks data:image/jpeg;base64,... de cassettes.js, citologias.js, necropsias.js — ya no habrá datos base64 en las respuestas
Fase 5 — Limpieza y seguridad
#	Tarea	Detalle
5.1	Proteger MEDIA_ROOT	Asegurar que media no es servido directamente por Django en producción. Mantener proxy_file como punto de acceso con control IDOR (SEC-2)
5.2	Path traversal	Ya no aplica _read_file_bytes con rutas arbitrarias. FileField de Django escribe siempre dentro de MEDIA_ROOT
5.3	Permisos de directorio	media con permisos 750 en Ubuntu Server — solo lectura para el proceso Django
5.4	Borrado de ficheros huérfanos	Al hacer soft-delete, los ficheros quedan en disco. Crear management command limpiar_huerfanos que borre ficheros de registros hard-deleted
5.5	Actualizar MEJORAS.md	Marcar PERF-3 (BinaryField en listados) como resuelto — con FileField los listados ya no cargan binarios a memoria
Fase 6 — Tests y verificación
#	Tarea	Detalle
6.1	Actualizar tests existentes en tests.py y tests.py	Los tests que crean imágenes con b'bytes' deben usar SimpleUploadedFile
6.2	Test de migración	Verificar que la data migration es reversible y no pierde datos
6.3	Test de subida/descarga	Upload vía API → verificar fichero en disco → download vía proxy_file → verificar contenido idéntico
6.4	Test de rendimiento	Comparar tamaño de BD antes/después. Verificar que listados ya no hacen SELECT de blobs
Impacto esperado
Métrica	Antes (BinaryField)	Después (FileField)
Tamaño BD	Crece ~5-15 MB por imagen	Solo rutas de texto (~100 bytes por registro)
RAM por listado	Carga blobs a memoria (potenciales GB)	Solo strings — resuelve PERF-3
Backup BD	Incluye todos los binarios	Solo metadata — backup separado de media
Velocidad de queries	Lento con SELECT *	Rápido — sin .defer() necesario
Escalabilidad	Límite ~10 GB en SQLite	Sin límite práctico en disco