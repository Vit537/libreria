# Guía Rápida de Inicio

## 🚀 Quick Start - Desarrollo Local

### 1. Inicializar Git (si no está inicializado)
```bash
git init
git add .
git commit -m "Initial commit: Setup Django + Next.js with Docker and Cloud Run"
```

### 2. Crear archivo .env
```bash
cp .env.example .env
```
Edita `.env` con tus valores locales.

### 3. Iniciar con Docker Compose
```bash
docker-compose up --build
```

Accede a:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Admin: http://localhost:8000/admin

### 4. Crear superusuario (en otra terminal)
```bash
docker-compose exec backend python manage.py createsuperuser
```

## ☁️ Deploy a Google Cloud

### Paso 1: Configurar Google Cloud Project

```bash
# Instalar gcloud CLI
# https://cloud.google.com/sdk/docs/install

# Iniciar sesión y configurar proyecto
gcloud auth login
gcloud config set project TU_PROJECT_ID

# Habilitar APIs
gcloud services enable run.googleapis.com sqladmin.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com
```

### Paso 2: Crear Infraestructura

#### Cloud SQL (PostgreSQL)
```bash
gcloud sql instances create libreria-db \
  --database-version=POSTGRES_15 \
  --cpu=1 \
  --memory=3840MB \
  --region=us-central1 \
  --root-password=TU_PASSWORD

gcloud sql databases create libreria_db --instance=libreria-db
gcloud sql users create libreria_user --instance=libreria-db --password=TU_PASSWORD
```

#### Artifact Registry
```bash
gcloud artifacts repositories create libreria \
  --repository-format=docker \
  --location=us-central1
```

### Paso 3: Configurar GitHub

#### Crear repositorio en GitHub
```bash
# En GitHub: Create new repository
# Luego en tu terminal:
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git branch -M main
git push -u origin main
```

#### Crear Service Account para GitHub Actions
```bash
export PROJECT_ID=$(gcloud config get-value project)

gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions"

# Dar permisos
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Crear y descargar key
gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions@$PROJECT_ID.iam.gserviceaccount.com

# Mostrar contenido (copiar para GitHub)
cat key.json
```

### Paso 4: Configurar GitHub Secrets

Ve a: `Tu Repo → Settings → Secrets and variables → Actions`

Crea estos secrets:

| Secret Name | Valor | Descripción |
|------------|-------|-------------|
| `GCP_PROJECT_ID` | tu-project-id | ID de tu proyecto GCP |
| `GCP_SA_KEY` | {contenido de key.json} | JSON completo del service account |
| `DJANGO_SECRET_KEY` | [generar nuevo](#generar-secret-key) | Secret key de Django |
| `DB_NAME` | libreria_db | Nombre de la base de datos |
| `DB_USER` | libreria_user | Usuario de la base de datos |
| `DB_PASSWORD` | tu-password | Password de Cloud SQL |
| `DB_HOST` | /cloudsql/PROJECT:REGION:INSTANCE | Host de Cloud SQL |
| `CLOUD_SQL_CONNECTION_NAME` | PROJECT:REGION:INSTANCE | Connection name |
| `ALLOWED_HOSTS` | * | Actualizar después del primer deploy |

#### Generar Secret Key
```bash
cd backend
python generate_secret_key.py
```

### Paso 5: Deploy

```bash
git add .
git commit -m "Configure for production deployment"
git push origin main
```

GitHub Actions automáticamente:
1. ✅ Construye las imágenes Docker
2. ✅ Las sube a Artifact Registry
3. ✅ Despliega backend en Cloud Run
4. ✅ Despliega frontend en Cloud Run

### Paso 6: Actualizar CORS

Después del primer deploy:

1. Obtén las URLs de Cloud Run:
```bash
gcloud run services describe libreria-backend --region=us-central1 --format='value(status.url)'
gcloud run services describe libreria-frontend --region=us-central1 --format='value(status.url)'
```

2. Actualiza el secret `ALLOWED_HOSTS` en GitHub:
   - Valor: `libreria-backend-xxxx.run.app,libreria-frontend-xxxx.run.app`

3. Re-despliega haciendo push a main

## 📚 Documentación Adicional

- **README.md**: Documentación completa del proyecto
- **DEPLOYMENT.md**: Guía detallada de deployment
- **check-setup.bat/sh**: Script de verificación

## 🔧 Comandos Útiles

```bash
# Ver logs en Cloud Run
gcloud run services logs read libreria-backend --region=us-central1

# Ejecutar migraciones en Cloud Run
gcloud run jobs create migrate-db \
  --image=IMAGE_URL \
  --tasks=1 \
  --set-env-vars="..." \
  --execute-now

# Conectar a Cloud SQL localmente
cloud_sql_proxy -instances=PROJECT:REGION:INSTANCE=tcp:5432

# Ver estado de servicios
gcloud run services list --region=us-central1
```

## ⚠️ Importante

- **NUNCA** subas el archivo `.env` a Git
- **SIEMPRE** usa `DEBUG=False` en producción
- **ACTUALIZA** `ALLOWED_HOSTS` y `CORS_ALLOWED_ORIGINS` después del deploy
- **GUARDA** el archivo `key.json` de forma segura (no subirlo a Git)

## 🆘 Troubleshooting

### Error de conexión a la base de datos
- Verifica que Cloud SQL está activo
- Verifica `CLOUD_SQL_CONNECTION_NAME`
- Verifica que el Service Account tiene permisos

### Error de CORS
- Actualiza `CORS_ALLOWED_ORIGINS` en settings.py
- Re-despliega la aplicación

### Error de build
- Verifica que Docker esté instalado
- Verifica `Dockerfile` y `docker-compose.yml`
- Verifica logs en GitHub Actions

## 💡 Tips

1. Prueba localmente antes de desplegar
2. Usa `docker-compose logs -f` para ver logs en tiempo real
3. Mantén secretos en GitHub Secrets, no en código
4. Usa Cloud SQL Proxy para desarrollo local con Cloud SQL
5. Configura alertas en Google Cloud Console

## 📞 Soporte

Para más ayuda, consulta:
- [Documentación de Django](https://docs.djangoproject.com/)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Cloud Run](https://cloud.google.com/run/docs)
