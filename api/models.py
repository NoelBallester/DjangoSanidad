from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

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
    id_tecnico = models.AutoField(primary_key=True, db_column='id')
    nombre = models.CharField(max_length=255, db_column='first_name')
    apellidos = models.CharField(max_length=255, db_column='last_name')
    username = models.CharField(max_length=150, unique=True, null=True, blank=True)
    email = models.EmailField(max_length=255, unique=True)
    centro = models.CharField(max_length=255, null=True, blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = TecnicoManager()

    USERNAME_FIELD = 'id_tecnico'
    REQUIRED_FIELDS = ['nombre', 'apellidos']

    class Meta:
        db_table = 'tecnicos'


# ─── Modelos abstractos base ─────────────────────────────────────────────────

class RegistroBase(models.Model):
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
    volante_peticion = models.BinaryField(null=True, blank=True)
    volante_peticion_nombre = models.CharField(max_length=255, null=True, blank=True)
    volante_peticion_tipo = models.CharField(max_length=100, null=True, blank=True)

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
    informe_imagen = models.BinaryField(null=True, blank=True)

    class Meta:
        abstract = True


class MuestraBase(models.Model):
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


class ImagenBase(models.Model):
    """
    Base abstracta para todos los modelos de imagen de muestra.
    """
    imagen = models.BinaryField(null=True, blank=True, editable=True)

    class Meta:
        abstract = True


# ─── Histología / Cassettes ──────────────────────────────────────────────────

class Cassette(RegistroConInforme):
    id_casette = models.AutoField(primary_key=True)
    cassette = models.CharField(max_length=50)
    qr_casette = models.CharField(max_length=255, unique=True)

    class Meta:
        db_table = 'cassettes'


class Muestra(MuestraBase):
    id_muestra = models.AutoField(primary_key=True)
    cassette = models.ForeignKey(Cassette, on_delete=models.CASCADE)

    class Meta:
        db_table = 'muestras'


class Imagen(ImagenBase):
    id_imagen = models.AutoField(primary_key=True)
    muestra = models.ForeignKey(Muestra, on_delete=models.CASCADE)

    class Meta:
        db_table = 'imagenes'


# ─── Citología ───────────────────────────────────────────────────────────────

class Citologia(RegistroBase):
    id_citologia = models.AutoField(primary_key=True, db_column='id')
    citologia = models.CharField(max_length=50)
    tipo_citologia = models.CharField(max_length=255)
    qr_citologia = models.CharField(max_length=255, unique=True)
    qr_imagen = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        db_table = 'citologias'


class MuestraCitologia(MuestraBase):
    id_muestra = models.AutoField(primary_key=True, db_column='id')
    qr_imagen = models.CharField(max_length=100, null=True, blank=True)
    citologia = models.ForeignKey(Citologia, on_delete=models.CASCADE, db_column='citologia_id')

    class Meta:
        db_table = 'muestrascitologia'


class ImagenCitologia(ImagenBase):
    id_imagen = models.AutoField(primary_key=True, db_column='id')
    muestra = models.ForeignKey(MuestraCitologia, on_delete=models.CASCADE, db_column='muestra_id')

    class Meta:
        db_table = 'imagenescitologia'


# ─── Necropsia ───────────────────────────────────────────────────────────────

class Necropsia(RegistroBase):
    id_necropsia = models.AutoField(primary_key=True, db_column='id')
    necropsia = models.CharField(max_length=50)
    tipo_necropsia = models.CharField(max_length=255)
    fenomenos_cadavericos = models.TextField(null=True, blank=True)
    examen_externo_cadaver = models.TextField(null=True, blank=True)
    datos_muerte = models.TextField(null=True, blank=True)
    qr_necropsia = models.CharField(max_length=255, unique=True)
    qr_imagen = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        db_table = 'necropsias'


class MuestraNecropsia(MuestraBase):
    id_muestra = models.AutoField(primary_key=True, db_column='id')
    examen_interno_cadaver = models.TextField(null=True, blank=True)
    tecnica_apertura = models.CharField(max_length=255, null=True, blank=True)
    datos_relevantes_region = models.TextField(null=True, blank=True)
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
    imagen = models.BinaryField(null=True, blank=True)
    tubo = models.ForeignKey(Tubo, on_delete=models.CASCADE, db_column='tubo_id', null=True, blank=True)
    hematologia = models.ForeignKey(Hematologia, on_delete=models.CASCADE, db_column='hematologia_id', null=True, blank=True)
    microbiologia = models.ForeignKey(Microbiologia, on_delete=models.CASCADE, db_column='microbiologia_id', null=True, blank=True)
    cassette = models.ForeignKey(Cassette, on_delete=models.CASCADE, db_column='cassette_id', null=True, blank=True)
    citologia = models.ForeignKey(Citologia, on_delete=models.CASCADE, db_column='citologia_id', null=True, blank=True)
    necropsia = models.ForeignKey(Necropsia, on_delete=models.CASCADE, db_column='necropsia_id', null=True, blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'informesresultado'
