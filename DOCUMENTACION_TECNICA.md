# Documentación Técnica — DjangoSanidad

> **Versión:** 1.0 &nbsp;|&nbsp; **Fecha:** Abril 2026 &nbsp;|&nbsp; **Estado:** En desarrollo activo &nbsp;|&nbsp; **Despliegue:** Intranet — red privada clase A

---

## Índice

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Stack Tecnológico](#2-stack-tecnológico)
3. [Estructura del Proyecto](#3-estructura-del-proyecto)
4. [Arquitectura General](#4-arquitectura-general)
5. [Modelo de Datos](#5-modelo-de-datos)
6. [Sistema de QR](#6-sistema-de-qr)
7. [API REST](#7-api-rest)
8. [Interfaz Web](#8-interfaz-web)
9. [Formularios](#9-formularios)
10. [Serializers](#10-serializers)
11. [Logging](#11-logging)
12. [Variables de Entorno](#12-variables-de-entorno)
13. [Seguridad](#13-seguridad)
14. [Integración con Sistema Legado](#14-integración-con-sistema-legado-phpsanidad)
15. [Guía de Configuración Local](#15-guía-de-configuración-local)
16. [Guía de Despliegue en Producción](#16-guía-de-despliegue-en-producción)
17. [Tests](#17-tests)
18. [Mantenimiento y Escalabilidad](#18-mantenimiento-y-escalabilidad)
19. [Deuda Técnica](#19-deuda-técnica)

---

## 1. Resumen Ejecutivo

**DjangoSanidad** es un sistema de información clínica para la gestión integral de un laboratorio veterinario y sección de anatomía patológica. Sustituye progresivamente a **PHPSanidad**, el sistema legado, manteniendo compatibilidad con él durante la migración.

### Problemas que resuelve

| Problema | Solución implementada |
|----------|----------------------|
| Falta de trazabilidad física de muestras | Código QR único por registro, imprimible y legible con escáner |
| Dispersión de información clínica | Registro estructurado: descripción macro/microscópica, diagnóstico, volante PDF e imágenes |
| Dependencia de un sistema PHP sin mantenimiento | API REST compatible con el cliente PHP existente para migración incremental |
| Gestión manual del control de acceso | Roles predefinidos con middleware que restringe secciones por perfil |
| Riesgo de pérdida de datos por eliminación accidental | Soft delete en todas las sub-muestras e imágenes |

### Interfaces disponibles

| Interfaz | Descripción | Público objetivo |
|----------|-------------|------------------|
| Web (templates Django) | Formularios HTML + AJAX, navegación por secciones | Técnicos de laboratorio |
| API REST (DRF) | Endpoints JSON, consumible por clientes externos | PHPSanidad (sistema legado) |

---

## 2. Stack Tecnológico

| Capa | Tecnología | Versión | Justificación |
|------|-----------|---------|---------------|
| Lenguaje | Python | 3.10+ | Ecosistema maduro, tipo estático opcional, amplio soporte Django |
| Framework web | Django | 6.0.3 | Baterías incluidas: ORM, autenticación, admin, migraciones |
| API REST | Django REST Framework | 3.16.1 | Integración nativa con Django, serializers y routers automáticos |
| Base de datos (desarrollo) | SQLite3 | — | Sin infraestructura adicional para desarrollo local |
| Base de datos (producción) | MySQL | — | Rendimiento y concurrencia para entorno multi-usuario |
| Driver MySQL | PyMySQL | 1.1.2 | Puro Python, sin dependencias binarias nativas |
| Procesamiento de imágenes | Pillow | 12.1.1 | Conversión y validación de formatos de imagen |
| Generación de QR | qrcode | 8.2 | Generación offline de códigos QR sin dependencias externas |
| CORS | django-cors-headers | 4.9.0 | Gestión de cabeceras CORS con configuración explícita por origen |
| Servidor ASGI | asgiref | 3.11.1 | Capa de compatibilidad Django ASGI/WSGI |
| Frontend | HTML5 + AJAX + CSS3 | — | Sin frameworks JS: reduce dependencias y simplifica el mantenimiento |

---

## 3. Estructura del Proyecto

```
DjangoSanidad/
├── core/                        # Configuración global del proyecto Django
│   ├── settings.py              # BD, autenticación, logging, CORS, paginación
│   ├── urls.py                  # Router raíz: admin, API, web, estáticos
│   ├── error_views.py           # Manejadores personalizados de errores 404/500
│   └── wsgi.py / asgi.py        # Puntos de entrada para servidores de producción
│
├── api/                         # Lógica de negocio y API REST
│   ├── models.py                # 26 modelos (bases abstractas + 6 tipos de muestra)
│   ├── views.py                 # ViewSets de DRF (20+ endpoints)
│   ├── serializers.py           # Serializers con validación de catálogo y QR
│   ├── urls.py                  # Router de DRF
│   ├── exceptions.py            # Manejador de excepciones personalizado
│   ├── admin.py                 # Configuración del panel de administración
│   ├── management/              # Comandos personalizados de Django (manage.py)
│   ├── migrations/              # Historial de migraciones de base de datos
│   └── tests.py
│
├── web/                         # Interfaz web con templates Django
│   ├── views.py                 # Vistas CRUD, login, descarga de ficheros
│   ├── forms.py                 # ModelForms con opciones dinámicas del catálogo
│   ├── middleware.py            # Control de acceso por rol (RolAccesoMiddleware)
│   ├── urls.py                  # 77 rutas web para cada sección
│   ├── templates/web/           # Plantillas HTML con AJAX embebido
│   └── tests.py
│
├── css/                         # Estilos CSS por sección + tema oscuro
├── js/                          # JavaScript AJAX por módulo
├── assets/                      # Imágenes y recursos estáticos
├── media/                       # Ficheros subidos por los usuarios (runtime)
├── logs/                        # errors.log con rotación automática (runtime)
│
├── manage.py                    # Punto de entrada de management de Django
├── requirements.txt             # Dependencias Python
├── .env.example                 # Plantilla de variables de entorno
├── db.sqlite3                   # Base de datos SQLite (solo desarrollo)
│
├── launcher_portable.py         # Lanzador para distribución sin instalación
├── build_portable.bat           # Compila ejecutable standalone con PyInstaller
└── verify_migration.py          # Verifica consistencia de migraciones
```

---

## 4. Arquitectura General

```
Navegador / Cliente externo
        │
        ▼
   core/urls.py
        │
        ├─────────────────────────────────────┐
        ▼                                     ▼
  web/urls.py                           api/urls.py
  (vistas HTML)                         (DRF Router)
        │                                     │
        ▼                                     ▼
  web/views.py                         api/views.py
  (CRUD + autenticación)               (ViewSets DRF)
        │                                     │
        └──────────────┬──────────────────────┘
                       ▼
                 api/models.py
              (ORM Django + SQLite / MySQL)
```

Ambas capas —web y API REST— comparten los mismos modelos definidos en `api/models.py`. El frontend web consume el ORM directamente a través de las vistas Django; la API REST está orientada exclusivamente a integraciones externas (PHPSanidad).

**Flujo de una petición web típica:**

1. El navegador envía petición autenticada (cookie `sessionid`).
2. `RolAccesoMiddleware` verifica que el rol del usuario tiene acceso a la URL.
3. La vista en `web/views.py` ejecuta la operación sobre los modelos de `api/models.py`.
4. La respuesta HTML se renderiza y se devuelve al navegador; las actualizaciones parciales se gestionan con AJAX.

---

## 5. Modelo de Datos

### 5.1 Jerarquía de clases abstractas

Las clases abstractas evitan duplicación entre los seis tipos de muestra:

```
SoftDeleteModel          (flag is_deleted, borrado lógico y físico)
    ├── MuestraBase      (campos comunes a sub-muestras: descripcion, fecha, tincion, qr)
    └── ImagenBase       (campo imagen BinaryField)

DetalleBase / RegistroBase   (campos comunes a todos los registros principales)
    └── RegistroConInforme   (campos clínicos: descripción microscópica, diagnóstico...)
```

### 5.2 Tipos de muestra

Cada tipo sigue el mismo patrón de tres niveles jerárquicos:

```
Registro principal  (ej. Cassette)
    └── Sub-muestra  (ej. Muestra)    ← SoftDelete activo
            └── Imagen  (ej. Imagen)  ← SoftDelete activo
```

| Tipo | Registro principal | Sub-muestra | Imagen | Prefijo QR |
|------|--------------------|-------------|--------|:----------:|
| Histología | `Cassette` | `Muestra` | `Imagen` | `CS` |
| Citología | `Citologia` | `MuestraCitologia` | `ImagenCitologia` | `CI` |
| Necropsia | `Necropsia` | `MuestraNecropsia` | `ImagenNecropsia` | `NC` |
| Tubo / Tejido | `Tubo` | `MuestraTubo` | `ImagenTubo` | `TB` |
| Hematología | `Hematologia` | `MuestraHematologia` | `ImagenHematologia` | `HM` |
| Microbiología | `Microbiologia` | `MuestraMicrobiologia` | `ImagenMicrobiologia` | `MC` |

### 5.3 Modelos de soporte

#### `Tecnico` — Modelo de usuario personalizado (`AUTH_USER_MODEL`)

- Autenticación basada en **email** (sin campo `username`).
- Extiende `AbstractBaseUser` con gestor personalizado `TecnicoManager`.

| Rol | Descripción |
|-----|-------------|
| `profesor` | Acceso completo al sistema |
| `anatomia_patologica` | Solo cassettes, citologías y necropsias |
| `laboratorio` | Solo hematología, microbiología y bioquímica |

#### `CatalogoOpcion` — Opciones dinámicas de formulario

- Gestiona los valores de: `organo`, `tincion`, `tipo_citologia`, `tipo_autopsia`, `analisis_informe`.
- Permite añadir o retirar opciones desde el panel de administración sin modificar código.
- Los órganos se agrupan por categoría usando `optgroup` en los formularios.

#### `InformeResultado` — Informe de resultados genérico

- Implementa el patrón `GenericForeignKey` de `django.contrib.contenttypes`.
- Puede vincularse a cualquier tipo de muestra sin crear tablas adicionales.
- Soporta imagen adjunta y campo `tincion`.

### 5.4 Sistema de Soft Delete

Sub-muestras e imágenes nunca se eliminan físicamente. El borrado lógico:

1. Marca `is_deleted = True` en el registro.
2. Propaga el borrado en cascada a los hijos mediante `_cascade_soft_delete_children()`.
3. El manager por defecto filtra automáticamente los registros borrados en todas las consultas.
4. El manager `all_objects` expone todos los registros para tareas de administración.

```python
# Borrado lógico (operación habitual)
muestra.delete()

# Borrado físico (solo administración)
muestra.hard_delete()

# Restauración de un registro borrado
muestra.restore()
```

---

## 6. Sistema de QR

Cada registro principal recibe un código QR único en el momento de su creación.

### Formato

```
PREFIX + UUID_12_chars
Ejemplo: CS3a7f2b91de04
```

### Comportamiento

| Aspecto | Detalle |
|---------|---------|
| Unicidad | Campo único a nivel de base de datos |
| Colisiones | La generación reintenta hasta 50 veces antes de fallar |
| Resolución | `GET /qr/resolver/?qr=<codigo>` detecta el tipo por el prefijo y redirige al detalle |

---

## 7. API REST

### 7.1 Autenticación

La API utiliza **autenticación de sesión de Django** (mismas cookies que el frontend web). No implementa tokens JWT ni OAuth en la versión actual.

> **Nota:** Si se prevé un cliente móvil o SPA desacoplada, se recomienda añadir autenticación por tokens (`djangorestframework-simplejwt`).

### 7.2 Endpoints

Todos los endpoints están bajo el prefijo `/api/` y son gestionados por el `DefaultRouter` de DRF.

| Recurso | Endpoint |
|---------|----------|
| Técnicos | `/api/tecnicos/` |
| Histología | `/api/cassettes/`, `/api/muestras/`, `/api/imagenes/` |
| Citología | `/api/citologias/`, `/api/muestrascitologia/`, `/api/imagenescitologia/` |
| Necropsia | `/api/necropsias/`, `/api/muestrasnecropsia/`, `/api/imagenesnecropsia/` |
| Tubo / Tejido | `/api/tubos/`, `/api/muestrastubo/`, `/api/imagenestubo/` |
| Hematología | `/api/hematologia/`, `/api/muestrashematologia/`, `/api/imageneshematologia/` |
| Microbiología | `/api/microbiologias/`, `/api/muestrasmicrobiologia/`, `/api/imagenesmicrobiologia/` |
| Informes | `/api/informesresultado/` |
| Proxy de ficheros | `/api/archivo/<modelo>/<pk>/<campo>/` |

### 7.3 Acciones personalizadas

| Acción | Método HTTP | ViewSet | Descripción |
|--------|:-----------:|---------|-------------|
| `actualizar_informe` | POST | Todos los principales | Actualiza campos de informe e imagen del registro |
| `get_by_mail` | GET | `TecnicoViewSet` | Busca un usuario por su dirección de email |
| `exist` | GET | `TecnicoViewSet` | Comprueba si un email ya existe en el sistema |
| `auth` | POST | `TecnicoViewSet` | Autentica credenciales (email + contraseña) |

### 7.4 Proxy de ficheros (`/api/archivo/`)

Los ficheros binarios —imágenes y PDF— almacenados en la base de datos se sirven a través de este endpoint centralizado:

1. Recibe `modelo`, `pk` y `campo` como parámetros de URL.
2. Valida que el campo esté en una **lista blanca** de campos permitidos.
3. Detecta el tipo MIME leyendo los **magic bytes** del fichero (JPEG, PNG, GIF, BMP, WebP, PDF).
4. Devuelve el binario con el `Content-Type` adecuado.

### 7.5 Paginación

Configurada globalmente. Todos los listados devuelven páginas de 50 registros:

```python
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 50,
}
```

---

## 8. Interfaz Web

### 8.1 Autenticación

| Aspecto | Implementación |
|---------|---------------|
| Login | `POST /login/` con email y contraseña |
| Sesiones | Gestionadas por Django (cookies `sessionid`) |
| Protección de vistas | Decorador `@login_required` en todas las vistas privadas |
| Logout | `POST /logout/` |

### 8.2 Control de acceso por rol (Middleware)

`RolAccesoMiddleware` intercepta cada petición **antes** de que llegue a la vista y comprueba si el rol del usuario tiene permiso para acceder a la URL solicitada.

| Rol | Secciones accesibles |
|-----|----------------------|
| `profesor` | Todo el sistema |
| `anatomia_patologica` | Cassettes, citologías, necropsias |
| `laboratorio` | Hematología, microbiología, bioquímica |

Los accesos no autorizados redirigen a `/index.html` con un mensaje de error descriptivo. Los usuarios staff y superusuarios de Django omiten estas comprobaciones.

### 8.3 Gestión de ficheros

Los ficheros (imágenes, volantes de petición, informes) se almacenan como `BinaryField` en la base de datos, **no en el sistema de ficheros**. Esto simplifica los backups y elimina inconsistencias entre la BD y el disco.

**Flujo de subida:**

```
1. Usuario sube fichero (formulario multipart)
        ↓
2. _leer_imagen_bytes()  →  extrae bytes del InMemoryUploadedFile
        ↓
3. Se persiste en el campo BinaryField del modelo
        ↓
4. Para mostrar en navegador: _imagen_bytes_a_base64()  →  URI base64
```

### 8.4 Plantillas y AJAX

- Las plantillas implementan operaciones CRUD **sin recarga de página** mediante `fetch` / `XMLHttpRequest`.
- Los formularios de sub-muestras e imágenes se envían de forma asíncrona y actualizan el DOM con la respuesta del servidor.
- Los parciales reutilizables (`_cassette_fields.html`, `_citologia_fields.html`, etc.) centralizan el markup de campos para los formularios de creación y edición.

---

## 9. Formularios

Los `ModelForm` de `web/forms.py` generan dinámicamente los `ChoiceField` consultando `CatalogoOpcion` en el momento de instanciación. Si el catálogo está vacío, recurren como **fallback** a los valores distintos ya presentes en la base de datos.

Los órganos se agrupan por categoría usando `<optgroup>` en el HTML para mejorar la usabilidad con catálogos extensos.

---

## 10. Serializers

`api/serializers.py` incluye dos mixins reutilizables aplicados a todos los serializers:

### `QrUnicoValidatorMixin`

Valida que el valor del campo QR no exista en otra fila antes de crear o actualizar un registro. Gestiona correctamente ambos escenarios (creación y edición).

### `FileUrlSerializerMixin`

Genera URLs absolutas al endpoint proxy para los campos de tipo fichero, evitando exponer rutas o datos internos directamente en el JSON.

### Compatibilidad con PHPSanidad

Los serializers incluyen **alias de campos** (por ejemplo, `id_muestra`, `muestra`, `tipo_muestra`) y atributos `db_column` para mantener compatibilidad con el esquema de la base de datos del cliente PHP legado.

### Validación de catálogo

La función `_validar_catalogo()` verifica que los valores de `organo`, `tincion`, `tipo_citologia` y `tipo_autopsia` estén presentes en `CatalogoOpcion` antes de persistir cualquier registro.

---

## 11. Logging

Configurado en `settings.py` con rotación automática de fichero.

| Logger | Destino | Nivel configurable |
|--------|---------|:-----------------:|
| `api` | Consola + `logs/errors.log` | Sí (`DJANGO_LOG_LEVEL`) |
| `web` | Consola + `logs/errors.log` | Sí |
| `django.request` | `logs/errors.log` | No (siempre `ERROR`) |

El manejador de excepciones personalizado (`api/exceptions.py`) intercepta todos los errores no controlados de la API, los registra en el log y devuelve una respuesta JSON consistente:

```json
{
  "error": "Descripción del error",
  "status_code": 500
}
```

**Rotación del fichero de log:** configurable con `DJANGO_LOG_MAX_BYTES` (defecto 10 MB) y `DJANGO_LOG_BACKUP_COUNT` (defecto 5 ficheros).

---

## 12. Variables de Entorno

El proyecto carga automáticamente el fichero `.env` desde la raíz al arrancar. El repositorio incluye `.env.example` como plantilla.

```bash
cp .env.example .env
# Editar .env con los valores del entorno
```

| Variable | Obligatoria | Valor por defecto | Descripción |
|----------|:-----------:|-------------------|-------------|
| `DJANGO_SECRET_KEY` | **Sí** | — | Clave criptográfica de Django. Se lanza excepción si falta. |
| `DJANGO_CORS_ALLOWED_ORIGINS` | **Sí** | — | Orígenes permitidos para CORS separados por coma. Se lanza excepción si falta. |
| `DJANGO_DEBUG` | No | `false` | Activa el modo de depuración. Debe ser `false` en producción. |
| `DJANGO_ALLOWED_HOSTS` | No | `localhost,127.0.0.1` | Hosts aceptados por Django. En producción incluir la IP/dominio del servidor. |
| `DJANGO_TIME_ZONE` | No | `Europe/Madrid` | Zona horaria del servidor. |
| `DJANGO_LOG_LEVEL` | No | `INFO` | Nivel de log para los loggers `api` y `web`. |
| `DJANGO_HTTPS` | No | `false` | Activa cabeceras y cookies seguras para HTTPS. Usar `true` en producción con TLS. |
| `DJANGO_LOG_MAX_BYTES` | No | `10485760` (10 MB) | Tamaño máximo del fichero de log antes de rotar. |
| `DJANGO_LOG_BACKUP_COUNT` | No | `5` | Número de ficheros de log rotados a conservar. |

---

## 13. Seguridad

> La aplicación está diseñada para desplegarse en una **intranet en red privada clase A** con usuarios internos autenticados. Las medidas de seguridad están calibradas para este contexto.

### 13.1 Medidas implementadas

| Medida | Implementación |
|--------|---------------|
| Sin secretos en el código | Todas las claves se leen de variables de entorno |
| Autenticación por email | Modelo `Tecnico` sin campo `username` |
| CSRF | Activo en todos los formularios web |
| CORS explícito | Solo los orígenes listados en la variable de entorno pueden acceder a la API |
| Proxy de ficheros con whitelist | `/api/archivo/` valida el nombre de campo antes de servir cualquier binario |
| Soft delete | El borrado físico es una operación separada y explícita |
| Control de acceso por rol | `RolAccesoMiddleware` restringe secciones según el rol del usuario |
| Seguridad de cookies | `SESSION_COOKIE_HTTPONLY`, `SESSION_COOKIE_SAMESITE=Lax`, `X_FRAME_OPTIONS=DENY` |
| HTTPS opcional | Configurado con `DJANGO_HTTPS=true`: HSTS, SSL redirect, cookies seguras |

### 13.2 Vulnerabilidades pendientes de corrección

| ID | Severidad | Descripción | Archivo |
|----|:---------:|-------------|---------|
| SEC-2 | **ALTA** | IDOR entre roles: un técnico de laboratorio puede acceder a ficheros de anatomía y viceversa | `api/views.py` — `proxy_file` |
| SEC-4 | **ALTA** | Mass Assignment: `fields = '__all__'` permite manipular campos internos como `is_deleted` | `api/serializers.py` |
| SEC-11 | **ALTA** | Logout roto: la sesión Django no se destruye al cerrar sesión desde el frontend JS | `js/auth.js` |
| SEC-16 | **ALTA** | Stored XSS: el `Content-Type` de los archivos subidos se almacena sin validar y se sirve de vuelta | `web/views.py` |
| SEC-6 | **MEDIA** | `DEBUG=True` por defecto si no se configura `.env`, exponiendo stack traces | `core/settings.py` |
| SEC-12 | **MEDIA** | Mensajes de error internos (rutas, tablas de BD) visibles al usuario final | `web/views.py` |
| SEC-1 | **BAJA** | Open Redirect: el parámetro `?next=` no se valida | `web/views.py` |
| SEC-10 | **BAJA** | Enumeración de usuarios: cualquier técnico puede consultar datos de otro por email | `api/views.py` |

> El detalle completo con código vulnerable y solución propuesta está en `MEJORAS.md` — Fase 4.

---

## 14. Integración con Sistema Legado (PHPSanidad)

La API mantiene compatibilidad con el cliente PHP existente mediante:

- **Alias de campos** en los serializers que mapean a los nombres de columna originales.
- **Atributos `db_column`** en los modelos para respetar el esquema de la base de datos heredada.

Esto permite una **migración incremental**: incorporar funcionalidades en DjangoSanidad sin interrumpir el cliente PHP, hasta que la transición esté completa.

---

## 15. Guía de Configuración Local

### Requisitos previos

| Software | Versión mínima |
|----------|---------------|
| Python | 3.10 |
| pip | 23.x |
| Git | cualquiera |
| (opcional) MySQL | 8.x — solo si se usa MySQL en local |

### Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd DjangoSanidad

# 2. Crear y activar entorno virtual
python -m venv .venv
source .venv/bin/activate        # Linux / macOS
# .venv\Scripts\activate.bat     # Windows

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Configurar variables de entorno
cp .env.example .env
# Editar .env — mínimo obligatorio:
#   DJANGO_SECRET_KEY=<clave-larga-y-aleatoria>
#   DJANGO_CORS_ALLOWED_ORIGINS=http://localhost:8000

# 5. Aplicar migraciones
python manage.py migrate

# 6. Crear superusuario inicial (obtendrá rol de profesor)
python manage.py createsuperuser

# 7. Arrancar el servidor de desarrollo
python manage.py runserver
```

### Configuración inicial tras el arranque

1. Acceder al panel de administración en `http://localhost:8000/admin/` con el superusuario creado.
2. Gestionar **`CatalogoOpcion`** para configurar las opciones de los formularios (órganos, tinciones, tipos de análisis, etc.).
3. Crear los usuarios técnicos asignando el rol correspondiente (`profesor`, `anatomia_patologica` o `laboratorio`).

### Cambio a MySQL en local (opcional)

```python
# core/settings.py — sustituir el bloque DATABASES
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'djangosanidad',
        'USER': 'tu_usuario',
        'PASSWORD': 'tu_password',
        'HOST': '127.0.0.1',
        'PORT': '3306',
    }
}
```

```bash
# Recrear migraciones con la nueva BD
python manage.py migrate
```

---

## 16. Guía de Despliegue en Producción

### 16.1 Requisitos del servidor

| Componente | Recomendación |
|------------|--------------|
| SO | Ubuntu 22.04 LTS / Debian 12 |
| Python | 3.10+ |
| Servidor de aplicación | Gunicorn o uWSGI |
| Proxy inverso | Nginx |
| Base de datos | MySQL 8.x |
| (opcional) TLS | Certificado autofirmado para intranet o Let's Encrypt |

### 16.2 Despliegue paso a paso

```bash
# 1. Clonar en el servidor
git clone <url-del-repositorio> /opt/djangosanidad
cd /opt/djangosanidad

# 2. Entorno virtual y dependencias
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install gunicorn                  # servidor WSGI de producción

# 3. Variables de entorno de producción
cp .env.example .env
# Editar .env con valores de producción:
#   DJANGO_SECRET_KEY=<clave-producción-única>
#   DJANGO_DEBUG=false
#   DJANGO_ALLOWED_HOSTS=192.168.X.X,tu-dominio.local
#   DJANGO_CORS_ALLOWED_ORIGINS=http://192.168.X.X
#   DJANGO_HTTPS=false               # true si hay TLS

# 4. Recopilar estáticos
python manage.py collectstatic --noinput

# 5. Aplicar migraciones
python manage.py migrate

# 6. Crear superusuario (si es primera vez)
python manage.py createsuperuser

# 7. Levantar Gunicorn (prueba)
gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 3
```

### 16.3 Servicio systemd (recomendado)

Crear `/etc/systemd/system/djangosanidad.service`:

```ini
[Unit]
Description=DjangoSanidad Gunicorn
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/opt/djangosanidad
EnvironmentFile=/opt/djangosanidad/.env
ExecStart=/opt/djangosanidad/.venv/bin/gunicorn \
    core.wsgi:application \
    --bind unix:/run/djangosanidad.sock \
    --workers 3 \
    --timeout 120
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload
systemctl enable djangosanidad
systemctl start djangosanidad
systemctl status djangosanidad
```

### 16.4 Configuración Nginx

```nginx
server {
    listen 80;
    server_name 192.168.X.X tu-dominio.local;

    location /static/ {
        alias /opt/djangosanidad/staticfiles/;
    }

    location /media/ {
        alias /opt/djangosanidad/media/;
    }

    location / {
        proxy_pass http://unix:/run/djangosanidad.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 50M;
    }
}
```

```bash
nginx -t && systemctl reload nginx
```

### 16.5 Configuración de MySQL en producción

```sql
CREATE DATABASE djangosanidad CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'djangouser'@'localhost' IDENTIFIED BY '<password-segura>';
GRANT ALL PRIVILEGES ON djangosanidad.* TO 'djangouser'@'localhost';
FLUSH PRIVILEGES;
```

Actualizar `core/settings.py` con el bloque MySQL descrito en la sección 15.

### 16.6 Checklist de producción

- [ ] `DJANGO_DEBUG=false`
- [ ] `DJANGO_SECRET_KEY` es única y no está en el repositorio
- [ ] `DJANGO_ALLOWED_HOSTS` incluye solo los hosts del servidor
- [ ] `DJANGO_CORS_ALLOWED_ORIGINS` no incluye orígenes de desarrollo
- [ ] Estáticos recopilados con `collectstatic`
- [ ] Logs rotando correctamente en `logs/errors.log`
- [ ] Backup de `db.sqlite3` o de MySQL configurado
- [ ] Puerto 8000 **no expuesto** directamente (solo Nginx en 80/443)

---

## 17. Tests

### Ejecutar los tests existentes

```bash
# Todos los tests
python manage.py test

# Solo tests de la API
python manage.py test api

# Solo tests de la web
python manage.py test web

# Con detalle de cada test
python manage.py test --verbosity=2
```

Los tests se ubican en:
- `api/tests.py` — tests unitarios e integración de los modelos y ViewSets
- `web/tests.py` — tests de las vistas web
- `test_volante.py` — test de descarga de volantes en intranet

### Cobertura (opcional)

```bash
pip install coverage
coverage run manage.py test
coverage report -m
coverage html           # genera htmlcov/index.html
```

---

## 18. Mantenimiento y Escalabilidad

### Actualizaciones de dependencias

```bash
pip list --outdated
pip install --upgrade <paquete>
# Actualizar requirements.txt tras verificar compatibilidad:
pip freeze > requirements.txt
```

### Migraciones

```bash
# Crear nueva migración tras cambio en modelos
python manage.py makemigrations

# Verificar migraciones pendientes sin aplicar
python manage.py showmigrations

# Verificar consistencia post-migración
python verify_migration.py
```

### Backup de la base de datos

```bash
# SQLite (desarrollo)
cp db.sqlite3 db.sqlite3.bak

# MySQL (producción)
mysqldump -u djangouser -p djangosanidad > backup_$(date +%Y%m%d).sql
```

### Consideraciones de escalabilidad

| Área | Situación actual | Acción si el sistema crece |
|------|-----------------|---------------------------|
| Almacenamiento de imágenes | `BinaryField` en BD | Migrar a almacenamiento externo (S3, MinIO, filesystem con Nginx) si el volumen supera varios GB |
| Concurrencia de usuarios | SQLite (un escritor simultáneo) | Migrar a MySQL (ya preparado con PyMySQL) en cuanto haya más de 2-3 usuarios simultáneos |
| Autenticación de la API | Sesiones de Django | Añadir tokens JWT (`djangorestframework-simplejwt`) si se prevé cliente móvil o SPA desacoplada |
| JavaScript en plantillas | AJAX embebido en HTML | Refactorizar a módulos JS si el número de secciones crece |
| Número de workers Gunicorn | 3 (recomendado) | `2 * núcleos_CPU + 1` como regla general |

---

## 19. Deuda Técnica

| Área | Situación actual | Recomendación |
|------|-----------------|---------------|
| Base de datos | SQLite en desarrollo | Migrar a MySQL en producción (driver `PyMySQL` ya incluido) |
| Almacenamiento de imágenes | `BinaryField` en BD | Evaluar almacenamiento externo si el volumen de imágenes crece significativamente |
| Autenticación de la API | Sesiones de Django | Añadir tokens JWT si se prevé cliente móvil o SPA desacoplada |
| JavaScript en plantillas | AJAX embebido en HTML | Refactorizar a un cliente JS estructurado si el proyecto escala |
| Ficheros HTML en raíz | Interfaces legacy conviviendo con Django | Eliminar gradualmente a medida que las vistas Django las sustituyan |
| Scripts temporales en raíz | `tmp_*.py` de desarrollo | Eliminar antes de cada release de producción |
| Mass Assignment en serializers | `fields = '__all__'` | Listar explícitamente los campos permitidos en cada serializer |
