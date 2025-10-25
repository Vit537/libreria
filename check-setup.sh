#!/bin/bash

# Script para verificar que todo está listo antes del deploy

echo "🔍 Verificando configuración del proyecto..."

# Verificar archivos Docker
echo ""
echo "📦 Verificando archivos Docker..."
if [ -f "backend/Dockerfile" ]; then
    echo "✅ backend/Dockerfile existe"
else
    echo "❌ backend/Dockerfile no encontrado"
fi

if [ -f "frontend/Dockerfile" ]; then
    echo "✅ frontend/Dockerfile existe"
else
    echo "❌ frontend/Dockerfile no encontrado"
fi

if [ -f "docker-compose.yml" ]; then
    echo "✅ docker-compose.yml existe"
else
    echo "❌ docker-compose.yml no encontrado"
fi

# Verificar archivos de configuración
echo ""
echo "⚙️ Verificando archivos de configuración..."
if [ -f ".env.example" ]; then
    echo "✅ .env.example existe"
else
    echo "❌ .env.example no encontrado"
fi

if [ -f ".gitignore" ]; then
    echo "✅ .gitignore existe"
else
    echo "❌ .gitignore no encontrado"
fi

# Verificar GitHub Actions
echo ""
echo "🚀 Verificando GitHub Actions..."
if [ -f ".github/workflows/deploy-to-gcp.yml" ]; then
    echo "✅ GitHub Actions workflow existe"
else
    echo "❌ GitHub Actions workflow no encontrado"
fi

# Verificar dependencias del backend
echo ""
echo "🐍 Verificando dependencias del backend..."
if [ -f "backend/requirements.txt" ]; then
    echo "✅ requirements.txt existe"
    if grep -q "gunicorn" backend/requirements.txt; then
        echo "✅ gunicorn está en requirements.txt"
    else
        echo "❌ gunicorn no encontrado en requirements.txt"
    fi
    if grep -q "whitenoise" backend/requirements.txt; then
        echo "✅ whitenoise está en requirements.txt"
    else
        echo "❌ whitenoise no encontrado en requirements.txt"
    fi
else
    echo "❌ requirements.txt no encontrado"
fi

# Verificar configuración del frontend
echo ""
echo "⚛️ Verificando configuración del frontend..."
if [ -f "frontend/next.config.ts" ]; then
    echo "✅ next.config.ts existe"
    if grep -q "standalone" frontend/next.config.ts; then
        echo "✅ output: 'standalone' configurado"
    else
        echo "⚠️ output: 'standalone' no encontrado (necesario para Docker)"
    fi
else
    echo "❌ next.config.ts no encontrado"
fi

# Verificar git
echo ""
echo "📝 Verificando Git..."
if [ -d ".git" ]; then
    echo "✅ Repositorio Git inicializado"
    
    # Verificar archivos sin commit
    if [ -n "$(git status --porcelain)" ]; then
        echo "⚠️ Hay archivos sin commit"
        echo "   Ejecuta: git add . && git commit -m 'Setup for Cloud Run deployment'"
    else
        echo "✅ Todos los archivos están commiteados"
    fi
else
    echo "❌ Repositorio Git no inicializado"
    echo "   Ejecuta: git init"
fi

# Resumen
echo ""
echo "============================================"
echo "📋 RESUMEN"
echo "============================================"
echo ""
echo "Próximos pasos:"
echo ""
echo "1. Crear archivo .env basado en .env.example"
echo "2. Probar localmente con: docker-compose up --build"
echo "3. Configurar Google Cloud (ver DEPLOYMENT.md)"
echo "4. Configurar GitHub Secrets (ver README.md)"
echo "5. Push a GitHub para activar el deployment"
echo ""
echo "Para más información, consulta:"
echo "  - README.md: Documentación general"
echo "  - DEPLOYMENT.md: Guía de deployment paso a paso"
echo ""
