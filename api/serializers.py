from rest_framework import serializers
from .models import Tecnico, Cassette, Muestra, Imagen, Citologia, MuestraCitologia, ImagenCitologia

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
