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
    id_tecnico = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    apellidos = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    centro = models.CharField(max_length=255, null=True, blank=True)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    objects = TecnicoManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre', 'apellidos']
    
    class Meta:
        db_table = 'tecnicos'

class Cassette(models.Model):
    id_casette = models.AutoField(primary_key=True)
    cassette = models.CharField(max_length=50)
    fecha = models.DateField()
    descripcion = models.TextField()  # Detalle biopsia/Nombre paciente
    caracteristicas = models.TextField()  # Descripción macroscópica
    observaciones = models.TextField(null=True, blank=True)
    descripcion_microscopica = models.TextField(null=True, blank=True)
    diagnostico_final = models.TextField(null=True, blank=True)
    patologo_responsable = models.TextField(null=True, blank=True)
    qr_casette = models.CharField(max_length=255, unique=True)
    organo = models.CharField(max_length=255)
    tecnico = models.ForeignKey(Tecnico, on_delete=models.CASCADE, db_column='tecnicoIdTecnico')
    # Campos de Informe de Resultados
    informe_descripcion = models.TextField(null=True, blank=True)
    informe_fecha = models.DateField(null=True, blank=True)
    informe_tincion = models.CharField(max_length=255, null=True, blank=True)
    informe_observaciones = models.TextField(null=True, blank=True)
    informe_imagen = models.BinaryField(null=True, blank=True)  # BLOB
    
    class Meta:
        db_table = 'cassettes'

class Citologia(models.Model):
    id_citologia = models.AutoField(primary_key=True)
    citologia = models.CharField(max_length=50)
    tipo_citologia = models.CharField(max_length=255)  # PAAF, Citología Líquida, Cervico Vaginal, Derrames
    fecha = models.DateField()
    descripcion = models.TextField()  # Detalle biopsia/Nombre paciente
    caracteristicas = models.TextField()  # Descripción macroscópica
    observaciones = models.TextField(null=True, blank=True)
    descripcion_microscopica = models.TextField(null=True, blank=True)
    diagnostico_final = models.TextField(null=True, blank=True)
    patologo_responsable = models.TextField(null=True, blank=True)
    qr_citologia = models.CharField(max_length=255, unique=True)
    organo = models.CharField(max_length=255)
    tecnico = models.ForeignKey(Tecnico, on_delete=models.CASCADE, db_column='tecnicoIdTecnico')
    # Campos de Informe de Resultados
    informe_descripcion = models.TextField(null=True, blank=True)
    informe_fecha = models.DateField(null=True, blank=True)
    informe_tincion = models.CharField(max_length=255, null=True, blank=True)
    informe_observaciones = models.TextField(null=True, blank=True)
    informe_imagen = models.BinaryField(null=True, blank=True)  # BLOB
    
    class Meta:
        db_table = 'citologias'

class Muestra(models.Model):
    id_muestra = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=255)
    fecha = models.DateField()
    observaciones = models.TextField(null=True, blank=True)
    tincion = models.CharField(max_length=255)
    qr_muestra = models.CharField(max_length=255)
    cassette = models.ForeignKey(Cassette, on_delete=models.CASCADE, db_column='cassetteIdCassette')

    class Meta:
        db_table = 'muestras'

class MuestraCitologia(models.Model):
    id_muestra = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=255)
    fecha = models.DateField()
    observaciones = models.TextField(null=True, blank=True)
    tincion = models.CharField(max_length=255)
    qr_muestra = models.CharField(max_length=255)
    citologia = models.ForeignKey(Citologia, on_delete=models.CASCADE, db_column='citologiaIdCitologia')

    class Meta:
        db_table = 'muestrascitologia'

class Imagen(models.Model):
    id_imagen = models.AutoField(primary_key=True)
    imagen = models.ImageField(upload_to='imagenes/', null=True, blank=True)
    muestra = models.ForeignKey(Muestra, on_delete=models.CASCADE, db_column='muestraIdMuestra')

    class Meta:
        db_table = 'imagenes'

class ImagenCitologia(models.Model):
    id_imagen = models.AutoField(primary_key=True)
    imagen = models.ImageField(upload_to='imagenes_citologia/', null=True, blank=True)
    muestra = models.ForeignKey(MuestraCitologia, on_delete=models.CASCADE, db_column='muestraIdMuestra')

    class Meta:
        db_table = 'imagenescitologia'
