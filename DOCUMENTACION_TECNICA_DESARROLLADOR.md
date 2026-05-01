# Documentación Técnica — DjangoSanidad

> **Versión:** 1.0 — Abril 2026
> **Audiencia:** Desarrolladores incorporándose al proyecto.
> **Objetivo:** Permitir a un desarrollador nuevo entender la arquitectura, configurar su entorno local y desplegar el sistema sin asistencia externa.

---

## Tabla de contenidos

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Stack Tecnológico](#2-stack-tecnológico)
3. [Arquitectura del Sistema](#3-arquitectura-del-sistema)
4. [Guía de Configuración Local](#4-guía-de-configuración-local)
5. [Guía de Despliegue](#5-guía-de-despliegue)
6. [Documentación de la API](#6-documentación-de-la-api)
7. [Mantenimiento y Escalabilidad](#7-mantenimiento-y-escalabilidad)

---

## 1. Resumen Ejecutivo

**DjangoSanidad** es una aplicación web de gestión de muestras biológicas para laboratorios de centros educativos sanitarios (FP de Anatomía Patológica, Laboratorio Clínico y Veterinaria). Cubre el ciclo completo: registro de muestras, sub-muestras procesadas, imágenes asociadas, generación de códigos QR de trazabilidad e informes de resultados.

### Problemas que resuelve

| Problema | Solución aportada |
|---|---|
| Trazabilidad manual de muestras en papel | Códigos QR únicos por registro, resolubles por endpoint web |
| Pérdida de imágenes y volantes en el sistema de archivos | Almacenamiento binario en BD, sin inconsistencias entre disco y registros |
| Acceso indiscriminado a todos los módulos | Control por rol (`profesor`, `anatomia_patologica`, `laboratorio`) |
| Migración del aplicativo PHP legado (PHPSanidad) sin interrumpir servicio | API REST con alias de campos compatibles con el esquema legado |
| Despliegue en centros educativos sin equipo TI dedicado | Ejecutable portátil + script `.bat` de autodespliegue para Windows |

### Estado actual

- **En producción** en el centro educativo de origen.
- **Pendiente de implantación** en un segundo centro (IES Ramón y Cajal).
- **Migración PHP→Django** en curso; ambos sistemas conviven mediante la API REST.

---

## 2. Stack Tecnológico

### 2.1 Capas y elecciones

| Capa | Tecnología | Versión | Justificación |
|---|---|---|---|
| Lenguaje | Python | 3.10+ (probado en 3.12) | Coherencia con el equipo y ecosistema Django. |
| Framework web | Django | 6.0.3 | ORM maduro, panel de administración integrado, auth y sesiones de serie. Reduce código boilerplate. |
| API REST | Django REST Framework | 3.16.1 | Estándar de facto sobre Django; serializers, ViewSets, paginación y router. |
| Base de datos | SQLite3 | embebida | Cero administración, fichero único, suficiente para uso intra-centro (≤20 usuarios concurrentes). |
| Driver MySQL | PyMySQL | 1.1.2 | Preparado para migrar a MySQL/MariaDB cuando crezca el volumen. |
| Imágenes | Pillow | 12.1.1 | Procesamiento de imágenes subidas por usuarios. |
| QR | qrcode | 8.2 | Generación de PNGs de códigos QR para trazabilidad física. |
| CORS | django-cors-headers | 4.9.0 | Whitelist explícita de orígenes (sin wildcard) para integración con PHPSanidad. |
| Empaquetado | PyInstaller | 6.x | Genera un ejecutable portátil para Windows sin dependencia de Python instalado. |

### 2.2 Lo que **no** se usa (y por qué)

- **Sin Docker / Kubernetes**: el despliegue final es en equipos Windows aislados de la red del centro. Contenedores añaden complejidad sin beneficio en este contexto.
- **Sin servidor web externo (Nginx/Apache/IIS)**: el `runserver` de Django basta para el volumen de carga interno. Si se escala, ver §7.
- **Sin frontend SPA**: las plantillas Django con AJAX puntual cubren la UX requerida y reducen la superficie de mantenimiento.
- **Sin tokens JWT**: autenticación de sesión Django (cookie `sessionid`) suficiente para uso intranet. Documentado como evolución pendiente si surge un cliente móvil.

---

## 3. Arquitectura del Sistema

### 3.1 Tipo de arquitectura

Monolito modular Django, con dos interfaces sobre el mismo dominio:

```
┌────────────────────────────┐    ┌───────────────────────────┐
│  Navegador (técnico/admin) │    │  PHPSanidad (legado)      │
└──────────────┬─────────────┘    └──────────────┬────────────┘
               │ HTTP/HTTPS                      │ HTTP (REST)
               ▼                                 ▼
        ┌──────────────────────────────────────────────┐
        │              core/urls.py                    │
        └──────┬─────────────────────┬─────────────────┘
               ▼                     ▼
        ┌─────────────┐       ┌─────────────┐
        │  web/       │       │  api/       │
        │  (HTML+AJAX)│       │  (DRF)      │
        └──────┬──────┘       └──────┬──────┘
               │                     │
               └──────────┬──────────┘
                          ▼
                 ┌────────────────────┐
                 │   api/models.py    │
                 │   (ORM Django)     │
                 └─────────┬──────────┘
                           ▼
                 ┌────────────────────┐
                 │ SQLite3  / MySQL   │
                 └────────────────────┘
```

### 3.2 Estructura del proyecto

```
DjangoSanidad/
├── core/                       # Configuración global Django
│   ├── settings.py             # BD, auth, logging, CORS, paginación
│   ├── urls.py                 # Router raíz: /admin, /api, /, /health
│   ├── error_views.py          # 404/500 personalizados
│   └── wsgi.py / asgi.py
│
├── api/                        # Lógica de negocio + REST
│   ├── models.py               # 26 modelos (bases abstractas + 6 tipos de muestra)
│   ├── views.py                # ViewSets DRF y proxy de ficheros
│   ├── serializers.py          # Validadores de QR único, alias PHPSanidad
│   ├── urls.py                 # Router DRF
│   ├── exceptions.py           # Manejador JSON consistente
│   └── migrations/
│
├── web/                        # Interfaz HTML
│   ├── views.py                # CRUD por sección, login, descargas
│   ├── forms.py                # ModelForms con catálogo dinámico
│   ├── middleware.py           # RolAccesoMiddleware
│   ├── urls.py                 # Rutas web
│   └── templates/web/
│
├── media/                      # Ficheros subidos (si MEDIA_ROOT activo)
├── logs/                       # errors.log con rotación
├── css/  js/  assets/          # Estáticos del frontend
├── *.html                      # Páginas estáticas servidas vía render_html
│
├── manage.py
├── requirements.txt
├── DjangoSanidadPortable.spec  # Configuración PyInstaller
├── launcher_portable.py        # Punto de entrada del ejecutable
├── *.bat                       # Scripts Windows (deploy/start/uninstall)
└── .env.example
```

### 3.3 Modelo de dominio

Cada uno de los 6 tipos de muestra sigue una jerarquía de tres niveles:

```
Registro principal (ej. Cassette)        ← QR único, BinaryField volante
    └── Sub-muestra (ej. Muestra)        ← SoftDelete activo
            └── Imagen                   ← SoftDelete activo, BinaryField
```

| Tipo | Registro | Sub-muestra | Imagen | Prefijo QR |
|---|---|---|---|:---:|
| Histología | `Cassette` | `Muestra` | `Imagen` | `CS` |
| Citología | `Citologia` | `MuestraCitologia` | `ImagenCitologia` | `CI` |
| Necropsia | `Necropsia` | `MuestraNecropsia` | `ImagenNecropsia` | `NC` |
| Tubo / Tejido | `Tubo` | `MuestraTubo` | `ImagenTubo` | `TB` |
| Hematología | `Hematologia` | `MuestraHematologia` | `ImagenHematologia` | `HM` |
| Microbiología | `Microbiologia` | `MuestraMicrobiologia` | `ImagenMicrobiologia` | `MC` |

Modelos transversales:

- **`Tecnico`** (`AUTH_USER_MODEL`): autenticación por email, sin `username`. Roles: `profesor`, `anatomia_patologica`, `laboratorio`.
- **`CatalogoOpcion`**: opciones dinámicas (órganos, tinciones, tipos de análisis) editables desde `/admin/` sin tocar código.
- **`InformeResultado`**: vinculado vía `GenericForeignKey` a cualquier tipo de muestra.

### 3.4 Flujo de una petición típica

**Subida de imagen vía web:**
```
POST /muestras/<id>/imagenes/subir/
   ↓
RolAccesoMiddleware ─→ verifica que el rol del Tecnico autenticado puede acceder a la sección
   ↓
web/views.imagen_upload ─→ form valida, _leer_imagen_bytes() extrae InMemoryUploadedFile
   ↓
api/models.Imagen.objects.create(...)  con BinaryField
   ↓
Respuesta JSON ─→ AJAX repinta el listado de imágenes
```

**Resolución de QR físico:**
```
GET /qr/resolver/?qr=CS3a7f2b91de04
   ↓
web/views.qr_resolver detecta prefijo `CS`
   ↓
Redirige a /cassettes/<pk>/editar/
```

### 3.5 Patrones aplicados

| Patrón | Implementación |
|---|---|
| Soft Delete | Mixin `SoftDeleteModel` con manager dual (`objects` filtra borrados, `all_objects` los expone). Cascada lógica vía `_cascade_soft_delete_children()`. |
| Generic Foreign Key | `InformeResultado` se vincula a cualquier registro principal sin tabla intermedia por tipo. |
| Whitelist de campos en proxy de ficheros | `proxy_file` valida `(modelo, campo)` contra una lista permitida y detecta MIME por *magic bytes*. |
| Mixins en serializers | `QrUnicoValidatorMixin`, `FileUrlSerializerMixin` aplicados a todos los serializers. |
| Catálogo dinámico | `ModelForm` consulta `CatalogoOpcion` en `__init__`; *fallback* a valores `distinct()` de la BD si está vacío. |

---

## 4. Guía de Configuración Local

### 4.1 Requisitos previos

| Software | Versión mínima | Observaciones |
|---|---|---|
| Python | 3.10 | Probado en 3.12. Marcar "Add to PATH" en Windows. |
| pip | la incluida en Python | Se actualiza automáticamente. |
| Git | cualquiera reciente | Opcional si se descarga el ZIP. |
| SQLite3 | embebida en Python | Sin acción adicional. |

No requiere Node.js, Docker, ni servidor de base de datos externo.

### 4.2 Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/NoelBallester/DjangoSanidad
cd DjangoSanidad

# 2. Crear y activar el entorno virtual
python -m venv venv
# Linux / macOS:
source venv/bin/activate
# Windows (cmd):
venv\Scripts\activate.bat
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1

# 3. Instalar dependencias
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt

# 4. Crear el fichero .env (ver §4.3)
cp .env.example .env   # Linux/macOS
copy .env.example .env # Windows

# 5. Aplicar migraciones
python manage.py migrate

# 6. Crear el primer superusuario (rol implícito: profesor)
python manage.py createsuperuser

# 7. Arrancar el servidor de desarrollo
python manage.py runserver
```

Acceder a:
- Aplicación: <http://127.0.0.1:8000/>
- Admin Django: <http://127.0.0.1:8000/admin/>
- Health check: <http://127.0.0.1:8000/health/>

### 4.3 Variables de entorno (`.env`)

| Variable | Obligatoria | Por defecto | Descripción |
|---|:---:|---|---|
| `DJANGO_SECRET_KEY` | **Sí** | — | Clave criptográfica única por entorno. ≥50 caracteres aleatorios. |
| `DJANGO_CORS_ALLOWED_ORIGINS` | **Sí** | — | Orígenes permitidos para CORS, separados por coma. Sin wildcard. |
| `DJANGO_DEBUG` | No | `false` | `true` solo en desarrollo. |
| `DJANGO_ALLOWED_HOSTS` | No | `localhost,127.0.0.1` | Hosts aceptados por Django. |
| `DJANGO_TIME_ZONE` | No | `Europe/Madrid` | Zona horaria. |
| `DJANGO_HTTPS` | No | `false` | `true` activa HSTS y cookies seguras. |
| `DJANGO_LOG_LEVEL` | No | `INFO` | Nivel de los loggers `api` y `web`. |
| `DJANGO_LOG_MAX_BYTES` | No | `10485760` | Tamaño máximo de `errors.log` antes de rotar. |
| `DJANGO_LOG_BACKUP_COUNT` | No | `5` | Ficheros de log rotados a conservar. |

Ejemplo mínimo de `.env` para desarrollo:

```env
DJANGO_SECRET_KEY=django-insecure-dev-key-cambiar-en-produccion
DJANGO_DEBUG=true
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
DJANGO_CORS_ALLOWED_ORIGINS=http://localhost:8000,http://127.0.0.1:8000
```

### 4.4 Configuración inicial post-arranque

Desde `/admin/`, antes de poner el sistema en uso:

1. **Catálogo de opciones**: poblar `CatalogoOpcion` con los valores de `organo`, `tincion`, `tipo_citologia`, `tipo_autopsia` y `analisis_informe`. Sin esto, los `<select>` de los formularios estarán vacíos.
2. **Usuarios técnicos**: crear los `Tecnico` con su rol correspondiente.

---

## 5. Guía de Despliegue

El proyecto soporta tres modalidades de despliegue. La elección depende del contexto del centro destino.

### 5.1 Modalidad A — Ejecutable portátil (Windows)

Ideal para demos rápidas o pruebas. Empaqueta Python + Django + código + BD en una carpeta.

```bash
# Generar el ejecutable (en la máquina de desarrollo, con venv activado)
pip install pyinstaller
build_portable.bat
```

Salida: `dist/DjangoSanidad/`. Comprimir esa carpeta y entregarla. El destinatario solo hace doble clic en `DjangoSanidad.exe`.

**Limitación:** la BD se empaqueta dentro del `_internal/`, lo que dificulta actualizaciones sin perder datos. Solo recomendado para pruebas.

### 5.2 Modalidad B — Autodespliegue por script (Windows, recomendada)

Para implantación permanente en centros sin equipo TI.

1. Entregar `AUTO_DESCARGAR_E_INICIAR_DJANGOSANIDAD.bat` al centro.
2. El script realiza, idempotentemente:
   - Detección de Python; instalación vía `winget` si falta (`Python.Python.3.12`).
   - Descarga del repo (Git si está disponible, ZIP en otro caso).
   - Creación del `venv` y `pip install -r requirements.txt`.
   - Generación de `.env` con `SECRET_KEY` aleatoria de 50 caracteres.
   - `python manage.py migrate --run-syncdb`.
   - Búsqueda de puerto libre entre 8000–8029.
   - `runserver 0.0.0.0:<port>` y apertura del navegador.
3. Para arranques posteriores, usar `INICIAR_DJANGOSANIDAD_WINDOWS.bat` (más rápido, no comprueba descargas).
4. Para desinstalar, `ELIMINAR_DJANGOSANIDAD_COMPLETAMENTE.bat`.

Errores se vuelcan en `deployment_log.txt`.

### 5.3 Modalidad C — Despliegue manual (servidor Linux / Windows)

Para escenarios con servidor de aplicación dedicado:

```bash
# 1. Clonar y preparar el entorno (ver §4.2)
# 2. Producción: añadir Gunicorn (Linux) o Waitress (Windows)
pip install gunicorn  # o: pip install waitress

# 3. Variables de entorno productivas
DJANGO_DEBUG=false
DJANGO_HTTPS=true
DJANGO_ALLOWED_HOSTS=lab.miescuela.local
DJANGO_CORS_ALLOWED_ORIGINS=https://lab.miescuela.local

# 4. Recolectar estáticos
python manage.py collectstatic --noinput

# 5. Aplicar migraciones
python manage.py migrate

# 6. Lanzar (ejemplo Linux con Gunicorn detrás de Nginx)
gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 3
```

Si se migra a MySQL, sustituir el bloque `DATABASES` de `core/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'djangosanidad',
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST', '127.0.0.1'),
        'PORT': os.getenv('DB_PORT', '3306'),
        'OPTIONS': {'charset': 'utf8mb4'},
    }
}
```

`PyMySQL` ya está en `requirements.txt` y registrado como `MySQLdb` en `core/settings.py`.

### 5.4 CI/CD

**Estado actual:** no hay pipeline configurado. El despliegue se realiza vía `git pull` en el equipo destino o regenerando el ejecutable portátil.

**Propuesta mínima (GitHub Actions)** para añadir cuando se priorice:

```yaml
# .github/workflows/ci.yml  (referencia, no implementado todavía)
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.12' }
      - run: pip install -r requirements.txt
      - run: python manage.py migrate
        env:
          DJANGO_SECRET_KEY: ci-key
          DJANGO_CORS_ALLOWED_ORIGINS: http://localhost:8000
      - run: python manage.py test
```

Se recomienda añadir un *job* paralelo de `build_portable.bat` en `windows-latest` cuando el ejecutable se quiera distribuir como artefacto de release.

---

## 6. Documentación de la API

### 6.1 Convenciones

- **Prefijo**: `/api/`
- **Autenticación**: `SessionAuthentication` (cookie `sessionid` + cabecera `X-CSRFToken`).
- **Permiso por defecto**: `IsAuthenticated`.
- **Paginación**: `PageNumberPagination` con `PAGE_SIZE = 50`.
- **Formato**: JSON.
- **Errores**: handler en `api/exceptions.py` devuelve siempre `{"error": "...", "status_code": N}`.

### 6.2 Endpoints CRUD (DRF Router)

Todos los recursos exponen `list`, `retrieve`, `create`, `update`, `partial_update`, `destroy`:

| Recurso | URL base |
|---|---|
| Técnicos | `/api/tecnicos/` |
| Cassettes / Muestras / Imágenes | `/api/cassettes/`, `/api/muestras/`, `/api/imagenes/` |
| Citologías | `/api/citologias/`, `/api/muestrascitologia/`, `/api/imagenescitologia/` |
| Necropsias | `/api/necropsias/`, `/api/muestrasnecropsia/`, `/api/imagenesnecropsia/` |
| Tubo / Tejido | `/api/tubos/`, `/api/muestrastubo/`, `/api/imagenestubo/` |
| Hematología | `/api/hematologia/`, `/api/muestrashematologia/`, `/api/imageneshematologia/` |
| Microbiología | `/api/microbiologias/`, `/api/muestrasmicrobiologia/`, `/api/imagenesmicrobiologia/` |
| Informes | `/api/informesresultado/` |

### 6.3 Acciones personalizadas

| Endpoint | Método | Descripción |
|---|:---:|---|
| `/api/tecnicos/get_by_mail/?email=<email>` | `GET` | Obtiene un técnico por su email. |
| `/api/tecnicos/exist/?email=<email>` | `GET` | Comprueba si el email ya existe. |
| `/api/tecnicos/auth/` | `POST` | Autentica con `{"email", "password"}`. |
| `/api/<recurso>/<pk>/actualizar_informe/` | `POST` | Actualiza campos de informe e imagen del registro principal. |

### 6.4 Endpoints especiales

| Endpoint | Método | Notas |
|---|:---:|---|
| `/api/archivo/<modelo>/<pk>/<campo>/` | `GET` | Proxy de ficheros binarios; valida campo en *whitelist* y detecta MIME por *magic bytes*. |
| `/qr/resolver/?qr=<codigo>` | `GET` | Resuelve un QR (por prefijo) y redirige al detalle del registro. |
| `/health/` | `GET` | Health check sin autenticación. Devuelve `{"status": "ok"}`. |

### 6.5 Ejemplo de uso

```bash
# 1. Obtener CSRF y autenticarse
curl -c cookies.txt http://127.0.0.1:8000/api/tecnicos/

# 2. Login (extrayendo el csrftoken del paso 1)
curl -b cookies.txt -c cookies.txt \
     -H "X-CSRFToken: $CSRF" \
     -H "Content-Type: application/json" \
     -d '{"email":"prof@centro.local","password":"***"}' \
     http://127.0.0.1:8000/api/tecnicos/auth/

# 3. Listar cassettes
curl -b cookies.txt http://127.0.0.1:8000/api/cassettes/
```

---

## 7. Mantenimiento y Escalabilidad

### 7.1 Tests

**Estado actual:** existe `python manage.py test web` y un `tmp_test.py` puntual. La cobertura no es sistemática.

```bash
# Ejecutar todos los tests
python manage.py test

# Tests de una app concreta
python manage.py test api
python manage.py test web

# Con verbosidad
python manage.py test --verbosity=2
```

**Recomendaciones para cuando se priorice cobertura:**
- `pytest-django` para sintaxis más concisa.
- `factory_boy` para fixtures de los 26 modelos.
- `coverage.py` integrado en CI con umbral mínimo (sugerido: 60% para empezar).

### 7.2 Logs y monitorización

- Fichero rotativo en `logs/errors.log` (10 MB × 5 backups por defecto).
- Loggers `api` y `web` configurables vía `DJANGO_LOG_LEVEL`.
- Endpoint `/health/` apto para monitorización externa (UptimeKuma, healthchecks.io).

### 7.3 Backups

Con SQLite:

```bash
# Apagar el servidor primero o usar el comando atómico de SQLite
sqlite3 db.sqlite3 ".backup backups/db-$(date +%F).sqlite3"
```

Las imágenes y volantes están en la BD (BinaryField), por lo que un backup de `db.sqlite3` es completo.

### 7.4 Consideraciones de escalabilidad

| Vector | Síntoma | Acción |
|---|---|---|
| Volumen de BD > 1 GB | SQLite empieza a notar latencia en escrituras concurrentes | Migrar a MySQL/MariaDB (driver ya incluido). |
| Imágenes pesadas y >5 GB | El backup de la BD se vuelve lento | Mover `BinaryField` → `FileField` con almacenamiento externo (filesystem o S3). |
| Picos de conexiones | `runserver` no escala | Sustituir por Gunicorn/Waitress + Nginx como reverse proxy. |
| Cliente móvil o SPA | Sesiones de cookie incómodas | Añadir `djangorestframework-simplejwt` y reconfigurar `DEFAULT_AUTHENTICATION_CLASSES`. |
| Múltiples centros con datos compartidos | Un fichero SQLite por centro fragmenta los datos | Centralizar BD en MySQL multi-tenant + multi-DB Django. |

### 7.5 Deuda técnica conocida

| Área | Situación | Recomendación |
|---|---|---|
| BD | SQLite en todos los entornos | MySQL/PostgreSQL en producción multiusuario. |
| Almacenamiento de imágenes | `BinaryField` en BD | Almacenamiento externo si crece el volumen. |
| Auth API | Solo sesión Django | Tokens JWT cuando haya cliente desacoplado. |
| Frontend | AJAX embebido en plantillas | Refactor a cliente JS estructurado si escala el alcance. |
| Vulnerabilidades | Listadas en `MEJORAS.md` (Fase 4) y `DOCUMENTACION_TECNICA.md` §13.2 | Priorizar las marcadas **ALTA** antes de cualquier nuevo despliegue. |

### 7.6 Comandos de gestión útiles

```bash
# Crear superusuario (rol profesor por defecto)
python manage.py createsuperuser

# Recolectar estáticos
python manage.py collectstatic --noinput

# Generar migraciones tras cambios en modelos
python manage.py makemigrations

# Shell interactivo con el ORM cargado
python manage.py shell

# Listar URLs registradas
python manage.py show_urls   # requiere django-extensions
```

---

> **Mantenimiento de este documento:** actualizar cada vez que cambien `requirements.txt`, los scripts `.bat`, el modelo de datos o las variables de entorno. La fuente de verdad es el código; este documento debe quedar desfasado lo menos posible.
