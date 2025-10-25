# 🪣 Configuración de Cloud Storage para Next.js

## ¿Por qué usar Cloud Storage para el Frontend?

### Ventajas
- ✅ **Más económico**: $0.026/GB/mes vs Cloud Run
- ✅ **Mejor rendimiento**: Archivos servidos directamente desde CDN
- ✅ **Escalabilidad**: Sin límites de concurrencia
- ✅ **Cache eficiente**: Cache automático de archivos estáticos
- ✅ **CDN gratis**: Con Cloud CDN integrado

### Comparación de Costos

| Recurso | Cloud Run | Cloud Storage + CDN |
|---------|-----------|---------------------|
| Frontend | ~$20-40/mes | ~$5-15/mes |
| Velocidad | Buena | Excelente |
| Escalabilidad | Limitada | Ilimitada |

## 🏗️ Arquitectura Híbrida

```
                    ┌─────────────────────────────┐
                    │        USUARIO              │
                    └──────────┬──────────────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                │  HTML/CSS/JS/Images         │  API Calls
                │  (Archivos estáticos)       │
                │                             │
                ▼                             ▼
    ┌───────────────────────┐    ┌────────────────────────┐
    │  Cloud Storage Bucket  │    │   Cloud Run           │
    │  (Next.js Static)      │    │   (Django Backend)    │
    │                        │    │                       │
    │  - _next/static/*      │    │   - REST API          │
    │  - images/*            │    │   - /api/*            │
    │  - index.html          │    │   - Admin             │
    └───────────────────────┘    └───────┬────────────────┘
                                          │
                                          ▼
                              ┌────────────────────────┐
                              │   Cloud SQL           │
                              │   (PostgreSQL)        │
                              └────────────────────────┘
```

## 📝 Configuración Paso a Paso

### 1. Crear Cloud Storage Bucket

```bash
# Variables
export PROJECT_ID=$(gcloud config get-value project)
export BUCKET_NAME="${PROJECT_ID}-frontend"

# Crear bucket
gsutil mb -p $PROJECT_ID -c STANDARD -l us-central1 gs://${BUCKET_NAME}

# Hacer el bucket público para lectura
gsutil iam ch allUsers:objectViewer gs://${BUCKET_NAME}

# Configurar para website estático
gsutil web set -m index.html -e 404.html gs://${BUCKET_NAME}

# Habilitar CORS
cat > cors.json <<EOF
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
EOF

gsutil cors set cors.json gs://${BUCKET_NAME}
rm cors.json
```

### 2. Build y Deploy de Next.js al Bucket

#### Opción A: Build local y upload

```bash
cd frontend

# Configurar variable de entorno para build
echo "NEXT_PUBLIC_API_URL=https://tu-backend-url.run.app" > .env.production

# Build de producción
npm run build

# El build genera:
# - .next/static/* (archivos estáticos)
# - out/* (si usas static export)

# Upload a Cloud Storage
gsutil -m rsync -r .next/static gs://${BUCKET_NAME}/_next/static
gsutil -m rsync -r public gs://${BUCKET_NAME}

# Si usas static export (recomendado para frontend puro)
npm run export  # Requiere configurar en next.config.ts
gsutil -m rsync -r out gs://${BUCKET_NAME}
```

#### Opción B: GitHub Actions (Automático)

El workflow que crearemos más abajo hace esto automáticamente.

### 3. Configurar Cloud CDN (Opcional pero Recomendado)

```bash
# Crear Load Balancer con CDN
gcloud compute backend-buckets create frontend-backend-bucket \
  --gcs-bucket-name=${BUCKET_NAME} \
  --enable-cdn

# Crear URL map
gcloud compute url-maps create frontend-url-map \
  --default-backend-bucket=frontend-backend-bucket

# Crear proxy HTTP
gcloud compute target-http-proxies create frontend-http-proxy \
  --url-map=frontend-url-map

# Crear IP externa
gcloud compute addresses create frontend-ip --global

# Obtener la IP
gcloud compute addresses describe frontend-ip --global --format="get(address)"

# Crear forwarding rule
gcloud compute forwarding-rules create frontend-forwarding-rule \
  --address=frontend-ip \
  --global \
  --target-http-proxy=frontend-http-proxy \
  --ports=80
```

### 4. Configurar HTTPS (Opcional)

```bash
# Crear certificado SSL para dominio custom
gcloud compute ssl-certificates create frontend-ssl-cert \
  --domains=tudominio.com

# Crear proxy HTTPS
gcloud compute target-https-proxies create frontend-https-proxy \
  --url-map=frontend-url-map \
  --ssl-certificates=frontend-ssl-cert

# Crear forwarding rule HTTPS
gcloud compute forwarding-rules create frontend-https-forwarding-rule \
  --address=frontend-ip \
  --global \
  --target-https-proxy=frontend-https-proxy \
  --ports=443
```

## 🔄 Dos Estrategias de Deployment

### Estrategia 1: Static Export (RECOMENDADO) ✅

**Mejor para:** Aplicaciones con contenido mayormente estático

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',  // Genera HTML estático
  
  // Configurar trailing slashes
  trailingSlash: true,
  
  // Variables de entorno
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  
  // Optimización de imágenes
  images: {
    unoptimized: true, // Requerido para static export
  },
};
```

**Ventajas:**
- 🚀 Ultra rápido (solo HTML/CSS/JS)
- 💰 Muy económico (~$1-5/mes)
- 📦 No requiere servidor Node.js
- ⚡ Cache perfecto

**Limitaciones:**
- ❌ No ISR (Incremental Static Regeneration)
- ❌ No API Routes en Next.js (usar Django backend)
- ❌ No middleware de Next.js

### Estrategia 2: Híbrido (Cloud Storage + Cloud Run)

**Mejor para:** Apps con SSR complejo

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'standalone',
  
  // Configurar asset prefix para Cloud Storage
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://storage.googleapis.com/TU-BUCKET-NAME'
    : '',
  
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
};
```

**Deploy:**
- Archivos estáticos → Cloud Storage
- Server-side code → Cloud Run

## 📋 Configuración Completa

### Paso 1: Actualizar next.config.ts

Ya lo actualizaremos en el siguiente paso.

### Paso 2: Actualizar package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "export": "next build && next export"
  }
}
```

### Paso 3: GitHub Actions para Static Export

El workflow automático se encargará de:
1. Build de Next.js con static export
2. Upload de archivos a Cloud Storage
3. Invalidar cache de CDN

## 🎯 Comandos Útiles

### Ver contenido del bucket
```bash
gsutil ls gs://${BUCKET_NAME}
```

### Limpiar bucket
```bash
gsutil -m rm -r gs://${BUCKET_NAME}/*
```

### Sincronizar archivos
```bash
gsutil -m rsync -r -d out gs://${BUCKET_NAME}
```

### Ver estadísticas
```bash
gsutil du -sh gs://${BUCKET_NAME}
```

### Hacer archivo público
```bash
gsutil acl ch -u AllUsers:R gs://${BUCKET_NAME}/index.html
```

### Configurar cache headers
```bash
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" gs://${BUCKET_NAME}/_next/static/**
```

## 🔒 Seguridad

### Configurar CORS correctamente
```json
[
  {
    "origin": ["https://tu-dominio.com"],
    "method": ["GET", "HEAD"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
```

### Configurar política de bucket
```bash
cat > bucket-policy.json <<EOF
{
  "bindings": [
    {
      "role": "roles/storage.objectViewer",
      "members": ["allUsers"]
    }
  ]
}
EOF

gsutil iam set bucket-policy.json gs://${BUCKET_NAME}
```

## 💰 Costos Estimados

### Cloud Storage
- **Storage**: $0.020 - $0.026 per GB/mes
- **Network egress**: $0.12 per GB (gratis los primeros GB)
- **Operations**: $0.004 per 10,000 ops

### Ejemplo para 1GB de assets, 100k visitas/mes
- Storage: ~$0.03/mes
- Egress: ~$2-5/mes
- Operations: ~$0.50/mes
- **Total: ~$3-8/mes**

### Con CDN habilitado
- CDN cache egress: $0.08 per GB (más barato)
- Cache hit ratio: ~80-90%
- **Total: ~$1-4/mes**

## 🚀 URL Final

Después de configurar, tu app estará disponible en:

### Sin dominio custom
```
http://storage.googleapis.com/TU-BUCKET-NAME/index.html
```

### Con Load Balancer
```
http://IP-EXTERNA/
```

### Con dominio custom
```
https://tudominio.com
```

## ✅ Checklist de Configuración

- [ ] Crear Cloud Storage Bucket
- [ ] Configurar bucket como público
- [ ] Habilitar CORS
- [ ] Actualizar next.config.ts para static export
- [ ] Build y test local
- [ ] Upload manual inicial
- [ ] Configurar GitHub Actions
- [ ] (Opcional) Configurar Cloud CDN
- [ ] (Opcional) Configurar dominio custom
- [ ] Actualizar CORS en Django para nueva URL

## 🆘 Troubleshooting

### Error: 404 en rutas de Next.js
**Solución:** Configurar `trailingSlash: true` y asegurar que el bucket tenga `index.html` en subdirectorios.

### Error: CORS
**Solución:** Configurar CORS en el bucket y en Django backend.

### Error: Imágenes no cargan
**Solución:** Usar `images: { unoptimized: true }` en next.config.ts

### Cache no actualiza
**Solución:** Usar versioning en nombres de archivos o invalidar cache de CDN.

## 📚 Recursos

- [Cloud Storage Documentation](https://cloud.google.com/storage/docs)
- [Cloud CDN Documentation](https://cloud.google.com/cdn/docs)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

---

**Próximo paso:** Actualizar la configuración del proyecto para usar esta estrategia.
