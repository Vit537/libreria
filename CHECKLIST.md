# ✅ Checklist de Deployment

## Fase 1: Preparación Local ✅

- [x] Crear Dockerfiles para backend y frontend
- [x] Crear docker-compose.yml
- [x] Crear .dockerignore files
- [x] Actualizar requirements.txt con gunicorn y whitenoise
- [x] Configurar settings.py para producción
- [x] Configurar next.config.ts con output standalone
- [x] Crear .gitignore
- [x] Crear .env.example
- [ ] Crear archivo .env local
- [ ] Probar localmente con docker-compose

## Fase 2: Configuración de Google Cloud

### 2.1 Setup Inicial
- [ ] Instalar Google Cloud SDK
- [ ] Crear/seleccionar proyecto en GCP
- [ ] Habilitar APIs necesarias
  - [ ] Cloud Run API
  - [ ] Cloud SQL Admin API
  - [ ] Artifact Registry API
  - [ ] Cloud Build API

### 2.2 Base de Datos
- [ ] Crear instancia de Cloud SQL (PostgreSQL)
- [ ] Crear base de datos `libreria_db`
- [ ] Crear usuario `libreria_user`
- [ ] Anotar connection string

### 2.3 Artifact Registry
- [ ] Crear repositorio Docker `libreria`
- [ ] Configurar región (us-central1)

### 2.4 Service Account
- [ ] Crear service account `github-actions`
- [ ] Asignar roles necesarios:
  - [ ] roles/run.admin
  - [ ] roles/storage.admin
  - [ ] roles/artifactregistry.writer
  - [ ] roles/iam.serviceAccountUser
- [ ] Generar y descargar key.json
- [ ] Guardar key.json de forma segura

## Fase 3: Configuración de GitHub

### 3.1 Repositorio
- [ ] Crear repositorio en GitHub
- [ ] Inicializar Git local
- [ ] Conectar con repositorio remoto
- [ ] Push del código inicial

### 3.2 GitHub Secrets
Ir a: Settings → Secrets and variables → Actions

- [ ] `GCP_PROJECT_ID`: ID del proyecto GCP
- [ ] `GCP_SA_KEY`: Contenido completo de key.json
- [ ] `DJANGO_SECRET_KEY`: Secret key generado
- [ ] `DB_NAME`: libreria_db
- [ ] `DB_USER`: libreria_user
- [ ] `DB_PASSWORD`: Password de Cloud SQL
- [ ] `DB_HOST`: /cloudsql/PROJECT:REGION:INSTANCE
- [ ] `CLOUD_SQL_CONNECTION_NAME`: PROJECT:REGION:INSTANCE
- [ ] `ALLOWED_HOSTS`: * (actualizar después del primer deploy)

### 3.3 GitHub Actions
- [ ] Verificar que `.github/workflows/deploy-to-gcp.yml` existe
- [ ] Verificar permisos del workflow

## Fase 4: Primer Deployment

### 4.1 Deploy Inicial
- [ ] Commit de todos los cambios
- [ ] Push a rama main
- [ ] Verificar que GitHub Actions se ejecuta
- [ ] Esperar a que termine el deployment
- [ ] Anotar URLs de Cloud Run generadas

### 4.2 Configuración Post-Deploy
- [ ] Actualizar secret `ALLOWED_HOSTS` con URLs reales
- [ ] Actualizar `CORS_ALLOWED_ORIGINS` en settings.py
- [ ] Commit y push de cambios
- [ ] Verificar re-deployment automático

## Fase 5: Verificación

### 5.1 Backend
- [ ] Acceder a URL del backend
- [ ] Verificar que responde correctamente
- [ ] Probar endpoint /api/ 
- [ ] Verificar conexión a base de datos
- [ ] Verificar logs en Cloud Run

### 5.2 Frontend
- [ ] Acceder a URL del frontend
- [ ] Verificar que carga correctamente
- [ ] Probar navegación entre páginas
- [ ] Verificar conexión con backend API
- [ ] Verificar logs en Cloud Run

### 5.3 Base de Datos
- [ ] Ejecutar migraciones si es necesario
- [ ] Crear superusuario en producción
- [ ] Verificar que los datos se persisten

## Fase 6: Optimización

### 6.1 Seguridad
- [ ] Verificar DEBUG=False en producción
- [ ] Verificar SSL/HTTPS activo
- [ ] Revisar configuración de CORS
- [ ] Configurar dominios custom (opcional)

### 6.2 Monitoreo
- [ ] Configurar alertas en Cloud Console
- [ ] Revisar métricas de Cloud Run
- [ ] Configurar logging adicional si es necesario
- [ ] Documentar proceso de rollback

### 6.3 Documentación
- [ ] Actualizar README con URLs de producción
- [ ] Documentar variables de entorno
- [ ] Crear guía de troubleshooting
- [ ] Documentar proceso de deploy

## Comandos de Referencia Rápida

### Verificar estado
```bash
gcloud run services list --region=us-central1
```

### Ver logs
```bash
gcloud run services logs read libreria-backend --region=us-central1 --limit=50
gcloud run services logs read libreria-frontend --region=us-central1 --limit=50
```

### Obtener URLs
```bash
gcloud run services describe libreria-backend --region=us-central1 --format='value(status.url)'
gcloud run services describe libreria-frontend --region=us-central1 --format='value(status.url)'
```

### Conectar a base de datos
```bash
gcloud sql connect libreria-db --user=libreria_user
```

### Ejecutar migraciones (método manual)
```bash
# Primero obtener la imagen actual
gcloud run services describe libreria-backend --region=us-central1 --format='value(spec.template.spec.containers[0].image)'

# Luego ejecutar con Cloud Run Jobs o conectar via Cloud SQL Proxy
```

## Notas Importantes

⚠️ **SEGURIDAD**
- NUNCA subas archivos .env a Git
- NUNCA compartas el archivo key.json
- SIEMPRE usa DEBUG=False en producción
- Actualiza ALLOWED_HOSTS y CORS después del deploy

💡 **TIPS**
- Prueba localmente antes de desplegar
- Usa logs de Cloud Run para debugging
- Mantén backups de la base de datos
- Documenta todos los cambios importantes

🐛 **TROUBLESHOOTING**
- Si falla el build, revisa logs en GitHub Actions
- Si falla la conexión a DB, verifica Cloud SQL connection
- Si hay errores de CORS, revisa settings.py
- Si el servicio no responde, revisa logs de Cloud Run

## Estado del Proyecto

**Última actualización:** [Fecha]

**Estado actual:** En configuración

**Próximo paso:** [Completar fase actual]

---

**Creado:** 24 de Octubre, 2025
**Mantenido por:** Tu equipo
