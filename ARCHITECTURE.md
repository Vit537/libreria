# 🏗️ Arquitectura del Sistema

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUARIO FINAL                            │
│                     (Browser / Mobile)                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTPS
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    GOOGLE CLOUD RUN                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │   Frontend (Next.js 16)                                 │   │
│  │   - React 19                                            │   │
│  │   - Material-UI                                         │   │
│  │   - Tailwind CSS                                        │   │
│  │   - Server-side rendering                               │   │
│  │                                                          │   │
│  │   Puerto: 3000                                          │   │
│  │   Instancias: 0-10 (Auto-scaling)                      │   │
│  │   Memory: 512Mi                                         │   │
│  │                                                          │   │
│  └─────────────────────┬────────────────────────────────────┘   │
│                        │                                         │
│                        │ HTTP/REST API                           │
│                        │                                         │
│  ┌─────────────────────▼────────────────────────────────────┐   │
│  │                                                          │   │
│  │   Backend (Django 5.2.7)                                │   │
│  │   - Django REST Framework                               │   │
│  │   - Gunicorn (WSGI Server)                              │   │
│  │   - WhiteNoise (Static Files)                           │   │
│  │   - CORS Headers                                        │   │
│  │                                                          │   │
│  │   Puerto: 8000                                          │   │
│  │   Instancias: 0-10 (Auto-scaling)                      │   │
│  │   Memory: 512Mi                                         │   │
│  │                                                          │   │
│  └─────────────────────┬────────────────────────────────────┘   │
└────────────────────────┼────────────────────────────────────────┘
                         │
                         │ Cloud SQL Connector
                         │ (Unix Socket)
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    GOOGLE CLOUD SQL                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │   PostgreSQL 15                                         │   │
│  │   - Database: libreria_db                               │   │
│  │   - User: libreria_user                                 │   │
│  │   - CPU: 1 vCPU                                         │   │
│  │   - Memory: 3.75GB                                      │   │
│  │   - Storage: SSD                                        │   │
│  │   - Backups: Automated                                  │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                    ARTIFACT REGISTRY                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │   Docker Images                                          │   │
│  │   - libreria/backend:latest                             │   │
│  │   - libreria/frontend:latest                            │   │
│  │   - Tagged versions by commit SHA                       │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                       GITHUB ACTIONS                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │   CI/CD Pipeline                                         │   │
│  │   1. Checkout code                                       │   │
│  │   2. Authenticate to GCP                                 │   │
│  │   3. Build Docker images                                 │   │
│  │   4. Push to Artifact Registry                           │   │
│  │   5. Deploy Backend to Cloud Run                         │   │
│  │   6. Deploy Frontend to Cloud Run                        │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Flujo de Datos

### 1. Request del Usuario

```
Usuario → HTTPS → Frontend (Cloud Run)
```

### 2. API Call

```
Frontend → HTTP → Backend API (Cloud Run) → PostgreSQL (Cloud SQL)
```

### 3. Response

```
PostgreSQL → Backend → Frontend → Usuario
```

## Componentes Detallados

### Frontend Container
```
┌─────────────────────────────────┐
│  Next.js Application            │
│  ├── Node.js 20 Alpine          │
│  ├── React 19                   │
│  ├── Material-UI Components     │
│  ├── Tailwind CSS               │
│  ├── Axios (HTTP Client)        │
│  └── Standalone Output          │
│                                 │
│  Environment Variables:         │
│  - NEXT_PUBLIC_API_URL         │
│  - NODE_ENV=production         │
│                                 │
│  Port: 3000                     │
└─────────────────────────────────┘
```

### Backend Container
```
┌─────────────────────────────────┐
│  Django Application             │
│  ├── Python 3.11 Slim           │
│  ├── Django 5.2.7               │
│  ├── Django REST Framework      │
│  ├── Gunicorn (3 workers)       │
│  ├── WhiteNoise                 │
│  └── psycopg2 (PostgreSQL)      │
│                                 │
│  Environment Variables:         │
│  - DEBUG=False                  │
│  - SECRET_KEY                   │
│  - DB_* (Connection info)       │
│  - ALLOWED_HOSTS                │
│  - CORS_ALLOWED_ORIGINS        │
│                                 │
│  Port: 8000                     │
└─────────────────────────────────┘
```

## Seguridad

### SSL/TLS
- ✅ Cloud Run proporciona HTTPS automático
- ✅ Certificados SSL gestionados por Google
- ✅ Redirección automática HTTP → HTTPS

### Autenticación
- 🔒 Cloud SQL: Usuario/Password
- 🔒 Backend: Secret Key de Django
- 🔒 CORS configurado para orígenes específicos
- 🔒 Service Account con permisos mínimos

### Headers de Seguridad
```python
# Django Settings (Producción)
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
```

## Escalabilidad

### Auto-scaling
```
Frontend:
- Min instances: 0 (escala a cero cuando no hay tráfico)
- Max instances: 10
- CPU: 1 vCPU
- Memory: 512Mi

Backend:
- Min instances: 0 (escala a cero cuando no hay tráfico)
- Max instances: 10
- CPU: 1 vCPU
- Memory: 512Mi
```

### Límites de Solicitudes
```
Cloud Run Default:
- Concurrency: 80 solicitudes por instancia
- Request timeout: 5 minutos
- Max request size: 32MB
```

## Monitoreo

### Logs
```
Cloud Run Logs:
- Application logs (stdout/stderr)
- Access logs
- Error logs

Disponibles en:
- Google Cloud Console
- gcloud CLI
- Cloud Logging API
```

### Métricas
```
Cloud Run Metrics:
- Request count
- Request latency
- Instance count
- CPU utilization
- Memory utilization
- Container startup time
```

## Costos Estimados (aproximado)

### Cloud Run
```
Pricing (us-central1):
- CPU: $0.00002400 per vCPU-second
- Memory: $0.00000250 per GiB-second
- Requests: $0.40 per million requests

Estimado mensual (uso moderado):
~$5-20 USD/mes por servicio
```

### Cloud SQL
```
Pricing:
- db-f1-micro: ~$7.67/month
- db-g1-small: ~$25/month
- Storage: $0.17/GB/month

Estimado: ~$25-50 USD/mes
```

### Artifact Registry
```
Storage: $0.10/GB/month
Estimado: ~$1-5 USD/mes
```

**Total Estimado: $30-75 USD/mes**
(Depende del tráfico y uso)

## Disaster Recovery

### Backups
```
Cloud SQL:
- Automated daily backups
- Point-in-time recovery
- 7 days retention (configurable)
```

### Rollback
```
GitHub Actions:
- Tagged images en Artifact Registry
- Deploy version específica:
  gcloud run deploy SERVICE --image IMAGE:TAG
```

## Performance

### Cold Start
```
Frontend: ~2-3 segundos
Backend: ~3-4 segundos

Optimizaciones:
- Min instances > 0 (costo adicional)
- Lazy loading de componentes
- Caching estratégico
```

### Response Time
```
API Response: <200ms (promedio)
Page Load: <1s (first contentful paint)
TTI: <3s (time to interactive)
```

## Desarrollo vs Producción

| Aspecto | Desarrollo | Producción |
|---------|-----------|-----------|
| **Host** | localhost | Cloud Run |
| **Database** | Local PostgreSQL | Cloud SQL |
| **DEBUG** | True | False |
| **SSL** | No | Sí (automático) |
| **Scaling** | Manual | Auto |
| **Logs** | Console | Cloud Logging |
| **Secrets** | .env file | GitHub Secrets |

## Siguientes Pasos

### Mejoras Futuras
- [ ] Implementar CDN (Cloud CDN)
- [ ] Configurar dominio custom
- [ ] Implementar cache con Redis
- [ ] Configurar Cloud Armor (WAF)
- [ ] Implementar monitoring con Cloud Monitoring
- [ ] Configurar alertas automáticas
- [ ] Implementar CI/CD para múltiples entornos
- [ ] Configurar Cloud Storage para media files

---

**Documentación creada:** 24 de Octubre, 2025
**Última actualización:** 24 de Octubre, 2025
