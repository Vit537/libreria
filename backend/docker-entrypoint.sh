#!/bin/bash
set -e

echo "Comprobando disponibilidad de la base de datos..."
# Si se usa Cloud SQL por Unix Socket, omitimos pg_isready porque el socket se monta en /cloudsql/*
if [[ "${DB_HOST:-}" == /cloudsql/* ]]; then
  echo "Detectado Cloud SQL vía Unix socket (${DB_HOST}), se omite pg_isready"
else
  echo "Esperando a que la base de datos TCP esté lista en ${DB_HOST:-localhost}:${DB_PORT:-5432}..."
  until pg_isready -h "${DB_HOST:-localhost}" -p "${DB_PORT:-5432}" -U "${DB_USER:-postgres}"; do
    echo "Base de datos no disponible - esperando..."
    sleep 2
  done
  echo "Base de datos lista!"
fi

# Ejecutar migraciones
echo "Ejecutando migraciones..."
python manage.py migrate --noinput

# Crear superuser si no existe
echo "👤 Verificando superuser..."
python superuser.py

# Recolectar archivos estáticos
echo "Recolectando archivos estáticos..."
python manage.py collectstatic --noinput

echo "Iniciando servidor..."
exec "$@"
