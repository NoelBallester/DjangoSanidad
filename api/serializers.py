import base64
import logging
import os
from rest_framework import serializers
logger = logging.getLogger(__name__)
from .models import Tecnico, Cassette, Muestra, Imagen, Citologia, MuestraCitologia, ImagenCitologia, Necropsia, MuestraNecropsia, ImagenNecropsia, Tubo, MuestraTubo, ImagenTubo, Hematologia, MuestraHematologia, ImagenHematologia, Microbiologia, MuestraMicrobiologia, ImagenMicrobiologia, InformeResultado

class TecnicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tecnico
        fields = ['id_tecnico', 'nombre', 'apellidos', 'email', 'centro']

class CassetteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cassette
        fields = [
            'id_casette', 'cassette', 'fecha', 'descripcion', 'caracteristicas', 'observaciones',
            'informacion_clinica', 'descripcion_microscopica', 'diagnostico_final',
            'patologo_responsable', 'qr_casette', 'organo', 'tecnico', 'informe_descripcion',
            'informe_fecha', 'informe_tincion', 'informe_observaciones',
            'volante_peticion_nombre', 'volante_peticion_tipo'
        ]

class MuestraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Muestra
        fields = ['id_muestra', 'descripcion', 'fecha', 'observaciones', 'tincion', 'qr_muestra', 'cassette']

class ImagenSerializer(serializers.ModelSerializer):
    imagen_base64 = serializers.SerializerMethodField()

    class Meta:
        model = Imagen
        fields = ['id_imagen', 'muestra', 'imagen_base64']
        read_only_fields = ['id_imagen', 'imagen_base64']

    def get_imagen_base64(self, obj):
        if obj.imagen:
            try:
                return base64.b64encode(obj.imagen.read()).decode('utf-8')
            except Exception:
                return None
        return None

class CitologiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Citologia
        fields = [
            'id_citologia', 'citologia', 'tipo_citologia', 'fecha', 'descripcion', 'caracteristicas',
            'observaciones', 'qr_citologia', 'qr_imagen', 'organo', 'tecnico',
            'volante_peticion_nombre', 'volante_peticion_tipo'
        ]

class MuestraCitologiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = MuestraCitologia
        fields = [
            'id_muestra', 'descripcion', 'fecha', 'observaciones', 'tincion', 'qr_muestra',
            'qr_imagen', 'citologia'
        ]

class ImagenCitologiaSerializer(serializers.ModelSerializer):
    imagen_base64 = serializers.SerializerMethodField()

    class Meta:
        model = ImagenCitologia
        fields = ['id_imagen', 'muestra', 'imagen_base64']
        read_only_fields = ['id_imagen', 'imagen_base64']

    def get_imagen_base64(self, obj):
        if obj.imagen:
            try:
                return base64.b64encode(obj.imagen.read()).decode('utf-8')
            except Exception:
                return None
        return None

class NecropsiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Necropsia
        fields = '__all__'

class MuestraNecropsiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = MuestraNecropsia
        fields = '__all__'

class ImagenNecropsiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenNecropsia
        fields = '__all__'

class TuboSerializer(serializers.ModelSerializer):
    imagen_base64 = serializers.SerializerMethodField()
    volante_peticion_base64 = serializers.SerializerMethodField()
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
            'informe_tincion', 'informe_observaciones', 'imagen_base64',
            'volante_peticion_nombre', 'volante_peticion_tipo', 'volante_peticion_base64'
        ]

    def get_imagen_base64(self, obj):
        if obj.informe_imagen:
            return base64.b64encode(obj.informe_imagen.read()).decode('utf-8')
        return None

    def get_volante_peticion_base64(self, obj):
        if obj.volante_peticion:
            return base64.b64encode(obj.volante_peticion.read()).decode('utf-8')
        return None

class MuestraTuboSerializer(serializers.ModelSerializer):
    imagen_base64 = serializers.SerializerMethodField()

    class Meta:
        model = MuestraTubo
        fields = ['id_muestra', 'descripcion', 'fecha', 'observaciones', 'tincion', 'qr_muestra', 'qr_imagen', 'tubo', 'imagen_base64']
        read_only_fields = ['id_muestra', 'qr_muestra', 'imagen_base64']

    def get_imagen_base64(self, obj):
        # Las imágenes están en la tabla ImagenTubo, relacionada a través de MuestraTubo
        try:
            imagen = obj.imagentubo_set.first()  # Obtener la primera imagen
            if imagen and imagen.imagen:
                return base64.b64encode(imagen.imagen.read()).decode('utf-8')
        except Exception:
            pass
        return None

class ImagenTuboSerializer(serializers.ModelSerializer):
    imagen_base64 = serializers.SerializerMethodField()

    class Meta:
        model = ImagenTubo
        fields = ['id_imagen', 'muestra', 'imagen_base64']
        read_only_fields = ['id_imagen', 'imagen_base64']

    def get_imagen_base64(self, obj):
        if obj.imagen:
            try:
                return base64.b64encode(obj.imagen.read()).decode('utf-8')
            except Exception as e:
                logger.error(f"Error al convertir imagen {obj.id_imagen}: {e}")
        return None

class HematologiaSerializer(serializers.ModelSerializer):
    imagen_base64 = serializers.SerializerMethodField()

    class Meta:
        model = Hematologia
        fields = [
            'id_hematologia', 'hematologia', 'fecha', 'descripcion', 'caracteristicas', 
            'observaciones', 'informacion_clinica', 'descripcion_microscopica', 
            'diagnostico_final', 'patologo_responsable', 'qr_hematologia', 'organo', 
            'tecnico', 'informe_descripcion', 'informe_fecha', 'informe_tincion', 
            'informe_observaciones', 'imagen_base64'
        ]

    def get_imagen_base64(self, obj):
        if obj.informe_imagen:
            return base64.b64encode(obj.informe_imagen.read()).decode('utf-8')
        return None

class MuestraHematologiaSerializer(serializers.ModelSerializer):
    imagen_base64 = serializers.SerializerMethodField()
    id_muestra = serializers.IntegerField(read_only=True)

    class Meta:
        model = MuestraHematologia
        fields = [
            'id_muestra', 'descripcion', 'fecha', 'observaciones', 'tincion',
            'qr_muestra', 'qr_imagen', 'hematologia', 'imagen_base64'
        ]
        read_only_fields = ['id_muestra', 'qr_muestra', 'imagen_base64']

    def get_imagen_base64(self, obj):
        try:
            imagen = obj.imagenhematologia_set.first()
            if imagen and imagen.imagen:
                return base64.b64encode(imagen.imagen.read()).decode('utf-8')
        except Exception:
            pass
        return None


class ImagenHematologiaSerializer(serializers.ModelSerializer):
    imagen_base64 = serializers.SerializerMethodField()

    class Meta:
        model = ImagenHematologia
        fields = ['id_imagen', 'muestra', 'imagen_base64']
        read_only_fields = ['id_imagen', 'imagen_base64']

    def get_imagen_base64(self, obj):
        if obj.imagen:
            try:
                return base64.b64encode(obj.imagen.read()).decode('utf-8')
            except Exception as e:
                logger.error(f"Error al convertir imagen {obj.id_imagen}: {e}")
        return None

class MicrobiologiaSerializer(serializers.ModelSerializer):
    imagen_base64 = serializers.SerializerMethodField()
    volante_peticion_base64 = serializers.SerializerMethodField()
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
            'informe_tincion', 'informe_observaciones', 'imagen_base64',
            'volante_peticion_nombre', 'volante_peticion_tipo', 'volante_peticion_base64'
        ]

    def get_imagen_base64(self, obj):
        if obj.informe_imagen:
            return base64.b64encode(obj.informe_imagen.read()).decode('utf-8')
        return None

    def get_volante_peticion_base64(self, obj):
        if obj.volante_peticion:
            return base64.b64encode(obj.volante_peticion.read()).decode('utf-8')
        return None

class MuestraMicrobiologiaSerializer(serializers.ModelSerializer):
    imagen_base64 = serializers.SerializerMethodField()

    class Meta:
        model = MuestraMicrobiologia
        fields = '__all__'

    def get_imagen_base64(self, obj):
        try:
            imagen = obj.imagenmicrobiologia_set.first()
            if imagen and imagen.imagen:
                return base64.b64encode(imagen.imagen.read()).decode('utf-8')
        except Exception:
            return None
        return None

class ImagenMicrobiologiaSerializer(serializers.ModelSerializer):
    imagen_base64 = serializers.SerializerMethodField()

    class Meta:
        model = ImagenMicrobiologia
        fields = '__all__'

    def get_imagen_base64(self, obj):
        if obj.imagen:
            try:
                return base64.b64encode(obj.imagen.read()).decode('utf-8')
            except Exception:
                return None
        return None


class InformeResultadoSerializer(serializers.ModelSerializer):
    imagen = serializers.CharField(write_only=True, required=False, allow_blank=True)
    imagen_base64 = serializers.SerializerMethodField()

    class Meta:
        model = InformeResultado
        fields = [
            'id_informe', 'descripcion', 'fecha', 'tincion', 'observaciones', 'imagen', 'imagen_base64',
            'tubo', 'hematologia', 'microbiologia', 'cassette', 'citologia', 'necropsia', 'creado_en'
        ]
        read_only_fields = ['id_informe', 'imagen_base64', 'creado_en']

    def get_imagen_base64(self, obj):
        if obj.imagen:
            try:
                return base64.b64encode(obj.imagen.read()).decode('utf-8')
            except Exception:
                return None
        return None
