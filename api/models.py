from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.core.files.base import ContentFile
import os
from uuid import uuid4


# ─── Funciones upload_to dinámicas para organizar archivos por tipo ──────────

def upload_volante(instance, filename):
    """Guarda volantes en media/volantes/{tipo}/{uuid}.{ext}"""
    ext = os.path.splitext(filename)[1]
    tipo = getattr(instance, 'volante_peticion_tipo', 'sin_tipo') or 'sin_tipo'
    return f'volantes/{tipo}/{uuid4().hex}{ext}'


def upload_informe_imagen(instance, filename):
    """Guarda informes de imagen por tipo de registro (cassette, citologia, etc)"""
    ext = os.path.splitext(filename)[1]
    model_name = instance.__class__.__name__.lower()
    return f'informes/{model_name}/{uuid4().hex}{ext}'


def upload_imagen_muestra(instance, filename):
    """Guarda imágenes de muestras en carpeta del tipo de muestra"""
    ext = os.path.splitext(filename)[1]
    # Obtener el tipo desde la muestra o el modelo padre
    muestra = instance.muestra if hasattr(instance, 'muestra') else None
    if muestra:
        model_name = muestra.__class__.__name__.lower()
        tipo_muestra = model_name.replace('muestra', '').replace('citologia', 'citologias')
    else:
        model_name = instance.__class__.__name__.lower()
        tipo_muestra = model_name.replace('imagen', '')
    
    tipo_map = {
        'cassette': 'cassettes',
        'citologia': 'citologias',
        'necropsia': 'necropsias',
        'tubo': 'tubos',
        'hematologia': 'hematologia',
        'microbiologia': 'microbiologia',
    }
    tipo = tipo_map.get(tipo_muestra, tipo_muestra)
    return f'imagenes/{tipo}/{uuid4().hex}{ext}'


def upload_qr(instance, filename):
    """Guarda códigos QR en media/qr/"""
    ext = os.path.splitext(filename)[1]
    return f'qr/{uuid4().hex}{ext}'


def upload_informe_resultado(instance, filename):
    """Guarda imágenes de informes de resultado"""
    ext = os.path.splitext(filename)[1]
    return f'informes_resultado/{uuid4().hex}{ext}'


def _extension_imagen_desde_bytes(content):
    if content.startswith(b'\xff\xd8\xff'):
        return '.jpg'
    if content.startswith(b'\x89PNG\r\n\x1a\n'):
        return '.png'
    if content.startswith((b'GIF87a', b'GIF89a')):
        return '.gif'
    if content.startswith(b'BM'):
        return '.bmp'
    if content.startswith(b'RIFF') and content[8:12] == b'WEBP':
        return '.webp'
    return '.bin'


def _coerce_filefield_bytes(instance, field_name, default_ext='.bin'):
    raw = getattr(instance, field_name, None)
    if isinstance(raw, memoryview):
        raw = raw.tobytes()
    elif isinstance(raw, bytearray):
        raw = bytes(raw)

    if not isinstance(raw, bytes):
        return

    if not raw:
        setattr(instance, field_name, None)
        return

    filename = f'legacy_{uuid4().hex}{default_ext}'
    setattr(instance, field_name, None)
    getattr(instance, field_name).save(filename, ContentFile(raw), save=False)


class SoftDeleteQuerySet(models.QuerySet):
    def delete(self):
        return super().update(is_deleted=True)

    def hard_delete(self):
        return super().delete()

    def alive(self):
        return self.filter(is_deleted=False)

    def deleted(self):
        return self.filter(is_deleted=True)


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return SoftDeleteQuerySet(self.model, using=self._db).filter(is_deleted=False)


class SoftDeleteModel(models.Model):
    is_deleted = models.BooleanField(default=False, db_index=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        abstract = True

    def _cascade_soft_delete_children(self):
        for relation in self._meta.related_objects:
            related_model = relation.related_model
            if not isinstance(related_model, type) or not issubclass(related_model, SoftDeleteModel):
                continue
            accessor = relation.get_accessor_name()
            related_manager = getattr(self, accessor, None)
            if related_manager is not None:
                related_manager.all().update(is_deleted=True)

    def delete(self, using=None, keep_parents=False):
        self._cascade_soft_delete_children()
        self.is_deleted = True
        self.save(update_fields=['is_deleted'])

    def hard_delete(self, using=None, keep_parents=False):
        return super().delete(using=using, keep_parents=keep_parents)

    def restore(self):
        self.is_deleted = False
        self.save(update_fields=['is_deleted'])

class TecnicoManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class Tecnico(AbstractBaseUser, PermissionsMixin):
    ROL_PROFESOR = 'profesor'
    ROL_ANATOMIA = 'anatomia_patologica'
    ROL_LABORATORIO = 'laboratorio'

    ROL_CHOICES = [
        (ROL_PROFESOR, 'Profesor'),
        (ROL_ANATOMIA, 'Anatomía Patológica'),
        (ROL_LABORATORIO, 'Laboratorio'),
    ]

    id_tecnico = models.AutoField(primary_key=True, db_column='id')
    nombre = models.CharField(max_length=255, db_column='first_name')
    apellidos = models.CharField(max_length=255, db_column='last_name')
    username = models.CharField(max_length=150, unique=True, null=True, blank=True)
    email = models.EmailField(max_length=255, unique=True)
    centro = models.CharField(max_length=255, null=True, blank=True)
    rol = models.CharField(max_length=30, choices=ROL_CHOICES, default=ROL_LABORATORIO)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = TecnicoManager()

    USERNAME_FIELD = 'id_tecnico'
    REQUIRED_FIELDS = ['nombre', 'apellidos']

    def __str__(self):
        return f"{self.nombre} {self.apellidos}"

    class Meta:
        db_table = 'tecnicos'


class CatalogoOpcion(models.Model):
    TIPO_ORGANO = 'organo'
    TIPO_TINCION = 'tincion'
    TIPO_CITOLOGIA = 'tipo_citologia'
    TIPO_AUTOPSIA = 'tipo_autopsia'
    TIPO_ANALISIS = 'analisis_informe'

    TIPO_CHOICES = [
        (TIPO_ORGANO, 'Organo'),
        (TIPO_TINCION, 'Tincion'),
        (TIPO_CITOLOGIA, 'Tipo citologia'),
        (TIPO_AUTOPSIA, 'Tipo autopsia'),
        (TIPO_ANALISIS, 'Analisis informe'),
    ]

    tipo = models.CharField(max_length=40, choices=TIPO_CHOICES)
    valor = models.CharField(max_length=255)
    categoria = models.CharField(max_length=255, null=True, blank=True)
    orden = models.PositiveIntegerField(default=0)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'catalogo_opciones'
        ordering = ['tipo', 'orden', 'valor']
        unique_together = ('tipo', 'valor')

    def __str__(self):
        return f"{self.tipo}: {self.valor}"


# ─── Modelos abstractos base ─────────────────────────────────────────────────

class DetalleBase(models.Model):
    """
    Base abstracta compartida por todos los registros principales
    (Cassette, Citología, Necropsia, Tubo, Hematología, Microbiología).
    Contiene los campos comunes de identificación, descripción y volante.
    """
    fecha = models.DateField()
    descripcion = models.CharField(max_length=255)
    caracteristicas = models.TextField()
    observaciones = models.TextField(null=True, blank=True)
    organo = models.CharField(max_length=255)
    tecnico = models.ForeignKey(
        'Tecnico',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column='tecnico_id',
    )
    volante_peticion = models.FileField(upload_to=upload_volante, null=True, blank=True)
    volante_peticion_nombre = models.CharField(max_length=255, null=True, blank=True)
    volante_peticion_tipo = models.CharField(max_length=100, null=True, blank=True)

    def save(self, *args, **kwargs):
        _coerce_filefield_bytes(self, 'volante_peticion', default_ext='.bin')
        super().save(*args, **kwargs)

    class Meta:
        abstract = True


class RegistroBase(DetalleBase):
    """
    Alias de compatibilidad sobre DetalleBase para no romper referencias
    existentes en el código y en migraciones históricas.
    """

    class Meta:
        abstract = True


class RegistroConInforme(RegistroBase):
    """
    Extiende RegistroBase con campos clínicos y de informe de resultado.
    Usado por Cassette, Tubo, Hematología y Microbiología.
    """
    informacion_clinica = models.TextField(null=True, blank=True)
    descripcion_microscopica = models.TextField(null=True, blank=True)
    diagnostico_final = models.TextField(null=True, blank=True)
    patologo_responsable = models.CharField(max_length=255, null=True, blank=True)
    informe_descripcion = models.CharField(max_length=255, null=True, blank=True)
    informe_fecha = models.DateField(null=True, blank=True)
    informe_tincion = models.CharField(max_length=255, null=True, blank=True)
    informe_observaciones = models.TextField(null=True, blank=True)
    informe_imagen = models.ImageField(upload_to=upload_informe_imagen, null=True, blank=True)

    def save(self, *args, **kwargs):
        raw = getattr(self, 'informe_imagen', None)
        if isinstance(raw, memoryview):
            raw = raw.tobytes()
        elif isinstance(raw, bytearray):
            raw = bytes(raw)
        ext = _extension_imagen_desde_bytes(raw) if isinstance(raw, bytes) else '.bin'
        _coerce_filefield_bytes(self, 'informe_imagen', default_ext=ext)
        super().save(*args, **kwargs)

    class Meta:
        abstract = True


class MuestraBase(SoftDeleteModel):
    """
    Base abstracta para todos los modelos de muestra.
    Contiene los campos comunes de descripción, fecha, tinción y QR.
    """
    descripcion = models.CharField(max_length=255)
    fecha = models.DateField()
    observaciones = models.TextField(null=True, blank=True)
    tincion = models.CharField(max_length=255)
    qr_muestra = models.CharField(max_length=255)

    class Meta:
        abstract = True


class ImagenBase(SoftDeleteModel):
    """
    Base abstracta para todos los modelos de imagen de muestra.
    """
    imagen = models.ImageField(upload_to=upload_imagen_muestra, null=True, blank=True)

    def save(self, *args, **kwargs):
        raw = getattr(self, 'imagen', None)
        if isinstance(raw, memoryview):
            raw = raw.tobytes()
        elif isinstance(raw, bytearray):
            raw = bytes(raw)
        ext = _extension_imagen_desde_bytes(raw) if isinstance(raw, bytes) else '.bin'
        _coerce_filefield_bytes(self, 'imagen', default_ext=ext)
        super().save(*args, **kwargs)

    class Meta:
        abstract = True


# ─── Histología / Cassettes ──────────────────────────────────────────────────

class Cassette(RegistroConInforme):
    id_casette = models.AutoField(primary_key=True)
    cassette = models.CharField(max_length=50)
    qr_casette = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return f"Cassette {self.cassette}"

    class Meta:
        db_table = 'cassettes'


class Muestra(MuestraBase):
    id_muestra = models.AutoField(primary_key=True)
    cassette = models.ForeignKey(Cassette, on_delete=models.CASCADE)
    numero_bloque = models.CharField(max_length=100, null=True, blank=True)
    descripcion_macroscopica = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'muestras'


class Imagen(ImagenBase):
    id_imagen = models.AutoField(primary_key=True)
    muestra = models.ForeignKey(Muestra, on_delete=models.CASCADE)

    class Meta:
        db_table = 'imagenes'


# ─── Citología ───────────────────────────────────────────────────────────────

class Citologia(RegistroConInforme):
    """
    Representa una citología.
    Hereda de RegistroConInforme para incluir campos de diagnóstico y volante.
    """
    id_citologia = models.AutoField(primary_key=True)
    citologia = models.CharField(max_length=255)
    tipo_citologia = models.CharField(max_length=255)
    qr_citologia = models.CharField(max_length=255, null=True, blank=True)
    qr_imagen = models.ImageField(upload_to=upload_qr, null=True, blank=True)

    def __str__(self):
        return f"Citología {self.citologia}"

    class Meta:
        db_table = 'citologias'


class MuestraCitologia(MuestraBase):
    id_muestra = models.AutoField(primary_key=True, db_column='id')
    qr_imagen = models.CharField(max_length=100, null=True, blank=True)
    citologia = models.ForeignKey(Citologia, on_delete=models.CASCADE, db_column='citologia_id')
    descripcion_microscopica = models.TextField(null=True, blank=True)
    aproximacion_diagnostica = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'muestrascitologia'


class ImagenCitologia(ImagenBase):
    id_imagen = models.AutoField(primary_key=True, db_column='id')
    muestra = models.ForeignKey(MuestraCitologia, on_delete=models.CASCADE, db_column='muestra_id')

    class Meta:
        db_table = 'imagenescitologia'


# ─── Necropsia ───────────────────────────────────────────────────────────────

class Necropsia(RegistroConInforme):
    id_necropsia = models.AutoField(primary_key=True, db_column='id')
    necropsia = models.CharField(max_length=50)
    tipo_necropsia = models.CharField(max_length=255)
    fenomenos_cadavericos = models.TextField(null=True, blank=True)
    examen_externo_cadaver = models.TextField(null=True, blank=True)
    datos_muerte = models.TextField(null=True, blank=True)
    prueba_complementaria = models.TextField(null=True, blank=True)
    qr_necropsia = models.CharField(max_length=255, unique=True)
    qr_imagen = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"Necropsia {self.necropsia}"

    class Meta:
        db_table = 'necropsias'


class MuestraNecropsia(MuestraBase):
    id_muestra = models.AutoField(primary_key=True, db_column='id')
    examen_interno_cadaver = models.TextField(null=True, blank=True)
    tecnica_apertura = models.CharField(max_length=255, null=True, blank=True)
    datos_relevantes_region = models.TextField(null=True, blank=True)
    toma_muestras = models.TextField(null=True, blank=True)
    prueba_complementaria = models.TextField(null=True, blank=True)
    qr_imagen = models.CharField(max_length=100, null=True, blank=True)
    necropsia = models.ForeignKey(Necropsia, on_delete=models.CASCADE, db_column='necropsia_id')

    class Meta:
        db_table = 'muestrasnecropsia'


class ImagenNecropsia(ImagenBase):
    id_imagen = models.AutoField(primary_key=True, db_column='id')
    muestra = models.ForeignKey(MuestraNecropsia, on_delete=models.CASCADE, db_column='muestra_id')

    class Meta:
        db_table = 'imagenesnecropsia'


# ─── Tubos (Histología alternativa) ──────────────────────────────────────────

class Tubo(RegistroConInforme):
    id_tubo = models.AutoField(primary_key=True, db_column='id')
    tubo = models.CharField(max_length=50)  # Numero de muestra/tubo
    qr_tubo = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return f"Tubo {self.tubo}"

    class Meta:
        db_table = 'tubos'


class MuestraTubo(MuestraBase):
    id_muestra = models.AutoField(primary_key=True, db_column='id')
    qr_imagen = models.CharField(max_length=100, null=True, blank=True)
    tubo = models.ForeignKey(Tubo, on_delete=models.CASCADE, db_column='tubo_id')

    class Meta:
        db_table = 'muestrastubo'


class ImagenTubo(ImagenBase):
    id_imagen = models.AutoField(primary_key=True, db_column='id')
    muestra = models.ForeignKey(MuestraTubo, on_delete=models.CASCADE, db_column='muestra_id')

    class Meta:
        db_table = 'imagenestubo'


# ─── Hematología ─────────────────────────────────────────────────────────────

class Hematologia(RegistroConInforme):
    id_hematologia = models.AutoField(primary_key=True, db_column='id')
    hematologia = models.CharField(max_length=50)  # Numero de muestra
    qr_hematologia = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return f"Hematología {self.hematologia}"

    class Meta:
        db_table = 'hematologias'


class MuestraHematologia(MuestraBase):
    id_muestra = models.AutoField(primary_key=True, db_column='id')
    qr_imagen = models.CharField(max_length=100, null=True, blank=True)
    hematologia = models.ForeignKey(Hematologia, on_delete=models.CASCADE, db_column='hematologia_id')

    class Meta:
        db_table = 'muestrashematologia'


class ImagenHematologia(ImagenBase):
    id_imagen = models.AutoField(primary_key=True, db_column='id')
    muestra = models.ForeignKey(MuestraHematologia, on_delete=models.CASCADE, db_column='muestra_id')

    class Meta:
        db_table = 'imageneshematologia'


# ─── Microbiología ────────────────────────────────────────────────────────────

class Microbiologia(RegistroConInforme):
    id_microbiologia = models.AutoField(primary_key=True, db_column='id')
    microbiologia = models.CharField(max_length=50)  # Numero de muestra
    qr_microbiologia = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return f"Microbiología {self.microbiologia}"

    class Meta:
        db_table = 'microbiologias'


class MuestraMicrobiologia(MuestraBase):
    id_muestra = models.AutoField(primary_key=True, db_column='id')
    qr_imagen = models.CharField(max_length=100, null=True, blank=True)
    microbiologia = models.ForeignKey(Microbiologia, on_delete=models.CASCADE, db_column='microbiologia_id')

    class Meta:
        db_table = 'muestrasmicrobiologia'


class ImagenMicrobiologia(ImagenBase):
    id_imagen = models.AutoField(primary_key=True, db_column='id')
    muestra = models.ForeignKey(MuestraMicrobiologia, on_delete=models.CASCADE, db_column='muestra_id')

    class Meta:
        db_table = 'imagenesmicrobiologia'


# ─── Informe de Resultado ─────────────────────────────────────────────────────

class InformeResultado(models.Model):
    id_informe = models.AutoField(primary_key=True, db_column='id')
    descripcion = models.CharField(max_length=255, null=True, blank=True)
    fecha = models.DateField(null=True, blank=True)
    tincion = models.CharField(max_length=255, null=True, blank=True)
    observaciones = models.TextField(null=True, blank=True)
    imagen = models.ImageField(upload_to=upload_informe_resultado, null=True, blank=True)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    creado_en = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        raw = getattr(self, 'imagen', None)
        if isinstance(raw, memoryview):
            raw = raw.tobytes()
        elif isinstance(raw, bytearray):
            raw = bytes(raw)
        ext = _extension_imagen_desde_bytes(raw) if isinstance(raw, bytes) else '.bin'
        _coerce_filefield_bytes(self, 'imagen', default_ext=ext)
        super().save(*args, **kwargs)

    class Meta:
        db_table = 'informesresultado'
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
        ]
