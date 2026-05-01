---
version: "2.0"
fecha: "2026-05-01"
autor: "Claude Sonnet 4.6 (arquitecto) / JL (proyecto)"
commit: "e983992380e9e97434e9405b8f1ad0f5bb18b498"
---

# DjangoSanidad — Documentación Técnica v2

## Tabla de contenidos

- [1. Resumen ejecutivo](#1-resumen-ejecutivo)
- [2. Stack y decisiones de arquitectura](#2-stack-y-decisiones-de-arquitectura)
- [3. Modelo de dominio](#3-modelo-de-dominio)
- [4. Arquitectura runtime](#4-arquitectura-runtime)
- [5. Estructura de carpetas comentada](#5-estructura-de-carpetas-comentada)
- [6. Configuración local paso a paso](#6-configuración-local-paso-a-paso)
- [7. API REST completa](#7-api-rest-completa)
- [8. Modelo de permisos y roles](#8-modelo-de-permisos-y-roles)
- [9. Flujos críticos](#9-flujos-críticos)
- [10. Despliegue](#10-despliegue)
- [11. Operación y mantenimiento](#11-operación-y-mantenimiento)
- [12. Compatibilidad con PHPSanidad](#12-compatibilidad-con-phpsanidad)
- [13. Deuda técnica y riesgos conocidos](#13-deuda-técnica-y-riesgos-conocidos)
- [14. Roadmap de evolución](#14-roadmap-de-evolución)
- [15. Glosario](#15-glosario)
- [16. Anexo: comandos de referencia rápida](#16-anexo-comandos-de-referencia-rápida)

---

## 1. Resumen ejecutivo

### 1.1 Qué es y qué problema resuelve

DjangoSanidad es una aplicación web de gestión de muestras biológicas diseñada para laboratorios de ciclos formativos de grado superior en Sanidad (Anatomía Patológica, Laboratorio Clínico, Veterinaria). Permite registrar, trazar y archivar muestras, sub-muestras, imágenes microscópicas e informes de resultado durante las prácticas del alumnado.

El problema que resuelve: los laboratorios de FP gestionaban sus registros en papel o en hojas de cálculo sin trazabilidad. DjangoSanidad introduce códigos QR por muestra, roles diferenciados por especialidad y un histórico digital accesible desde el navegador sin instalación en el cliente.

### 1.2 Estado actual

- Un centro educativo en producción con la aplicación instalada. [verificar con el equipo qué centro]
- Pendiente de implantación en IES Ramón y Cajal.
- Convive actualmente con un sistema PHP legado (PHPSanidad) al que sirve datos a través de la API REST.
- La API y la UI de plantillas están feature-complete. La suite de tests automáticos cubre seguridad, validación, permisos y flujos CRUD (`api/tests.py` + `web/tests.py`: **217 tests**, todos verdes, ~150 s con BD en memoria).

### 1.3 Números clave

| Métrica | Valor |
|---|---|
| LOC Python del proyecto (sin venv, sin migraciones) | ~5 500 aprox. |
| Migraciones (app `api`) | 41 |
| Modelos concretos en BD | 18 |
| Modelos abstractos (bases) | 6 |
| Endpoints REST registrados (rutas base × acciones) | ~130 |
| Rutas de la UI web | 55 |
| Apps Django | 2 (`api`, `web`) |
| Roles de usuario | 3 (`profesor`, `anatomia_patologica`, `laboratorio`) |
| Centros en producción | 1 [verificar con el equipo] |
| Tests automáticos (`api` + `web`) | 217 |

---

## 2. Stack y decisiones de arquitectura

| Capa | Tecnología | Versión | Justificación | Alternativa descartada y por qué |
|---|---|---|---|---|
| Framework web | Django | 6.0.3 | Batería completa incluida (ORM, admin, auth, sesiones), madurez probada en entornos educativos | Flask — demasiado minimalista para la superficie de modelos y formularios requerida |
| API REST | Django REST Framework | 3.16.1 | Integración nativa con modelos Django, autenticación por sesión sin configuración adicional | FastAPI — requeriría duplicar modelos con Pydantic y perder el admin |
| Base de datos | SQLite | (bundled) | Sin instalación de servidor, un solo fichero para backup, suficiente para carga < 10 usuarios concurrentes | MySQL/PostgreSQL — válidos para escalado, pero añaden dependencia de servidor externo incompatible con el modelo portátil |
| Adapter MySQL | PyMySQL | 1.1.2 | Permite migrar a MySQL sin cambiar código: `pymysql.install_as_MySQLdb()` al inicio de `settings.py` | mysqlclient — requiere compilación de extensión C, incompatible con ejecutable PyInstaller portable |
| CORS | django-cors-headers | 4.9.0 | PHPSanidad consume la API desde otro origen; CORS estricto vía lista explícita de orígenes | — |
| Imágenes | Pillow | 12.1.1 | Requerido por `ImageField` de Django para validación de formato | — |
| QR | qrcode | 8.2 | Generación de códigos QR para trazabilidad de muestras | — |
| Despliegue portátil | PyInstaller | (dev-dep) | Empaqueta toda la aplicación en un ejecutable `.exe` sin que el centro necesite Python instalado | Docker — no disponible en equipos Windows de aula sin administrador de dominio |
| Autenticación | Sesión Django (cookie) | — | Sin configuración adicional, funciona con navegador, no requiere cliente HTTP especial | JWT — añade complejidad innecesaria para una app de intranet con un solo servidor |
| Type stubs (dev) | django-stubs + djangorestframework-stubs | 6.0.3 / 3.16.9 | Proveen tipos estáticos a Pyright/Pylance para los modelos ORM y los serializers DRF, eliminando ~300 falsos positivos en el IDE | — |
| Type checker (dev) | mypy + mypy_django_plugin + mypy_drf_plugin | ≥1.13 | Análisis estático offline; configurado en `mypy.ini` con `django_settings_module = core.settings` | — |
| Servidor HTTP | `runserver` de Django | — | Suficiente para intranet local; no expuesto a internet | Gunicorn/Waitress — el modo portátil no los incluye; previsto en el roadmap |
| Servidor estático | Django (sirve directamente) | — | Sin Nginx disponible en entorno portátil; `core/urls.py` registra rutas para `css/`, `js/`, `assets/` | Nginx/WhiteNoise — adecuado en producción real, innecesario en despliegue local |

**Decisión arquitectónica clave — modelo portátil:** La aplicación está diseñada para ejecutarse en una máquina Windows de aula sin infraestructura de servidor. PyInstaller empaqueta Django, el código de la app, las plantillas HTML y la BD SQLite vacía en un directorio distribuible. El resultado cabe en un `.rar` de ~100 MB. El coste de esta decisión es que `runserver` no es apto para carga de producción real (single-threaded, sin WSGI).

**Decisión clave — usuario personalizado:** `AUTH_USER_MODEL = 'api.Tecnico'` (`core/settings.py:192`). El login no usa `username` sino `id_tecnico` (entero) como `USERNAME_FIELD` (`api/models.py:184`). Esto simplifica la integración con PHPSanidad que identifica usuarios por ID numérico, pero hace que el admin de Django requiera login con ese ID numérico también.

---

## 3. Modelo de dominio

### 3.1 Entidades concretas en base de datos

| Tabla | Modelo | PK | Hereda de | Soft-delete |
|---|---|---|---|---|
| `tecnicos` | `Tecnico` | `id_tecnico` | `AbstractBaseUser`, `PermissionsMixin` | No |
| `catalogo_opciones` | `CatalogoOpcion` | `id` (auto) | `Model` | No |
| `cassettes` | `Cassette` | `id_casette` | `RegistroConInforme` | No |
| `muestras` | `Muestra` | `id_muestra` | `MuestraBase` (→`SoftDeleteModel`) | Sí |
| `imagenes` | `Imagen` | `id_imagen` | `ImagenBase` (→`SoftDeleteModel`) | Sí |
| `citologias` | `Citologia` | `id_citologia` | `RegistroConInforme` | No |
| `muestrascitologia` | `MuestraCitologia` | `id` | `MuestraBase` | Sí |
| `imagenescitologia` | `ImagenCitologia` | `id` | `ImagenBase` | Sí |
| `necropsias` | `Necropsia` | `id` | `RegistroConInforme` | No |
| `muestrasnecropsia` | `MuestraNecropsia` | `id` | `MuestraBase` | Sí |
| `imagenesnecropsia` | `ImagenNecropsia` | `id` | `ImagenBase` | Sí |
| `tubos` | `Tubo` | `id` | `RegistroConInforme` | No |
| `muestrastubo` | `MuestraTubo` | `id` | `MuestraBase` | Sí |
| `imagenestubo` | `ImagenTubo` | `id` | `ImagenBase` | Sí |
| `hematologias` | `Hematologia` | `id` | `RegistroConInforme` | No |
| `muestrashematologia` | `MuestraHematologia` | `id` | `MuestraBase` | Sí |
| `imageneshematologia` | `ImagenHematologia` | `id` | `ImagenBase` | Sí |
| `microbiologias` | `Microbiologia` | `id` | `RegistroConInforme` | No |
| `muestrasmicrobiologia` | `MuestraMicrobiologia` | `id` | `MuestraBase` | Sí |
| `imagenesmicrobiologia` | `ImagenMicrobiologia` | `id` | `ImagenBase` | Sí |
| `informesresultado` | `InformeResultado` | `id` | `Model` | No |

### 3.2 Jerarquía de clases abstractas

```
Model
 ├── SoftDeleteModel (is_deleted, SoftDeleteManager)
 │    ├── MuestraBase (descripcion, fecha, tincion, qr_muestra)
 │    │    ├── Muestra
 │    │    ├── MuestraCitologia
 │    │    ├── MuestraNecropsia
 │    │    ├── MuestraTubo
 │    │    ├── MuestraHematologia
 │    │    └── MuestraMicrobiologia
 │    └── ImagenBase (imagen: ImageField)
 │         ├── Imagen
 │         ├── ImagenCitologia
 │         ├── ImagenNecropsia
 │         ├── ImagenTubo
 │         ├── ImagenHematologia
 │         └── ImagenMicrobiologia
 └── DetalleBase (fecha, descripcion, caracteristicas, organo, tecnico FK, volante_peticion)
      └── RegistroBase  [alias de compatibilidad]
           └── RegistroConInforme (informacion_clinica, descripcion_microscopica,
                                   diagnostico_final, patologo_responsable,
                                   informe_descripcion, informe_fecha, informe_tincion,
                                   informe_imagen)
                ├── Cassette  (cassette, qr_casette UNIQUE)
                ├── Citologia (citologia, tipo_citologia, qr_citologia, qr_imagen)
                ├── Necropsia (necropsia, tipo_necropsia, fenomenos_cadavericos,
                │              examen_externo_cadaver, datos_muerte,
                │              prueba_complementaria, qr_necropsia UNIQUE)
                ├── Tubo      (tubo, qr_tubo UNIQUE)
                ├── Hematologia (hematologia, qr_hematologia UNIQUE)
                └── Microbiologia (microbiologia, qr_microbiologia UNIQUE)
```

### 3.3 Diagrama ASCII de entidades y relaciones

```
 Tecnico
 (id_tecnico, nombre, apellidos, email, username, centro, rol, is_staff)
     |
     | 0..N (SET_NULL)
     v
+------------------+  1    N  +------------------+  1    N  +----------+
|    Cassette      |--------->|     Muestra      |--------->|  Imagen  |
| qr_casette UNIQ  |          | qr_muestra       |          | imagen   |
| [RegistroConInf] |          | [MuestraBase]    |          | [soft-del]
+------------------+          | [soft-delete]    |          +----------+
                               +------------------+

+------------------+  1    N  +------------------+  1    N  +------------------+
|    Citologia     |--------->|  MuestraCitologia|--------->| ImagenCitologia  |
| qr_citologia     |          | qr_muestra       |          | imagen           |
| [RegistroConInf] |          | [MuestraBase]    |          | [soft-del]       |
+------------------+          | [soft-delete]    |          +------------------+

+------------------+  1    N  +------------------+  1    N  +------------------+
|    Necropsia     |--------->|  MuestraNecropsia|--------->| ImagenNecropsia  |
| qr_necropsia UNIQ|          | qr_muestra       |          | imagen           |
| [RegistroConInf] |          | [MuestraBase]    |          | [soft-del]       |
+------------------+          | [soft-delete]    |          +------------------+

+------------------+  1    N  +------------------+  1    N  +------------------+
|      Tubo        |--------->|    MuestraTubo   |--------->|    ImagenTubo    |
| qr_tubo UNIQUE   |          | qr_muestra       |          | imagen           |
| [RegistroConInf] |          | [MuestraBase]    |          | [soft-del]       |
+------------------+          | [soft-delete]    |          +------------------+

+------------------+  1    N  +---------------------+  1  N  +--------------------+
|   Hematologia    |--------->| MuestraHematologia  |------->| ImagenHematologia  |
| qr_hematologia   |          | qr_muestra          |        | imagen             |
| [RegistroConInf] |          | [MuestraBase]       |        | [soft-del]         |
+------------------+          | [soft-delete]       |        +--------------------+

+------------------+  1    N  +---------------------+  1  N  +--------------------+
|   Microbiologia  |--------->| MuestraMicrobiologia|------->| ImagenMicrobiologia|
| qr_microbiologia |          | qr_muestra          |        | imagen             |
| [RegistroConInf] |          | [MuestraBase]       |        | [soft-del]         |
+------------------+          | [soft-delete]       |        +--------------------+

+------------------+
| InformeResultado |
| content_type FK  |---------> ContentType (apunta a cualquiera de los 6
| object_id        |           modelos-registro arriba)
| imagen           |
| descripcion      |
| fecha, tincion   |
+------------------+

+------------------+
|  CatalogoOpcion  |   (tipo, valor, categoria, orden, activo)
|  tipos: organo,  |   Usado por formularios para poblar <select>
|  tincion,        |   Sin FK; validación flexible en serializers
|  tipo_citologia, |
|  tipo_autopsia,  |
|  analisis_informe|
+------------------+
```

### 3.4 Soft-delete (`api/models.py:95-143`)

`SoftDeleteModel` añade `is_deleted BooleanField(default=False, db_index=True)`. El manager por defecto (`objects`) filtra `is_deleted=False` automáticamente. Para acceder a todos los registros se usa `all_objects`. La eliminación en cascada de imágenes hijas se gestiona en `_cascade_soft_delete_children()` (`api/models.py:123-131`) y en `_soft_delete_related_images()` en `api/views.py:206-213`.

> **Nota (corrección aplicada):** `_cascade_soft_delete_children` itera `_meta.related_objects` y llama a `relation.get_accessor_name()`, que puede devolver `None`. Se añadió una guarda `if accessor is None: continue` para evitar un `TypeError` silencioso al pasar `None` a `getattr`.

Las tablas de registro principal (Cassette, Citologia, Necropsia, Tubo, Hematologia, Microbiologia) **no tienen soft-delete** — se eliminan físicamente. Solo las sub-muestras (`Muestra*`) e imágenes (`Imagen*`) tienen soft-delete.

### 3.5 InformeResultado — modo dual (`api/views.py:979-984`)

El modelo `InformeResultado` pasó por una refactorización histórica. El código detecta en tiempo de ejecución qué esquema tiene la BD:

- **Modo moderno** (migración 0020+): usa `content_type_id` + `object_id` (GenericForeignKey). Un solo `InformeResultado` puede apuntar a cualquier tipo de registro.
- **Modo legacy**: columnas FK directas (`cassette_id`, `citologia_id`, etc.). El código cae en este modo si la tabla no tiene `content_type_id`.

El método `_modo_generico()` consulta el schema de la tabla `informesresultado` en cada petición. Esto implica una introspección extra por request en los endpoints de informes.

---

## 4. Arquitectura runtime

### 4.1 Diagrama de componentes

```
 Navegador (Windows, intranet del centro)
    |
    | HTTP (localhost o IP local, puerto 8000-8029)
    |
    v
+--------------------------------------------------+
|           Django 6 / DRF 3.16                    |
|                                                  |
|  core/urls.py                                    |
|    /health/        -> JsonResponse               |
|    /admin/         -> Django admin               |
|    /api/           -> api/urls.py (DRF Router)   |
|    /login/ /logout/-> web/views.py               |
|    /cassettes/ ... -> web/views.py               |
|    /bioquimica/ ..-> web/views.py (lab API-driv) |
|    /*.html         -> render_html() login_req    |
|    /css/ /js/ ...  -> serve_static()             |
|    /media/         -> Django static (siempre)    |
|                                                  |
|  Middleware stack (LIFO):                        |
|    CorsMiddleware                                |
|    SecurityMiddleware                            |
|    SessionMiddleware                             |
|    CommonMiddleware                              |
|    CsrfViewMiddleware                            |
|    AuthenticationMiddleware                      |
|    MessageMiddleware                             |
|    XFrameOptionsMiddleware                       |
|    RolAccesoMiddleware  <-- control de acceso    |
+--------------------------------------------------+
    |                    |
    | ORM Django         | FileField / ImageField
    v                    v
+----------+       +------------------+
| SQLite   |       | media/           |
| db.sqlite3|      |   imagenes/      |
| (19 MB   |       |   volantes/      |
|  en prod)|       |   informes/      |
+----------+       |   informes_result|
                   |   qr/            |
                   +------------------+
    |
    | logs/errors.log (RotatingFileHandler 10MB, 5 backups)
    v
+----------+
| logs/    |
+----------+

PHPSanidad (PHP legado, mismo servidor o servidor distinto)
    |
    | HTTP GET/POST con credenciales (cookie de sesión o ID+pwd)
    | Consume: /api/tubos/, /api/microbiologias/, /api/hematologia/,
    |          /api/muestrastubo/, /api/muestrasmicrobiologia/,
    |          /api/muestrashematologia/
    v
  DjangoSanidad API (mismos endpoints que el navegador)
```

### 4.2 Modos de ejecución

**Modo desarrollo:** `python manage.py runserver` inicia el servidor de desarrollo de Django con recarga automática. Adecuado para trabajar localmente.

**Modo portátil:** `DjangoSanidad.exe` (generado por PyInstaller). El ejecutable extrae `launcher_portable.py` y ejecuta `call_command('runserver', ...)` sin recarga (`--noreload`). La BD, los assets y las plantillas se incluyen en el bundle. El proceso abre el navegador automáticamente tras 2 segundos.

**Modo instalación en centro:** Los scripts `.bat` clonan el repo (o descargan el ZIP), crean un virtualenv, instalan dependencias, generan `.env` y arrancan `runserver`. No usan el ejecutable portátil — usan el código fuente directamente.

### 4.3 Sesiones y middleware

Las sesiones se almacenan en la tabla `django_session` de SQLite (backend por defecto). No hay configuración explícita de `SESSION_ENGINE`, por tanto usa `django.contrib.sessions.backends.db`. No hay expiración de sesión configurada explícitamente; usa el valor por defecto de Django (2 semanas). Los flags de cookie (`SESSION_COOKIE_HTTPONLY = True`, `SESSION_COOKIE_SAMESITE = 'Lax'`) están activos en HTTP. HTTPS opcional vía variable `DJANGO_HTTPS=true` (`core/settings.py:201-210`).

---

## 5. Estructura de carpetas comentada

```
DjangoSanidad/
│
├── core/                       Paquete de configuración Django
│   ├── settings.py             Configuración central (BD, auth, CORS, logging, static)
│   ├── urls.py                 Enrutador raíz: registra /api/, /admin/, web.urls, *.html
│   ├── wsgi.py                 Punto de entrada WSGI (no usado en portátil)
│   ├── asgi.py                 Punto de entrada ASGI (no usado)
│   └── error_views.py          Handlers 404/500 personalizados
│
├── api/                        App de la API REST (modelos + endpoints)
│   ├── models.py               Todos los modelos: Tecnico, Cassette, Muestra, Imagen,
│   │                           Citologia, Necropsia, Tubo, Hematologia, Microbiologia,
│   │                           Microbiologia, InformeResultado, CatalogoOpcion + abstractos
│   ├── views.py                ViewSets DRF + proxy_file + generación de QR
│   ├── serializers.py          Serializers (con aliases PHP, validación catálogo, proxy URL)
│   ├── urls.py                 DefaultRouter + ruta proxy_file
│   ├── admin.py                Registro en admin Django (sin personalización, excepto CatalogoOpcion)
│   ├── exceptions.py           Handler de excepciones: normaliza respuestas de error a {error, status_code}
│   ├── apps.py                 AppConfig
│   ├── migrations/             41 migraciones; varias con rama merge por desarrollo paralelo
│   │   ├── 0001_initial.py     Crea las tablas base: cassettes, muestras, imagenes, citologias
│   │   ├── 0004_*              Añade Hematologia, MuestraHematologia, ImagenHematologia
│   │   ├── 0006_*              Microbiologia (rama A) / InformeResultado (rama B) — merge en 0009
│   │   ├── 0014_*              Necropsia, MuestraNecropsia, ImagenNecropsia
│   │   ├── 0018_*              CatalogoOpcion (rama A) / informe_imagen en Cassette (rama B)
│   │   ├── 0020_*              Limpia FK directas de InformeResultado; migra a GenericFK
│   │   ├── 0026_*              Añade is_deleted (soft-delete) a Muestra* e Imagen*
│   │   ├── 0027_*              Añade campo rol a Tecnico
│   │   └── 0037_*              Migra imágenes de BinaryField SQLite a FileField en disco
│   └── management/
│       └── commands/
│           ├── cleanup_orphaned_files.py   Borra archivos en media/ sin referencia en BD
│           ├── rehash_legacy_passwords.py  Rehashea contraseñas en texto plano de registros legacy
│           └── repair_missing_file_references.py  Pone a NULL campos FileField con ruta inexistente
│
├── web/                        App de la UI con plantillas Django
│   ├── views.py                Vistas CRUD completas para todas las entidades + QR resolver
│   ├── urls.py                 55 rutas: login, cassettes, citologias, necropsias,
│   │                           hematologias, usuarios, bioquimica, microbiologia,
│   │                           descargas de volantes e informes
│   ├── forms.py                Formularios ModelForm + Form para todas las entidades;
│   │                           contiene lógica de catálogo y validación de archivos
│   ├── middleware.py           RolAccesoMiddleware: bloquea rutas por rol del usuario
│   ├── models.py               Vacío — la app web no tiene modelos propios
│   ├── admin.py                Sin contenido relevante
│   ├── apps.py                 AppConfig
│   ├── migrations/             Solo __init__.py — sin migraciones propias
│   └── templates/
│       └── web/
│           ├── login.html              Pantalla de autenticación
│           ├── cassettes.html          Lista + detalle cassettes, muestras, imágenes, informes
│           ├── citologias.html         Lista + detalle citologías
│           ├── necropsias.html         Lista + detalle necropsias
│           ├── hematologias.html       Lista + detalle hematologías (template Django)
│           ├── hematologia.html        Vista de laboratorio API-driven
│           ├── bioquimica.html         Vista de laboratorio API-driven (tubos)
│           ├── microbiologia.html      Vista de laboratorio API-driven
│           ├── usuarios.html           Gestión de técnicos (solo staff)
│           ├── 404.html / 500.html     Páginas de error personalizadas
│           ├── _cassette_fields.html   Partial: campos del formulario cassette
│           ├── _citologia_fields.html  Partial: campos citología
│           ├── _hematologia_fields.html Partial: campos hematología
│           └── _necropsia_fields.html  Partial: campos necropsia
│
├── css/ js/ assets/            Estáticos del frontend (sin framework; JS vanilla)
│                               Servidos directamente por Django (ver core/urls.py)
│
├── media/                      Archivos subidos en producción
│   ├── imagenes/               Imágenes microscópicas por tipo de muestra
│   ├── volantes/               Volantes de petición (PDF, DOC, imágenes)
│   ├── informes/               Imágenes de informe de resultado
│   ├── informes_resultado/     Variante de ruta para InformeResultado.imagen
│   └── qr/                     Imágenes QR generadas (uso histórico; actualmente QR es texto)
│
├── logs/                       Logs rotativos (errors.log, máx 10 MB × 5 copias)
│
├── manage.py                   CLI de Django estándar
├── launcher_portable.py        Entrada del ejecutable PyInstaller
├── DjangoSanidadPortable.spec  Spec de PyInstaller para el build
├── build_portable.bat          Construye el ejecutable portátil
├── AUTO_DESCARGAR_E_INICIAR_DJANGOSANIDAD.bat  Instalación desatendida 1-clic
├── INICIAR_DJANGOSANIDAD_WINDOWS.bat           Arranque diario en el centro
├── ELIMINAR_DJANGOSANIDAD_COMPLETAMENTE.bat    Desinstalación limpia
├── requirements.txt            11 dependencias Python (8 de producción + 3 de type-checking:
│                               django-stubs, django-stubs-ext, djangorestframework-stubs)
├── pyrightconfig.json          Configuración de Pyright/Pylance: apunta al venv, Python 3.14,
│                               modo de comprobación básico
├── mypy.ini                    Configuración de mypy con los plugins django y drf;
│                               `django_settings_module = core.settings`
├── .env.example                Plantilla de variables de entorno
├── .env                        Variables activas (en .gitignore)
├── db.sqlite3                  Base de datos de producción (19 MB actualmente)
├── db.sqlite3.bak              Backup manual puntual
├── dump_mapping.csv            Artefacto de la migración 0037: mapa modelo→ruta de archivo
│                               para datos que se extrajeron de BLOBs SQLite a ficheros.
│                               No es operacional; puede eliminarse.
│
├── *.html (raíz)               Páginas del frontend PHP legado (PHPSanidad).
│                               No son plantillas Django; las sirve PHPSanidad o son
│                               prototipos. No editarlas con la lógica de plantillas Django.
│
├── tmp_*.py (raíz)             Scripts de utilidad puntuales de desarrollo:
│   ├── tmp_dump_images.py      Exportaba imágenes de BD a disco (usado en migración 0037)
│   ├── tmp_restore_images.py   Restauraba imágenes a BD desde disco (uso inverso)
│   ├── tmp_test.py             Prueba manual ad-hoc
│   └── tmp_test2.py            Ídem
│                               [verificar con el equipo si se pueden eliminar]
│
├── verify_migration.py         Script de comprobación post-migración (uso puntual)
├── test_volante.py             Script de prueba del volante de petición (uso puntual)
├── dist/                       Ejecutable portátil generado por PyInstaller
├── dist.rar                    Comprimido del ejecutable para distribución (102 MB)
│                               [verificar con el equipo si distribuir por git es intencionado]
└── claude-agents-library-main/ Carpeta ajena al proyecto, coló por error.
                                Añadir a .gitignore o eliminar.
```

---

## 6. Configuración local paso a paso

**Prerequisitos:** Python 3.10+ con pip, Git. Tiempo estimado: 10-15 minutos en primera instalación.

```powershell
# 1. Clonar el repositorio
git clone https://github.com/NoelBallester/DjangoSanidad.git
cd DjangoSanidad

# 2. Crear y activar entorno virtual
python -m venv venv
.\venv\Scripts\Activate.ps1
# Si PowerShell bloquea la ejecución de scripts:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Crear el fichero .env
# (mínimo requerido — settings.py falla sin DJANGO_SECRET_KEY y DJANGO_CORS_ALLOWED_ORIGINS)
@"
DJANGO_SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(50))")
DJANGO_DEBUG=true
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
DJANGO_CORS_ALLOWED_ORIGINS=http://localhost:8000,http://127.0.0.1:8000
"@ | Set-Content .env -Encoding utf8

# 5. Aplicar migraciones y crear superusuario
python manage.py migrate --run-syncdb
python manage.py createsuperuser
# Se pedirá: email (cualquiera), nombre, apellidos, contraseña
# El campo USERNAME_FIELD es id_tecnico (autoincremental); el superusuario tendrá id=1

# 6. Arrancar el servidor
python manage.py runserver
# Abre: http://127.0.0.1:8000/login/
# Admin: http://127.0.0.1:8000/admin/
```

**Nota crítica sobre `.env`:** La variable `DJANGO_CORS_ALLOWED_ORIGINS` es **obligatoria** (`core/settings.py:182-191`). Si falta, Django lanza `ImproperlyConfigured` al arrancar. El `.env.example` la incluye, pero los scripts `.bat` de instalación desatendida la omiten — ver sección 13.

**Variables de entorno disponibles:**

| Variable | Requerida | Por defecto | Descripción |
|---|---|---|---|
| `DJANGO_SECRET_KEY` | Sí | — | Clave de firma de sesiones y CSRF |
| `DJANGO_DEBUG` | No | `false` | Activar modo debug (tracebacks en navegador) |
| `DJANGO_ALLOWED_HOSTS` | No | `localhost,127.0.0.1` | Hosts HTTP aceptados |
| `DJANGO_CORS_ALLOWED_ORIGINS` | Sí | — | Orígenes permitidos para CORS (comma-sep.) |
| `DJANGO_HTTPS` | No | `false` | Activar cabeceras HTTPS (HSTS, Secure cookies) |
| `DJANGO_TIME_ZONE` | No | `Europe/Madrid` | Zona horaria |
| `DJANGO_LOG_LEVEL` | No | `INFO` | Nivel de log de los loggers `api` y `web` |
| `DJANGO_LOG_MAX_BYTES` | No | `10485760` (10 MB) | Tamaño máximo del fichero de log |
| `DJANGO_LOG_BACKUP_COUNT` | No | `5` | Número de copias de log rotadas |

---

## 7. API REST completa

### 7.1 Convenciones generales

- **Prefijo base:** `/api/`
- **Autenticación:** sesión Django (`SessionAuthentication`). Todas las rutas requieren `IsAuthenticated` excepto `POST /api/tecnicos/login/` y `GET /health/`.
- **Formato de respuesta:** JSON.
- **Paginación:** `PageNumberPagination`, 50 elementos por página en listados estándar (`GET /api/<recurso>/`). Los actions `todos` también paginan. El action `index` devuelve los primeros 10 sin paginación.
- **Errores normalizados:** el handler `custom_exception_handler` (`api/exceptions.py`) transforma todas las excepciones a `{"error": "...", "status_code": N}`. Las excepciones no manejadas se loguean y devuelven 500.
- **Eliminación:** usa soft-delete en modelos que lo soportan; elimina en cascada imágenes hijas. Los registros de tipo registro-principal (Cassette, Citologia, etc.) se eliminan físicamente.
- **QR auto-generado:** si no se envía el campo QR en `create`, el servidor lo genera con `generar_qr_unico()` garantizando unicidad frente a la BD.

### 7.2 Endpoints

#### Autenticación / Técnicos

| Método | Ruta | Permiso | Body | Respuesta exitosa | Códigos error |
|---|---|---|---|---|---|
| `POST` | `/api/tecnicos/login/` | `AllowAny` | `{tecnico_id, password}` | `{id_tecnico, nombre, apellidos, email, centro}` + cookie sesión | 401 credenciales inválidas |
| `GET` | `/api/tecnicos/me/` | Autenticado | — | Datos del técnico autenticado | 401 |
| `GET` | `/api/tecnicos/` | Autenticado | — | Lista de técnicos paginada | 401 |
| `GET` | `/api/tecnicos/<id>/` | Autenticado | — | Técnico por ID | 404 |
| `PUT/PATCH` | `/api/tecnicos/<id>/` | Autenticado | Campos del técnico | Técnico actualizado | 400, 404 |
| `DELETE` | `/api/tecnicos/<id>/` | Autenticado | — | 204 | 404 |
| `GET` | `/api/tecnicos/mail/<mail>/` | Autenticado + is_staff | — | Técnico por email | 403, 404 |

#### Cassettes (Anatomía Patológica)

| Método | Ruta | Permiso | Body / Params | Respuesta | Códigos error |
|---|---|---|---|---|---|
| `GET` | `/api/cassettes/` | Autenticado | — | Lista paginada (defer volante, informe_imagen) | 401 |
| `POST` | `/api/cassettes/` | Autenticado | Campos cassette; `qr_casette` auto-generado si ausente | Cassette creado | 400 |
| `GET` | `/api/cassettes/<id>/` | Autenticado | — | Cassette completo | 404 |
| `PUT/PATCH` | `/api/cassettes/<id>/` | Autenticado | Campos a actualizar | Cassette actualizado | 400, 404 |
| `DELETE` | `/api/cassettes/<id>/` | Autenticado | — | 204 (hard delete) | 404 |
| `GET` | `/api/cassettes/qr/<qr>/` | Autenticado | — | Lista cassettes con ese QR | — |
| `GET` | `/api/cassettes/organo/<organo>/` | Autenticado | `organo=*` devuelve todos | Lista filtrada por órgano | — |
| `GET` | `/api/cassettes/numero/<numero>/` | Autenticado | — | Lista filtrada por número | — |
| `GET` | `/api/cassettes/fecha/<fecha>/` | Autenticado | Fecha en formato ISO | Lista del día | — |
| `GET` | `/api/cassettes/index/` | Autenticado | — | Primeros 10 | — |
| `GET` | `/api/cassettes/todos/` | Autenticado | — | Todos, paginados | — |
| `GET` | `/api/cassettes/rango_fechas/` | Autenticado | `?inicio=&fin=` | Filtrado por rango | 400 si falta param |
| `POST` | `/api/cassettes/<id>/actualizar_informe/` | Autenticado | `{informe_descripcion, informe_fecha, informe_tincion, informe_observaciones, informe_imagen?}` | Cassette actualizado | 404 |

#### Muestras de Cassette

| Método | Ruta | Body | Notas |
|---|---|---|---|
| `GET/POST` | `/api/muestras/` | Campos muestra; `qr_muestra` auto-generado | POST requiere `cassette` (FK) |
| `GET/PUT/PATCH/DELETE` | `/api/muestras/<id>/` | — | DELETE: soft-delete + soft-delete imágenes hijas |
| `GET` | `/api/muestras/cassette/<id>/` | — | Todas las muestras de un cassette |
| `GET` | `/api/muestras/qr/<qr>/` | — | Búsqueda por QR |

#### Imágenes de Muestra (Cassette)

| Método | Ruta | Notas |
|---|---|---|
| `POST` | `/api/imagenes/` | `multipart/form-data`: campo `imagen` (archivo) + `muestra` (int). Valida extensión, magic bytes y tamaño ≤20 MB |
| `GET/DELETE` | `/api/imagenes/<id>/` | DELETE: soft-delete |
| `GET` | `/api/imagenes/muestra/<id>/` | Imágenes de una muestra |

Los mismos patrones aplican para **Citologías**, **Necropsias**, **Tubos** (Bioquímica), **Hematología** y **Microbiología**. Tabla de prefijos QR y rutas:

| Dominio | Registro | Ruta base | QR prefix | Sub-muestra | Imagen |
|---|---|---|---|---|---|
| Anatomía | Cassette | `/api/cassettes/` | `--c--` | `/api/muestras/` (→`--m--`) | `/api/imagenes/` |
| Anatomía | Citologia | `/api/citologias/` | `--cit--` | `/api/muestrascitologia/` (→`--mc--`) | `/api/imagenescitologia/` |
| Anatomía | Necropsia | `/api/necropsias/` | `--nec--` | `/api/muestrasnecropsia/` (→`--mn--`) | `/api/imagenesnecropsia/` |
| Laboratorio | Tubo | `/api/tubos/` | `--t--` | `/api/muestrastubo/` (→`--mt--`) | `/api/imagenestubo/` |
| Laboratorio | Hematologia | `/api/hematologia/` | `--h--` | `/api/muestrashematologia/` (→`--mh--`) | `/api/imageneshematologia/` |
| Laboratorio | Microbiologia | `/api/microbiologias/` | `--mb--` | `/api/muestrasmicrobiologia/` (→`--mmb--`) | `/api/imagenesmicrobiologia/` |

#### Informes de resultado

| Método | Ruta | Body | Notas |
|---|---|---|---|
| `GET` | `/api/informesresultado/` | — | Lista todos |
| `POST` | `/api/informesresultado/` | `{descripcion, fecha, tincion, observaciones, imagen?, <tipo>_id}` donde `<tipo>` es uno de: `cassette`, `citologia`, `necropsia`, `tubo`, `hematologia`, `microbiologia` | Exactamente un campo tipo requerido |
| `GET/PUT/PATCH` | `/api/informesresultado/<id>/` | — | |
| `GET` | `/api/informesresultado/cassette/<id>/` | — | Informes de un cassette |
| `GET` | `/api/informesresultado/citologia/<id>/` | — | Ídem citología |
| `GET` | `/api/informesresultado/necropsia/<id>/` | — | Ídem necropsia |
| `GET` | `/api/informesresultado/tubo/<id>/` | — | Ídem tubo |
| `GET` | `/api/informesresultado/hematologia/<id>/` | — | Ídem hematología |
| `GET` | `/api/informesresultado/microbiologia/<id>/` | — | Ídem microbiología |

#### Proxy de archivos y salud

| Método | Ruta | Permiso | Notas |
|---|---|---|---|
| `GET` | `/api/archivo/<model_name>/<pk>/<field_name>/` | Autenticado + rol permitido | Sirve archivos desde FileField. Verifica rol por `_ROLES_POR_MODELO` (`api/views.py:48-61`). Cabeceras: `X-Content-Type-Options: nosniff`, `Cache-Control: no-store`, `X-Frame-Options: DENY` |
| `GET` | `/health/` | Sin autenticación | `{"status": "ok"}` para monitoreo |

#### Catálogo de opciones

No hay ViewSet registrado para `CatalogoOpcion`. El catálogo se gestiona exclusivamente a través del admin de Django (`/admin/`) o con migraciones de datos (0019_seed_catalogoopcion).

### 7.3 Formato de respuesta de error

Toda respuesta de error tiene esta forma (`api/exceptions.py`):

```json
{"error": "Mensaje legible", "status_code": 400}
```

En errores de validación con campos múltiples:

```json
{"error": "Solicitud no procesable.", "details": {"campo": ["mensaje"]}, "status_code": 422}
```

---

## 8. Modelo de permisos y roles

### 8.1 Roles definidos (`api/models.py:161-169`)

| Rol | Constante | `is_staff` | Descripción |
|---|---|---|---|
| `profesor` | `Tecnico.ROL_PROFESOR` | `True` (forzado en `web/views.py:1408`) | Acceso completo. Equivale a administrador funcional. |
| `anatomia_patologica` | `Tecnico.ROL_ANATOMIA` | `False` | Acceso a cassettes, citologías y necropsias únicamente. |
| `laboratorio` | `Tecnico.ROL_LABORATORIO` | `False` | Acceso a hematología, microbiología y bioquímica (tubos) únicamente. |

### 8.2 Dónde se aplica el control

**Nivel middleware — UI web** (`web/middleware.py:47-89`):

`RolAccesoMiddleware.process_view()` intercepta cada petición autenticada antes de que llegue a la vista. Comprueba el `url_name` resuelto contra dos conjuntos:

- `_URLS_ANATOMIA` (cassettes, citologías, necropsias y sus sub-recursos) — solo accesible a `anatomia_patologica`.
- `_URLS_LABORATORIO` (hematologías, bioquímica, microbiología) — solo accesible a `laboratorio`.

Páginas `.html` genéricas también se filtran por `_PAGES_ANATOMIA` y `_PAGES_LABORATORIO`. Los usuarios con `is_staff = True` o rol `profesor` pasan sin comprobación.

**Nivel vista — proxy de archivos** (`api/views.py:153-188`):

`proxy_file()` usa `_ROLES_POR_MODELO` para verificar que el rol del usuario tiene permiso de ver archivos del modelo concreto. Staff omite esta comprobación. Devuelve 404 (no 403) para no revelar si el recurso existe.

**Nivel vista — gestión de usuarios** (`web/views.py:1396-1516`):

Las vistas `usuario_create`, `usuario_update`, `usuario_delete` y `usuario_bulk_delete` comprueban `request.user.is_staff` explícitamente. No basta con el middleware.

**API REST:**

No hay permisos diferenciados por rol en los ViewSets de la API. Cualquier usuario autenticado puede acceder a todos los endpoints REST. El control de acceso a la API depende de que el frontend no exponga los endpoints del dominio contrario. [Verificar con el equipo si es intencional o si hay planes de añadir permisos por rol en la API].

### 8.3 Matriz de permisos

| Sección | profesor | anatomia_patologica | laboratorio |
|---|---|---|---|
| Cassettes | ✓ | ✓ | ✗ |
| Citologías | ✓ | ✓ | ✗ |
| Necropsias | ✓ | ✓ | ✗ |
| Hematologías | ✓ | ✗ | ✓ |
| Bioquímica (tubos) | ✓ | ✗ | ✓ |
| Microbiología | ✓ | ✗ | ✓ |
| Gestión de usuarios | ✓ | ✗ | ✗ |
| Admin Django | ✓ | ✗ | ✗ |
| Todos los endpoints API | ✓ | ✓ | ✓ |

### 8.4 Admin Django (`api/admin.py`)

Registrados sin personalización: `Tecnico`, `Cassette`, `Muestra`, `Imagen`, `Citologia`, `MuestraCitologia`, `ImagenCitologia`, `Hematologia`, `MuestraHematologia`, `ImagenHematologia`, `Tubo`, `MuestraTubo`, `ImagenTubo`.

`CatalogoOpcion` tiene `ModelAdmin` personalizado con filtros por `tipo`, `activo`, `categoria` y búsqueda por `valor`.

`Necropsia`, `MuestraNecropsia`, `ImagenNecropsia`, `Microbiologia`, `MuestraMicrobiologia`, `ImagenMicrobiologia`, `InformeResultado` **no están registrados** en el admin.

---

## 9. Flujos críticos

### 9.1 Alta de muestra de cassette + generación de QR

**Vía UI web:**

1. Usuario hace POST a `POST /cassettes/<cassette_pk>/muestras/crear/` (`web/urls.py:16`).
2. `muestra_create()` (`web/views.py:573`) construye `MuestraForm` con los datos POST.
3. Si `descripcion` está vacío, usa `numero_bloque` o `descripcion_macroscopica` como fallback (`web/views.py:579-582`).
4. Si `fecha` está vacía, usa `timezone.localdate()` (`web/views.py:584-585`).
5. El form valida; en `MuestraForm.save()` (`web/forms.py:352-359`), si `qr_muestra` está vacío, genera `_qr('--m--')` con `secrets.choice` (12 caracteres alfanuméricos).
6. Si hay `imagen` adjunta, crea `Imagen(muestra=muestra, imagen=archivo_imagen.read())` — guarda bytes en el campo antes de que el `save()` de `ImagenBase` los convierta a archivo en disco.
7. Redirige a `/cassettes/?cassette=<id>&muestra=<id>`.

**Vía API REST:**

1. Cliente hace `POST /api/muestras/` con `{cassette: id, descripcion, fecha, tincion, ...}`.
2. `MuestraViewSet.create()` (`api/views.py:445`) detecta que `qr_muestra` está ausente.
3. Llama a `generar_qr_unico('--m--', Muestra, 'qr_muestra')` (`api/views.py:196-203`): genera `--m--` + 12 hex chars via `uuid4().hex[:12]`, verifica colisión en BD hasta 50 intentos.
4. Serializa y guarda. Respuesta 201 con el objeto completo.

**Diferencia entre UI y API:** La UI usa `secrets.choice` (alfanumérico, más legible); la API usa `uuid4().hex[:12]` (hexadecimal). Ambos tienen 12 caracteres de entropía suficiente para el contexto.

### 9.2 Resolución de QR desde dispositivo externo

1. El dispositivo (tablet, móvil con cámara) escanea el QR, que contiene la URL `http://<host>:<puerto>/qr/resolver/?code=<codigo>`.
2. La petición llega a `qr_resolver()` (`web/views.py:759`).
3. Si el `code` es una URL completa (el usuario escaneó un QR que ya contenía la URL de resolución), se extrae el parámetro `code` del query string (`web/views.py:768-775`).
4. La función busca el código en este orden: Cassette → Citologia → Necropsia → Muestra (cassette) → MuestraCitologia → MuestraNecropsia → Hematologia → MuestraHematologia → Tubo → MuestraTubo → Microbiologia → MuestraMicrobiologia.
5. Si encuentra coincidencia, redirige a la vista correspondiente con el ID en el query string (p. ej. `/cassettes/?cassette=5`).
6. Si no encuentra nada, redirige a `/cassettes/` con mensaje de error via `messages`.

**Requisito:** el dispositivo debe estar autenticado (cookie de sesión activa). Si no lo está, Django redirige a `/login/?next=/qr/resolver/?code=...`.

### 9.3 Subida de imagen y almacenamiento en disco

1. Cliente envía `POST /api/imagenes/` con `multipart/form-data`: campo `imagen` (archivo) + campo `muestra` (int).
2. `ImagenViewSet.create()` (`api/views.py:520`) llama a `_validar_imagen_api(imagen_file)` (`api/views.py:90-114`):
   - Verifica extensión contra `_EXTENSIONES_IMAGEN_PERMITIDAS` (jpg, jpeg, png, gif, bmp, webp, tif, tiff).
   - Verifica tamaño ≤ 20 MB.
   - Lee 16 bytes de cabecera y verifica magic bytes (JPEG, PNG, GIF, BMP, WebP, TIFF).
3. Crea `Imagen(imagen=imagen_file.read(), muestra_id=muestra_id)`.
4. En `Imagen.save()` (heredado de `ImagenBase`, `api/models.py:316-324`): detecta si `imagen` es bytes (legacy) y llama a `_coerce_filefield_bytes()` (`api/models.py:76-92`), que genera un nombre de fichero UUID y guarda el contenido en `media/imagenes/<tipo>/<uuid>.ext`.
5. La función `upload_imagen_muestra()` (`api/models.py:26-47`) determina la subcarpeta (`cassettes`, `citologias`, `necropsias`, `tubos`, `hematologia`, `microbiologia`) según el modelo de la muestra asociada.

**Resultado:** el campo `imagen` en la BD almacena una **ruta relativa** (`imagenes/cassettes/abc123.jpg`), no bytes. La imagen se sirve via `proxy_file()` que abre el fichero y lo devuelve como `FileResponse`.

### 9.4 Login y sesión

1. Usuario abre `/login/`, `login_view()` (`web/views.py:234`).
2. Si ya autenticado, redirige a `/index.html`.
3. En POST: extrae `tecnico_id` (entero) y `password` del form.
4. Llama a `authenticate(request, id_tecnico=tecnico_id, password=password)`. Django usa el backend por defecto (`ModelBackend`) que busca `Tecnico.objects.get(id_tecnico=tecnico_id)` y verifica el hash de contraseña con `check_password()`.
5. Si válido, llama a `login(request, user)` que crea la sesión en `django_session` y establece la cookie `sessionid`.
6. Redirige a `next` (si es seguro) o a `/index.html`.
7. La sesión expira según el valor por defecto de Django (2 semanas), sin configuración explícita en el proyecto.
8. Logout: `POST /logout/` con token CSRF válido → `logout(request)` destruye la sesión → redirige a `/login/`.

**Nota:** No hay `SESSION_COOKIE_AGE` configurado. La sesión dura 2 semanas (1 209 600 segundos, valor Django por defecto). No hay endpoint de refresco de token porque no se usa JWT.

### 9.5 Soft-delete de una sub-muestra

1. POST a `/muestras/<id>/eliminar/` → `muestra_delete()` (`web/views.py:622`).
2. `get_object_or_404(Muestra, pk=pk)` — solo encuentra objetos con `is_deleted=False` porque `SoftDeleteManager` filtra automáticamente.
3. `muestra.delete()` → `SoftDeleteModel.delete()` (`api/models.py:133`):
   - Llama a `_cascade_soft_delete_children()` que pone `is_deleted=True` en todos los `Imagen` hijos.
   - Pone `is_deleted=True` en la propia muestra y llama a `save(update_fields=['is_deleted'])`.
4. Los registros quedan en BD. Para eliminarlos físicamente: `muestra.hard_delete()` o `Muestra.all_objects.filter(...).hard_delete()`.

---

## 10. Despliegue

### 10.1 Modo a) Desarrollo local

Ya descrito en sección 6. Usar `python manage.py runserver 0.0.0.0:8000` para acceso desde otros dispositivos de la misma red.

### 10.2 Modo b) Build del ejecutable portátil

El ejecutable empaqueta Django, el código de la app, los templates y la BD vacía en una carpeta distribuible.

```bat
REM Prerrequisito: venv activo con requirements.txt instalado
REM (build_portable.bat lo activa si existe)

.\build_portable.bat
```

**Lo que hace `build_portable.bat` paso a paso:**

| Línea | Acción |
|---|---|
| `call venv\Scripts\activate.bat` | Activa el virtualenv si existe |
| `python -m PyInstaller --version` | Verifica PyInstaller; instala si falta |
| `rmdir build\DjangoSanidad` | Limpia build anterior |
| `python -m PyInstaller DjangoSanidadPortable.spec --clean -y` | Construye usando el `.spec` |

**`DjangoSanidadPortable.spec` — puntos clave:**

- `Analysis(['launcher_portable.py'], ...)` — el ejecutable entra por `launcher_portable.py`.
- `datas` incluye: `core/`, `api/`, `web/`, `css/`, `js/`, `assets/`, `media/`, `*.html` (raíz), `db.sqlite3`.
- `hiddenimports` cubre todos los submódulos de Django, DRF, CORS, pymysql, qrcode, PIL.
- `excludes`: `tkinter`, `matplotlib`, `numpy`, `pandas`, `scipy` (reducen tamaño).
- `upx=True`: compresión UPX del ejecutable.
- Genera `dist/DjangoSanidad/DjangoSanidad.exe` (modo consola, no windowed).

**`launcher_portable.py` — lo que hace al arrancar:**

1. `get_base_dir()`: detecta si corre como `.exe` o como `.py` y obtiene el directorio correcto.
2. Añade `base_dir` a `sys.path`.
3. `setup_env()`: si no existe `.env`, crea uno con `SECRET_KEY` aleatoria + `DJANGO_CORS_ALLOWED_ORIGINS` para `localhost:8000`. Si existe, lo carga en `os.environ` sin sobreescribir variables ya presentes.
4. Crea `logs/` y `media/` si no existen.
5. `find_free_port(8000)`: intenta ligar cada puerto desde 8000 hasta 8019.
6. Si el puerto no es 8000, añade las variantes al listado de `DJANGO_CORS_ALLOWED_ORIGINS`.
7. `django.setup()` y `call_command('migrate', '--run-syncdb')` — aplica migraciones en cada arranque.
8. Abre el navegador en un thread daemon (espera 2 segundos).
9. `call_command('runserver', '0.0.0.0:<puerto>', '--noreload')`.

**Distribución:** comprimir la carpeta `dist/DjangoSanidad/` en un `.rar` o `.zip` y enviársela al centro. El usuario solo hace doble clic en `DjangoSanidad.exe`.

### 10.3 Modo c) Instalación desatendida en centro (`AUTO_DESCARGAR_E_INICIAR_DJANGOSANIDAD.bat`)

Este script está diseñado para ser enviado al responsable TI del centro y ejecutado con doble clic en un PC sin ningún prerrequisito.

**Paso a paso:**

| Fase | Qué hace |
|---|---|
| 1. Comprueba PowerShell | `where powershell` — indispensable para la descarga ZIP |
| 2. Detecta si el proyecto ya existe | Busca `manage.py` en `.\DjangoSanidad\` |
| 3. Si no existe → `:download_project` | Intenta `git clone --depth 1` primero. Si git no está: descarga el ZIP desde GitHub con `Invoke-WebRequest`, descomprime con `Expand-Archive`, mueve la carpeta. Usa archivos temp en `%TEMP%` con nombre aleatorio. |
| 4. Detecta Python → `:detect_python` | Prueba `py -3` (Python Launcher) y luego `python`. Si ninguno: instala Python 3.12 vía `winget install Python.Python.3.12`. |
| 5. Crea virtualenv | `python -m venv venv` (solo si no existe) |
| 6. Activa venv | `call venv\Scripts\activate.bat` |
| 7. Actualiza pip/setuptools/wheel | `pip install --upgrade pip setuptools wheel` |
| 8. Instala dependencias | `pip install -r requirements.txt` |
| 9. Crea `.env` si no existe | Genera `SECRET_KEY` con `secrets.token_urlsafe(50)`. **No incluye `DJANGO_CORS_ALLOWED_ORIGINS`** — fallo conocido; el servidor arrancará si la migración 0037 ya pasó pero lanzará `ImproperlyConfigured` al inicio. Ver sección 13. |
| 10. Crea `logs/` y `media/` | `mkdir` si no existen |
| 11. Aplica migraciones | `python manage.py migrate --run-syncdb --noinput` |
| 12. Busca puerto libre → `:find_port` | Comprueba desde 8000 hasta 8029 con `netstat` |
| 13. Abre navegador | `start "" "http://127.0.0.1:<puerto>/"` tras 3 segundos |
| 14. Arranca Django | `python manage.py runserver 0.0.0.0:<puerto> --noreload` |
| 15. Al cerrar | Borra `deployment_log.txt` |

### 10.4 `INICIAR_DJANGOSANIDAD_WINDOWS.bat` — arranque diario

Equivalente simplificado del auto-descargar. Hace los mismos pasos 4-14 pero **asume que el proyecto ya está en la misma carpeta** (verifica `manage.py` al inicio). Es el script que el técnico del centro usa cada día.

Diferencias con AUTO_DESCARGAR:
- No descarga el proyecto (no tiene `:download_project`).
- Muestra la salida de todos los comandos en la consola (sin `>> log`).
- La apertura del navegador se hace en una cmd separada con `timeout /t 3`.

### 10.5 `ELIMINAR_DJANGOSANIDAD_COMPLETAMENTE.bat` — desinstalación

Pide confirmación escribiendo "SI" en mayúsculas. Luego:
- Mata procesos `python.exe` con título `DjangoSanidad*` (`taskkill /IM python.exe /F /FI`).
- Elimina `.\DjangoSanidad\` y `.\DjangoSanidad-main\` (variante ZIP).
- Elimina `.\venv\`.
- Limpia `%APPDATA%\Python\` (subdirectorios).
- Limpia temporales `%TEMP%\djangosanidad_*`.
- Borra un fichero de historial de Explorer (`AutomaticDestinations`).

**No elimina**: la BD `db.sqlite3` si está fuera del directorio del proyecto. Tampoco elimina Python del sistema.

---

## 11. Operación y mantenimiento

### 11.1 Backup de `db.sqlite3`

SQLite es un fichero único. El backup más simple es copiar el fichero mientras el servidor está parado.

```powershell
# Parar el servidor (cerrar la ventana de cmd o matar el proceso)
# Luego:
Copy-Item db.sqlite3 "db.sqlite3.bak_$(Get-Date -Format 'yyyyMMdd_HHmm')"
```

Con el servidor en marcha, SQLite puede corromperse si se copia en mitad de una escritura. La forma segura es usar la API de backup de SQLite:

```python
# Ejecutar en una consola Python con el venv activo
import sqlite3
src = sqlite3.connect('db.sqlite3')
dst = sqlite3.connect('db.sqlite3.backup')
src.backup(dst)
dst.close()
src.close()
```

O con el comando de administración de Django:

```powershell
python manage.py dumpdata --natural-foreign --natural-primary -e contenttypes -e auth.Permission --indent 2 > backup_$(Get-Date -Format 'yyyyMMdd').json
```

**Recuperación:**

```powershell
python manage.py migrate  # asegúrate de que el schema es correcto
python manage.py loaddata backup_20260501.json
```

### 11.2 Logs

El fichero de log está en `logs/errors.log`. Configuración (`core/settings.py:219-266`):
- Solo errores (`level: ERROR`) van al fichero. INFO y DEBUG solo a consola.
- Rotación: máximo 10 MB, 5 copias (configurable con `DJANGO_LOG_MAX_BYTES` y `DJANGO_LOG_BACKUP_COUNT`).
- Las copias se nombran `errors.log.1`, `errors.log.2`, etc.

```powershell
# Ver los últimos 100 errores
Get-Content logs\errors.log -Tail 100

# Buscar errores de un módulo concreto
Select-String -Path logs\errors.log -Pattern "api:"
```

### 11.3 Comandos de gestión custom

**`cleanup_orphaned_files`** — borra ficheros en `media/` sin referencia en BD:

```powershell
# Ver qué borraría sin borrar nada
python manage.py cleanup_orphaned_files --dry-run

# Ejecutar limpieza real
python manage.py cleanup_orphaned_files
```

**`rehash_legacy_passwords`** — rehasheaba contraseñas en texto plano de importaciones desde PHPSanidad:

```powershell
# Diagnóstico (no modifica nada)
python manage.py rehash_legacy_passwords --dry-run

# Aplicar
python manage.py rehash_legacy_passwords --apply
```

Usar este comando si al importar usuarios desde PHPSanidad las contraseñas quedaron en texto plano (sin el prefijo `pbkdf2_sha256$` de Django).

**`repair_missing_file_references`** — pone a NULL los `FileField`/`ImageField` de registros cuyo fichero referenciado no existe en disco:

```powershell
# Diagnóstico
python manage.py repair_missing_file_references --dry-run

# Aplicar
python manage.py repair_missing_file_references
```

Útil tras mover `media/` o restaurar una BD de otro entorno.

### 11.4 Actualización de la app en producción

```powershell
# 1. Hacer backup de la BD primero (ver 11.1)
Copy-Item db.sqlite3 "db.sqlite3.bak_$(Get-Date -Format 'yyyyMMdd_HHmm')"

# 2. Parar el servidor (cerrar la ventana del proceso)

# 3. Actualizar el código
git pull origin main

# 4. Instalar nuevas dependencias si las hay
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# 5. Aplicar migraciones
python manage.py migrate --run-syncdb

# 6. Arrancar
python manage.py runserver 0.0.0.0:8000 --noreload
```

Para el ejecutable portátil, el proceso es rebuildar (`build_portable.bat`) y redistribuir el `.rar` al centro. La BD del centro **no va incluida** en la redistribución — el centro mantiene su `db.sqlite3`.

### 11.5 Rollback

Si una actualización deja el sistema inestable:

```powershell
# Volver al commit anterior
git log --oneline -10   # identificar el commit anterior
git checkout <commit_hash>

# Si hubo migraciones nuevas, hacer rollback de la última
python manage.py migrate api <numero_migracion_anterior>
# Ejemplo: volver antes de la migración 0041
python manage.py migrate api 0040

# Restaurar la BD si es necesario (solo si se guardó backup antes)
Copy-Item db.sqlite3.bak_20260501_1430 db.sqlite3
```

**Advertencia:** el rollback de migraciones que eliminan columnas (`RemoveField`) puede no ser posible de forma automática en SQLite — Django genera un `--fake` necesario en algunos casos. Verificar cada migración antes de hacer rollback.

---

## 12. Compatibilidad con PHPSanidad

### 12.1 Endpoints que sirve al legado

PHPSanidad consume datos del módulo de laboratorio a través de la API REST de Django. Los endpoints utilizados son los estándar del DRF Router; no hay endpoints exclusivos para el legado. Los que usa son, principalmente:

- `GET /api/tubos/` y acciones de filtro (bioquímica)
- `GET /api/microbiologias/` (microbiología)
- `GET /api/hematologia/` (hematología)
- `GET /api/muestrastubo/`, `/api/muestrasmicrobiologia/`, `/api/muestrashematologia/`
- `POST` para crear registros desde el PHP

La autenticación es por sesión: PHPSanidad debe hacer primero `POST /api/tecnicos/login/` con `{tecnico_id, password}` y guardar la cookie `sessionid`.

### 12.2 Aliases de campos

Los serializers de `Tubo` y `Microbiologia` exponen aliases para que PHPSanidad no necesite cambiar su código de cliente:

**`TuboSerializer`** (`api/serializers.py:260-286`):

| Campo Django | Alias expuesto | Descripción |
|---|---|---|
| `id_tubo` | `id_muestra` | Compatibilidad con nomenclatura PHP |
| `tubo` | `muestra` | Número de muestra |
| `organo` | `tipo_muestra` | Tipo/localización |

**`MicrobiologiaSerializer`** (`api/serializers.py:401-428`):

| Campo Django | Alias expuesto | Descripción |
|---|---|---|
| `id_microbiologia` | `id_muestra` | Compatibilidad |
| `microbiologia` | `muestra` | Número de muestra |
| `organo` | `tipo_muestra` | Tipo |

Estos aliases son campos `SerializerMethodField` o `serializers.IntegerField(source=...)`, es decir, son solo de lectura en algunos casos. El campo real siempre está disponible también.

### 12.3 `dump_mapping.csv`

Este fichero no es un mapeo de aliases. Es un artefacto de la migración 0037 (`0037_migrate_binary_to_files`) que documentaba qué registros tenían datos binarios en la BD y a qué ruta de fichero se exportaron. No tiene uso operacional actual. Se puede eliminar del repositorio.

### 12.4 Estrategia de convivencia y apagado del PHP

Actualmente PHPSanidad sirve las páginas del frontend de laboratorio (los ficheros `.html` en la raíz del repo). DjangoSanidad les proporciona los datos vía API.

Cuando PHPSanidad se apague:
- Los datos de laboratorio siguen accesibles via la UI de Django en `/hematologia/`, `/bioquimica/` y `/microbiologia/`.
- Los `.html` de la raíz del repo dejarán de servirse (no tienen ruta Django activa excepto la regex genérica `/*.html` protegida por login).
- No se necesitan cambios en el código de Django para completar la transición.

---

## 13. Deuda técnica y riesgos conocidos

| # | Riesgo | Severidad | Descripción | Esfuerzo estimado |
|---|---|---|---|---|
| 1 | SQLite concurrencia | **Alta** | SQLite usa bloqueo a nivel de fichero. Con >5 usuarios concurrentes escribiendo simultáneamente pueden producirse errores `OperationalError: database is locked`. Aceptable para una sola aula; inaceptable si se añaden más centros o módulos online. | Migración a MySQL: 1-2 días |
| 2 | `DJANGO_CORS_ALLOWED_ORIGINS` ausente en `.bat` | **Alta** | `AUTO_DESCARGAR.bat` e `INICIAR.bat` crean un `.env` sin `DJANGO_CORS_ALLOWED_ORIGINS`. Django lanza `ImproperlyConfigured` al arrancar. El `launcher_portable.py` sí lo establece correctamente. Fix: añadir la línea al bloque de creación del `.env` en ambos `.bat`. | 5 minutos |
| 3 | ~~Sin tests automáticos~~ | ~~**Alta**~~ **Resuelto** | 217 tests automáticos en `api/tests.py` y `web/tests.py` cubriendo seguridad, validación de imágenes, control de acceso por rol, helpers, serializers y flujos CRUD. Pendiente: integrar la ejecución en CI (ver §14.5). | — |
| 4 | `runserver` en producción | **Alta** | El servidor de desarrollo Django no está diseñado para producción: no soporta múltiples workers, no gestiona keepalive adecuadamente, sin compresión gzip. Para un aula de 10 alumnos es tolerable; para uso simultáneo desde múltiples aulas, no. | 1-2 días (Waitress + script de arranque) |
| 5 | `SECRET_KEY` generada por `.bat` sin `CORS` | **Media** | Relacionado con el riesgo 2. Si el usuario usa el `.bat` y Django no arranca, puede no saber por qué. | Fix junto con riesgo 2 |
| 6 | Migraciones con numeración duplicada | **Media** | Hay 7 pares de migraciones con el mismo número (`0006_*`, `0007_*`, `0018_*`, `0030_*` etc.) resueltos con `merge_*`. En BD nueva funcionan bien, pero el historial hace difícil el rollback selectivo. | Squash de migraciones: 1 día |
| 7 | `dist.rar` (102 MB) en el repo | **Media** | Los ejecutables binarios en Git saturan el historial. GitHub limita ficheros >100 MB. Si se sube una nueva versión, el `.rar` anterior sigue en el historial. | Mover a GitHub Releases o carpeta compartida: 1 hora |
| 8 | Ausencia de límite de intentos de login | **Media** | No hay rate limiting en `POST /api/tecnicos/login/` ni en la vista web. Un atacante puede hacer fuerza bruta sin restricción. | django-axes o throttle de DRF: 2-4 horas |
| 9 | `InformeResultado._modo_generico()` en cada request | **Baja** | La introspección del schema en cada petición a endpoints de informes añade una query extra. En SQLite local el coste es despreciable, pero es un patrón a eliminar cuando se haga el squash de migraciones. | 2-4 horas |
| 10 | Archivos `tmp_*.py` y `claude-agents-library-main/` en el repo | **Baja** | Código de desarrollo puntual y una biblioteca ajena mezclados con el proyecto. Confunden a nuevos desarrolladores. | 30 minutos |
| 11 | Gestión de usuarios via SQL directo | **Baja** | `web/views.py:1532` usa SQL crudo para resetear la secuencia de IDs de SQLite (`UPDATE sqlite_sequence`). No portable a MySQL sin modificación. | Reemplazar por señal post_delete: 2-3 horas |
| 12 | Roles no aplicados en API REST | **Baja** | Un usuario con rol `laboratorio` puede leer y crear cassettes de anatomía si accede directamente a la API. Solo el middleware web aplica control de acceso. | Añadir permisos DRF por rol: 4-8 horas |
| 13 | `db.sqlite3` incluida en el bundle PyInstaller | **Baja** | La BD vacía se incluye en el `.spec` (`db.sqlite3`). Si se rebuilda con una BD de producción, los datos van en el ejecutable. Añadir `.gitignore` y gestionar externamente. | 30 minutos |

---

## 14. Roadmap de evolución

Las siguientes mejoras se ordenan por impacto/esfuerzo. Solo se listan las que tienen sentido dado el contexto (centros educativos, Windows, sin infraestructura de servidor dedicado).

### 14.1 Migración a MySQL (prioridad: media-alta)

PyMySQL ya está instalado y configurado como adaptador en `core/settings.py:13-16`. El cambio en `settings.py` es mínimo:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('DB_NAME', 'djangosanidad'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '3306'),
    }
}
```

Precauciones:
- El SQL crudo de `web/views.py:1532` (`UPDATE sqlite_sequence`) no es compatible con MySQL. Eliminar esa lógica.
- El modo legacy de `InformeResultado` ya no será necesario una vez migrados todos los centros; simplificar.
- Verificar que `MuestraNecropsia.tincion` (CharField, puede llegar vacío) no viola constraints MySQL.

### 14.2 Servidor de producción: Waitress (Windows) o Gunicorn (Linux)

Waitress es un servidor WSGI puro-Python para Windows, sin dependencias de compilación:

```powershell
pip install waitress
waitress-serve --host=0.0.0.0 --port=8000 core.wsgi:application
```

Reemplazar la llamada a `manage.py runserver` en los `.bat` y en `launcher_portable.py`. Reducir `DEBUG=false` obligatoriamente.

### 14.3 Autenticación JWT para la API

Si PHPSanidad evoluciona a un SPA o si se crean apps móviles, las cookies de sesión son inconvenientes. Migrar a `djangorestframework-simplejwt`:
- `POST /api/token/` → `{access, refresh}`
- `POST /api/token/refresh/`
- Los ViewSets existentes cambian solo la clase de autenticación en `settings.py`.

### 14.4 Nginx como proxy inverso (si se sale de la intranet)

Si la aplicación necesita ser accesible desde fuera del centro (profesores en casa, inspección educativa), un proxy Nginx delante de Waitress/Gunicorn añade:
- Terminación SSL.
- Compresión gzip.
- Servido de estáticos sin pasar por Django.
- Rate limiting para el login.

### 14.5 CI/CD básico

Un pipeline mínimo con GitHub Actions:
- Lint con `flake8` o `ruff`.
- `python manage.py migrate --run-syncdb` contra una BD test.
- `python manage.py test api web` (217 tests, ~150 s).

---

## 15. Glosario

| Término | Definición |
|---|---|
| **Cassette** | Recipiente de plástico que contiene el tejido a analizar durante el procesado histológico. En la app, es el registro padre de una o varias muestras histológicas. |
| **Citología** | Técnica de diagnóstico basada en el análisis de células individuales (no tejido). Tipos: PAAF, improntas, esputos, líquidos, raspados, etc. |
| **Necropsia** | Examen post-mortem de un cadáver animal (en veterinaria) o de una persona (en anatomía patológica, denominada autopsia). |
| **Muestra** | Sub-unidad de un registro principal (Cassette, Citología, Necropsia, etc.) que representa una preparación o bloque concreto procesado. |
| **Biopsia** | Extracción y análisis de tejido vivo. En el contexto de la app, los cassettes representan el procesado histológico de biopsias. |
| **Tinción** | Técnica de coloración aplicada a una preparación microscópica para visualizar estructuras celulares. Ejemplos: Hematoxilina-Eosina (H&E), Diff-Quick, PAS, Ziehl-Neelsen. |
| **Hematología** | Especialidad que estudia la sangre y los órganos hematopoyéticos. En la app, cubre análisis de frotis de sangre y otras muestras sanguíneas. |
| **Microbiología** | Especialidad que estudia microorganismos. En la app, cubre cultivos, antibiogramas y análisis microbiológicos. |
| **Bioquímica** | Análisis de composición química de fluidos biológicos (sangre, orina, etc.). En la app, se gestiona bajo el modelo `Tubo`. |
| **Volante de petición** | Documento clínico que solicita un análisis y acompaña a la muestra. Se almacena como fichero (PDF, imagen) adjunto al registro. |
| **QR de trazabilidad** | Código QR generado por la app para identificar unívocamente una muestra o sub-muestra. Al escanearlo se accede al registro correspondiente en la app. |
| **Informe de resultado** | Documento (texto + imagen opcional) que recoge el diagnóstico o resultado de un análisis. Vinculado a cualquier tipo de registro via `InformeResultado` (GenericFK). |
| **Técnico** | Nombre que da la app al usuario autenticado (professor o alumno en prácticas). Modelo `Tecnico` es el `AUTH_USER_MODEL`. |
| **Soft-delete** | Eliminación lógica: el registro se marca como borrado (`is_deleted=True`) pero permanece en BD. Solo afecta a sub-muestras e imágenes, no a los registros principales. |
| **PHPSanidad** | Sistema legado en PHP que gestiona el frontend de laboratorio clínico. Consume datos de DjangoSanidad a través de la API REST. |
| **Bloque** | En histología, el bloque de parafina que contiene el tejido incluido para seccionar. Referenciado en `Muestra.numero_bloque`. |
| **PAAF** | Punción-Aspiración con Aguja Fina. Tipo de citología. |
| **BAL/BAS** | Lavado/Aspirado bronco-alveolar. Tipo de muestra respiratoria para citología. |
| **Descripción macroscópica** | Descripción a simple vista de la muestra antes del procesado microscópico. |
| **Descripción microscópica** | Descripción de las características observadas al microscopio. |

---

## 16. Anexo: Comandos de referencia rápida

### manage.py habituales

```powershell
# Activar entorno (siempre primero)
.\venv\Scripts\Activate.ps1

# Arrancar servidor
python manage.py runserver                          # localhost:8000
python manage.py runserver 0.0.0.0:8000            # red local
python manage.py runserver 0.0.0.0:8000 --noreload # sin recarga automática

# Migraciones
python manage.py makemigrations                     # crear nueva migración
python manage.py migrate                            # aplicar todas
python manage.py migrate api 0040                   # rollback a migración 0040
python manage.py migrate --run-syncdb               # también crea tablas sin migración
python manage.py showmigrations                     # estado de migraciones

# Usuarios
python manage.py createsuperuser                    # crear admin
python manage.py rehash_legacy_passwords --dry-run  # diagnóstico contraseñas
python manage.py rehash_legacy_passwords --apply    # aplicar rehash

# Mantenimiento de ficheros
python manage.py cleanup_orphaned_files --dry-run   # ver huérfanos
python manage.py cleanup_orphaned_files             # eliminar huérfanos
python manage.py repair_missing_file_references --dry-run
python manage.py repair_missing_file_references

# Backup JSON
python manage.py dumpdata --natural-foreign --natural-primary -e contenttypes -e auth.Permission --indent 2 > backup.json
python manage.py loaddata backup.json

# Shell interactivo
python manage.py shell
```

### Build portátil

```bat
REM Desde la raíz del proyecto, con venv activo:
build_portable.bat

REM El ejecutable queda en:
REM   dist\DjangoSanidad\DjangoSanidad.exe

REM Para distribuir:
REM   Comprimir dist\DjangoSanidad\ en un .rar/.zip
```

### Despliegue en centro (primera vez)

```
1. Enviar AUTO_DESCARGAR_E_INICIAR_DJANGOSANIDAD.bat al responsable TI
2. Ejecutar con doble clic (requiere internet para descargar el repo y las dependencias)
3. Primera ejecución: ~10-15 minutos
4. Para arrancar en el futuro: INICIAR_DJANGOSANIDAD_WINDOWS.bat
5. Para desinstalar: ELIMINAR_DJANGOSANIDAD_COMPLETAMENTE.bat
```

### Endpoints de diagnóstico rápido

```
GET http://localhost:8000/health/           → {"status": "ok"} (sin auth)
GET http://localhost:8000/api/tecnicos/me/  → datos del usuario autenticado
GET http://localhost:8000/admin/            → panel de administración Django
```
