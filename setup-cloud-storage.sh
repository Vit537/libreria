#!/bin/bash
# Script para configurar Cloud Storage para Next.js Frontend

set -e

echo "=========================================="
echo "  Configuración de Cloud Storage"
echo "  para Next.js Frontend"
echo "=========================================="
echo ""

# Verificar que gcloud esté instalado
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI no está instalado"
    echo "   Instala desde: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Obtener project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: No hay proyecto configurado"
    echo "   Ejecuta: gcloud config set project TU_PROJECT_ID"
    exit 1
fi

echo "📋 Proyecto: $PROJECT_ID"
echo ""

# Configurar variables
BUCKET_NAME="${PROJECT_ID}-frontend"
REGION="us-central1"

echo "🪣 Bucket: gs://${BUCKET_NAME}"
echo "📍 Región: ${REGION}"
echo ""

# Preguntar confirmación
read -p "¿Continuar con la configuración? (s/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "❌ Cancelado"
    exit 1
fi

# 1. Crear bucket
echo ""
echo "1️⃣ Creando bucket..."
if gsutil ls -b gs://${BUCKET_NAME} > /dev/null 2>&1; then
    echo "⚠️  Bucket ya existe, continuando..."
else
    gsutil mb -p ${PROJECT_ID} -c STANDARD -l ${REGION} gs://${BUCKET_NAME}
    echo "✅ Bucket creado"
fi

# 2. Configurar como público
echo ""
echo "2️⃣ Configurando bucket como público..."
gsutil iam ch allUsers:objectViewer gs://${BUCKET_NAME}
echo "✅ Bucket configurado como público"

# 3. Configurar como website estático
echo ""
echo "3️⃣ Configurando como website estático..."
gsutil web set -m index.html -e 404.html gs://${BUCKET_NAME}
echo "✅ Website estático configurado"

# 4. Configurar CORS
echo ""
echo "4️⃣ Configurando CORS..."
cat > /tmp/cors.json <<EOF
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD", "OPTIONS"],
    "responseHeader": ["Content-Type", "Access-Control-Allow-Origin"],
    "maxAgeSeconds": 3600
  }
]
EOF

gsutil cors set /tmp/cors.json gs://${BUCKET_NAME}
rm /tmp/cors.json
echo "✅ CORS configurado"

# 5. Mostrar información
echo ""
echo "=========================================="
echo "  ✅ Configuración Completada"
echo "=========================================="
echo ""
echo "📋 Información del Bucket:"
echo "   Nombre: gs://${BUCKET_NAME}"
echo "   URL pública: https://storage.googleapis.com/${BUCKET_NAME}/index.html"
echo ""
echo "📝 Próximos pasos:"
echo "   1. Build del frontend:"
echo "      cd frontend"
echo "      npm run build"
echo ""
echo "   2. Upload de archivos:"
echo "      gsutil -m rsync -r -d out gs://${BUCKET_NAME}"
echo ""
echo "   3. Verificar:"
echo "      https://storage.googleapis.com/${BUCKET_NAME}/index.html"
echo ""
echo "   4. (Opcional) Configurar Cloud CDN:"
echo "      Ver: CLOUD_STORAGE_SETUP.md"
echo ""
echo "=========================================="
