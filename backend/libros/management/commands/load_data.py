from django.core.management.base import BaseCommand
from libros.models import Libro, Lugar


class Command(BaseCommand):
    help = 'Carga datos de prueba'

    def handle(self, *args, **kwargs):
        # Libros de prueba
        libros_data = [
            {
                'titulo': 'Cien años de soledad',
                'autor': 'Gabriel García Márquez',
                'descripcion': 'Una obra maestra del realismo mágico que narra la historia de la familia Buendía.',
                'genero': 'Ficción',
                'año_publicacion': 1967
            },
            {
                'titulo': 'El Principito',
                'autor': 'Antoine de Saint-Exupéry',
                'descripcion': 'Un cuento poético que trata temas profundos como el sentido de la vida y la amistad.',
                'genero': 'Infantil',
                'año_publicacion': 1943
            },
            {
                'titulo': '1984',
                'autor': 'George Orwell',
                'descripcion': 'Una distopía sobre un futuro totalitario donde el gobierno controla todos los aspectos de la vida.',
                'genero': 'Ciencia Ficción',
                'año_publicacion': 1949
            },
        ]

        for libro_data in libros_data:
            Libro.objects.get_or_create(**libro_data)

        # Lugares de prueba
        lugares_data = [
            {
                'nombre': 'Librería Central',
                'tipo': 'libreria',
                'direccion': 'Av. 16 de Julio 1234, La Paz',
                'telefono': '2-2345678',
                'horario': 'Lun-Sáb: 9:00-19:00'
            },
            {
                'nombre': 'Biblioteca Municipal',
                'tipo': 'biblioteca',
                'direccion': 'Calle Comercio 567, La Paz',
                'telefono': '2-2123456',
                'horario': 'Lun-Vie: 8:00-18:00'
            },
            {
                'nombre': 'Amazon Bolivia',
                'tipo': 'online',
                'direccion': 'Plataforma en línea',
                'sitio_web': 'https://amazon.com',
                'horario': '24/7'
            },
        ]

        for lugar_data in lugares_data:
            Lugar.objects.get_or_create(**lugar_data)

        self.stdout.write(self.style.SUCCESS('Datos cargados exitosamente!'))