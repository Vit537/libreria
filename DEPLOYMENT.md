# Scripts de ayuda para el proyecto

## Desarrollo Local

### Iniciar con Docker Compose
```bash
docker-compose up --build
```

### Detener servicios
```bash
docker-compose down
```

### Ver logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Ejecutar migraciones
```bash
docker-compose exec backend python manage.py migrate
```

### Crear superusuario
```bash
docker-compose exec backend python manage.py createsuperuser
```

### Cargar datos de ejemplo
```bash
docker-compose exec backend python manage.py load_data
```

## Configuración de Google Cloud

### 1. Instalar Google Cloud SDK
Descarga desde: https://cloud.google.com/sdk/docs/install

### 2. Iniciar sesión
```bash
gcloud auth login
gcloud config set project TU_PROJECT_ID
```

### 3. Habilitar APIs
```bash
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 4. Crear Cloud SQL Instance
```bash
gcloud sql instances create libreria-db \
  --database-version=POSTGRES_15 \
  --cpu=1 \
  --memory=3840MB \
  --region=us-central1 \
  --root-password=TU_PASSWORD_SEGURO

gcloud sql databases create libreria_db --instance=libreria-db

gcloud sql users create libreria_user \
  --instance=libreria-db \
  --password=TU_PASSWORD_SEGURO
```

### 5. Crear Artifact Registry
```bash
gcloud artifacts repositories create libreria \
  --repository-format=docker \
  --location=us-central1 \
  --description="Docker repository for libreria app"
```

### 6. Crear Service Account para GitHub Actions
```bash
# Crear service account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Service Account"

# Obtener el project ID
export PROJECT_ID=$(gcloud config get-value project)

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

# Crear key JSON
gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions@$PROJECT_ID.iam.gserviceaccount.com

# Mostrar contenido para copiar a GitHub Secrets
cat key.json
```

### 7. Generar Django Secret Key
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

## GitHub Secrets Necesarios

Ve a: Repositorio → Settings → Secrets and variables → Actions → New repository secret

Agregar los siguientes secrets:

1. **GCP_PROJECT_ID**: Tu Project ID de Google Cloud
2. **GCP_SA_KEY**: Contenido completo del archivo `key.json`
3. **DJANGO_SECRET_KEY**: Generado con el comando anterior
4. **DB_NAME**: `libreria_db`
5. **DB_USER**: `libreria_user`
6. **DB_PASSWORD**: Password que configuraste en Cloud SQL
7. **DB_HOST**: `/cloudsql/PROJECT_ID:us-central1:libreria-db`
8. **CLOUD_SQL_CONNECTION_NAME**: `PROJECT_ID:us-central1:libreria-db`
9. **ALLOWED_HOSTS**: Agregar después del primer deploy las URLs de Cloud Run

## Deploy Manual (Primera vez)

### Backend
```bash
# Construir imagen
gcloud builds submit --tag gcr.io/PROJECT_ID/libreria-backend ./backend

# Desplegar
gcloud run deploy libreria-backend \
  --image gcr.io/PROJECT_ID/libreria-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --add-cloudsql-instances PROJECT_ID:us-central1:libreria-db \
  --set-env-vars "DEBUG=False,SECRET_KEY=TU_SECRET_KEY"
```

### Frontend
```bash
# Construir imagen
gcloud builds submit --tag gcr.io/PROJECT_ID/libreria-frontend ./frontend

# Desplegar
gcloud run deploy libreria-frontend \
  --image gcr.io/PROJECT_ID/libreria-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "NEXT_PUBLIC_API_URL=https://backend-url.run.app"
```

## Verificar Deployment

```bash
# Ver servicios
gcloud run services list --region=us-central1

# Ver logs
gcloud run services logs read libreria-backend --region=us-central1
gcloud run services logs read libreria-frontend --region=us-central1

# Obtener URLs
gcloud run services describe libreria-backend --region=us-central1 --format='value(status.url)'
gcloud run services describe libreria-frontend --region=us-central1 --format='value(status.url)'
```

## Actualizar CORS después del primer deploy

1. Obtén las URLs de Cloud Run
2. Actualiza el secret `ALLOWED_HOSTS` en GitHub
3. Actualiza `CORS_ALLOWED_ORIGINS` con las URLs de producción
4. Haz push para re-desplegar

## Comandos útiles

### Conectar a Cloud SQL localmente
```bash
cloud_sql_proxy -instances=PROJECT_ID:us-central1:libreria-db=tcp:5432
```

### Ejecutar migraciones en producción
```bash
gcloud run services update libreria-backend \
  --region us-central1 \
  --command="python,manage.py,migrate"
```

### Ver configuración actual
```bash
gcloud run services describe libreria-backend --region=us-central1
```
