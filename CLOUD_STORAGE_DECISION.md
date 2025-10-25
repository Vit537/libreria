# 🪣 Cloud Storage vs Cloud Run - Guía de Decisión

## 🤔 ¿Qué opción elegir?

### Opción 1: Cloud Storage (RECOMENDADO) ✅

**Usa esto si:**
- ✅ Tu frontend es mayormente estático
- ✅ No necesitas SSR (Server-Side Rendering) complejo
- ✅ No usas API Routes de Next.js
- ✅ Quieres **ahorrar dinero** (~$5-15/mes vs $20-40/mes)
- ✅ Quieres **mejor rendimiento** (CDN + cache)
- ✅ Necesitas **escalabilidad ilimitada**

**Perfecto para:**
- SPAs (Single Page Applications)
- Sitios con contenido estático
- Landing pages
- Portfolios
- Blogs estáticos
- Apps con API en backend separado

### Opción 2: Cloud Run

**Usa esto si:**
- ⚠️ Necesitas SSR (Server-Side Rendering)
- ⚠️ Usas API Routes de Next.js
- ⚠️ Necesitas middleware de Next.js
- ⚠️ Necesitas ISR (Incremental Static Regeneration)
- ⚠️ Necesitas funcionalidades server-side complejas

## 📊 Comparación Detallada

| Característica | Cloud Storage | Cloud Run |
|----------------|---------------|-----------|
| **Costo** | ~$5-15/mes | ~$20-40/mes |
| **Velocidad** | ⚡⚡⚡ Excelente | ⚡⚡ Buena |
| **Escalabilidad** | ♾️ Ilimitada | 📈 Limitada |
| **SSR** | ❌ No | ✅ Sí |
| **API Routes** | ❌ No | ✅ Sí |
| **ISR** | ❌ No | ✅ Sí |
| **Middleware** | ❌ No | ✅ Sí |
| **CDN** | ✅ Incluido | ⚠️ Extra |
| **Cache** | ✅ Perfecto | ⚠️ Complejo |
| **Setup** | 🟢 Simple | 🟡 Moderado |
| **Mantenimiento** | 🟢 Mínimo | 🟡 Regular |

## 🏗️ Arquitecturas Disponibles

### Arquitectura 1: Cloud Storage + Cloud Run (RECOMENDADO)

```
Usuario
  │
  ├─► Cloud Storage (Frontend estático)
  │   └─► HTML, CSS, JS, Images
  │
  └─► Cloud Run (Backend API)
      └─► Django REST API
          └─► Cloud SQL (PostgreSQL)
```

**Ventajas:**
- 💰 Más económico
- ⚡ Más rápido
- 📈 Mejor escalabilidad
- 🔄 Separación de concerns

**Costos estimados:**
- Frontend: ~$5-15/mes
- Backend: ~$10-20/mes
- Base de datos: ~$25-50/mes
- **Total: ~$40-85/mes**

### Arquitectura 2: Todo en Cloud Run

```
Usuario
  │
  ├─► Cloud Run (Frontend Next.js)
  │   └─► SSR + Archivos estáticos
  │
  └─► Cloud Run (Backend Django)
      └─► Cloud SQL (PostgreSQL)
```

**Ventajas:**
- ✅ Soporta SSR completo
- ✅ API Routes de Next.js
- ✅ ISR y middleware

**Costos estimados:**
- Frontend: ~$20-40/mes
- Backend: ~$10-20/mes
- Base de datos: ~$25-50/mes
- **Total: ~$55-110/mes**

## 📝 Guías Disponibles

### Para Cloud Storage (Opción 1)
1. **`CLOUD_STORAGE_SETUP.md`** - Configuración completa de Cloud Storage
2. **`setup-cloud-storage.bat/sh`** - Script de configuración automática
3. **`deploy-frontend.bat/sh`** - Script de deploy manual
4. **`.github/workflows/deploy-to-gcp-storage.yml`** - Deploy automático

### Para Cloud Run (Opción 2)
1. **`Dockerfile`** (frontend) - Ya configurado
2. **`.github/workflows/deploy-to-gcp.yml`** - Deploy automático
3. **`docker-compose.yml`** - Desarrollo local

## 🚀 Quick Start por Opción

### Opción 1: Cloud Storage (RECOMENDADO)

```bash
# 1. Configurar bucket
.\setup-cloud-storage.bat

# 2. Deploy manual (primera vez)
.\deploy-frontend.bat

# 3. O configurar GitHub Actions
# (Usar el workflow: deploy-to-gcp-storage.yml)
```

### Opción 2: Cloud Run

```bash
# 1. Build local
cd frontend
npm run build

# 2. Test con Docker
docker-compose up

# 3. Deploy con GitHub Actions
git push origin main
```

## 🔄 Cambiar entre Opciones

### De Cloud Run a Cloud Storage

1. Actualizar `next.config.ts`:
```typescript
output: 'export'
```

2. Actualizar `package.json`:
```json
"export": "next build"
```

3. Usar workflow `deploy-to-gcp-storage.yml`

### De Cloud Storage a Cloud Run

1. Actualizar `next.config.ts`:
```typescript
output: 'standalone'
```

2. Usar workflow `deploy-to-gcp.yml`

3. Usar Dockerfile para frontend

## 💡 Recomendación Final

### Para tu proyecto actual (Sistema de Librería):

**✅ Usa Cloud Storage** porque:

1. **Frontend es mayormente estático**
   - Listado de libros
   - Formularios
   - UI/UX

2. **Backend Django maneja toda la lógica**
   - API REST completa
   - Base de datos
   - Autenticación

3. **Mejor costo-beneficio**
   - Ahorro de ~$20-30/mes
   - Mejor rendimiento
   - Más escalable

4. **Más simple de mantener**
   - No servidor Node.js
   - No complejidad SSR
   - Deploy más rápido

## 📋 Workflows Disponibles

### 1. deploy-to-gcp-storage.yml (USAR ESTE)
- ✅ Frontend → Cloud Storage
- ✅ Backend → Cloud Run
- ✅ Automático con GitHub Actions

### 2. deploy-to-gcp.yml (Alternativa)
- Frontend → Cloud Run
- Backend → Cloud Run
- Ambos con Docker

## 🎯 Próximos Pasos

### Configuración Inicial (Una vez)

1. **Ejecutar script de configuración:**
   ```bash
   .\setup-cloud-storage.bat
   ```

2. **Deploy manual del backend:**
   ```bash
   # Ver DEPLOYMENT.md o QUICKSTART.md
   ```

3. **Deploy manual del frontend:**
   ```bash
   .\deploy-frontend.bat
   ```

### Deployments Futuros (Automático)

1. **Configurar GitHub Secrets** (ver CHECKLIST.md)

2. **Push a main:**
   ```bash
   git add .
   git commit -m "Update"
   git push origin main
   ```

3. **GitHub Actions se encarga del resto** ✨

## 📚 Documentación

- **`CLOUD_STORAGE_SETUP.md`** - Guía completa de Cloud Storage
- **`DEPLOYMENT.md`** - Guía de deployment general
- **`QUICKSTART.md`** - Guía rápida
- **`README.md`** - Documentación completa

## ⚠️ Notas Importantes

1. **CORS**: Debes actualizar Django settings para incluir:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "https://storage.googleapis.com",
       # ... otras URLs
   ]
   ```

2. **URLs del frontend**:
   - Sin CDN: `https://storage.googleapis.com/BUCKET-NAME/index.html`
   - Con CDN: `https://tu-dominio.com` (si configuras)

3. **Cache**: Archivos en `_next/static/` tienen cache de 1 año

4. **Actualización**: Cada deploy reemplaza archivos automáticamente

---

**Última actualización:** 25 de Octubre, 2025
**Configuración recomendada:** ✅ Cloud Storage + Cloud Run
