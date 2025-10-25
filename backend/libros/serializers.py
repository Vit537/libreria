from rest_framework import serializers
from .models import Libro, Sugerencia, Lugar


class LibroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Libro
        fields = '__all__'


class SugerenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sugerencia
        fields = '__all__'


class LugarSerializer(serializers.ModelSerializer):
    tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)
    
    class Meta:
        model = Lugar
        fields = '__all__'