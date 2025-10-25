# from django.contrib import admin

# # Register your models here.


from django.contrib import admin
from .models import Libro, Sugerencia, Lugar


@admin.register(Libro)
class LibroAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'autor', 'genero', 'año_publicacion', 'creado_en')
    list_filter = ('genero', 'año_publicacion')
    search_fields = ('titulo', 'autor', 'descripcion')


@admin.register(Sugerencia)
class SugerenciaAdmin(admin.ModelAdmin):
    list_display = ('libro_sugerido', 'autor_sugerido', 'nombre', 'email', 'creado_en')
    list_filter = ('creado_en',)
    search_fields = ('libro_sugerido', 'autor_sugerido', 'nombre')


@admin.register(Lugar)
class LugarAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'tipo', 'direccion', 'telefono')
    list_filter = ('tipo',)
    search_fields = ('nombre', 'direccion')