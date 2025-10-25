#!/bin/bash
set -e

echo "Esperando a que la base de datos esté lista..."
until pg_isready -h ${DB_HOST:-localhost} -p ${DB_PORT:-5432} -U ${DB_USER:-postgres}; do
  echo "Base de datos no disponible - esperando..."
  sleep 2
done

echo "Base de datos lista!"

# Ejecutar migraciones
echo "Ejecutando migraciones..."
python manage.py migrate --noinput

# Recolectar archivos estáticos
echo "Recolectando archivos estáticos..."
python manage.py collectstatic --noinput

echo "Iniciando servidor..."
exec "$@"
