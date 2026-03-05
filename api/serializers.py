import base64
from rest_framework import serializers
from .models import Tecnico, Cassette, Muestra, Imagen, Citologia, MuestraCitologia, ImagenCitologia, Tubo, MuestraTubo, ImagenTubo, Hematologia, MuestraHematologia, ImagenHematologia

class TecnicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tecnico
        fields = ['id_tecnico', 'nombre', 'apellidos', 'email', 'centro']

class CassetteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cassette
        fields = '__all__'

class MuestraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Muestra
        fields = '__all__'

class ImagenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Imagen
        fields = '__all__'

class CitologiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Citologia
        fields = '__all__'

class MuestraCitologiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = MuestraCitologia
        fields = '__all__'

class ImagenCitologiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenCitologia
        fields = '__all__'

class TuboSerializer(serializers.ModelSerializer):
    imagen_base64 = serializers.SerializerMethodField()
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
            'informe_tincion', 'informe_observaciones', 'imagen_base64'
        ]

    def get_imagen_base64(self, obj):
        if obj.informe_imagen:
            return base64.b64encode(obj.informe_imagen).decode('utf-8')
        return None

class MuestraTuboSerializer(serializers.ModelSerializer):
    imagen_base64 = serializers.SerializerMethodField()
    # Alias para compatibilidad con el frontend de PHPSanidad
    id_muestra = serializers.IntegerField(source='id_muestra', read_only=True)

    class Meta:
        model = MuestraTubo
        fields = '__all__'

    def get_imagen_base64(self, obj):
        if obj.imagen:
            try:
                with open(obj.imagen.path, 'rb') as f:
                    return base64.b64encode(f.read()).decode('utf-8')
            except:
                return None
        return None

class ImagenTuboSerializer(serializers.ModelSerializer):
    imagen_base64 = serializers.SerializerMethodField()

    class Meta:
        model = ImagenTubo
        fields = '__all__'

    def get_imagen_base64(self, obj):
        if obj.imagen:
            try:
                with open(obj.imagen.path, 'rb') as f:
                    return base64.b64encode(f.read()).decode('utf-8')
            except:
                return None
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
            return base64.b64encode(obj.informe_imagen).decode('utf-8')
        return None

class MuestraHematologiaSerializer(serializers.ModelSerializer):
    imagen_base64 = serializers.SerializerMethodField()

    class Meta:
        model = MuestraHematologia
        fields = '__all__'

    def get_imagen_base64(self, obj):
        if hasattr(obj, 'imagen') and obj.imagen:
            try:
                with open(obj.imagen.path, 'rb') as f:
                    return base64.b64encode(f.read()).decode('utf-8')
            except:
                return None
        return None

class ImagenHematologiaSerializer(serializers.ModelSerializer):
    imagen_base64 = serializers.SerializerMethodField()

    class Meta:
        model = ImagenHematologia
        fields = '__all__'

    def get_imagen_base64(self, obj):
        if obj.imagen:
            try:
                with open(obj.imagen.path, 'rb') as f:
                    return base64.b64encode(f.read()).decode('utf-8')
            except:
                return None
        return None
