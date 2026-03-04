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

class Cassette(models.Model):
    id_casette = models.AutoField(primary_key=True)
    cassette = models.CharField(max_length=50)
    fecha = models.DateField()
    descripcion = models.CharField(max_length=255)
    caracteristicas = models.TextField()
    observaciones = models.TextField(null=True, blank=True)
    informacion_clinica = models.TextField(null=True, blank=True)
    descripcion_microscopica = models.TextField(null=True, blank=True)
    diagnostico_final = models.TextField(null=True, blank=True)
    patologo_responsable = models.CharField(max_length=255, null=True, blank=True)
    qr_casette = models.CharField(max_length=255, unique=True)
    organo = models.CharField(max_length=255)
    informe_descripcion = models.CharField(max_length=255, null=True, blank=True)
    informe_fecha = models.DateField(null=True, blank=True)
    informe_tincion = models.CharField(max_length=255, null=True, blank=True)
    informe_observaciones = models.TextField(null=True, blank=True)
    informe_imagen = models.BinaryField(null=True, blank=True)

    class Meta:
        db_table = 'cassettes'

class Citologia(models.Model):
    id_citologia = models.AutoField(primary_key=True, db_column='id')
    citologia = models.CharField(max_length=50)
    tipo_citologia = models.CharField(max_length=255)
    fecha = models.DateField()
    descripcion = models.CharField(max_length=255)
    caracteristicas = models.TextField()
    observaciones = models.TextField(null=True, blank=True)
    qr_citologia = models.CharField(max_length=255, unique=True)
    qr_imagen = models.CharField(max_length=100, null=True, blank=True)
    organo = models.CharField(max_length=255)
    tecnico = models.ForeignKey(Tecnico, on_delete=models.SET_NULL, null=True, blank=True, db_column='tecnico_id')

    class Meta:
        db_table = 'citologias'

class Muestra(models.Model):
    id_muestra = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=255)
    fecha = models.DateField()
    observaciones = models.TextField(null=True, blank=True)
    tincion = models.CharField(max_length=255)
    qr_muestra = models.CharField(max_length=255)
    cassette = models.ForeignKey(Cassette, on_delete=models.CASCADE)

    class Meta:
        db_table = 'muestras'

class MuestraCitologia(models.Model):
    id_muestra = models.AutoField(primary_key=True, db_column='id')
    descripcion = models.CharField(max_length=255)
    fecha = models.DateField()
    observaciones = models.TextField(null=True, blank=True)
    tincion = models.CharField(max_length=255)
    qr_muestra = models.CharField(max_length=255)
    qr_imagen = models.CharField(max_length=100, null=True, blank=True)
    citologia = models.ForeignKey(Citologia, on_delete=models.CASCADE, db_column='citologia_id')

    class Meta:
        db_table = 'muestrascitologia'

class Imagen(models.Model):
    id_imagen = models.AutoField(primary_key=True)
    imagen = models.ImageField(upload_to='imagenes/', null=True, blank=True)
    muestra = models.ForeignKey(Muestra, on_delete=models.CASCADE)

    class Meta:
        db_table = 'imagenes'

class ImagenCitologia(models.Model):
    id_imagen = models.AutoField(primary_key=True, db_column='id')
    imagen = models.ImageField(upload_to='imagenes_citologia/', null=True, blank=True)
    muestra = models.ForeignKey(MuestraCitologia, on_delete=models.CASCADE, db_column='muestra_id')

    class Meta:
        db_table = 'imagenescitologia'

class Tubo(models.Model):
    id_tubo = models.AutoField(primary_key=True, db_column='id')
    tubo = models.CharField(max_length=50) # Numero de muestra/tubo
    fecha = models.DateField()
    descripcion = models.CharField(max_length=255) # Detalle / Paciente
    caracteristicas = models.TextField() # Descripción macroscópica
    observaciones = models.TextField(null=True, blank=True)
    informacion_clinica = models.TextField(null=True, blank=True)
    descripcion_microscopica = models.TextField(null=True, blank=True)
    diagnostico_final = models.TextField(null=True, blank=True)
    patologo_responsable = models.CharField(max_length=255, null=True, blank=True)
    qr_tubo = models.CharField(max_length=255, unique=True)
    organo = models.CharField(max_length=255) # Tipo de Muestra
    tecnico = models.ForeignKey(Tecnico, on_delete=models.SET_NULL, null=True, blank=True, db_column='tecnico_id')
    informe_descripcion = models.CharField(max_length=255, null=True, blank=True)
    informe_fecha = models.DateField(null=True, blank=True)
    informe_tincion = models.CharField(max_length=255, null=True, blank=True)
    informe_observaciones = models.TextField(null=True, blank=True)
    informe_imagen = models.BinaryField(null=True, blank=True)

    class Meta:
        db_table = 'tubos'

class MuestraTubo(models.Model):
    id_muestra = models.AutoField(primary_key=True, db_column='id')
    descripcion = models.CharField(max_length=255)
    fecha = models.DateField()
    observaciones = models.TextField(null=True, blank=True)
    tincion = models.CharField(max_length=255)
    qr_muestra = models.CharField(max_length=255)
    qr_imagen = models.CharField(max_length=100, null=True, blank=True)
    tubo = models.ForeignKey(Tubo, on_delete=models.CASCADE, db_column='tubo_id')

    class Meta:
        db_table = 'muestrastubo'

class ImagenTubo(models.Model):
    id_imagen = models.AutoField(primary_key=True, db_column='id')
    imagen = models.ImageField(upload_to='imagenes_tubo/', null=True, blank=True)
    muestra = models.ForeignKey(MuestraTubo, on_delete=models.CASCADE, db_column='muestra_id')

    class Meta:
        db_table = 'imagenestubo'

class Hematologia(models.Model):
    id_hematologia = models.AutoField(primary_key=True, db_column='id')
    hematologia = models.CharField(max_length=50) # Numero de muestra
    fecha = models.DateField()
    descripcion = models.CharField(max_length=255) # Detalle / Paciente
    caracteristicas = models.TextField() # Descripción macroscópica
    observaciones = models.TextField(null=True, blank=True)
    informacion_clinica = models.TextField(null=True, blank=True)
    descripcion_microscopica = models.TextField(null=True, blank=True)
    diagnostico_final = models.TextField(null=True, blank=True)
    patologo_responsable = models.CharField(max_length=255, null=True, blank=True)
    qr_hematologia = models.CharField(max_length=255, unique=True)
    organo = models.CharField(max_length=255) # Tipo de Muestra
    tecnico = models.ForeignKey(Tecnico, on_delete=models.SET_NULL, null=True, blank=True, db_column='tecnico_id')
    informe_descripcion = models.CharField(max_length=255, null=True, blank=True)
    informe_fecha = models.DateField(null=True, blank=True)
    informe_tincion = models.CharField(max_length=255, null=True, blank=True)
    informe_observaciones = models.TextField(null=True, blank=True)
    informe_imagen = models.BinaryField(null=True, blank=True)

    class Meta:
        db_table = 'hematologias'

class MuestraHematologia(models.Model):
    id_muestra = models.AutoField(primary_key=True, db_column='id')
    descripcion = models.CharField(max_length=255)
    fecha = models.DateField()
    observaciones = models.TextField(null=True, blank=True)
    tincion = models.CharField(max_length=255)
    qr_muestra = models.CharField(max_length=255)
    qr_imagen = models.CharField(max_length=100, null=True, blank=True)
    hematologia = models.ForeignKey(Hematologia, on_delete=models.CASCADE, db_column='hematologia_id')

    class Meta:
        db_table = 'muestrashematologia'

class ImagenHematologia(models.Model):
    id_imagen = models.AutoField(primary_key=True, db_column='id')
    imagen = models.ImageField(upload_to='imagenes_hematologia/', null=True, blank=True)
    muestra = models.ForeignKey(MuestraHematologia, on_delete=models.CASCADE, db_column='muestra_id')

    class Meta:
        db_table = 'imageneshematologia'
