# Documentación Técnica — DjangoSanidad

**Versión:** 1.0
**Fecha:** Marzo 2026
**Estado:** En desarrollo activo

---

## 1. Descripción del Proyecto

**DjangoSanidad** es un sistema de gestión de laboratorio veterinario/patológico. Permite registrar, consultar y gestionar muestras biológicas de distintos tipos, vinculando imágenes, informes de resultados y volantes de petición a cada entrada. El sistema contempla múltiples perfiles de usuario con acceso restringido según su rol, y genera códigos QR únicos para cada muestra para facilitar su trazabilidad física.

El proyecto tiene una doble interfaz:
- **Interfaz web** basada en plantillas Django con formularios HTML y llamadas AJAX.
- **API REST** consumible por clientes externos (por ejemplo, el sistema heredado PHPSanidad).

---

## 2. Stack Tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Framework web | Django | 6.0.3 |
| API REST | Django REST Framework | 3.16.1 |
| Base de datos | SQLite3 (dev) / MySQL (prod) | — |
| Driver MySQL | PyMySQL | 1.1.2 |
| Procesamiento de imágenes | Pillow | 12.1.1 |
| Generación de QR | qrcode | 8.2 |
| CORS | django-cors-headers | 4.9.0 |
| Servidor ASGI | asgiref | 3.11.1 |
| Lenguaje | Python 3.x | — |

---

## 3. Estructura del Proyecto

```
DjangoSanidad/
├── core/                   # Configuración global del proyecto Django
│   ├── settings.py         # Ajustes: BD, auth, logging, CORS, paginación
│   ├── urls.py             # Router raíz: admin, API, web, estáticos
│   └── wsgi.py / asgi.py
│
├── api/                    # Aplicación Django: lógica de negocio y API REST
│   ├── models.py           # Todos los modelos de datos
│   ├── views.py            # ViewSets de DRF
│   ├── serializers.py      # Serializers con validación de catálogo
│   ├── urls.py             # Router de DRF con 20+ endpoints
│   └── exceptions.py       # Manejador de excepciones personalizado
│
├── web/                    # Aplicación Django: interfaz web con templates
│   ├── views.py            # Vistas CRUD, login, descarga de ficheros
│   ├── forms.py            # ModelForms con opciones dinámicas del catálogo
│   ├── middleware.py        # Control de acceso por rol (RolAccesoMiddleware)
│   ├── urls.py             # URLs web para cada sección
│   └── templates/web/      # Plantillas HTML con AJAX embebido
│
├── media/                  # Ficheros subidos por usuarios
├── logs/                   # errors.log generado en runtime
├── css/ js/ assets/        # Estáticos del frontend
└── requirements.txt
```

---

## 4. Arquitectura General

```
Navegador / Cliente externo
        │
        ▼
   core/urls.py  ──────────────────────────────────────
        │                                              │
        ▼                                              ▼
  web/urls.py                                   api/urls.py
  (vistas HTML)                              (DRF Router)
        │                                              │
        ▼                                              ▼
  web/views.py                               api/views.py
  (CRUD + auth)                            (ViewSets DRF)
        │                                              │
        └──────────────┬───────────────────────────────┘
                       ▼
                 api/models.py
              (ORM Django + SQLite/MySQL)
```

El frontend web consume directamente el ORM de Django a través de las vistas del módulo `web`. La API REST es independiente y está pensada para integraciones externas. Ambas capas comparten los mismos modelos.

---

## 5. Modelo de Datos

### 5.1 Jerarquía de clases abstractas

```
SoftDeleteModel (is_deleted, soft/hard delete)
    └── MuestraBase
    └── ImagenBase

DetalleBase / RegistroBase (campos comunes a todos los registros)
    └── RegistroConInforme (campos clínicos: descripción microscópica, diagnóstico...)
```

Esta jerarquía evita duplicación de código entre los 6 tipos de muestra del sistema.

### 5.2 Tipos de muestra (6 workflows)

Cada tipo sigue el mismo patrón de tres niveles:

```
Registro principal (ej. Cassette)
    └── Muestra / sub-muestra (ej. Muestra)  ← SoftDelete
            └── Imagen (ej. Imagen)          ← SoftDelete
```

| Tipo | Registro | Sub-muestra | Imagen | Prefijo QR |
|---|---|---|---|---|
| Histología | Cassette | Muestra | Imagen | `CS` |
| Citología | Citologia | MuestraCitologia | ImagenCitologia | `CI` |
| Necropsia | Necropsia | MuestraNecropsia | ImagenNecropsia | `NC` |
| Tubo/Tejido | Tubo | MuestraTubo | ImagenTubo | `TB` |
| Hematología | Hematologia | MuestraHematologia | ImagenHematologia | `HM` |
| Microbiología | Microbiologia | MuestraMicrobiologia | ImagenMicrobiologia | `MC` |

### 5.3 Modelos de soporte

**`Tecnico`** — Modelo de usuario personalizado (`AUTH_USER_MODEL`)
- Autenticación basada en email (no en username)
- Roles: `profesor`, `anatomia_patologica`, `laboratorio`
- Extiende `AbstractBaseUser` con `TecnicoManager`

**`CatalogoOpcion`** — Opciones dinámicas de formulario
- Tipos gestionados: `organo`, `tincion`, `tipo_citologia`, `tipo_autopsia`, `analisis_informe`
- Permite a los administradores añadir/retirar opciones sin tocar código
- Las categorías de órganos se agrupan visualmente en los formularios

**`InformeResultado`** — Informe de resultados genérico
- Usa `django.contrib.contenttypes` (GenericForeignKey)
- Puede vincularse a cualquier tipo de muestra sin tablas adicionales
- Soporta imagen adjunta y campo `tincion`

### 5.4 Sistema de Soft Delete

Las sub-muestras e imágenes no se eliminan físicamente. La borrado lógico:

1. Marca `is_deleted = True`
2. Propaga el borrado en cascada a los hijos mediante `_cascade_soft_delete_children()`
3. El manager por defecto filtra automáticamente los registros borrados
4. `all_objects` expone todos los registros para administración

```python
# Borrado lógico
muestra.delete()

# Borrado físico (administración)
muestra.hard_delete()

# Restauración
muestra.restore()
```

---

## 6. Sistema de QR

Cada registro principal recibe un código QR único en el momento de su creación:

```
Formato:  PREFIX + UUID_12_chars
Ejemplo:  CS3a7f2b91de04
```

- El campo `qr_*` es único a nivel de base de datos
- La generación reintenta hasta 50 veces ante colisiones
- El endpoint `/qr/resolver/?qr=<codigo>` redirige al detalle del registro correspondiente, detectando el tipo por el prefijo

---

## 7. API REST

### 7.1 Autenticación

La API usa autenticación de sesión de Django (mismas cookies que el frontend). No implementa tokens JWT ni OAuth en la versión actual.

### 7.2 Endpoints principales

Todos bajo el prefijo `/api/` gestionados por `DefaultRouter` de DRF.

```
/api/tecnicos/
/api/cassettes/
/api/muestras/
/api/imagenes/
/api/citologias/
/api/muestrascitologia/
/api/imagenescitologia/
/api/necropsias/
/api/muestrasnecropsia/
/api/imagenesnecropsia/
/api/tubos/
/api/muestrastubo/
/api/imagenestubo/
/api/hematologia/
/api/muestrashematologia/
/api/imageneshematologia/
/api/microbiologias/
/api/muestrasmicrobiologia/
/api/imagenesmicrobiologia/
/api/informesresultado/
/api/archivo/<modelo>/<pk>/<campo>/   ← proxy de ficheros binarios
```

### 7.3 Acciones personalizadas en ViewSets

Además del CRUD estándar, los ViewSets principales exponen:

| Acción | Método | Descripción |
|---|---|---|
| `actualizar_informe` | POST | Actualiza campos de informe e imagen del registro |
| `get_by_mail` (Tecnico) | GET | Busca usuario por email |
| `exist` (Tecnico) | GET | Comprueba si un email existe |
| `auth` (Tecnico) | POST | Autentica credenciales |

### 7.4 Proxy de ficheros (`/api/archivo/`)

Los ficheros binarios (imágenes, PDF) almacenados en la base de datos se sirven a través de este endpoint:

- Recibe `modelo`, `pk` y `campo` como parámetros de URL
- Valida que el campo esté en una lista blanca de campos permitidos
- Detecta el tipo MIME leyendo los magic bytes del fichero
- Devuelve el binario con el `Content-Type` adecuado

### 7.5 Paginación

Configurada globalmente en `settings.py`:
```python
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 50
}
```

---

## 8. Interfaz Web

### 8.1 Autenticación

- Login por email y contraseña (`/login/`)
- Sesiones gestionadas por Django
- `@login_required` sobre todas las vistas protegidas
- Logout vía POST (`/logout/`)

### 8.2 Control de acceso por rol (Middleware)

`RolAccesoMiddleware` intercepta cada petición antes de que llegue a la vista:

| Rol | Acceso permitido |
|---|---|
| `profesor` | Todo el sistema (acceso completo) |
| `anatomia_patologica` | Solo cassettes, citologías, necropsias |
| `laboratorio` | Solo hematología, microbiología, bioquímica |

Los intentos de acceso no autorizado redirigen a `/index.html` con un mensaje de error.

### 8.3 Gestión de ficheros

Los ficheros (imágenes de muestras, volantes de petición, informes) se almacenan como `BinaryField` en la base de datos, no en el sistema de ficheros. Esto simplifica los backups y evita inconsistencias entre BD y disco.

El flujo de subida:
1. El usuario sube el fichero mediante un formulario multipart
2. `_leer_imagen_bytes()` extrae los bytes del `InMemoryUploadedFile`
3. Se persisten en el campo `BinaryField` del modelo correspondiente
4. Para mostrarlos en el navegador, se convierten a base64 con `_imagen_bytes_a_base64()`

### 8.4 Plantillas y AJAX

Las plantillas implementan operaciones CRUD parciales sin recarga de página mediante AJAX (fetch/XMLHttpRequest embebido en el HTML). Los formularios para sub-muestras e imágenes se envían de forma asíncrona y actualizan el DOM con la respuesta.

Los partiales reutilizables (`_cassette_fields.html`, `_citologia_fields.html`, etc.) centralizan el markup de campos para formularios de creación y edición.

---

## 9. Formularios

Los ModelForms del módulo `web/forms.py` generan dinámicamente los campos `ChoiceField` consultando `CatalogoOpcion` en tiempo de instanciación. Si el catálogo está vacío, recurren a los valores distintos ya presentes en la base de datos como fallback.

Los órganos se agrupan por categoría usando `optgroup` en el HTML para mejorar la usabilidad con catálogos extensos.

---

## 10. Serializers

`api/serializers.py` incluye dos mixins reutilizables:

- **`QrUnicoValidatorMixin`**: valida que el valor del campo QR no exista en otra fila antes de crear/actualizar.
- **`FileUrlSerializerMixin`**: genera URLs absolutas al endpoint proxy para los campos de fichero, evitando exponer rutas internas.

Los serializers incluyen aliases de campos (p.ej. `id_muestra`, `muestra`, `tipo_muestra`) para mantener compatibilidad con el cliente PHP legado.

La función `_validar_catalogo()` verifica que los valores de `organo`, `tincion`, `tipo_citologia` y `tipo_autopsia` estén presentes en `CatalogoOpcion` antes de persistir.

---

## 11. Logging

Configurado en `settings.py` con dos loggers específicos:

| Logger | Destino | Nivel configurable |
|---|---|---|
| `api` | Consola + `logs/errors.log` | Sí (`DJANGO_LOG_LEVEL`) |
| `web` | Consola + `logs/errors.log` | Sí |

El manejador de excepciones personalizado (`api/exceptions.py`) intercepta errores no controlados, los registra y devuelve una respuesta JSON consistente con la estructura `{"error": "..."}`.

---

## 12. Configuración y Variables de Entorno

| Variable | Obligatoria | Valor por defecto | Descripción |
|---|---|---|---|
| `DJANGO_SECRET_KEY` | Sí | — | Clave criptográfica de Django |
| `DJANGO_CORS_ALLOWED_ORIGINS` | Sí | — | Orígenes permitidos para CORS |
| `DJANGO_DEBUG` | No | `True` | Modo depuración |
| `DJANGO_ALLOWED_HOSTS` | No | `localhost,127.0.0.1` | Hosts aceptados |
| `DJANGO_TIME_ZONE` | No | `Europe/Madrid` | Zona horaria |
| `DJANGO_LOG_LEVEL` | No | `INFO` | Nivel de log |

Se recomienda usar un fichero `.env` en desarrollo. El repositorio incluye `.env.example` como referencia.

---

## 13. Seguridad

- **Sin secretos en el código**: todas las claves son variables de entorno.
- **Modelo de usuario personalizado**: email como identificador, sin campo `username`.
- **CSRF activo** en todos los formularios web.
- **CORS explícito**: solo los orígenes listados en la variable de entorno pueden acceder a la API.
- **Proxy de ficheros con whitelist**: el endpoint `/api/archivo/` valida el nombre del campo contra una lista permitida antes de servir el binario.
- **Soft delete**: los datos no se pierden accidentalmente; el borrado físico es una operación separada y explícita.

---

## 14. Integración con Sistema Legado (PHPSanidad)

La API incluye campos alias y mapeos de columnas de base de datos (`db_column`) para mantener compatibilidad con el esquema de PHPSanidad. Esto permite una migración incremental sin interrumpir el cliente existente.

---

## 15. Deuda Técnica y Notas de Desarrollo

- La base de datos en producción debería migrar de SQLite a MySQL/PostgreSQL (el driver `PyMySQL` ya está incluido).
- Las imágenes como `BinaryField` en BD funcionan bien para volúmenes bajos, pero en producción con muchas imágenes se debería evaluar el uso de almacenamiento externo (S3, filesystem) para no penalizar el rendimiento de la BD.
- La autenticación de la API actualmente depende de sesiones de Django. Si se prevé un cliente móvil o SPA desacoplada, convendría añadir autenticación por tokens (p.ej. `djangorestframework-simplejwt`).
- El AJAX embebido en las plantillas podría refactorizarse a un cliente JavaScript más estructurado si el proyecto crece.

---

## 16. Cómo arrancar el proyecto en local

```bash
# 1. Clonar e instalar dependencias
git clone <repo>
cd DjangoSanidad
pip install -r requirements.txt

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con los valores correspondientes

# 3. Aplicar migraciones
python manage.py migrate

# 4. Crear superusuario (rol profesor)
python manage.py createsuperuser

# 5. Arrancar servidor de desarrollo
python manage.py runserver
```

El panel de administración de Django (`/admin/`) permite gestionar el `CatalogoOpcion` para configurar las opciones de los formularios.
