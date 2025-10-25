# from django.db import models

# # Create your models here.

from django.db import models

class Libro(models.Model):
    titulo = models.CharField(max_length=200)
    autor = models.CharField(max_length=100)
    descripcion = models.TextField()
    genero = models.CharField(max_length=50)
    año_publicacion = models.IntegerField()
    imagen_url = models.URLField(blank=True, null=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-creado_en']

    def __str__(self):
        return f"{self.titulo} - {self.autor}"


class Sugerencia(models.Model):
    nombre = models.CharField(max_length=100)
    email = models.EmailField()
    libro_sugerido = models.CharField(max_length=200)
    autor_sugerido = models.CharField(max_length=100)
    razon = models.TextField()
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-creado_en']

    def __str__(self):
        return f"{self.libro_sugerido} sugerido por {self.nombre}"


class Lugar(models.Model):
    TIPO_CHOICES = [
        ('libreria', 'Librería'),
        ('biblioteca', 'Biblioteca'),
        ('online', 'Tienda Online'),
    ]

    nombre = models.CharField(max_length=200)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    direccion = models.CharField(max_length=300)
    telefono = models.CharField(max_length=20, blank=True)
    sitio_web = models.URLField(blank=True)
    horario = models.CharField(max_length=200, blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['nombre']

    def __str__(self):
        return f"{self.nombre} ({self.get_tipo_display()})"