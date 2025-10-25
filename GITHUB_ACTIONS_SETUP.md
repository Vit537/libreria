# Configuración de GitHub Actions (GCP)

Esta guía conecta tu repo de GitHub con Google Cloud para desplegar:
- Backend (Django) → Cloud Run (imagen desde Artifact Registry)
- Frontend (Next.js estático) → Cloud Storage

## 1) Crear el repositorio en GitHub y subir el código

En PowerShell (Windows):

```powershell
cd d:\All 02-2025\DjangoProject\prueba
 git init
 git branch -m main
 git add .
 git commit -m "Proyecto inicial"
 git remote add origin https://github.com/<tu-usuario>/<tu-repo>.git
 git push -u origin main
```

## 2) Service Account y permisos en Google Cloud

Usa el mismo proyecto donde creaste Artifact Registry y (si aplica) Cloud SQL.

```bash
# Reemplaza TU_PROJECT_ID
PROJECT_ID=TU_PROJECT_ID

# Service Account para Actions
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Service Account"

# Permisos necesarios
for ROLE in roles/run.admin roles/iam.serviceAccountUser roles/artifactregistry.writer roles/storage.admin; do
  gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="$ROLE"
done

# (opcional) si subes a Cloud SQL vía sockets, no requiere rol extra

# Crear credencial JSON (si no usarás OIDC/WIF)
gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions@$PROJECT_ID.iam.gserviceaccount.com
```

## 3) Secrets y Variables en GitHub

Repositorio → Settings → Secrets and variables → Actions

Secrets (New repository secret):
- GCP_PROJECT_ID: TU_PROJECT_ID
- GCP_SA_KEY: (pega el contenido de key.json completo)
- DJANGO_SECRET_KEY: genera uno: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`
- DB_NAME: libreria_db
- DB_USER: libreria_user
- DB_PASSWORD: <tu_password>
- DB_HOST: /cloudsql/<PROJECT_ID>:us-central1:libreria-db  (si usas Cloud SQL por socket)
- CLOUD_SQL_CONNECTION_NAME: <PROJECT_ID>:us-central1:libreria-db (si usas Cloud SQL)
- ALLOWED_HOSTS: se completa después del primer deploy (URLs de Cloud Run)

Variables (New repository variable):
- GCS_BUCKET: nombre del bucket donde sirves el frontend (p.e. `<PROJECT_ID>-frontend`)
- NEXT_PUBLIC_API_URL: URL pública del backend en Cloud Run, ej: `https://libreria-backend-xxxx-uc.a.run.app`

## 4) Repositorio de Artifact Registry

Asegúrate de tener creado el repositorio Docker (ejemplo):

```bash
gcloud artifacts repositories create libreria \
  --repository-format=docker \
  --location=us-central1 \
  --description="Docker repository for libreria app"
```

Los workflows usan:
- Región: `us-central1` (puedes cambiarla en los YAML)
- Repositorio: `libreria`
- Imagen backend: `backend`
- Servicio Cloud Run: `libreria-backend`

## 5) Despliegues

Con cada push a `main`:
- `backend-deploy.yml` construye y sube imagen a Artifact Registry y despliega a Cloud Run
- `frontend-storage-deploy.yml` construye el sitio estático y sincroniza `./frontend/out` a tu bucket GCS

Puedes dispararlos manualmente desde la pestaña Actions (workflow_dispatch).

## 6) Después del primer deploy

1. Copia la URL del backend Cloud Run (último paso del job imprime la URL)
2. Configura `ALLOWED_HOSTS` (secret) con esa URL y la del frontend (si usas dominio/CDN)
3. Configura `NEXT_PUBLIC_API_URL` (variable) con la URL del backend
4. Vuelve a hacer un commit/push para re-desplegar

## 7) Notas y resolución de problemas

- Si `gcloud storage rsync` falla por permisos, verifica `roles/storage.admin` en la service account.
- Si el backend no conecta a Cloud SQL, verifica `--add-cloudsql-instances` y que `DB_HOST` apunte a `/cloudsql/<connection_name>`.
- Para producción, considera autenticación OIDC (Workload Identity Federation) en lugar de claves JSON.

### (Opcional recomendado) Autenticación sin llaves con OIDC (Workload Identity Federation)

Esto evita subir `GCP_SA_KEY` a GitHub y usa tokens de corta duración.

1. Crear un Workload Identity Pool y Provider para GitHub:

```bash
PROJECT_ID=TU_PROJECT_ID
POOL_ID=github-pool
PROVIDER_ID=github-provider

gcloud iam workload-identity-pools create $POOL_ID \
  --project=$PROJECT_ID \
  --location="global" \
  --display-name="GitHub OIDC Pool"

gcloud iam workload-identity-pools providers create-oidc $PROVIDER_ID \
  --project=$PROJECT_ID \
  --location="global" \
  --workload-identity-pool=$POOL_ID \
  --display-name="GitHub OIDC Provider" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref"
```

2. Vincular la Service Account al provider (ajusta `<owner>/<repo>` y rama):

```bash
SA="github-actions@$PROJECT_ID.iam.gserviceaccount.com"
POOL_FULL="projects/$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')/locations/global/workloadIdentityPools/$POOL_ID"

gcloud iam service-accounts add-iam-policy-binding "$SA" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/$POOL_FULL/attribute.repository/<owner>/<repo>"
```

3. En los workflows, reemplaza el bloque de auth por:

```yaml
- uses: google-github-actions/auth@v2
  with:
    workload_identity_provider: projects/<PROJECT_NUMBER>/locations/global/workloadIdentityPools/github-pool/providers/github-provider
    service_account: github-actions@<PROJECT_ID>.iam.gserviceaccount.com
```

Con esto ya no necesitas `GCP_SA_KEY`.
