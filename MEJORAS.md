# Mejoras pendientes - DjangoSanidad

## 🔴 Críticas (Seguridad & Estabilidad)



### 2. Paginación en endpoints de lista
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

### 15. Sin borrado suave (soft delete)
- **Problema:** Al borrar una muestra se eliminan permanentemente sus imágenes e informes. Sin trazabilidad ni recuperación.
- **Solución:** Campo `is_deleted = BooleanField(default=False)` con manager personalizado.
- **Afecta:** `api/models.py`, `api/views.py`

### 16. Sin logging
- **Problema:** No hay registro de errores ni operaciones importantes. Imposible depurar en producción.
- **Solución:** Configurar `LOGGING` en `settings.py` para errores a fichero.
- **Afecta:** `core/settings.py`

### 18. CORS configurable a "allow all"
- **Problema:** `DJANGO_CORS_ALLOW_ALL` puede permitir peticiones desde cualquier origen.
- **Solución:** Eliminar la opción y requerir lista explícita de orígenes.
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

### Fase 3 - Pendientes
- [ ] Paginación (#2)
- [ ] Borrado suave (#15)
- [ ] Logging (#16)
- [x] Zona horaria (#19)
- [x] Manejo de errores (#20)
- [x] Ampliar tests (#25)
