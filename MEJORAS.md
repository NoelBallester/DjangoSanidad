# Mejoras pendientes - DjangoSanidad

## 🔴 Críticas (Seguridad & Estabilidad)



### 2. Paginación en endpoints de lista HECHO
- **Problema:** Endpoints como `/todos/` devuelven todos los registros sin límite. Con volúmenes grandes causará problemas de rendimiento.
- **Solución:** Añadir `PageNumberPagination` en DRF para todos los ViewSets.
- **Afecta:** `api/views.py`, `core/settings.py`

### 3. Configuración de archivos estáticos insegura HECHO
- **Problema:** `STATICFILES_DIRS = [BASE_DIR]` expone todo el proyecto incluyendo `.git`, `db.sqlite3` y cualquier archivo `.env`.
- **Solución:** Crear un directorio `static/` dedicado y apuntar solo a él.
- **Afecta:** `core/settings.py`

### 4. Secret key sin protección obligatoria HECHO
- **Problema:** Si no se define `DJANGO_SECRET_KEY`, usa el valor por defecto `'dev-insecure-change-me'`.
- **Solución:** Hacer obligatoria la variable de entorno.
- **Afecta:** `core/settings.py`

### 5. Sin archivo `.env` de ejemplo HECHO
- **Problema:** No hay `.env.example` ni documentación de las variables de entorno necesarias.
- **Solución:** Crear `.env.example` con todas las variables requeridas.

---

## 🟠 Importantes (Calidad del código)

### 6. Duplicación masiva de modelos HECHO
- **Problema:** 5 modelos de muestra casi idénticos, más de 80 campos duplicados.
- **Solución:** Modelos base abstractos (`MuestraBase`, `DetalleBase`, `ImagenBase`).
- **Afecta:** `api/models.py`

### 7. Rutas API triplicadas HECHO
- **Problema:** `/api/`, `/sanitaria/` y `/modelo/` apuntaban a los mismos endpoints.
- **Solución:** Usar únicamente `/api/`.
- **Afecta:** `core/urls.py`

### 8. Tipos de órganos y tinciones hardcodeados HECHO
- **Problema:** Más de 80 líneas de listas estáticas en `web/forms.py`.
- **Solución:** Mover a modelos de base de datos administrables desde Django Admin.
- **Afecta:** `web/forms.py`, `api/models.py`

### 9. Sin archivo `requirements.txt` HECHO
- **Problema:** No existe archivo de dependencias.
- **Solución:** `pip freeze > requirements.txt`.

### 10. Diseño de `InformeResultado` con múltiples FK opcionales HECHO
- **Problema:** ForeignKey a 5 tipos de muestra con `null=True`, rompiendo integridad referencial.
- **Solución:** `GenericForeignKey`.
- **Afecta:** `api/models.py`

### 11. Generación de QR sin validación de unicidad HECHO
- **Problema:** Los QR se generan sin verificar colisiones en base de datos.
- **Solución:** Bucle de verificación contra BD.
- **Afecta:** `api/views.py`

### 12. Opciones de formularios sin validación en serializers HECHO
- **Problema:** Los serializers no validan unicidad de QR ni reglas de negocio.
- **Solución:** Métodos `validate_*()` en los serializers.
- **Afecta:** `api/serializers.py`

---

## 🟡 Pendientes

### 15. Sin borrado suave (soft delete) HECHO
- **Problema:** Al borrar una muestra se eliminan permanentemente sus imágenes e informes. Sin trazabilidad ni recuperación.
- **Solución:** Campo `is_deleted = BooleanField(default=False)` con manager personalizado.
- **Afecta:** `api/models.py`, `api/views.py`

### 16. Sin logging HECHO
- **Problema:** No hay registro de errores ni operaciones importantes. Imposible depurar en producción.
- **Solución:** Configurar `LOGGING` en `settings.py` para errores a fichero.
- **Afecta:** `core/settings.py`

### 18. CORS configurable a "allow all"
- **Problema:** `DJANGO_CORS_ALLOW_ALL` puede permitir peticiones desde cualquier origen.
- **Solución:** Eliminar la opción y requerir lista explícita de orígenes.
- **Afecta:** `core/settings.py`

### 26. Archivo `.env` en el historial de git
- **Problema:** El fichero `.env` está committed en el repositorio. Aunque contenga valores de desarrollo, expone la estructura de secretos y crea el hábito de commitear credenciales. Si en algún momento se usa una secret key real, quedará en el historial.
- **Solución:** Añadir `.env` a `.gitignore` y eliminarlo del historial con `git rm --cached .env`.
- **Afecta:** `.gitignore`, `.env`

### 27. Logging sin rotación de ficheros
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

- [ ] IDOR entre roles — acceso a datos de otros departamentos (#SEC-2)
- [ ] Mass Assignment en serializers (#SEC-4)
- [ ] DEBUG=True por defecto (#SEC-6)
- [ ] Logout roto — sesión no destruida en servidor (#SEC-11)
- [ ] Fuga de información en mensajes de error (#SEC-12)
- [ ] Stored XSS via Content-Type controlado por el usuario (#SEC-16)
- [ ] Open Redirect en login — phishing interno (#SEC-1)
- [ ] Enumeración de usuarios en get_by_mail (#SEC-10)
- [ ] Carga de archivos sin validación en endpoints API (#SEC-3)
- [ ] SQL con nombre de columna interpolado por f-string (#SEC-5)
- [ ] BasicAuthentication habilitada — credenciales en claro en red interna (#SEC-13)
- [ ] Archivo `.env` en el historial de git (#26)
- [ ] Logging sin rotación de ficheros (#27)

---

## 🔴 Seguridad — Vulnerabilidades detectadas (Informe 13/03/2026)

> **Contexto:** Aplicación desplegada en intranet, red privada clase A, usuarios internos autenticados.
> Las vulnerabilidades que solo aplican a exposición pública en internet han sido descartadas.

### Estado de verificación práctica (13/03/2026)
- **SEC-1 Open Redirect:** ✅ **Confirmada (explotable)**. Prueba real: login con `?next=http://evil.local/` devuelve `302` con `Location: http://evil.local/`.
- **SEC-2 IDOR entre roles en `proxy_file`:** ✅ **Confirmada (riesgo real)**. Hay `@login_required`, pero no validación de rol/propiedad antes de acceder al objeto por `pk`.
- **SEC-4 Mass Assignment (`fields='__all__'`):** ✅ **Confirmada (riesgo real)**. `NecropsiaSerializer` y `MuestraNecropsiaSerializer` exponen `__all__`.
- **SEC-6 DEBUG por defecto:** ✅ **Confirmada (riesgo real)**. `DJANGO_DEBUG` tiene default `'true'` en `settings.py`.
- **SEC-11 Logout roto en frontend:** ✅ **Confirmada (riesgo real)**. `auth.js` redirige a `./registro.html` y no llama a `/logout/`.
- **SEC-12 Fuga de errores internos:** ✅ **Confirmada (riesgo real)**. Se encontraron `messages.error(... {e})` mostrando excepción al usuario.
- **SEC-16 Stored XSS por Content-Type:** ✅ **Confirmada (riesgo real)**. Se guarda `archivo.content_type` del usuario y luego se sirve ese tipo sin redetección.
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
- **Solución:** Declarar `fields` explícitamente y marcar como `read_only_fields` los campos que no deben modificarse desde la API.
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
        read_only_fields = ['id_necropsia', 'qr_necropsia']
```

---

### SEC-6. DEBUG=True por defecto — MEDIA
- **Archivo:** `core/settings.py`
- **Problema:** Si el servidor arranca sin `.env` configurado, `DEBUG=True` activa la página de error de Django, que muestra stack traces con rutas del servidor, código fuente de las vistas e historial SQL. Cualquier usuario interno lo vería.
- **Solución:** Cambiar el valor por defecto a `'false'`.
```python
# ❌ Inseguro
DEBUG = os.getenv('DJANGO_DEBUG', 'true').strip().lower() == 'true'

# ✅ Seguro
DEBUG = os.getenv('DJANGO_DEBUG', 'false').strip().lower() == 'true'
```

---

### SEC-11. Logout roto — sesión Django no destruida — ALTA
- **Archivo:** `js/auth.js` — función `logout()`
- **Problema:** La función de logout del frontend redirige a `./registro.html` (ruta PHP del sistema anterior) en lugar de llamar al endpoint `/logout/` de Django. La cookie `sessionid` sigue siendo válida indefinidamente en el servidor. En un entorno de laboratorio con ordenadores compartidos, cualquier persona que acceda al equipo después puede continuar con la sesión abierta.
- **Solución:** Llamar al endpoint Django real con POST y el token CSRF.
```javascript
// ❌ Solo borra estado local, la sesión Django persiste en el servidor
function logout() {
    sessionStorage.removeItem('isLoggedIn');
    window.location.href = './registro.html';
}

// ✅ Destruye la sesión en el servidor
function logout() {
    const csrfToken = document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '';
    fetch('/logout/', { method: 'POST', headers: { 'X-CSRFToken': csrfToken } })
        .finally(() => { sessionStorage.clear(); window.location.href = '/login/'; });
}
```

---

### SEC-12. Fuga de información en mensajes de error — MEDIA
- **Archivo:** `web/views.py` — múltiples vistas (`cassette_create`, etc.)
- **Problema:** Las excepciones internas se muestran directamente al usuario: `messages.error(request, f'Error al guardar el cassette: {e}')`. Un usuario puede ver rutas del servidor, nombres de tablas de la base de datos o mensajes de error internos de SQLite/MySQL.
- **Solución:** Registrar el error en el log y mostrar un mensaje genérico al usuario.
```python
# ❌ Expone el error interno al usuario
messages.error(request, f'Error al guardar el cassette: {e}')

# ✅ Log interno, mensaje genérico
logger.exception('Error al guardar cassette pk=%s user=%s', pk, request.user.pk)
messages.error(request, 'Error interno al guardar el cassette. Contacta con el administrador.')
```

---

### SEC-16. Stored XSS via Content-Type controlado por el usuario — ALTA
- **Archivos:** `web/views.py:100` — `_guardar_volante_peticion` · `web/views.py:1352` — `_descargar_volante`
- **Problema:** El sistema guarda el `Content-Type` tal como lo reporta el navegador del usuario que sube el archivo (`archivo.content_type`), y luego lo usa directamente al servir el archivo a otros usuarios. Un técnico puede subir un archivo HTML con `Content-Type: text/html` — cuando otro usuario lo descargue, el navegador lo ejecutará como HTML con JavaScript completo, pudiendo robar cookies de sesión o realizar acciones en nombre de la víctima.
- **Solución:** Detectar el tipo real por magic bytes al servir el archivo, nunca confiar en el Content-Type almacenado.
```python
# ❌ Vulnerable — usa el Content-Type guardado por el atacante
response = HttpResponse(content, content_type=instancia.volante_peticion_tipo)

# ✅ Seguro — detecta el tipo real por magic bytes
from api.views import _detect_content_type
content_type_real = _detect_content_type(instancia.volante_peticion)
response = HttpResponse(content, content_type=content_type_real)
```

---

### SEC-1. Open Redirect en login_view — BAJA
- **Tipo:** Unvalidated Redirect (CWE-601)
- **Archivo:** `web/views.py` — `login_view`
- **Problema:** El parámetro `?next=` no se valida. En una red clase A con miles de usuarios, un atacante interno puede enviar a un compañero el enlace `http://app/login/?next=http://sitio-falso.interno/` para redirigirle tras autenticarse a una página de phishing que suplante al sistema. El destino malicioso puede estar alojado en otra máquina de la misma red.
- **Solución:** Usar `url_has_allowed_host_and_scheme()` de Django para validar que el destino pertenece al mismo host.
```python
# ❌ Vulnerable
return redirect(request.GET.get('next', '/index.html'))

# ✅ Seguro
from django.utils.http import url_has_allowed_host_and_scheme
next_url = request.GET.get('next', '').strip()
if next_url and url_has_allowed_host_and_scheme(next_url, allowed_hosts={request.get_host()}):
    return redirect(next_url)
return redirect('/index.html')
```

---

### SEC-10. Enumeración de usuarios en get_by_mail — BAJA (riesgo latente)
- **Tipo:** Insecure Direct Object Reference + User Enumeration (CWE-204)
- **Archivo:** `api/views.py` — `TecnicoViewSet.get_by_mail`
- **Problema:** El diseño del endpoint permite búsqueda de usuarios por email sin control adicional de permisos. En el estado actual **no se explota con emails normales** porque el patrón de ruta `[^/.]+` no acepta `.` (por ejemplo `@dominio.local`), devolviendo `404` para existente y no existente. Si la ruta se corrige para aceptar emails reales, reaparece la enumeración del directorio de personal.
- **Solución:** Restringir el endpoint a usuarios `is_staff` o eliminarlo si no es necesario para el funcionamiento normal.
```python
# ❌ Vulnerable — accesible a cualquier usuario autenticado
@action(detail=False, methods=['get'], url_path='mail/(?P<mail>[^/.]+)')
def get_by_mail(self, request, mail=None):
    tecnico = Tecnico.objects.get(email=mail)
    return Response(TecnicoSerializer(tecnico).data)

# ✅ Seguro — solo staff
def get_by_mail(self, request, mail=None):
    if not request.user.is_staff:
        return Response({'error': 'No autorizado'}, status=403)
    tecnico = get_object_or_404(Tecnico, email=mail)
    return Response(TecnicoSerializer(tecnico).data)
```

---

### SEC-3. Carga de archivos sin validación en endpoints API — ALTA
- **Tipo:** Unrestricted File Upload (CWE-434)
- **Archivos:** `api/views.py` — `ImagenViewSet.create`, `ImagenCitologiaViewSet.create`, `ImagenNecropsiaViewSet.create`, `ImagenTuboViewSet.create`, `ImagenHematologiaViewSet.create`, `ImagenMicrobiologiaViewSet.create`, `MuestraTuboViewSet.create`, `MuestraHematologiaViewSet.create`, `MuestraMicrobiologiaViewSet.create`
- **Problema:** Los endpoints de la API aceptan cualquier fichero sin comprobar tipo ni tamaño. Los formularios web (`web/forms.py`) sí aplican validación (extensión permitida + máximo 20 MB), pero esa validación **no existe en ninguno de los 9 ViewSets** de imagen de la API. Un usuario autenticado puede subir ejecutables, scripts o archivos de varios GB directamente por la API sin ningún rechazo.
- **Solución:** Añadir una función validadora reutilizable y llamarla en cada `create()` antes de guardar.
```python
# ❌ Vulnerable — guarda sin validar
imagen_obj = Imagen.objects.create(
    imagen=imagen_file.read(),
    muestra_id=muestra_id
)

# ✅ Seguro — valida extensión, magic bytes y tamaño
EXTENSIONES_IMAGEN = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff'}
MAGIC_BYTES = {
    b'\xff\xd8\xff': 'image/jpeg',
    b'\x89PNG\r\n\x1a\n': 'image/png',
    b'GIF87a': 'image/gif',
    b'GIF89a': 'image/gif',
    b'BM': 'image/bmp',
    b'RIFF': 'image/webp',
    b'II*\x00': 'image/tiff',
    b'MM\x00*': 'image/tiff',
}
MAX_SIZE_BYTES = 20 * 1024 * 1024  # 20 MB

def _validar_imagen_api(imagen_file):
    ext = os.path.splitext(imagen_file.name)[1].lower()
    if ext not in EXTENSIONES_IMAGEN:
        raise ValidationError(f'Extensión no permitida: {ext}')
    if imagen_file.size > MAX_SIZE_BYTES:
        raise ValidationError('La imagen supera el límite de 20 MB.')
    cabecera = imagen_file.read(16)
    imagen_file.seek(0)
    if not any(cabecera.startswith(magic) for magic in MAGIC_BYTES):
        raise ValidationError('El archivo no es una imagen válida.')
```

---

### SEC-5. SQL con nombre de columna interpolado por f-string — MEDIA
- **Tipo:** SQL Injection (CWE-89) — riesgo latente / patrón frágil
- **Archivos:** `web/views.py:167` — `_obtener_informes_legacy` · `web/views.py:400` — `_guardar_informe` · `api/views.py` — `InformeResultadoViewSet._filtrar_por_modelo`
- **Problema:** El nombre de columna se inyecta directamente en la cadena SQL mediante f-string: `f"... WHERE {columna_fk} = %s"`. Hoy `columna_fk` proviene siempre de un diccionario Python con claves hardcodeadas (no de entrada del usuario), por lo que **no es directamente explotable en el estado actual**. Sin embargo, si en un refactor futuro la función recibe el nombre de columna del usuario o de una URL, se convierte en inyección SQL completa. Django no puede parametrizar nombres de columna.
- **Solución:** Sustituir el pattern por un mapeo que valide el nombre de columna contra una lista permitida antes de interpolarlo.
```python
# ❌ Frágil — columna entra en la cadena SQL sin validación explícita en el sitio de uso
query = f"SELECT ... FROM informesresultado WHERE {columna_fk} = %s"

# ✅ Defensivo — whitelist explícita en el punto de uso
COLUMNAS_FK_PERMITIDAS = frozenset({
    'cassette_id', 'citologia_id', 'necropsia_id',
    'tubo_id', 'hematologia_id', 'microbiologia_id'
})
if columna_fk not in COLUMNAS_FK_PERMITIDAS:
    raise ValueError(f'Columna FK no reconocida: {columna_fk!r}')
query = f"SELECT ... FROM informesresultado WHERE {columna_fk} = %s"
```

---

### SEC-13. BasicAuthentication habilitada — credenciales en Base64 en la red — MEDIA
- **Tipo:** Cryptographic Failure / Cleartext Transmission (CWE-319)
- **Archivo:** `core/settings.py` — `REST_FRAMEWORK['DEFAULT_AUTHENTICATION_CLASSES']`
- **Problema:** `BasicAuthentication` está activada junto a `SessionAuthentication`. HTTP Basic Auth envía las credenciales codificadas en Base64 (no cifradas) en cada petición: `Authorization: Basic dGVzdDp0ZXN0`. Cualquier máquina de la misma red interna puede capturar el tráfico con Wireshark y decodificar el `id_tecnico` y la contraseña en claro. En una red de laboratorio con equipos compartidos y switches gestionados (o sin gestionar) el riesgo es real.
- **Solución:** Eliminar `BasicAuthentication` y dejar únicamente `SessionAuthentication`, que es el mecanismo de autenticación real de la aplicación.
```python
# ❌ Inseguro — BasicAuthentication transmite credenciales desprotegidas
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',  # ← eliminar
    ],
    ...
}

# ✅ Seguro — solo sesión
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    ...
}
```
