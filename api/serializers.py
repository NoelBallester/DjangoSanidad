import logging
from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from django.urls import reverse
logger = logging.getLogger(__name__)
from .models import Tecnico, Cassette, Muestra, Imagen, Citologia, MuestraCitologia, ImagenCitologia, Necropsia, MuestraNecropsia, ImagenNecropsia, Tubo, MuestraTubo, ImagenTubo, Hematologia, MuestraHematologia, ImagenHematologia, Microbiologia, MuestraMicrobiologia, ImagenMicrobiologia, InformeResultado, CatalogoOpcion


def _validar_catalogo(tipo, valor, campo):
    if valor in (None, ''):
        return valor
    # Compatibilidad legacy: algunas vistas antiguas envian valores con
    # variaciones de mayusculas/espacios o valores libres que antes eran
    # aceptados en PHPSanidad. Intentamos coincidencia flexible y, si no hay,
    # dejamos pasar el valor para no romper altas/ediciones con 400.
    if CatalogoOpcion.objects.filter(tipo=tipo, valor=valor, activo=True).exists():
        return valor

    valor_norm = str(valor).strip()
    if CatalogoOpcion.objects.filter(tipo=tipo, valor__iexact=valor_norm, activo=True).exists():
        return valor_norm

    logger.warning("Catalogo sin coincidencia exacta para %s (%s): %r", campo, tipo, valor)
    return valor


class QrUnicoValidatorMixin:
    """
    Mixin para serializers que necesiten validar unicidad de un campo QR.
    La subclase debe declarar `qr_field` con el nombre del campo a validar.
    """
    qr_field: str = None

    def validate(self, attrs):
        attrs = super().validate(attrs)
        if not self.qr_field:
            return attrs
        value = attrs.get(self.qr_field)
        if not value:
            return attrs
        qs = self.Meta.model.objects.filter(**{self.qr_field: value})
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError({self.qr_field: 'El QR ya existe.'})
        return attrs


class FileUrlSerializerMixin:
    def _file_url(self, instance, field_name):
        archivo = getattr(instance, field_name, None)
        if not archivo:
            return None

        try:
            return reverse('api-file-proxy', args=[instance._meta.model_name, instance.pk, field_name])
        except Exception:
            return None

class TecnicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tecnico
        fields = ['id_tecnico', 'nombre', 'apellidos', 'email', 'centro']

class CassetteSerializer(QrUnicoValidatorMixin, serializers.ModelSerializer):
    qr_field = 'qr_casette'

    def validate_organo(self, value):
        return _validar_catalogo(CatalogoOpcion.TIPO_ORGANO, value, 'Organo')

    class Meta:
        model = Cassette
        fields = [
            'id_casette', 'cassette', 'fecha', 'descripcion', 'caracteristicas', 'observaciones',
            'informacion_clinica', 'descripcion_microscopica', 'diagnostico_final',
            'patologo_responsable', 'qr_casette', 'organo', 'tecnico', 'informe_descripcion',
            'informe_fecha', 'informe_tincion', 'informe_observaciones',
            'volante_peticion_nombre', 'volante_peticion_tipo', 'volante_peticion_url'
        ]

    def get_volante_peticion_url(self, obj):
        return self._file_url(obj, 'volante_peticion')

class MuestraSerializer(QrUnicoValidatorMixin, serializers.ModelSerializer):
    qr_field = 'qr_muestra'

    def validate_tincion(self, value):
        return _validar_catalogo(CatalogoOpcion.TIPO_TINCION, value, 'Tincion')

    class Meta:
        model = Muestra
        fields = ['id_muestra', 'descripcion', 'fecha', 'observaciones', 'tincion', 'qr_muestra', 'cassette']

class ImagenSerializer(FileUrlSerializerMixin, serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()

    class Meta:
        model = Imagen
        fields = ['id_imagen', 'muestra', 'imagen_url']
        read_only_fields = ['id_imagen', 'imagen_url']

    def get_imagen_url(self, obj):
        return self._file_url(obj, 'imagen')

class CitologiaSerializer(QrUnicoValidatorMixin, FileUrlSerializerMixin, serializers.ModelSerializer):
    qr_field = 'qr_citologia'
    volante_peticion_url = serializers.SerializerMethodField()

    def validate_tipo_citologia(self, value):
        return _validar_catalogo(CatalogoOpcion.TIPO_CITOLOGIA, value, 'Tipo de citologia')

    def validate_organo(self, value):
        return _validar_catalogo(CatalogoOpcion.TIPO_ORGANO, value, 'Organo')

    class Meta:
        model = Citologia
        fields = [
            'id_citologia', 'citologia', 'tipo_citologia', 'fecha', 'descripcion', 'caracteristicas',
            'observaciones', 'qr_citologia', 'qr_imagen', 'organo', 'tecnico',
            'informacion_clinica', 'descripcion_microscopica', 'diagnostico_final',
            'patologo_responsable', 'informe_descripcion', 'informe_fecha',
            'informe_tincion', 'informe_observaciones',
            'volante_peticion_nombre', 'volante_peticion_tipo', 'volante_peticion_url'
        ]

    def get_volante_peticion_url(self, obj):
        return self._file_url(obj, 'volante_peticion')

class MuestraCitologiaSerializer(QrUnicoValidatorMixin, serializers.ModelSerializer):
    qr_field = 'qr_muestra'

    def validate_tincion(self, value):
        return _validar_catalogo(CatalogoOpcion.TIPO_TINCION, value, 'Tincion')

    class Meta:
        model = MuestraCitologia
        fields = [
            'id_muestra', 'descripcion', 'fecha', 'observaciones', 'tincion', 'qr_muestra',
            'qr_imagen', 'citologia', 'descripcion_microscopica', 'aproximacion_diagnostica'
        ]

class ImagenCitologiaSerializer(FileUrlSerializerMixin, serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()

    class Meta:
        model = ImagenCitologia
        fields = ['id_imagen', 'muestra', 'imagen_url']
        read_only_fields = ['id_imagen', 'imagen_url']

    def get_imagen_url(self, obj):
        return self._file_url(obj, 'imagen')

class NecropsiaSerializer(QrUnicoValidatorMixin, serializers.ModelSerializer):
    qr_field = 'qr_necropsia'

    def validate_tipo_necropsia(self, value):
        return _validar_catalogo(CatalogoOpcion.TIPO_AUTOPSIA, value, 'Tipo de necropsia')

    def validate_organo(self, value):
        return _validar_catalogo(CatalogoOpcion.TIPO_ORGANO, value, 'Organo')

    class Meta:
        model = Necropsia
        fields = [
            'id_necropsia', 'necropsia', 'tipo_necropsia', 'fecha',
            'descripcion', 'caracteristicas', 'observaciones', 'organo',
            'fenomenos_cadavericos', 'examen_externo_cadaver', 'datos_muerte',
            'informacion_clinica', 'descripcion_microscopica', 'diagnostico_final',
            'patologo_responsable', 'informe_descripcion', 'informe_fecha',
            'informe_tincion', 'informe_observaciones',
            'qr_necropsia', 'qr_imagen', 'tecnico',
            'volante_peticion_nombre', 'volante_peticion_tipo', 'volante_peticion_url'
        ]
        read_only_fields = ['id_necropsia', 'qr_necropsia', 'tecnico']

    def get_volante_peticion_url(self, obj):
        return self._file_url(obj, 'volante_peticion')

class MuestraNecropsiaSerializer(QrUnicoValidatorMixin, serializers.ModelSerializer):
    qr_field = 'qr_muestra'

    def validate_tincion(self, value):
        return _validar_catalogo(CatalogoOpcion.TIPO_TINCION, value, 'Tincion')

    class Meta:
        model = MuestraNecropsia
        fields = [
            'id_muestra', 'descripcion', 'fecha', 'observaciones', 'tincion',
            'qr_muestra', 'qr_imagen', 'necropsia',
            'examen_interno_cadaver', 'tecnica_apertura', 'datos_relevantes_region',
            'is_deleted',
        ]
        read_only_fields = ['id_muestra', 'is_deleted']

class ImagenNecropsiaSerializer(FileUrlSerializerMixin, serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()

    class Meta:
        model = ImagenNecropsia
        fields = ['id_imagen', 'muestra', 'imagen_url']
        read_only_fields = ['id_imagen', 'imagen_url']

    def get_imagen_url(self, obj):
        return self._file_url(obj, 'imagen')

class TuboSerializer(QrUnicoValidatorMixin, FileUrlSerializerMixin, serializers.ModelSerializer):
    qr_field = 'qr_tubo'
    informe_imagen_url = serializers.SerializerMethodField()
    volante_peticion_url = serializers.SerializerMethodField()
    # Aliases para compatibilidad con el frontend de PHPSanidad
    id_muestra = serializers.IntegerField(source='id_tubo', read_only=True)
    muestra = serializers.CharField(source='tubo', required=False)
    tipo_muestra = serializers.CharField(source='organo', required=False)
    
    class Meta:
        model = Tubo
        fields = [
            'id_muestra', 'muestra', 'tipo_muestra', 'id_tubo', 'tubo', 'fecha', 
            'descripcion', 'caracteristicas', 'observaciones', 'informacion_clinica', 
            'descripcion_microscopica', 'diagnostico_final', 'patologo_responsable', 
            'qr_tubo', 'organo', 'tecnico', 'informe_descripcion', 'informe_fecha', 
            'informe_tincion', 'informe_observaciones', 'informe_imagen_url',
            'volante_peticion_nombre', 'volante_peticion_tipo', 'volante_peticion_url'
        ]

    def get_informe_imagen_url(self, obj):
        return self._file_url(obj, 'informe_imagen')

    def get_volante_peticion_url(self, obj):
        return self._file_url(obj, 'volante_peticion')

    def validate_organo(self, value):
        return _validar_catalogo(CatalogoOpcion.TIPO_ORGANO, value, 'Organo')

class MuestraTuboSerializer(QrUnicoValidatorMixin, FileUrlSerializerMixin, serializers.ModelSerializer):
    tincion = serializers.CharField(required=False, allow_blank=True)
    qr_muestra = serializers.CharField(required=False, allow_blank=True)
    qr_field = 'qr_muestra'
    imagen_url = serializers.SerializerMethodField()

    class Meta:
        model = MuestraTubo
        fields = ['id_muestra', 'descripcion', 'fecha', 'observaciones', 'tincion', 'qr_muestra', 'qr_imagen', 'tubo', 'imagen_url']
        read_only_fields = ['id_muestra', 'imagen_url']

    def get_imagen_url(self, obj):
        try:
            imagen = obj.imagentubo_set.first()
            if imagen and imagen.imagen:
                return self._file_url(imagen, 'imagen')
                
        except Exception:
            pass
        return None

    def validate_tincion(self, value):
        return _validar_catalogo(CatalogoOpcion.TIPO_TINCION, value, 'Tincion')

class ImagenTuboSerializer(FileUrlSerializerMixin, serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()

    class Meta:
        model = ImagenTubo
        fields = ['id_imagen', 'muestra', 'imagen_url']
        read_only_fields = ['id_imagen', 'imagen_url']

    def get_imagen_url(self, obj):
        try:
            return self._file_url(obj, 'imagen')
        except Exception as e:
            logger.error(f"Error al obtener URL de imagen {obj.id_imagen}: {e}")
            return None

class HematologiaSerializer(QrUnicoValidatorMixin, FileUrlSerializerMixin, serializers.ModelSerializer):
    qr_field = 'qr_hematologia'
    informe_imagen_url = serializers.SerializerMethodField()
    volante_peticion_url = serializers.SerializerMethodField()

    class Meta:
        model = Hematologia
        fields = [
            'id_hematologia', 'hematologia', 'fecha', 'descripcion', 'caracteristicas', 
            'observaciones', 'informacion_clinica', 'descripcion_microscopica', 
            'diagnostico_final', 'patologo_responsable', 'qr_hematologia', 'organo', 
            'tecnico', 'informe_descripcion', 'informe_fecha', 'informe_tincion', 
            'informe_observaciones', 'informe_imagen_url',
            'volante_peticion_nombre', 'volante_peticion_tipo', 'volante_peticion_url'
        ]

    def get_informe_imagen_url(self, obj):
        return self._file_url(obj, 'informe_imagen')

    def get_volante_peticion_url(self, obj):
        return self._file_url(obj, 'volante_peticion')

    def validate_organo(self, value):
        return _validar_catalogo(CatalogoOpcion.TIPO_ORGANO, value, 'Organo')

class MuestraHematologiaSerializer(QrUnicoValidatorMixin, FileUrlSerializerMixin, serializers.ModelSerializer):
    tincion = serializers.CharField(required=False, allow_blank=True)
    qr_muestra = serializers.CharField(required=False, allow_blank=True)
    qr_field = 'qr_muestra'
    imagen_url = serializers.SerializerMethodField()
    id_muestra = serializers.IntegerField(read_only=True)

    class Meta:
        model = MuestraHematologia
        fields = [
            'id_muestra', 'descripcion', 'fecha', 'observaciones', 'tincion',
            'qr_muestra', 'qr_imagen', 'hematologia', 'imagen_url'
        ]
        read_only_fields = ['id_muestra', 'imagen_url']

    def get_imagen_url(self, obj):
        try:
            imagen = obj.imagenhematologia_set.first()
            if imagen and imagen.imagen:
                return self._file_url(imagen, 'imagen')

        except Exception:
            pass
        return None

    def validate_tincion(self, value):
        return _validar_catalogo(CatalogoOpcion.TIPO_TINCION, value, 'Tincion')


class ImagenHematologiaSerializer(FileUrlSerializerMixin, serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()

    class Meta:
        model = ImagenHematologia
        fields = ['id_imagen', 'muestra', 'imagen_url']
        read_only_fields = ['id_imagen', 'imagen_url']

    def get_imagen_url(self, obj):
        try:
            return self._file_url(obj, 'imagen')
        except Exception as e:
            logger.error(f"Error al obtener URL de imagen {obj.id_imagen}: {e}")
            return None

class MicrobiologiaSerializer(QrUnicoValidatorMixin, FileUrlSerializerMixin, serializers.ModelSerializer):
    qr_field = 'qr_microbiologia'
    informe_imagen_url = serializers.SerializerMethodField()
    volante_peticion_url = serializers.SerializerMethodField()
    # Aliases para compatibilidad con el frontend
    id_muestra = serializers.IntegerField(source='id_microbiologia', read_only=True)
    muestra = serializers.CharField(source='microbiologia', required=False)
    tipo_muestra = serializers.CharField(source='organo', required=False)

    class Meta:
        model = Microbiologia
        fields = [
            'id_muestra', 'muestra', 'tipo_muestra', 'id_microbiologia', 'microbiologia', 'fecha', 
            'descripcion', 'caracteristicas', 'observaciones', 'informacion_clinica', 
            'descripcion_microscopica', 'diagnostico_final', 'patologo_responsable', 
            'qr_microbiologia', 'organo', 'tecnico', 'informe_descripcion', 'informe_fecha', 
            'informe_tincion', 'informe_observaciones', 'informe_imagen_url',
            'volante_peticion_nombre', 'volante_peticion_tipo', 'volante_peticion_url'
        ]

    def get_informe_imagen_url(self, obj):
        return self._file_url(obj, 'informe_imagen')

    def get_volante_peticion_url(self, obj):
        return self._file_url(obj, 'volante_peticion')

    def validate_organo(self, value):
        return _validar_catalogo(CatalogoOpcion.TIPO_ORGANO, value, 'Organo')

class MuestraMicrobiologiaSerializer(QrUnicoValidatorMixin, FileUrlSerializerMixin, serializers.ModelSerializer):
    tincion = serializers.CharField(required=False, allow_blank=True)
    qr_muestra = serializers.CharField(required=False, allow_blank=True)
    qr_field = 'qr_muestra'
    imagen_url = serializers.SerializerMethodField()

    class Meta:
        model = MuestraMicrobiologia
        fields = [
            'id_muestra', 'descripcion', 'fecha', 'observaciones', 'tincion',
            'qr_muestra', 'qr_imagen', 'microbiologia', 'imagen_url'
        ]
        read_only_fields = ['id_muestra', 'imagen_url']

    def get_imagen_url(self, obj):
        try:
            imagen = obj.imagenmicrobiologia_set.first()
            if imagen and imagen.imagen:
                return self._file_url(imagen, 'imagen')

        except Exception:
            return None
        return None

    def validate_tincion(self, value):
        return _validar_catalogo(CatalogoOpcion.TIPO_TINCION, value, 'Tincion')

class ImagenMicrobiologiaSerializer(FileUrlSerializerMixin, serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()

    class Meta:
        model = ImagenMicrobiologia
        fields = ['id_imagen', 'muestra', 'imagen_url']
        read_only_fields = ['id_imagen', 'imagen_url']

    def get_imagen_url(self, obj):
        return self._file_url(obj, 'imagen')


class InformeResultadoSerializer(FileUrlSerializerMixin, serializers.ModelSerializer):
    imagen = serializers.CharField(write_only=True, required=False, allow_blank=True)
    imagen_url = serializers.SerializerMethodField()
    cassette = serializers.IntegerField(write_only=True, required=False)
    citologia = serializers.IntegerField(write_only=True, required=False)
    necropsia = serializers.IntegerField(write_only=True, required=False)
    tubo = serializers.IntegerField(write_only=True, required=False)
    hematologia = serializers.IntegerField(write_only=True, required=False)
    microbiologia = serializers.IntegerField(write_only=True, required=False)
    target_model = serializers.SerializerMethodField()
    target_id = serializers.SerializerMethodField()

    class Meta:
        model = InformeResultado
        fields = [
            'id_informe', 'descripcion', 'fecha', 'tincion', 'observaciones', 'imagen', 'imagen_url',
            'tubo', 'hematologia', 'microbiologia', 'cassette', 'citologia', 'necropsia',
            'target_model', 'target_id', 'creado_en'
        ]
        read_only_fields = ['id_informe', 'imagen_url', 'target_model', 'target_id', 'creado_en']

    def get_imagen_url(self, obj):
        return self._file_url(obj, 'imagen')

    def get_target_model(self, obj):
        return obj.content_type.model if obj.content_type else None

    def get_target_id(self, obj):
        return obj.object_id

    def validate_tincion(self, value):
        # En informes de laboratorio se usan analisis libres (p.ej. "Perfil hepatico").
        # No forzamos catalogo aqui para mantener compatibilidad con esos flujos.
        return value

    def validate(self, attrs):
        target_payload = {
            'cassette': attrs.pop('cassette', None),
            'citologia': attrs.pop('citologia', None),
            'necropsia': attrs.pop('necropsia', None),
            'tubo': attrs.pop('tubo', None),
            'hematologia': attrs.pop('hematologia', None),
            'microbiologia': attrs.pop('microbiologia', None),
        }

        provided = [(k, v) for k, v in target_payload.items() if v not in (None, '')]

        if self.instance is None and len(provided) != 1:
            raise serializers.ValidationError('Debe indicar exactamente un destino para el informe.')

        if len(provided) > 1:
            raise serializers.ValidationError('Solo se permite un destino por informe.')

        if provided:
            model_map = {
                'cassette': Cassette,
                'citologia': Citologia,
                'necropsia': Necropsia,
                'tubo': Tubo,
                'hematologia': Hematologia,
                'microbiologia': Microbiologia,
            }
            field, target_id = provided[0]
            model = model_map[field]
            try:
                attrs['_target_object'] = model.objects.get(pk=target_id)
            except model.DoesNotExist:
                raise serializers.ValidationError({field: 'Registro de destino no encontrado.'})

        return attrs

    def create(self, validated_data):
        target = validated_data.pop('_target_object')
        informe = InformeResultado.objects.create(content_object=target, **validated_data)
        return informe

    def update(self, instance, validated_data):
        target = validated_data.pop('_target_object', None)
        if target is not None:
            instance.content_object = target
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance
