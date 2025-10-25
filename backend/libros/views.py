# from django.shortcuts import render

# # Create your views here.

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Libro, Sugerencia, Lugar
from .serializers import LibroSerializer, SugerenciaSerializer, LugarSerializer


class LibroViewSet(viewsets.ModelViewSet):
    queryset = Libro.objects.all()
    serializer_class = LibroSerializer

    @action(detail=False, methods=['get'])
    def por_genero(self, request):
        genero = request.query_params.get('genero', None)
        if genero:
            libros = self.queryset.filter(genero__icontains=genero)
            serializer = self.get_serializer(libros, many=True)
            return Response(serializer.data)
        return Response({"error": "Especifica un género"}, status=status.HTTP_400_BAD_REQUEST)


class SugerenciaViewSet(viewsets.ModelViewSet):
    queryset = Sugerencia.objects.all()
    serializer_class = SugerenciaSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"message": "¡Gracias por tu sugerencia!", "data": serializer.data},
            status=status.HTTP_201_CREATED
        )


class LugarViewSet(viewsets.ModelViewSet):
    queryset = Lugar.objects.all()
    serializer_class = LugarSerializer

    @action(detail=False, methods=['get'])
    def por_tipo(self, request):
        tipo = request.query_params.get('tipo', None)
        if tipo:
            lugares = self.queryset.filter(tipo=tipo)
            serializer = self.get_serializer(lugares, many=True)
            return Response(serializer.data)
        return Response({"error": "Especifica un tipo"}, status=status.HTTP_400_BAD_REQUEST)