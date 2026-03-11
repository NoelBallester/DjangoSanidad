# Mejoras pendientes - DjangoSanidad

## 🔴 Críticas (Seguridad & Estabilidad)

### 1. Almacenamiento de imágenes en base de datos HECHO
- **Problema:** Las imágenes se guardan como `BinaryField` en SQLite, lo que infla la base de datos y ralentiza las consultas. Los backups son más complejos y no es compatible con CDN o servidores de media.
- **Solución:** Usar `FileField` con almacenamiento en el sistema de archivos (`media/`) o cloud (S3/GCS).
- **Afecta:** `api/models.py` → modelos `Imagen`, `ImagenTubo`, `ImagenHematologia`, `ImagenMicrobiologia`, `ImagenCitologia`

### 2. Paginación en endpoints de lista
- **Problema:** Endpoints como `/todos/` devuelven todos los registros sin límite. Con grandes volúmenes de datos causará problemas graves de rendimiento.
- **Solución:** Añadir `PageNumberPagination` en DRF para todos los ViewSets.
- **Afecta:** `api/views.py` → todos los ViewSets, `core/settings.py` (configuración global de paginación)

### 3. Configuración de archivos estáticos insegura HECHO
- **Problema:** `STATICFILES_DIRS = [BASE_DIR]` expone todo el proyecto incluyendo `.git`, `db.sqlite3` y cualquier archivo `.env`.
- **Solución:** Crear un directorio `static/` dedicado y apuntar solo a él.
- **Afecta:** `core/settings.py`

### 4. Secret key sin protección obligatoria HECHO
- **Problema:** Si no se define `DJANGO_SECRET_KEY`, usa el valor por defecto `'dev-insecure-change-me'`. Si el proyecto se despliega sin configurar la variable, es vulnerable.
- **Solución:** Hacer obligatoria la variable de entorno (lanzar error si no está definida) o usar `python-decouple` con un `.env` obligatorio.
- **Afecta:** `core/settings.py`

### 5. Sin archivo `.env` de ejemplo HECHO
- **Problema:** No hay `.env.example` ni documentación de las variables de entorno necesarias.
- **Solución:** Crear `.env.example` con todas las variables requeridas (`DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`, `DJANGO_CORS_ALLOW_ALL`, etc.) y añadir `.env` al `.gitignore`.

---

## 🟠 Importantes (Calidad del código)

### 6. Duplicación masiva de modelos HECHO
- **Problema:** Existen 5 modelos de muestra casi idénticos (Cassette, Tubo, Hematologia, Microbiologia, Citologia), 5 modelos de detalle y 5 modelos de imagen, con más de 80 campos duplicados en total.
- **Solución:** Crear modelos base abstractos (`MuestraBase`, `DetalleBase`, `ImagenBase`) y heredar de ellos en cada tipo específico.
- **Afecta:** `api/models.py`

### 7. Rutas API triplicadas HECHO
- **Problema:** `/api/`, `/sanitaria/` y `/modelo/` apuntan exactamente a los mismos endpoints. Genera confusión, superficie de ataque innecesaria y dificultad para mantener tests.
- **Solución:** Eliminar `/sanitaria/` y `/modelo/` y usar únicamente `/api/`.
- **Afecta:** `core/urls.py`

### 8. Tipos de órganos y tinciones hardcodeados en formularios HECHO
- **Problema:** Más de 80 líneas de listas estáticas en `web/forms.py` (tipos de órganos, tinciones, etc.). Añadir o modificar opciones requiere cambios de código.
- **Solución:** Mover a modelos de base de datos con administración desde el panel de Django Admin.
- **Afecta:** `web/forms.py`, requiere nuevos modelos en `api/models.py`

### 9. Sin archivo `requirements.txt`  HECHO
- **Problema:** No existe archivo de dependencias. Cualquier despliegue o instalación nueva requiere saber de memoria qué paquetes instalar.
- **Solución:** Ejecutar `pip freeze > requirements.txt` y mantenerlo actualizado.

### 10. Diseño de `InformeResultado` con múltiples FK opcionales HECHO
- **Problema:** El modelo `InformeResultado` tiene ForeignKey a los 5 tipos de muestra con `null=True`, lo que rompe la integridad referencial y hace las queries complejas.
- **Solución:** Usar `GenericForeignKey` de Django o crear tablas de informes separadas por tipo de muestra.
- **Afecta:** `api/models.py` → `InformeResultado`

### 11. Generación de QR sin validación de unicidad HECHO
- **Problema:** Los QR se generan con cadenas aleatorias sin verificar colisiones en base de datos. Aunque improbable, es posible un duplicado.
- **Solución:** Añadir un bucle de verificación o usar `uuid.uuid4()` directamente con restricción `unique=True`.
- **Afecta:** `api/views.py` → función `generar_qr()`

### 12. Opciones de formularios sin validación de negocio en serializers  HECHO
- **Problema:** Los serializers tienen validación mínima. No se valida unicidad de QR, formatos de fechas especiales ni reglas de negocio médicas.
- **Solución:** Añadir métodos `validate_*()` y `validate()` en los serializers.
- **Afecta:** `api/serializers.py`

---

## 🟡 Moderadas (Funcionalidad & Arquitectura)

### 13. Sin autenticación por token
- **Problema:** Solo hay sesión y autenticación básica (usuario/contraseña en cada request). Dificulta integraciones con aplicaciones externas o apps móviles.
- **Solución:** Añadir `rest_framework.authtoken` o JWT con `djangorestframework-simplejwt`.
- **Afecta:** `core/settings.py`, `api/views.py` (endpoint de login), `api/urls.py`

### 14. Sin versionado de API
- **Problema:** Cualquier cambio en la API afecta inmediatamente a todos los clientes. No hay forma de mantener compatibilidad hacia atrás.
- **Solución:** Usar prefijo `/api/v1/` en las URLs.
- **Afecta:** `core/urls.py`, `api/urls.py`

### 15. Sin borrado suave (soft delete)
- **Problema:** Al borrar una muestra se eliminan permanentemente sus imágenes, muestras detalle e informes. No hay trazabilidad ni posibilidad de recuperar datos.
- **Solución:** Añadir campo `is_deleted = BooleanField(default=False)` y sobreescribir el manager para filtrar automáticamente los borrados. Alternativa: usar `django-safedelete`.
- **Afecta:** `api/models.py`, `api/views.py`

### 16. Sin logging
- **Problema:** No hay registro de errores ni de operaciones importantes. Es imposible depurar problemas en producción.
- **Solución:** Configurar `LOGGING` en `settings.py` para registrar errores (nivel ERROR a fichero) y operaciones críticas (creación/borrado de muestras).
- **Afecta:** `core/settings.py`

### 17. Sin documentación de API
- **Problema:** No hay documentación de los endpoints disponibles, sus parámetros ni sus respuestas. Dificulta el desarrollo del frontend y la integración con terceros.
- **Solución:** Añadir `drf-spectacular` para generar documentación OpenAPI/Swagger automáticamente desde el código.
- **Afecta:** `core/settings.py`, `core/urls.py`

### 18. CORS configurable a "allow all"
- **Problema:** La variable `DJANGO_CORS_ALLOW_ALL` puede activarse y permitir peticiones desde cualquier origen. En producción supone un riesgo de seguridad.
- **Solución:** Eliminar la opción de "allow all" y requerir siempre la lista explícita de orígenes permitidos.
- **Afecta:** `core/settings.py`

### 19. Sin manejo de zona horaria
- **Problema:** `TIME_ZONE = 'UTC'` sin `USE_TZ = True` activo puede causar problemas con fechas si el servidor o los usuarios están en otra zona horaria.
- **Solución:** Activar `USE_TZ = True` y manejar zonas horarias correctamente en los modelos y vistas.
- **Afecta:** `core/settings.py`, posiblemente `api/models.py`

### 20. Sin manejo de errores personalizado
- **Problema:** Los errores no controlados devuelven páginas 500 genéricas o respuestas DRF sin formato consistente.
- **Solución:** Añadir un handler de excepciones personalizado en DRF y páginas de error personalizadas (404, 500) en Django.
- **Afecta:** `api/views.py`, `core/settings.py`

---

## 🟢 Rendimiento & Escalabilidad

### 21. Queries N+1 sin optimizar
- **Problema:** Los ViewSets hacen queries sin `select_related()` ni `prefetch_related()`. Al listar muestras con sus técnicos o imágenes, se ejecuta una query por cada registro.
- **Solución:** Añadir `select_related('tecnico')` y `prefetch_related('muestras', 'imagenes')` en los QuerySets de los ViewSets.
- **Afecta:** `api/views.py` → todos los ViewSets

### 22. Sin caché para filtros frecuentes
- **Problema:** Filtros por fecha, QR y órgano se ejecutan directamente contra la base de datos en cada request sin ningún tipo de caché.
- **Solución:** Añadir caché con `@cache_page` para vistas de solo lectura o configurar Redis/Memcached para caché de QuerySets frecuentes.
- **Afecta:** `api/views.py`, `core/settings.py`

### 23. Base de datos SQLite en producción
- **Problema:** SQLite no soporta escrituras concurrentes. Con múltiples técnicos usando el sistema simultáneamente se producirán errores de bloqueo.
- **Solución:** Migrar a PostgreSQL para el entorno de producción.
- **Afecta:** `core/settings.py`, requiere `psycopg2` en dependencias

### 24. Serialización de imágenes en Base64 ineficiente
- **Problema:** Las imágenes se codifican/decodifican en Base64 en los serializers para cada request, lo que consume mucha memoria con imágenes grandes.
- **Solución:** Una vez migradas a ficheros (mejora #1), servir las imágenes con URLs directas o URLs firmadas en lugar de incrustar los datos en el JSON.
- **Afecta:** `api/serializers.py`

---

## 🔵 Testing & Documentación

### 25. Cobertura de tests incompleta
- **Problema:** Hay tests para operaciones básicas pero faltan tests para todas las acciones personalizadas de los ViewSets (`por_qr`, `rango_fechas`, `actualizar_informe`, etc.) y para casos límite.
- **Solución:** Ampliar `api/tests.py` y `web/tests.py` con tests para todas las acciones, incluyendo casos de error y permisos.
- **Afecta:** `api/tests.py`, `web/tests.py`

### 26. Sin tests de integración end-to-end
- **Problema:** Los tests actuales son unitarios. No hay tests que verifiquen flujos completos (crear cassette → añadir muestra → subir imagen → generar informe).
- **Solución:** Añadir tests de integración con `pytest-django` o Selenium para los flujos críticos.

### 27. Sin guía de despliegue
- **Problema:** No hay documentación sobre cómo desplegar el proyecto en producción (servidor web, variables de entorno, migraciones, archivos estáticos).
- **Solución:** Crear `DEPLOYMENT.md` con instrucciones paso a paso para despliegue con Gunicorn + Nginx o en plataformas cloud.

### 28. Sin documentación de arquitectura
- **Problema:** No hay documentación sobre las decisiones de diseño, el modelo de datos ni cómo está organizado el código.
- **Solución:** Crear `ARCHITECTURE.md` con diagrama de modelos, descripción de cada app y flujos principales.

---

## Resumen por fases de implementación

### Fase 1 - Seguridad inmediata
- [x] Fix `STATICFILES_DIRS` (#3)
- [x] Proteger `SECRET_KEY` (#4)
- [x] Crear `.env.example` (#5)
- [x] Crear `requirements.txt` (#9)
- [x] Eliminar rutas duplicadas (#7)

### Fase 2 - Rendimiento y estabilidad
- [ ] Añadir paginación (#2)
- [x] Migrar imágenes a sistema de ficheros (#1)
- [ ] Optimizar queries N+1 (#21)
- [ ] Activar zona horaria (#19)

### Fase 3 - Calidad del código
- [x] Modelos abstractos base (#6)
- [x] Rediseñar `InformeResultado` (#10)
- [x] Unicidad de QR (#11)
- [x] Mover opciones hardcodeadas a BD (#8)
- [x] Validación en serializers (#12)
- [ ] Borrado suave (#15)

### Fase 4 - Funcionalidad
- [ ] Autenticación por token/JWT (#13)
- [ ] Versionado de API v1 (#14)
- [ ] Logging (#16)
- [ ] Manejo de errores personalizado (#20)
- [ ] Documentación de API con drf-spectacular (#17)

### Fase 5 - Escalabilidad
- [ ] Migrar a PostgreSQL (#23)
- [ ] Añadir caché (#22)
- [ ] Optimizar serialización de imágenes (#24)

### Fase 6 - Testing & Docs
- [ ] Ampliar cobertura de tests (#25)
- [ ] Tests de integración (#26)
- [ ] Guía de despliegue (#27)
- [ ] Documentación de arquitectura (#28)
