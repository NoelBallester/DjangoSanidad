# DjangoSanidad - Sistema de Gestión de Laboratorio Veterinario

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Propósito del Proyecto](#propósito-del-proyecto)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Guía de Archivos](#guía-de-archivos)
6. [Modelos de Datos](#modelos-de-datos)
7. [Endpoints de API REST](#endpoints-de-api-rest)
8. [Rutas Web](#rutas-web)
9. [Sistema de Roles y Permisos](#sistema-de-roles-y-permisos)
10. [Sistema de QR](#sistema-de-qr)
11. [Instalación y Configuración](#instalación-y-configuración)
12. [Ejecución del Proyecto](#ejecución-del-proyecto)
13. [Seguridad](#seguridad)
14. [Deuda Técnica](#deuda-técnica)

---

## Descripción General

**DjangoSanidad** es un sistema web y API REST para la gestión integral de un laboratorio veterinario y sección de anatomía patológica. Permite registrar, consultar y gestionar muestras biológicas de diferentes tipos (histología, citología, necropsias, análisis de sangre, microbiología), vinculando a cada una imágenes digitales, informes de resultados y volantes de petición. 

El sistema se ejecuta en una intranet privada (red clase A) y proporciona dos interfaces:
- **Web**: Interfaz HTML con AJAX para técnicos de laboratorio
- **API REST**: Endpoints JSON para integración con sistemas externos (PHPSanidad legado)

Despliegue actual: **Intranet — red privada clase A**
Versión: **1.0**
Estado: **En desarrollo activo**

---

## Propósito del Proyecto

El sistema resuelve los siguientes casos de uso:

### 1. **Trazabilidad de Muestras**
- Registro único e identificación con código QR para cada muestra
- Generación automática de códigos de barras únicos
- Acoplamiento físico: cada tubo/cassette tiene un QR pegado

### 2. **Gestión de Seis Tipos de Muestra**
- **Histología (Cassettes)**: Muestras en parafina con bloques de corte
- **Citología**: Preparaciones citológicas con muestras asociadas
- **Necropsias**: Autopsias completas con disección de órganos
- **Tubos (Bioquímica)**: Muestras de sangre/sueros para análisis bioquímicos
- **Hematología**: Análisis de sangre con técnicas de tinción
- **Microbiología**: Cultivos y muestras para identificación de microorganismos

### 3. **Documentación Clínica**
- Información clínica preliminar de cada registro
- Descripción macroscópica y microscópica
- Diagnóstico final y observaciones del patólogo
- Almacenamiento de volantes de petición en PDF
- Informes de resultado con imágenes adjuntas

### 4. **Control de Acceso Basado en Roles**
- **Profesor**: Acceso completo a anatomía y laboratorio
- **Técnico Anatomía Patológica**: Acceso a cassettes, citología y necropsias
- **Técnico Laboratorio**: Acceso a bioquímica, hematología y microbiología

### 5. **Compatibilidad con Sistema Legado**
- API REST compatible con PHPSanidad
- Sincronización bidireccional de datos
- Migración gradual sin perder datos históricos

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Framework Web** | Django | 6.0.3 |
| **API REST** | Django REST Framework | 3.16.1 |
| **Base de Datos (Desarrollo)** | SQLite3 | — |
| **Base de Datos (Producción)** | MySQL | — |
| **Driver MySQL** | PyMySQL | 1.1.2 |
| **Procesamiento de Imágenes** | Pillow | 12.1.1 |
| **Generación de Códigos QR** | qrcode | 8.2 |
| **CORS** | django-cors-headers | 4.9.0 |
| **Servidor ASGI** | asgiref | 3.11.1 |
| **Lenguaje** | Python | 3.10+ |
| **Frontend** | HTML5 + JavaScript AJAX + CSS3 | — |

**Dependencias instalables**: Ver [requirements.txt](requirements.txt)

---

## Estructura del Proyecto

```
DjangoSanidad/
│
├── core/                                    # Configuración central de Django
│   ├── settings.py                          # BD, autenticación, middleware, logging, CORS
│   ├── urls.py                              # Router raíz: admin, API, web, estáticos
│   ├── error_views.py                       # Manejadores 404/500 personalizados
│   ├── asgi.py                              # ASGI para servidor de producción
│   ├── wsgi.py                              # WSGI para servidor de producción
│   └── __pycache__/                         # Cache de Python compilado
│
├── api/                                     # Aplicación API REST (core de lógica)
│   ├── models.py                            # 26 modelos: bases abstractas + 6 tipos muestra
│   ├── views.py                             # 17 ViewSets DRF con 40+ endpoints
│   ├── serializers.py                       # Serializers con validación de catálogo y QR
│   ├── urls.py                              # Router DRF automático
│   ├── exceptions.py                        # Manejador excepciones personalizado
│   ├── admin.py                             # Configuración de admin Django
│   ├── apps.py                              # Configuración de app
│   ├── tests.py                             # Tests unitarios y de integración
│   ├── migrations/                          # Historial de migraciones de BD
│   │   ├── 0001_initial.py
│   │   ├── 0002_cassette_descripcion...
│   │   ├── ... (múltiples migraciones)
│   │   └── __init__.py
│   ├── management/                          # Comandos personalizados de Django
│   │   ├── commands/
│   │   └── __init__.py
│   ├── __pycache__/                         # Cache Python
│   └── __init__.py
│
├── web/                                     # Aplicación web con templates Django
│   ├── views.py                             # 40+ vistas CRUD, login, descargas
│   ├── forms.py                             # ModelForms con opciones dinámicas
│   ├── middleware.py                        # RolAccesoMiddleware (control de acceso)
│   ├── urls.py                              # 77+ rutas web específicas
│   ├── models.py                            # Modelos específicos de web (vacío, hereda de api)
│   ├── admin.py                             # Admin Django
│   ├── apps.py                              # Configuración app
│   ├── tests.py                             # Tests web
│   ├── migrations/                          # Migraciones de web (vacío)
│   ├── templates/                           # Templates Django renderizados
│   │   └── web/
│   │       ├── cassettes.html               # Interfaz gestión cassettes
│   │       ├── citologias.html              # Interfaz gestión citologías
│   │       ├── necropsias.html              # Interfaz gestión necropsias
│   │       ├── hematologias.html            # Interfaz laboratorio hematología
│   │       ├── usuarios.html                # Gestión de técnicos
│   │       ├── registro.html                # Registro de nuevos usuarios
│   │       └── ... (más templates)
│   ├── __pycache__/
│   └── __init__.py
│
├── media/                                   # Archivos subidos por usuarios (generado en runtime)
│   ├── volantes/                            # Documentos PDF de petición
│   │   └── {tipo}/
│   ├── informes_resultado/                  # Imágenes de informes de resultado
│   ├── imagenes/                            # Imágenes asociadas a muestras
│   │   ├── cassettes/
│   │   ├── citologias/
│   │   ├── necropsias/
│   │   ├── tubo/
│   │   ├── hematologia/
│   │   └── microbiologia/
│   ├── imagenes_tubo/
│   ├── imagenes_microbiologia/
│   └── qr/                                  # Códigos QR generados
│
├── logs/                                    # Logs de aplicación
│   └── errors.log                           # Log de errores con rotación
│
├── css/                                     # Estilos CSS
│   ├── all.css                              # Estilos globales
│   ├── bioquimica.css                       # Estilos laboratorio bioquímica
│   ├── cassettes.css                        # Estilos cassettes
│   ├── citologias.css                       # Estilos citologías
│   ├── dark-theme.css                       # Tema oscuro
│   ├── ejercicios.css                       # Estilos ejercicios
│   ├── footer.css                           # Footer
│   ├── forms.css                            # Estilos formularios
│   ├── header.css                           # Header/navbar
│   ├── hematologia.css                      # Estilos hematología
│   ├── index.css                            # Home
│   ├── loginregistro.css                    # Login/registro
│   ├── microbiologia.css                    # Estilos microbiología
│   ├── muestras.css                         # Estilos generales de muestras
│   ├── necropsias.css                       # Estilos necropsias
│   ├── normalize.css                        # Reset CSS
│   ├── sortable.css                         # Estilos tablas ordenables
│   ├── usuarios.css                         # Estilos gestión usuarios
│   ├── webfonts/                            # Fuentes web
│   └── variables.css                        # Variables CSS globales
│
├── js/                                      # JavaScript AJAX y lógica frontend
│   ├── api-django.js                        # Configuración base para llamadas API
│   ├── auth.js                              # Gestión autenticación
│   ├── autopsias.js                         # Lógica necropsias (alias)
│   ├── bioquimica.js                        # AJAX laboratorio bioquímica
│   ├── cassettes.js                         # AJAX gestión cassettes
│   ├── citologias.js                        # AJAX gestión citologías
│   ├── darkmode.js                          # Toggle tema oscuro
│   ├── hematologia.js                       # AJAX laboratorio hematología
│   ├── loginregistro.js                     # Lógica login/registro
│   ├── microbiologia.js                     # AJAX laboratorio microbiología
│   ├── muestra.js                           # Operaciones comunes muestras
│   ├── necropsias.js                        # AJAX gestión necropsias
│   ├── proyecto.js                          # Inicialización proyecto (soporte legacy)
│   ├── qr.js                                # Generación/lectura QR
│   ├── sortable.js                          # Ordenamiento tablas
│   ├── usuarios.js                          # AJAX gestión usuarios
│   ├── validation.js                        # Validación formularios
│   └── variables.js                         # Variables JavaScript globales
│
├── assets/                                  # Imágenes y recursos estáticos
│   └── images/
│
├── docker/                                  # Configuración Docker (opcional)
│   └── (archivos Docker)
│
├── db.sqlite3                               # Base de datos SQLite (desarrollo)
├── db.sqlite3.bak                           # Backup de BD
│
├── manage.py                                # Script de management de Django
├── requirements.txt                         # Dependencias Python
├── .env                                     # Variables de entorno (NO versionar)
├── .env.example                             # Plantilla .env para referencia
│
├── DOCUMENTACION_TECNICA.md                 # Documentación técnica detallada
├── IMPLEMENTADAS.md                         # Mejoras implementadas (changelog)
├── MEJORAS.md                               # Hoja de ruta de mejoras pendientes
│
├── launcher_portable.py                     # Script lanzador para ejecución portátil
├── build_portable.bat                       # Script batch para compilar ejecutable
├── test_volante.py                          # Test de descarga de volantes
│
├── levantar-python.txt                      # Notas de arranque manual
├── cosasmejorar.txt                         # Notas de mejoras pendientes
├── dump_mapping.csv                         # Mapeo de migración de datos legacy
│
├── tmp_dump_images.py                       # Script temporal: volcado de imágenes
├── tmp_restore_images.py                    # Script temporal: restaurar imágenes
├── tmp_test.py                              # Script temporal: tests
├── tmp_test2.py                             # Script temporal: tests
├── verify_migration.py                      # Verificación de migraciones
│
├── (archivos HTML legacy en raíz)
│   ├── index.html                           # Home (legacy)
│   ├── cassettes.html                       # Cassettes (legacy, con modales QR inline)
│   ├── citologias.html                      # Citologías (legacy)
│   ├── necropsias.html                      # Necropsias (legacy)
│   ├── laboratorio.html                     # Laboratorio general (legacy)
│   ├── anatomia.html                        # Anatomía (legacy)
│   ├── bioquimica.html                      # — Reemplazado por web/templates/web/
│   ├── microbiologia.html                   # — Reemplazado por web/templates/web/
│   ├── hematologia.html                     # — Reemplazado por web/templates/web/
│   ├── actividades.html                     # Actividades educativas (legacy)
│   ├── usuarios.html                        # Usuarios (legacy)
│   ├── registro.html                        # Registro (legacy)
│   ├── tecnicas.html                        # Técnicas (educativo)
│   ├── recursos.html                        # Recursos (educativo)
│   ├── material.html                        # Material educativo
│   └── proyecto.html                        # Info del proyecto
│
├── .git/                                    # Control de versiones Git
├── __pycache__/                             # Cache Python
└── venv/                                    # Virtual environment (si existe)
```

---

## Guía de Archivos

### 📁 Carpeta `core/`
- **settings.py**: Configuración central. Define BD, autenticación, middleware, logging, CORS, paginación DRF
- **urls.py**: Router raíz que mapea `/admin/`, `/api/`, rutas web, y sirve estáticos (CSS, JS, media)
- **error_views.py**: Vistas personalizadas para errores 404 y 500
- **asgi.py / wsgi.py**: Puntos de entrada para servidores de producción

### 📁 Carpeta `api/` (Core de lógica)
- **models.py**: Define 26 modelos:
  - Base abstractas: `DetalleBase`, `RegistroBase`, `RegistroConInforme`, `MuestraBase`, `ImagenBase`
  - 6 tipos de registro: `Cassette`, `Citologia`, `Necropsia`, `Tubo`, `Hematologia`, `Microbiologia`
  - 6 tipos de muestra asociada: `Muestra`, `MuestraCitologia`, `MuestraNecropsia`, `MuestraTubo`, `MuestraHematologia`, `MuestraMicrobiologia`
  - 6 tipos de imagen: `Imagen`, `ImagenCitologia`, `ImagenNecropsia`, `ImagenTubo`, `ImagenHematologia`, `ImagenMicrobiologia`
  - Modelo de usuario: `Tecnico` (hereda de `AbstractBaseUser`)
  - Catálogo dinámico: `CatalogoOpcion`
  - Informe de resultado genérico: `InformeResultado` (con GenericForeignKey)
  - Helper SoftDelete: `SoftDeleteQuerySet`, `SoftDeleteManager`, `SoftDeleteModel`

- **views.py**: ViewSets DRF para cada modelo (CRUD + acciones custom):
  - Endpoints de lectura, creación, actualización y soft delete
  - Acción custom `/todos/` con paginación en listados grandes
  - Protección de acceso por rol en cada endpoint
  - Optimizaciones: `select_related`, `defer` para baja latencia

- **serializers.py**: Serializers DRF con validación:
  - Validación de valores de catálogo dinámico
  - Validación de códigos QR únicos
  - Manejo de imágenes en bytes/base64
  - Validación cruzada de campos relacionados

- **urls.py**: Router automático de DRF. Genera rutas CRUD para todos los ViewSets
- **exceptions.py**: Manejador personalizado de excepciones DRF para respuestas consistentes
- **migrations/**: Historial de migraciones de BD. Mantiene sincronía schema de BD con modelos

### 📁 Carpeta `web/` (Interfaz web)
- **views.py**: Vistas CRUD Django (no DRF):
  - `cassette_list`, `cassette_create`, `cassette_update`, `cassette_delete`
  - `muestra_create`, `muestra_update`, `muestra_delete`
  - `imagen_upload`, `imagen_delete`
  - Equivalentes para citología, necropsia, hematología, usuarios
  - Vistas de laboratorio: `bioquimica_lab`, `microbiologia_lab`, `hematologia_lab`
  - Descargas: `descargar_volante_*`, `descargar_informe_resultado`
  - Autenticación: `login_view`, `logout_view`
  - QR: `qr_resolver`

- **forms.py**: ModelForms Django:
  - `CassetteForm`, `MuestraForm`, `ImagenForm` y equivalentes
  - `TecnicoForm` para creación de usuarios
  - Carga dinámica de opciones desde `CatalogoOpcion`
  - Generación criptográfica de códigos QR con `secrets.choice()`

- **middleware.py**: Implementa `RolAccesoMiddleware`:
  - Controla acceso a secciones según rol del usuario
  - Redirige a `/index.html` si acceso denegado
  - Permite ciertos roles en ciertos tipos de muestra

- **urls.py**: 77+ rutas de la app web:
  - Rutas CRUD para cassettes, citologías, necropsias, hematologías, usuarios
  - Rutas para subir/descargar imágenes
  - Rutas de laboratorio (bioquímica, microbiología, hematología)
  - Rutas de descargas (volantes, informes)
  - Rutas de autenticación

- **templates/web/**: Templates HTML Jinja2:
  - `cassettes.html`: Tabla de cassettes con modales para CRUD
  - `citologias.html`: Tabla de citologías
  - `necropsias.html`: Tabla de necropsias
  - `hematologias.html`, `usuarios.html`, `registro.html`: Análogos
  - Contienen AJAX embebido en `<script>` para llamadas sin recargar página

### 📁 Carpeta `css/`
Estilos por sección:
- **all.css**: Base global (colores, tipografía, layout)
- **header.css**: Navbar superior
- **footer.css**: Pie de página
- **forms.css**: Estilos de input, select, botones
- **cassettes.css, citologias.css, necropsias.css, hematologia.css, microbiologia.css**: Estilos específicos por sección
- **loginregistro.css**: Página de login/registro
- **dark-theme.css**: Tema oscuro (toggle con js/darkmode.js)
- **normalize.css**: Reset CSS cross-browser
- **sortable.css**: Estilos para tablas ordenables

### 📁 Carpeta `js/`
JavaScript AJAX para interactividad sin recarga:
- **api-django.js**: Configuración base, URLs de API, métodos HTTP wrapper
- **cassettes.js, citologias.js, necropsias.js, hematologia.js, microbiologia.js**: AJAX CRUD específico por tipo
- **usuarios.js**: Gestión de técnicos (crear, editar, eliminar)
- **auth.js**: Gestión sesión, token CSRF
- **darkmode.js**: Toggle tema oscuro
- **qr.js**: Renderizado de códigos QR en cliente
- **validation.js**: Validación de formularios antes de enviar
- **sortable.js**: Ordenamiento de columnas en tablas

### 📄 Archivos HTML Legacy (Raíz)
- **index.html**: Home (portal principal con enlaces a secciones)
- **cassettes.html, citologias.html, necropsias.html**: Interfaces legacy con modales QR inline
- **laboratorio.html**: Hub laboratorio (bioquímica, hematología, microbiología)
- **anatomia.html**: Hub anatomía patológica
- **usuarios.html, registro.html**: Autenticación legacy
- **tecnicas.html, recursos.html, material.html**: Secciones educativas
- **proyecto.html**: Información del proyecto
- **actividades.html**: Actividades educativas

**Nota**: Las nuevas interfaces están en `web/templates/web/` con lógica moderna en Django. Los HTML legacy persisten por compatibilidad.

### 📄 Scripts auxiliares
- **launcher_portable.py**: Lanza el servidor Django en modo portable (sin requerimientos externos)
- **build_portable.bat**: Compila ejecutable standalone con PyInstaller
- **manage.py**: Script de management de Django (migrate, runserver, etc.)
- **verify_migration.py**: Verifica consistencia de migraciones
- **tmp_*.py**: Scripts temporales de desarrollo/debug

### 📄 Documentación
- **DOCUMENTACION_TECNICA.md**: Guía técnica detallada (stack, arquitectura, modelos, API, logging, seguridad)
- **IMPLEMENTADAS.md**: Changelog de mejoras implementadas (seguridad HTTPS, QR, performance, etc.)
- **MEJORAS.md**: Hoja de ruta de pending tasks
- **README.md**: Este archivo

---

## Modelos de Datos

### Estructura Jerárquica

Todos los tipos de muestra siguen el patrón:

```
Registro Base (ej: Cassette)
├── Muestra Específica (ej: Muestra para Cassette)
│   └── Imagen Asociada (ej: Imagen de Muestra de Cassette)
└── Informe de Resultado (genérico)
```

### Modelos de Registro (6 tipos)

| Modelo | Tabla | Propósito | Campos Clave |
|--------|-------|----------|--------------|
| **Cassette** | `cassettes` | Histología en parafina | `cassette`, `qr_casette` |
| **Citologia** | `citologias` | Citología general | `citologia`, `tipo_citologia`, `qr_citologia` |
| **Necropsia** | `necropsias` | Autopsia animal | `necropsia`, `tipo_necropsia`, `qr_necropsia`, `fenomenos_cadavericos` |
| **Tubo** | `tubos` | Tubo de muestra (bioquímica) | `tubo`, `qr_tubo` |
| **Hematologia** | `hematologias` | Análisis de sangre | `hematologia`, `qr_hematologia` |
| **Microbiologia** | `microbiologias` | Cultivos/muestras microbianas | `microbiologia`, `qr_microbiologia` |

### Modelos de Muestra Asociada (6 tipos)

Cada registro tiene asociadas múltiples muestras. Ejemplo:

| Modelo | Tabla | Parent | Propósito |
|--------|-------|--------|----------|
| **Muestra** | `muestras` | Cassette | Muestra individual dentro del cassette |
| **MuestraCitologia** | `muestrascitologia` | Citologia | Preparación citológica |
| **MuestraNecropsia** | `muestrasnecropsia` | Necropsia | Órgano disecado |
| **MuestraTubo** | `muestrastubo` | Tubo | Alícuota del tubo |
| **MuestraHematologia** | `muestrashematologia` | Hematologia | Preparación de sangre |
| **MuestraMicrobiologia** | `muestrasmicrobiologia` | Microbiologia | Cultivo microbiológico |

### Modelos de Imagen (6 tipos)

Cada muestra puede contener múltiples imágenes:

| Modelo | Tabla | Parent | Propósito |
|--------|-------|--------|----------|
| **Imagen** | `imagenes` | Muestra | Imagen de muestra |
| **ImagenCitologia** | `imagenescitologia` | MuestraCitologia | Imagen citológica |
| **ImagenNecropsia** | `imagenesnecropsia` | MuestraNecropsia | Imagen de órgano |
| **ImagenTubo** | `imagenestubo` | MuestraTubo | Imagen de tubo |
| **ImagenHematologia** | `imageneshematologia` | MuestraHematologia | Imagen de preparación de sangre |
| **ImagenMicrobiologia** | `imagenesmicrobiologia` | MuestraMicrobiologia | Imagen de cultivo |

### Otros Modelos

| Modelo | Tabla | Propósito |
|--------|-------|----------|
| **Tecnico** | `tecnicos` | Usuario autenticado con rol |
| **CatalogoOpcion** | `catalogo_opciones` | Opciones dinámicas (órganos, tinciones, tipos de análisis) |
| **InformeResultado** | `informesresultado` | Informe genérico vinculable a cualquier registro (GenericForeignKey) |

### Campos Comunes

#### Base: `DetalleBase`
```python
fecha: DateField                        # Fecha de la muestra
descripcion: CharField(max_length=255)  # Descripción principal
caracteristicas: TextField              # Características clínicas
observaciones: TextField                # Observaciones adicionales
organo: CharField(max_length=255)       # Órgano involucrado
tecnico: ForeignKey(Tecnico)            # Técnico responsable
volante_peticion: FileField             # Documento PDF de petición
volante_peticion_nombre: CharField      # Nombre del archivo volante
volante_peticion_tipo: CharField        # Tipo de documento
```

#### Con Informe: `RegistroConInforme` (extiende RegistroBase)
```python
informacion_clinica: TextField                  # Datos clínicos previos
descripcion_microscopica: TextField            # Hallazgos microscópicos
diagnostico_final: TextField                   # Diagnóstico conclusivo
patologo_responsable: CharField                # Responsable de diagnóstico
informe_descripcion: CharField                 # Descripción del informe
informe_fecha: DateField                       # Fecha del informe
informe_tincion: CharField                     # Técnica de tinción usada
informe_observaciones: TextField               # Observaciones del informe
informe_imagen: ImageField                     # Imagen del informe (captura de pantalla)
```

#### Muestra: `MuestraBase`
```python
descripcion: CharField(max_length=255)  # Descripción de la muestra
fecha: DateField                        # Fecha de procesamiento
observaciones: TextField                # Notas de la muestra
tincion: CharField(max_length=255)      # Técnica de tinción aplicada
qr_muestra: CharField(max_length=255)   # Código QR único
is_deleted: BooleanField                # Para soft delete
```

#### Imagen: `ImagenBase`
```python
imagen: ImageField                      # Archivo de imagen
is_deleted: BooleanField                # Para soft delete
```

### Soft Delete

Todos los modelos con `SoftDeleteModel` incluyen:
- `is_deleted: BooleanField` (default=False)
- Manager `objects` que filtra por `is_deleted=False`
- Manager `all_objects` para acceso sin filtrar
- Método `delete()` que marca `is_deleted=True` en lugar de eliminar
- Método `restore()` para recuperar registros

**Ventaja**: Preserva integridad referencial e historial de auditoría.

---

## Endpoints de API REST

Base URL: `/api/`

### ViewSets (CRUD automático via DRF DefaultRouter)

Cada ViewSet genera automáticamente:
- `GET /api/{resource}/` → listar (con paginación)
- `POST /api/{resource}/` → crear
- `GET /api/{resource}/{id}/` → detalle
- `PUT /api/{resource}/{id}/` → actualizar completo
- `PATCH /api/{resource}/{id}/` → actualizar parcial
- `DELETE /api/{resource}/{id}/` → eliminar (soft delete)

### Recursos Principales

| Recurso | ViewSet | Objeto |
|---------|---------|--------|
| `/api/tecnicos/` | TecnicoViewSet | Usuarios autenticados |
| `/api/cassettes/` | CassetteViewSet | Registros histología |
| `/api/muestras/` | MuestraViewSet | Muestras cassette |
| `/api/imagenes/` | ImagenViewSet | Imágenes cassette |
| `/api/citologias/` | CitologiaViewSet | Registros citología |
| `/api/muestrascitologia/` | MuestraCitologiaViewSet | Muestras citología |
| `/api/imagenescitologia/` | ImagenCitologiaViewSet | Imágenes citología |
| `/api/necropsias/` | NecropsiaViewSet | Registros necropsia |
| `/api/muestrasnecropsia/` | MuestraNecropsiaViewSet | Muestras necropsia |
| `/api/imagenesnecropsia/` | ImagenNecropsiaViewSet | Imágenes necropsia |
| `/api/tubos/` | TuboViewSet | Registros tubo/bioquímica |
| `/api/muestrastubo/` | MuestraTuboViewSet | Muestras tubo |
| `/api/imagenestubo/` | ImagenTuboViewSet | Imágenes tubo |
| `/api/hematologia/` | HematologiaViewSet | Registros hematología |
| `/api/muestrashematologia/` | MuestraHematologiaViewSet | Muestras hematología |
| `/api/imageneshematologia/` | ImagenHematologiaViewSet | Imágenes hematología |
| `/api/microbiologias/` | MicrobiologiaViewSet | Registros microbiología |
| `/api/muestrasmicrobiologia/` | MuestraMicrobiologiaViewSet | Muestras microbiología |
| `/api/imagenesmicrobiologia/` | ImagenMicrobiologiaViewSet | Imágenes microbiología |
| `/api/informesresultado/` | InformeResultadoViewSet | Informes genéricos |

### Acciones Personalizadas

#### ViewSets de Registro (Cassette, Citologia, etc.)
- `GET /api/{resource}/{id}/todos/` → Listar todas las submuestras + imágenes (con paginación)

### Proxy de Archivos

- `GET /api/archivo/{model_name}/{pk}/{field_name}/` → Descargar archivo de modelo
  - Parámetros: `model_name` (ej. "cassette"), `pk` (ID registro), `field_name` (ej. "volante_peticion")
  - Protección: Solo descarga si usuario tiene acceso

## Ejemplo de Flujo de Datos AJAX

1. Frontend (JS) → `GET /api/cassettes/` → Listado de cassettes
2. Frontend (JS) → `POST /api/cassettes/` + form data → Crear cassette
3. Frontend (JS) → `POST /api/muestras/` + cassette_id → Crear muestra en cassette
4. Frontend (JS) → `POST /api/imagenes/` + muestra_id + imagen bytes → Subir imagen
5. Frontend (JS) → `GET /api/cassettes/{id}/todos/` → Obtener cassette + muestras + imágenes

---

## Rutas Web

Base URL: `/`

### Autenticación
- `GET /login/` → Formulario de login
- `POST /login/` → Procesar login
- `GET /logout/` → Cerrar sesión
- `POST /login/api/` → Login via API (crea sesión Django)

### QR
- `GET /qr/resolver/?qr={code}` → Resolver QR y redirigir a detalle

### Cassettes
- `GET /cassettes/` → Listar cassettes
- `GET /cassettes/crear/` → Formulario crear
- `POST /cassettes/crear/` → Procesar creación
- `GET /cassettes/<id>/editar/` → Formulario editar
- `POST /cassettes/<id>/editar/` → Procesar edición
- `POST /cassettes/<id>/eliminar/` → Eliminar (soft delete)
- `GET /cassettes/<id>/informe/` → Formulario informe
- `POST /cassettes/<id>/informe/` → Guardar informe
- `POST /cassettes/<id>/informes/<informe_id>/eliminar/` → Eliminar informe
- `GET /cassettes/<cassette_id>/muestras/crear/` → Formulario muestra
- `POST /cassettes/<cassette_id>/muestras/crear/` → Crear muestra
- `GET /muestras/<id>/editar/` → Editar muestra
- `POST /muestras/<id>/editar/` → Procesar edición muestra
- `POST /muestras/<id>/eliminar/` → Eliminar muestra
- `GET /muestras/<muestra_id>/imagenes/subir/` → Formulario subir imagen
- `POST /muestras/<muestra_id>/imagenes/subir/` → Subir imagen
- `POST /imagenes/<id>/eliminar/` → Eliminar imagen
- `GET /cassettes/<id>/volante/` → Descargar volante petición

### Citologías (análógos a cassettes)
- `GET /citologias/`
- `GET /citologias/crear/` → POST
- `GET /citologias/<id>/editar/` → POST
- `POST /citologias/<id>/eliminar/`
- `GET /citologias/<id>/informe/` → POST
- `POST /citologias/<id>/informes/<informe_id>/eliminar/`
- Similar para muestras-citologia, imagenes-citologia
- `GET /citologias/<id>/volante/`

### Necropsias (análogos a cassettes)
- `GET /necropsias/`
- Similar estructura a cassettes/citologías
- `GET /necropsias/<id>/volante/`

### Hematologías (análogos a cassettes)
- `GET /hematologias/`
- Similar estructura a cassettes
- `GET /hematologias/<id>/volante/`

### Laboratorio (Bioquímica, Microbiología, Hematología)
- `GET /bioquimica/` → Laboratorio bioquímica (display de tubos vía API)
- `GET /microbiologia/` → Laboratorio microbiología
- `GET /hematologia/` → Laboratorio hematología

### Usuarios
- `GET /usuarios/` → Listar técnicos
- `GET /usuarios/crear/` → Formulario crear
- `POST /usuarios/crear/` → Procesar creación
- `GET /usuarios/<id>/editar/` → Formulario editar
- `POST /usuarios/<id>/editar/` → Procesar edición
- `POST /usuarios/<id>/eliminar/` → Eliminar
- `POST /usuarios/bulk-delete/` → Eliminar múltiples

### Registro público
- `GET /registro/` → Formulario registro público
- `POST /registro/` → Registrar nuevo usuario

### Descargas
- `GET /informes/<informe_id>/descargar/` → Descargar imagen de informe
- `GET /cassettes/<id>/volante/` → Descargar volante
- `GET /citologias/<id>/volante/`
- `GET /necropsias/<id>/volante/`
- `GET /hematologias/<id>/volante/`
- `GET /tubos/<id>/volante/`
- `GET /microbiologias/<id>/volante/`

### Páginas estáticas (legacy)
- `GET /index.html` → Home
- `GET /cassettes.html` → Cassettes legacy
- `GET /citologias.html` → Citologías legacy
- `GET /necropsias.html` → Necropsias legacy
- `GET /laboratorio.html` → Laboratorio legacy
- `GET /anatomia.html` → Anatomía legacy
- `GET /usuarios.html` → Usuarios legacy
- `GET /registro.html` → Registro legacy
- `GET /tecnicas.html` → Técnicas educativas
- `GET /recursos.html` → Recursos
- `GET /material.html` → Material educativo
- `GET /proyecto.html` → Info proyecto
- `GET /actividades.html` → Actividades educativas

### Estáticos
- `GET /css/<archivo.css>` → Hojas de estilo
- `GET /js/<archivo.js>` → Scripts JavaScript
- `GET /assets/<archivo>` → Imágenes/recursos

### Admin Django
- `GET /admin/` → Panel admin (solo superusuarios)

### Monitoreo
- `GET /health/` → Health check (sin autenticación, solo JSON)

---

## Sistema de Roles y Permisos

### Tres Roles Disponibles

| Rol | Nombre Completo | Acceso |
|-----|-----------------|--------|
| **profesor** | Profesor | Todas las secciones (anatomía + laboratorio) |
| **anatomia_patologica** | Anatomía Patológica | Cassettes, Citologías, Necropsias |
| **laboratorio** | Laboratorio | Bioquímica, Hematología, Microbiología |

### Control de Acceso

Implementado en **`web/middleware.py`** mediante `RolAccesoMiddleware`:

```python
RUTAS_PROTEGIDAS = {
    '/cassettes/': ['profesor', 'anatomia_patologica'],
    '/citologias/': ['profesor', 'anatomia_patologica'],
    '/necropsias/': ['profesor', 'anatomia_patologica'],
    '/bioquimica/': ['profesor', 'laboratorio'],
    '/microbiologia/': ['profesor', 'laboratorio'],
    '/hematologia/': ['profesor', 'laboratorio'],
    '/usuarios/': ['profesor'],  # Solo profesor
}
```

Si un usuario intenta acceder a una ruta sin permisos:
- Redirige a `/index.html` con error 403
- Registra en logs
- No lanza excepción

### Protección en API

Cada endpoint de API valida permisos en `api/views.py`:

```python
def check_acceso(self, request):
    # Verifica rol del usuario contra recursos solicitados
    # Rechaza con 403 si no tiene permiso
```

---

## Sistema de QR

### Generación

- **Ubicación**: `web/forms.py` función `_qr()`
- **Algoritmo**: Generación criptográficamente segura con `secrets.choice()`
- **Formato**: String alfanumérico único (36 caracteres)
- **Almacenamiento**: Campo `qr_casette`, `qr_citologia`, `qr_necropsia`, `qr_tubo`, `qr_hematologia`, `qr_microbiologia` en BD

### Lectura

- **Ubicación**: `js/qr.js`
- **Método**: Sistema de lectura manual o scanner de código de barras
- **Ruta resolver**: `GET /qr/resolver/?qr={code}` redirige a detalle

### Imagen QR (PNG)

- **Generación**: `qrcode` library
- **Almacenamiento**: Campo `qr_imagen` en algunos registros (Citologia, Necropsia)
- **Upload**: API multipart-form-data

### Trazabilidad

- Cada muestra tiene QR único pegado físicamente
- Vinculación electrónica: QR → BD → Registro

---

## Instalación y Configuración

### Requisitos Previos

- Python 3.10+
- pip (gestor de paquetes Python)
- MySQL 5.7+ (producción) o SQLite (desarrollo)

### Paso 1: Clonar o descargar proyecto

```bash
cd /home/noel/Documentos/Documents/Proyectos/DjangoSanidad/DjangoSanidad/DjangoSanidad
```

### Paso 2: Crear virtual environment

```bash
python3 -m venv venv
source venv/bin/activate          # Linux/Mac
venv\Scripts\activate             # Windows
```

### Paso 3: Instalar dependencias

```bash
pip install -r requirements.txt
```

### Paso 4: Configurar variables de entorno

Copiar `.env.example` → `.env` y editar:

```bash
cp .env.example .env
```

Contenido de `.env`:

```env
# Seguridad
DJANGO_SECRET_KEY=tu-clave-secreta-generada-por-django-secret-key
DJANGO_DEBUG=false                  # false en producción
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,tu-dominio.com
DJANGO_HTTPS=false                 # true para activar HTTPS en producción

# Base de datos
DATABASE_ENGINE=django.db.backends.mysql
DATABASE_NAME=DjangoSanidad
DATABASE_USER=root
DATABASE_PASSWORD=tu-password
DATABASE_HOST=localhost
DATABASE_PORT=3306

# Logging
LOGGING_LEVEL=INFO
```

### Paso 5: Migrar base de datos

```bash
python manage.py migrate
```

Crea/actualiza tablas según modelos.

### Paso 6: Crear superusuario

```bash
python manage.py createsuperuser
```

Para acceder a `/admin/`.

### Paso 7: Crear usuarios técnicos

```python
python manage.py shell
```

```python
from api.models import Tecnico
Tecnico.objects.create_user(
    email='tecnico1@sanidad.com',
    password='password123',
    nombre='Juan',
    apellidos='Pérez',
    rol='laboratorio'
)
```

---

## Ejecución del Proyecto

### Desarrollo Local

```bash
python manage.py runserver 0.0.0.0:8000
```

Accede a: http://localhost:8000

### Desarrollo con Recarga Automática

```bash
python manage.py runserver --reload
```

### Producción (Gunicorn + Nginx)

```bash
# Instalar gunicorn
pip install gunicorn

# Recolectar estáticos
python manage.py collectstatic --noinput

# Iniciar gunicorn
gunicorn --bind 0.0.0.0:8000 --workers 4 core.wsgi:application
```

### Modo Portátil (Standalone)

```bash
python launcher_portable.py
```

Lanza servidor sin requerimientos externos. Útil para demostraciones.

### Docker (Opcional)

```bash
docker-compose up -d
```

Si existe `docker/docker-compose.yml`.

---

## Seguridad

### Protecciones Implementadas

| Protección | Implementación |
|------------|-----------------|
| **CSRF** | Django middleware + tokens en formularios |
| **XSS** | Escape automático en templates Jinja2 |
| **Clickjacking** | X-Frame-Options: DENY |
| **HTTPS** | SECURE_SSL_REDIRECT, HSTS headers (configurable) |
| **Path Traversal** | Validación de rutas en `proxy_file()` |
| **IDOR** | Verificación de rol en cada endpoint |
| **SQL Injection** | ORM Django (parameterized queries) |
| **Mass Assignment** | Fields explícitos en serializers |
| **Rate Limiting** | Implementable via middleware personalizado |
| **QR Criptográfico** | Generación con `secrets` (no `random`) |

### Cookies de Sesión

- `SESSION_COOKIE_SECURE`: True en producción (requiere HTTPS)
- `SESSION_COOKIE_HTTPONLY`: True (no acceso desde JS malicioso)
- `CSRF_COOKIE_SAMESITE`: Lax (protección CSRF)

### Headers de Seguridad

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Cache-Control: no-store (archivos médicos)
```

### Hashing de Contraseñas

- Algoritmo: PBKDF2 (Django default)
- Iteraciones: 260000
- Función: `django.contrib.auth.hashers.make_password()`

---

## Deuda Técnica

### Issues Conocidos

1. **Archivos HTML Legacy**: Existen en raíz paralelos a templates Django modernos. Requiere consolidación.
2. **Compatibilidad PHPSanidad**: Algunos campos opcionales para mantener retrocompatibilidad.
3. **Modales QR Inline**: En archivos legacy, lógica QR está embebida en HTML (difícil mantenimiento).
4. **Tests Incompletos**: Cobertura al ~40%, especialmente en integración API-Web.

### Mejoras Pendientes

Ver `MEJORAS.md` para hoja de ruta completa.

---

## Notas Técnicas importantes

### Base de Datos Legacy

- Sistema migrado desde PHPSanidad
- Algunas tablas pueden tener columnas opcionales (`content_type_id`, `object_id`)
- Compatibilidad bidireccional mantenida en serializers
- Fallback a valores existentes en caso de falta de `catalogo_opciones`

### CSS / Modales Necropsias

- ⚠️ **CRÍTICO**: Archivo `css/muestras.css` legacy define `.mimodal { top: -1200px; }` que oculta modales
- Fue eliminado en 11-3-2026
- Si los botones de necropsias dejan de funcionar, verificar si alguien resucitó ese CSS

### Submuestras de Laboratorio (Bioquímica, Hematología, Microbiología)

- Si frontend envía `tincion: ''` o hace `PUT` sin `qr_muestra`, DRF responde 400
- Serializers permiten valores opcionales con `required=False, allow_blank=True`

### Imágenes en Bytes

- Legacy puede enviar imágenes como `bytes` vs `ImageField`
- Coerción automática en `api/models.py` via `_coerce_filefield_bytes()`
- Convierte bytes → `ContentFile` para evitar `AttributeError: 'bytes' object has no attribute 'name'`

### Performance

- Paginación: 20 registros/página por defecto
- Optimizaciones: `select_related('tecnico')`, `defer('volante_peticion', 'informe_imagen')`
- BinaryFields: No se cargan en listados, solo en detaller (`defer()`)

### Logging

- Archivo: `logs/errors.log`
- Rotación: 5 archivos de máximo 10MB cada uno
- Nivel: INFO (development), WARNING (production)

---

## Contacto y Soporte

Para contribuciones, issues o preguntas:
- Revisar `DOCUMENTACION_TECNICA.md`
- Revisar `IMPLEMENTADAS.md` para cambios recientes
- Revisar `MEJORAS.md` para desarrollo futuro

---

**Última actualización**: 24 de Marzo de 2026
**Versión**: 1.0 (En desarrollo activo)
