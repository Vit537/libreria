#!/bin/bash
# Script para hacer build y deploy manual del frontend a Cloud Storage

set -e

echo "=========================================="
echo "  Deploy Frontend a Cloud Storage"
echo "=========================================="
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "frontend/package.json" ]; then
    echo "❌ Error: Ejecuta este script desde la raíz del proyecto"
    exit 1
fi

# Obtener project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: No hay proyecto configurado"
    echo "   Ejecuta: gcloud config set project TU_PROJECT_ID"
    exit 1
fi

BUCKET_NAME="${PROJECT_ID}-frontend"

# Verificar que el bucket existe
if ! gsutil ls -b gs://${BUCKET_NAME} > /dev/null 2>&1; then
    echo "❌ Error: Bucket gs://${BUCKET_NAME} no existe"
    echo "   Ejecuta primero: ./setup-cloud-storage.sh"
    exit 1
fi

# Preguntar por la URL del backend
echo "Ingresa la URL del backend (ejemplo: https://libreria-backend-xxx.run.app)"
read -p "Backend URL: " BACKEND_URL

if [ -z "$BACKEND_URL" ]; then
    echo "⚠️  No se proporcionó URL del backend, usando localhost"
    BACKEND_URL="http://localhost:8000"
fi

echo ""
echo "📦 Configuración:"
echo "   Backend URL: $BACKEND_URL"
echo "   Bucket: gs://${BUCKET_NAME}"
echo ""

read -p "¿Continuar con el deploy? (s/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "❌ Cancelado"
    exit 1
fi

# 1. Instalar dependencias
echo ""
echo "1️⃣ Instalando dependencias..."
cd frontend
npm ci

# 2. Build
echo ""
echo "2️⃣ Building Next.js (static export)..."
export NEXT_PUBLIC_API_URL="$BACKEND_URL"
export NEXT_OUTPUT_MODE="export"
export NODE_ENV="production"
npm run build

# Verificar que se generó la carpeta out
if [ ! -d "out" ]; then
    echo "❌ Error: No se generó la carpeta 'out'"
    echo "   Verifica next.config.ts y que output='export'"
    exit 1
fi

echo "✅ Build completado"

# 3. Upload a Cloud Storage
echo ""
echo "3️⃣ Subiendo archivos a Cloud Storage..."

# Subir archivos estáticos con cache largo
echo "   📤 Subiendo archivos estáticos (_next)..."
gsutil -m -h "Cache-Control:public, max-age=31536000, immutable" \
  rsync -r -d out/_next gs://${BUCKET_NAME}/_next

# Subir HTML y otros archivos con cache corto
echo "   📤 Subiendo HTML y assets..."
gsutil -m -h "Cache-Control:public, max-age=3600" \
  rsync -r -d -x ".*/_next/.*" out/ gs://${BUCKET_NAME}/

echo "✅ Upload completado"

# 4. Mostrar información
echo ""
echo "=========================================="
echo "  ✅ Deploy Completado"
echo "=========================================="
echo ""
echo "🌐 URLs disponibles:"
echo "   https://storage.googleapis.com/${BUCKET_NAME}/index.html"
echo "   http://storage.googleapis.com/${BUCKET_NAME}/index.html"
echo ""
echo "📋 Información:"
echo "   Bucket: gs://${BUCKET_NAME}"
echo "   Backend: $BACKEND_URL"
echo ""
echo "📝 Próximos pasos:"
echo "   1. Verifica que el sitio carga correctamente"
echo "   2. Actualiza CORS en Django para incluir:"
echo "      https://storage.googleapis.com"
echo "   3. (Opcional) Configura Cloud CDN para mejor rendimiento"
echo "   4. (Opcional) Configura dominio custom"
echo ""
echo "=========================================="
