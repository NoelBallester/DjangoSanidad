# Migración de PHPSanidad a DjangoSanidad - Guía de Completación

## Estado Actual

Se han realizado los siguientes cambios exitosamente:

### 1. ✅ Modelos Django Actualizados
- **Cassette**: Añadidos campos para informe médico (descripcion_microscopica, diagnostico_final, patologo_responsable, informe_descripcion, informe_fecha, informe_tincion, informe_observaciones, informe_imagen)
- **Citologia**: Mismos campos que Cassette
- **Muestra, MuestraCitologia**: Sin cambios (coinciden con PHP)
- **Imagen, ImagenCitologia**: Campo imagen cambió de ImageField a BinaryField para coincidir con BLOB de PHP

**Archivo**: `/api/models.py`

### 2. ✅ Vistas/APIs Completamente Replicadas
Todas las operaciones del sistema PHP replicadas en Django REST Framework:

#### Cassettes
- `GET /api/cassettes/index/` → últimos 10
- `GET /api/cassettes/todos/` → todos
- `GET /api/cassettes/{id}/` → detalle
- `GET /api/cassettes/por_organo/{organo}/` → filtrar por órgano
- `GET /api/cassettes/por_numero/{numero}/` → filtrar por número
- `GET /api/cassettes/por_fecha/{fecha}/` → filtrar por fecha
- `GET /api/cassettes/rango_fechas/?inicio=X&fin=Y` → rango de fechas
- `GET /api/cassettes/por_qr/{qr}/` → buscar por QR
- `POST /api/cassettes/` → crear
- `PUT /api/cassettes/{id}/` → actualizar
- `DELETE /api/cassettes/{id}/` → eliminar
- `POST /api/cassettes/{id}/actualizar_informe/` → actualizar solo informe

#### Citologías (idénticas a cassettes)
- Mismos endpoints pero con `/api/citologias/`

#### Muestras & MuestrasCitologia
- `GET /api/muestras/por_cassette/{id}/` → muestras de un cassette
- `GET /api/mestras/por_citologia/{id}/` → muestras de una citología
- `GET /api/muestras/{id}/` → detalle muestra
- `GET /api/muestras/por_qr/{qr}/` → buscar por QR
- `POST /api/muestras/` → crear
- `PUT /api/muestras/{id}/` → actualizar  
- `DELETE /api/muestras/{id}/` → eliminar

#### Imágenes
- `GET /api/imagenes/por_muestra/{id}/` → imágenes de muestra
- `POST /api/imagenes/` → crear/subir
- `DELETE /api/imagenes/{id}/` → eliminar

**Archivo**: `/api/views.py`

### 3. ✅ Migraciones de BD Aplicadas
- Creado: `api/migrations/0002_cassette_descripcion_microscopica_and_more.py`
- Aplicado exitosamente
- Base de datos actualizada con todos los nuevos campos

### 4. ✅ Archivos HTML Copiados
- `citologias.html` ✓
- `cassettes.html` ✓

### 5. ⚠️ Archivos JavaScript - Parcialmente Adaptados

#### cassettes.js - ADAPTADO para Django
Los siguientes cambios se realizaron:
- Todas las peticiones ahora usan `/api/cassettes/`, `/api/muestras/`, `/api/imagenes/`
- Cambiado de POST con "accion" a REST (GET, POST, PUT, DELETE)
- Manejo de FormData para subida de imágenes funciona igual
- Respuestas JSON se adaptan automáticamente

**Funciones adaptadas completamente:**
- cargarCassettesIndex()
- crearCassette()
- cargarTodosCassettes()
- cargarCassette()
- cargarPorOrgano()
- cargarPorNumero()
- obtenerCassettesFecha()
- obtenerCassettesFechaRango()
- borrarCassette()
- modificarCassetteUpdate()
- cargarMuestras()
- crearMuestra()
- cargarMuestraUpdateModal()
- modificarMuestraUpdate()
- cargarMuestra()
- obtenerImagenesMuestra()
- borrarMuestra()
- borrarImagenMuestra()
- consultarCassetteQR()

#### citologias.js - REQUIERE ADAPTACIÓN
Necesita cambios similares a cassettes.js. Las funciones a cambiar son idénticas pero apuntan al endpoint de citologías.

---

## Cambios Requeridos en JavaScript

Para completar la adaptación de `citologias.js`, reemplazar todas las peticiones siguiendo este patrón:

### Patrón PHP Original:
```javascript
fetch("modelo/citologias/citologias.php", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ accion: "cargarCitologiaId", citologiaId: id })
})
```

### Patrón Django:
```javascript
fetch(`/api/citologias/${id}/`, {
  method: "GET",
  headers: { "Content-Type": "application/json" }
})
```

### Mapeo de Acciones:

| Acción PHP | Endpoint Django | Método |
|-----------|-----------------|--------|
| cargarCitologiasIndex | /api/citologias/index/ | GET |
| crearCitologia | /api/citologias/ | POST |
| cargarTodasCitologias | /api/citologias/todos/ | GET |
| cargarCitologiaId | /api/citologias/{id}/ | GET |
| citologiasOrgano | /api/citologias/por_organo/{organo}/ | GET |
| citologiasNumero | /api/citologias/por_numero/{numero}/ | GET |
| citologiasFecha | /api/citologias/por_fecha/{fecha}/ | GET |
| citologiasRangoFechas | /api/citologias/rango_fechas/?inicio=X&fin=Y | GET |
| cargarCitologiaQR | /api/citologias/por_qr/{qr}/ | GET |
| modificarCitologia | /api/citologias/{id}/ | PUT |
| borrarCitologia | /api/citologias/{id}/ | DELETE |
| actualizarInformeMedico | /api/citologias/{id}/actualizar_informe/ | POST |
| cargarMuestras(citologiaId) | /api/muestrascitologia/por_citologia/{citologiaId}/ | GET |
| cargarMuestra | /api/muestrascitologia/{id}/ | GET |
| modificarMuestra | /api/muestrascitologia/{id}/ | PUT |
| borrarMuestra | /api/muestrascitologia/{id}/ | DELETE |
| crearMuestra | /api/muestrascitologia/ | POST |
| cargarImagenesMuestra | /api/imagenescitologia/por_muestra/{id}/ | GET |
| borrarImagen | /api/imagenescitologia/{id}/ | DELETE |
| crearMuestra (imagen) | /api/imagenescitologia/ | POST |
| consultarMuestraQR | /api/muestrascitologia/por_qr/{qr}/ | GET |

### Cambios en Nombres de Parámetros:

Los parámetros que enviaban a PHP necesitan ajustarse para Django:

| PHP | Django |
|-----|--------|
| `microscopia` | `descripcion_microscopica` |
| `diagnostico` | `diagnostico_final` |
| `patologo` | `patologo_responsable` |
| `tecnicoIdTecnico` | `tecnico` (ForeignKey automáticamente maneja el ID) |
| `cassetteIdCassette` | `cassette` |
| `citologiaIdCitologia` | `citologia` |
| `muestraIdMuestra` | `muestra` |

### Cambios en Respuestas JSON:

Las claves de respuesta pueden variar. Django DRF devuelve:
- `id_cassette`, `id_citologia`, `id_muestra` → se mantienen igual
- Todos los campos con subrayos: `descripcion_microscopica` (Django) vs `microscopia` (PHP)

---

## Cambios en Campos HTML

Los archivos HTML copian dos cambios menores:

1. Los campos del formulario deben coincidir con los nombres de Django:
   - `inputMicroscopia` → `descripcion_microscopica`
   - `inputDiagnostico` → `diagnostico_final`
   - `inputPatologo` → `patologo_responsable`

2. Las IDs del DOM pueden necesitar ajuste pero generalmente funcionan igual

---

## Cambios en Manejo de Imágenes

### PHP Original:
```javascript
let newImage = new FormData();
newImage.append("accion", "crearImagenMuestra");
newImage.append("imagen", file);
newImage.append("muestraIdMuestra", muestraId);
fetch("modelo/muestras/muestrasimagenes.php", { method: "POST", body: newImage })
```

### Django:
```javascript
let newImage = new FormData();
newImage.append("imagen", file);
newImage.append("muestra", muestraId);  // o "citologia"
fetch("/api/imagenes/", { method: "POST", body: newImage })  // o "/api/imagenescitologia/"
```

---

## Pasos Finales para Completar

1. **Adaptar citologias.js**: Reemplazar todas las peticiones siguiendo el mapeo anterior
   - Buscar: `"modelo/citologias/citologias.php"`
   - Reemplazar con: `/api/citologias/` (ajustando método y estructura)

2. **Verificar nombres de campos en FormData**:
   - Asegurar que usar nombres Django, no PHP
   - Ejemplo: `newMuestra.append("tecnico", ...)` en lugar de `tecnicoIdTecnico`

3. **Actualizar índices de Array**:
   - Si el código accede a respuesta[0], etc., verificar que coincida con la estructura JSON

4. **Pruebas**:
   - Verificar la consola del navegador (F12) para errores de red
   - Verificar en Django (Terminal/Logs) para errores de API
   - Usar Postman/curl para probar endpoints individuales

5. **CSRF Token** (si es necesario):
   - Si Django requiere tokens CSRF, añadir al header de peticiones POST
   - Ver: https://docs.djangoproject.com/en/stable/middleware/csrf/

---

## API Helper JavaScript (Opcional pero Recomendado)

Se ha creado un archivo `js/api-django.js` con funciones helper que pueden usarse:

```javascript
// Usar en lugar de fetch directo:
import { cassettesAPI, muestrasAPI, imagenesAPI } from '/js/api-django.js';

// Ejemplos:
const cassettes = await cassettesAPI.todos();
const cassette = await cassettesAPI.obtener(1);
await cassettesAPI.crear({ cassette: "C001", ... });
await muestrasAPI.porCassette(1);
await imagenesAPI.porMuestra(1);
```

**Ventajas:**
- Encapsula toda la lógica de API en un lugar
- Fácil mantener y actualizar
- Menos duplicación de código en los archivos principales

Para usar este enfoque:
1. Convertir cassettes.js y citologias.js a módulos ES6
2. Importar las funciones de api-django.js
3. Usar las funciones helper en lugar de fetch directo

---

## Verificación de Estado

### ✅ Completado
- Modelos Django
- Vistas/APIs
- Migraciones BD
- Archivos HTML
- cassettes.js (adaptado)
- api-django.js (archivo helper)

### ⚠️ Pendiente
- citologias.js (adaptación manual)
- Pruebas funcionales
- Posibles ajustes menores en HTML

---

## Comando para Probar la API

```bash
# Obtener todos los cassettes
curl http://localhost:8000/api/cassettes/

# Obtener una citología
curl http://localhost:8000/api/citologias/1/

# Crear cassette (POST)
curl -X POST http://localhost:8000/api/cassettes/ \
  -H "Content-Type: application/json" \
  -d '{"cassette": "C001", "fecha": "2026-03-03", ...}'
```

---

Es Fácil de completar considerando el gran trabajo de base ya realizado. ¡Adelante!
