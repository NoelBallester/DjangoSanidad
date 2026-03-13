# Documentación Técnica — DjangoSanidad

> **Versión:** 1.0 &nbsp;|&nbsp; **Fecha:** Marzo 2026 &nbsp;|&nbsp; **Estado:** En desarrollo activo &nbsp;|&nbsp; **Despliegue:** Intranet — red privada clase A

---

## Índice

1. [Descripción del Proyecto](#1-descripción-del-proyecto)
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
15. [Deuda Técnica](#15-deuda-técnica)
16. [Guía de Arranque Local](#16-guía-de-arranque-local)

---

## 1. Descripción del Proyecto

**DjangoSanidad** es un sistema de gestión de laboratorio veterinario y anatomía patológica. Permite registrar, consultar y gestionar muestras biológicas de distintos tipos, vinculando imágenes, informes de resultados y volantes de petición a cada entrada.

### Características principales

- Gestión de **6 tipos de muestra** con flujos de trabajo independientes.
- **Códigos QR únicos** por registro para trazabilidad física.
- **Control de acceso por rol** con tres perfiles de usuario.
- **Doble interfaz**: web para uso interno y API REST para integraciones externas.
- **Soft delete** en sub-muestras e imágenes para preservar la integridad del historial.

### Interfaces disponibles

| Interfaz | Descripción | Público objetivo |
|----------|-------------|------------------|
| Web (templates Django) | Formularios HTML + AJAX, navegación por secciones | Técnicos de laboratorio |
| API REST (DRF) | Endpoints JSON, consumible por clientes externos | PHPSanidad (sistema legado) |

---

## 2. Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework web | Django | 6.0.3 |
| API REST | Django REST Framework | 3.16.1 |
| Base de datos (desarrollo) | SQLite3 | — |
| Base de datos (producción) | MySQL | — |
| Driver MySQL | PyMySQL | 1.1.2 |
| Procesamiento de imágenes | Pillow | 12.1.1 |
| Generación de QR | qrcode | 8.2 |
| CORS | django-cors-headers | 4.9.0 |
| Servidor ASGI | asgiref | 3.11.1 |
| Lenguaje | Python | 3.x |

---

## 3. Estructura del Proyecto

```
DjangoSanidad/
├── core/                        # Configuración global del proyecto Django
│   ├── settings.py              # BD, autenticación, logging, CORS, paginación
│   ├── urls.py                  # Router raíz: admin, API, web, estáticos
│   ├── error_views.py           # Manejadores personalizados de errores 404/500
│   └── wsgi.py / asgi.py
│
├── api/                         # Lógica de negocio y API REST
│   ├── models.py                # 26 modelos (bases abstractas + 6 tipos de muestra)
│   ├── views.py                 # ViewSets de DRF (20+ endpoints)
│   ├── serializers.py           # Serializers con validación de catálogo y QR
│   ├── urls.py                  # Router de DRF
│   └── exceptions.py            # Manejador de excepciones personalizado
│
├── web/                         # Interfaz web con templates Django
│   ├── views.py                 # Vistas CRUD, login, descarga de ficheros
│   ├── forms.py                 # ModelForms con opciones dinámicas del catálogo
│   ├── middleware.py            # Control de acceso por rol (RolAccesoMiddleware)
│   ├── urls.py                  # 77 rutas web para cada sección
│   └── templates/web/           # Plantillas HTML con AJAX embebido
│
├── media/                       # Ficheros subidos por los usuarios
├── logs/                        # errors.log generado en tiempo de ejecución
├── css/ js/ assets/             # Estáticos del frontend
└── requirements.txt
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

Ambas capas —web y API REST— comparten los mismos modelos definidos en `api/models.py`. El frontend web consume el ORM directamente; la API REST está orientada a integraciones externas.

---

## 5. Modelo de Datos

### 5.1 Jerarquía de clases abstractas

Las clases abstractas evitan la duplicación de código entre los 6 tipos de muestra:

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
- **Roles disponibles:**

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

# Borrado físico (solo para administración)
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

> **Nota:** Si se prevé un cliente móvil o SPA desacoplada, se recomienda añadir autenticación por tokens (por ejemplo, `djangorestframework-simplejwt`).

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

Además del CRUD estándar, los ViewSets principales exponen las siguientes acciones:

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

- Las plantillas implementan operaciones CRUD **sin recarga de página** mediante `fetch` / `XMLHttpRequest` embebido en el HTML.
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

Configurado en `settings.py` con dos loggers independientes:

| Logger | Destino | Nivel configurable |
|--------|---------|:-----------------:|
| `api` | Consola + `logs/errors.log` | Sí (`DJANGO_LOG_LEVEL`) |
| `web` | Consola + `logs/errors.log` | Sí |

El manejador de excepciones personalizado (`api/exceptions.py`) intercepta todos los errores no controlados de la API, los registra en el log y devuelve una respuesta JSON consistente:

```json
{
  "error": "Descripción del error",
  "status_code": 500
}
```

---

## 12. Variables de Entorno

El proyecto requiere un fichero `.env` en la raíz. El repositorio incluye `.env.example` como plantilla.

| Variable | Obligatoria | Valor por defecto | Descripción |
|----------|:-----------:|-------------------|-------------|
| `DJANGO_SECRET_KEY` | **Sí** | — | Clave criptográfica de Django. Se lanza excepción si falta. |
| `DJANGO_CORS_ALLOWED_ORIGINS` | **Sí** | — | Orígenes permitidos para CORS (sin wildcard). |
| `DJANGO_DEBUG` | No | `False` | Activa el modo de depuración. Debe ser `False` en producción. |
| `DJANGO_ALLOWED_HOSTS` | No | `localhost,127.0.0.1` | Hosts aceptados por Django. |
| `DJANGO_TIME_ZONE` | No | `Europe/Madrid` | Zona horaria del servidor. |
| `DJANGO_LOG_LEVEL` | No | `INFO` | Nivel de log para los loggers `api` y `web`. |

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
| Soft delete | El borrado físico es una operación separada y explícita; los datos no se pierden accidentalmente |
| Control de acceso por rol | `RolAccesoMiddleware` restringe secciones según el rol del usuario |

### 13.2 Vulnerabilidades pendientes de corrección

Las siguientes vulnerabilidades han sido identificadas y están pendientes de resolución. Son relevantes incluso en entorno de intranet porque afectan a la integridad de los datos y a la separación entre departamentos.

| ID | Severidad | Descripción | Archivo |
|----|:---------:|-------------|---------|
| SEC-2 | **ALTA** | IDOR entre roles: un técnico de laboratorio puede acceder a ficheros de anatomía patológica y viceversa | `api/views.py` — `proxy_file` |
| SEC-4 | **ALTA** | Mass Assignment: `fields = '__all__'` permite manipular campos internos como `is_deleted` | `api/serializers.py` |
| SEC-11 | **ALTA** | Logout roto: la sesión Django no se destruye al cerrar sesión desde el frontend JS | `js/auth.js` |
| SEC-16 | **ALTA** | Stored XSS: el `Content-Type` de los archivos subidos se almacena sin validar y se sirve de vuelta | `web/views.py` |
| SEC-6 | **MEDIA** | `DEBUG=True` por defecto si no se configura `.env`, exponiendo stack traces a usuarios | `core/settings.py` |
| SEC-12 | **MEDIA** | Mensajes de error internos (rutas, tablas de BD) visibles al usuario final | `web/views.py` |
| SEC-1 | **BAJA** | Open Redirect: el parámetro `?next=` no se valida, posible phishing interno en red grande | `web/views.py` |
| SEC-10 | **BAJA** | Enumeración de usuarios: cualquier técnico puede consultar datos de cualquier otro por email | `api/views.py` |

> El detalle completo con código vulnerable y solución está en `MEJORAS.md` — Fase 4.

---

## 14. Integración con Sistema Legado (PHPSanidad)

La API mantiene compatibilidad con el cliente PHP existente mediante:

- **Alias de campos** en los serializers que mapean a los nombres de columna originales.
- **Atributos `db_column`** en los modelos para respetar el esquema de la base de datos heredada.

Esto permite una **migración incremental** —incorporar funcionalidades en DjangoSanidad sin interrumpir el cliente PHP— hasta que la transición esté completa.

---

## 15. Deuda Técnica

| Área | Situación actual | Recomendación |
|------|-----------------|---------------|
| Base de datos | SQLite en desarrollo | Migrar a MySQL/PostgreSQL en producción (driver `PyMySQL` ya incluido) |
| Almacenamiento de imágenes | `BinaryField` en BD | Evaluar almacenamiento externo (S3, filesystem) si el volumen de imágenes crece significativamente |
| Autenticación de la API | Sesiones de Django | Añadir tokens JWT (`djangorestframework-simplejwt`) si se prevé un cliente móvil o SPA desacoplada |
| JavaScript en plantillas | AJAX embebido en HTML | Refactorizar a un cliente JS más estructurado si el proyecto escala |

---

## 16. Guía de Arranque Local

```bash
# 1. Clonar el repositorio e instalar dependencias
git clone <repo>
cd DjangoSanidad
pip install -r requirements.txt

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con los valores correspondientes

# 3. Aplicar migraciones
python manage.py migrate

# 4. Crear superusuario (tendrá rol de profesor)
python manage.py createsuperuser

# 5. Arrancar el servidor de desarrollo
python manage.py runserver
```

### Configuración inicial tras el arranque

1. Acceder al **panel de administración** en `/admin/` con el superusuario creado.
2. Gestionar `CatalogoOpcion` para configurar las opciones de los formularios (órganos, tinciones, tipos de análisis, etc.).
3. Crear los usuarios técnicos asignando el rol correspondiente (`profesor`, `anatomia_patologica` o `laboratorio`).
