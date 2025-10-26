import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tu_proyecto.settings')  # Cambia 'tu_proyecto' por el nombre real
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

if password:
    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username, email, password)
        print(f'✅ Superuser "{username}" creado exitosamente')
    else:
        print(f'ℹ️  Superuser "{username}" ya existe')
else:
    print('⚠️  No se proporcionó DJANGO_SUPERUSER_PASSWORD')