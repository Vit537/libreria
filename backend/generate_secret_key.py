"""
Script para generar un SECRET_KEY seguro para Django
"""

from django.core.management.utils import get_random_secret_key

if __name__ == '__main__':
    secret_key = get_random_secret_key()
    print("\n" + "="*60)
    print("🔐 SECRET_KEY generado para Django:")
    print("="*60)
    print(secret_key)
    print("="*60)
    print("\nGuarda este SECRET_KEY en:")
    print("  - GitHub Secrets (DJANGO_SECRET_KEY)")
    print("  - Archivo .env para desarrollo local")
    print("  - Google Cloud Secret Manager (producción)")
    print("\n⚠️  NUNCA compartas este SECRET_KEY públicamente")
    print("="*60 + "\n")
