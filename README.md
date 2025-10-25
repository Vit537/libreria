# Sistema de Gestión de Librería

Aplicación web full-stack con Django REST Framework (backend) y Next.js (frontend) desplegada en Google Cloud Run.

## 🚀 Tecnologías

### Backend
- Django 5.2.7
- Django REST Framework
- PostgreSQL
- Gunicorn

### Frontend
- Next.js 16
- React 19
- Material-UI
- TypeScript
- Tailwind CSS

### Infraestructura
- Docker & Docker Compose
- Google Cloud Run
- Google Cloud SQL (PostgreSQL)
- GitHub Actions (CI/CD)

## 📋 Requisitos Previos

- Python 3.11+
- Node.js 20+
- Docker & Docker Compose
- Google Cloud Account
- GitHub Account

## 🛠️ Configuración Local

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd prueba
```

### 2. Configurar variables de entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp .env.example .env
```

Edita `.env` con tus valores locales.

### 3. Ejecutar con Docker Compose

```bash
docker-compose up --build
```

La aplicación estará disponible en:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Backend Admin: http://localhost:8000/admin

### 4. Desarrollo sin Docker

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## ☁️ Despliegue en Google Cloud

### 1. Configurar Google Cloud Project

```bash
# Instalar gcloud CLI
# https://cloud.google.com/sdk/docs/install

# Iniciar sesión
gcloud auth login

# Crear proyecto (o usar uno existente)
gcloud projects create tu-proyecto-id

# Configurar proyecto
gcloud config set project tu-proyecto-id

# Habilitar APIs necesarias
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 2. Crear Cloud SQL Instance (PostgreSQL)

```bash
gcloud sql instances create libreria-db \
  --database-version=POSTGRES_15 \
  --cpu=1 \
  --memory=3840MB \
  --region=us-central1 \
  --root-password=TU_PASSWORD_SEGURO

# Crear base de datos
gcloud sql databases create libreria_db --instance=libreria-db

# Crear usuario
gcloud sql users create libreria_user \
  --instance=libreria-db \
  --password=TU_PASSWORD_SEGURO
```

### 3. Crear Artifact Registry

```bash
gcloud artifacts repositories create libreria \
  --repository-format=docker \
  --location=us-central1 \
  --description="Docker repository for libreria app"
```

### 4. Crear Service Account

```bash
# Crear service account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Service Account"

# Dar permisos necesarios
gcloud projects add-iam-policy-binding tu-proyecto-id \
  --member="serviceAccount:github-actions@tu-proyecto-id.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding tu-proyecto-id \
  --member="serviceAccount:github-actions@tu-proyecto-id.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding tu-proyecto-id \
  --member="serviceAccount:github-actions@tu-proyecto-id.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

# Crear y descargar key
gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions@tu-proyecto-id.iam.gserviceaccount.com
```

### 5. Configurar GitHub Secrets

Ve a tu repositorio en GitHub → Settings → Secrets and variables → Actions

Agrega los siguientes secrets:

- `GCP_PROJECT_ID`: Tu project ID de Google Cloud
- `GCP_SA_KEY`: Contenido del archivo `key.json` (todo el JSON)
- `DJANGO_SECRET_KEY`: Secret key de Django (generar con `python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'`)
- `DB_NAME`: `libreria_db`
- `DB_USER`: `libreria_user`
- `DB_PASSWORD`: Password de la base de datos
- `DB_HOST`: `/cloudsql/tu-proyecto-id:us-central1:libreria-db`
- `CLOUD_SQL_CONNECTION_NAME`: `tu-proyecto-id:us-central1:libreria-db`
- `ALLOWED_HOSTS`: URLs de Cloud Run (agregar después del primer deploy)

### 6. Desplegar

Haz push a la rama `main` o `production`:

```bash
git add .
git commit -m "Initial commit with Cloud Run configuration"
git push origin main
```

GitHub Actions automáticamente (ver `GITHUB_ACTIONS_SETUP.md`):
1. Construirá la imagen Docker del backend y la subirá a Artifact Registry
2. Desplegará el backend en Cloud Run (`.github/workflows/backend-deploy.yml`)
3. Construirá el frontend como sitio estático y lo sincronizará a Cloud Storage (`.github/workflows/frontend-storage-deploy.yml`)

### 7. Actualizar CORS y ALLOWED_HOSTS

Después del primer despliegue, actualiza:

1. El secret `ALLOWED_HOSTS` en GitHub con las URLs de Cloud Run
2. El archivo `backend/config/settings.py` para incluir las URLs en `CORS_ALLOWED_ORIGINS`

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://tu-frontend-url.run.app",
]
```

## 📝 Comandos Útiles

### Docker

```bash
# Construir imágenes
docker-compose build

# Iniciar servicios
docker-compose up

# Detener servicios
docker-compose down

# Ver logs
docker-compose logs -f

# Ejecutar comandos en contenedor
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

### Django

```bash
# Migraciones
python manage.py makemigrations
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Recolectar archivos estáticos
python manage.py collectstatic

# Cargar datos de ejemplo
python manage.py load_data
```

### Google Cloud

```bash
# Ver logs de Cloud Run
gcloud run services logs read libreria-backend --region=us-central1
gcloud run services logs read libreria-frontend --region=us-central1

# Conectar a Cloud SQL
gcloud sql connect libreria-db --user=libreria_user

# Ver deployments
gcloud run services list --region=us-central1
```

## 🔒 Seguridad

- Nunca subas archivos `.env` al repositorio
- Usa secrets de GitHub para información sensible
- Cambia las claves por defecto en producción
- Configura `DEBUG=False` en producción
- Restringe `ALLOWED_HOSTS` y `CORS_ALLOWED_ORIGINS`

## 📚 Documentación Adicional
- [Guía de GitHub Actions para GCP](./GITHUB_ACTIONS_SETUP.md)

- [Django Documentation](https://docs.djangoproject.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Docker Documentation](https://docs.docker.com/)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
