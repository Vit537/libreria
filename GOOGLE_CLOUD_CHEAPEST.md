# 💰 Google Cloud - Configuración MÁS ECONÓMICA

## 🆓 Aprovechando el Tier Gratuito (12 meses)

### Opción 1: Cloud Run + Base externa (MÁS BARATA)
```bash
✅ Frontend: Cloud Run (GRATIS - 2M requests)
✅ Backend: Cloud Run (GRATIS - 2M requests)  
✅ Database: Supabase/PlanetScale (GRATIS externa)
✅ Storage: Cloud Storage (GRATIS - 5GB)
✅ Total: $0-5/mes por 12 meses
```

### Opción 2: Compute Engine compartido
```bash
✅ VM f1-micro: GRATIS por 12 meses (1 vCPU, 0.6GB RAM)
✅ Frontend + Backend + DB en misma VM
✅ Disco: 30GB GRATIS
✅ Total: $0/mes por 12 meses, después $5-8/mes
```

---

## 💰 Después del período gratuito (Mínimo posible)

### Configuración Ultra-Económica:
```bash
✅ Cloud Run (Frontend): $0.024/100K requests ≈ $2-5/mes
✅ Cloud Run (Backend): $0.024/100K requests ≈ $2-5/mes
✅ Cloud SQL db-f1-micro: $7.67/mes (MÍNIMO)
✅ Cloud Storage: $0.020/GB ≈ $1-3/mes
✅ Total mínimo: $12.67-20.67/mes
```

### Alternativa con VM pequeña:
```bash
✅ Compute Engine e2-micro: $5.54/mes
✅ Todo en una VM (Frontend+Backend+DB)
✅ Persistent Disk: $0.40-2/mes
✅ Total mínimo: $5.94-7.54/mes
```

---

## 📊 Comparación detallada Google Cloud:

| Servicio | Tier Gratuito | Post-Gratuito | Límites |
|----------|---------------|---------------|---------|
| **Cloud Run** | 2M requests/mes | $0.024/100K req | ✅ Perfecto para tu app |
| **Compute Engine** | f1-micro gratis | e2-micro $5.54/mes | ❌ Limitado para e-commerce |
| **Cloud SQL** | ❌ NO gratis | $7.67/mes mínimo | ✅ Confiable pero caro |
| **Cloud Storage** | 5GB gratis | $0.020/GB/mes | ✅ Muy económico |
| **Load Balancer** | ❌ $18/mes | $18/mes | ❌ Caro para apps pequeñas |

---

## 🎯 Estrategia ÓPTIMA en Google Cloud:

### Año 1 (Con créditos gratuitos):
```bash
✅ Cloud Run Frontend: GRATIS
✅ Cloud Run Backend: GRATIS  
✅ Database: Supabase externa GRATIS
✅ Storage: Cloud Storage GRATIS (5GB)
Costo real: $0/mes
```

### Año 2+ (Configuración económica):
```bash
✅ Cloud Run Frontend: $2-5/mes
✅ Cloud Run Backend: $2-5/mes
✅ Cloud SQL db-f1-micro: $7.67/mes
✅ Storage: $1-3/mes
Total: $12.67-20.67/mes
```

### Si necesitas MÁS barato año 2+:
```bash
✅ Compute Engine e2-micro: $5.54/mes
✅ PostgreSQL en misma VM
✅ Nginx para servir frontend
Total: $5.54-8/mes
```

---

## ⚠️ LIMITACIONES importantes:

### Cloud SQL (Base de datos):
- 🚫 **NO hay tier gratuito** 
- 💰 **Mínimo $7.67/mes** (db-f1-micro)
- 📊 **0.6GB RAM** muy limitado
- 🔄 **Alternativa**: Base externa (Supabase/PlanetScale)

### Compute Engine f1-micro:
- ⚡ **0.6GB RAM** (muy poco para sistema complejo)
- 🐌 **1 vCPU compartido** (lento)
- ❌ **No apto para e-commerce** con tráfico real

### Load Balancer:
- 💸 **$18/mes fijo** (muy caro para apps pequeñas)
- 🔄 **Alternativa**: Usar dominios directos de Cloud Run

---

## 🛠️ SETUP más barato paso a paso:

### Opción A: Híbrida (RECOMENDADA)
```bash
# 1. Cloud Run para aplicaciones
gcloud run deploy frontend --source . --platform managed --region us-central1

# 2. Base de datos externa (Supabase)
# Crear cuenta en supabase.com
# Usar connection string gratuito

# 3. Storage para imágenes
gsutil mb gs://tu-bucket-imagenes

Costo: $0 primer año, $5-10/mes después
```

### Opción B: Todo en VM (MÁS barato largo plazo)
```bash
# 1. Crear VM f1-micro (gratis primer año)
gcloud compute instances create vm-tienda \
    --machine-type=f1-micro \
    --zone=us-central1-a

# 2. Instalar Docker + PostgreSQL + Nginx
# 3. Deploy manual

Costo: $0 primer año, $5-8/mes después
```

---

## 💡 MI RECOMENDACIÓN para Google Cloud:

### 🥇 **Mejor opción económica**:
```bash
Año 1: Cloud Run + Supabase = $0/mes
Año 2+: Cloud Run + Cloud SQL = $13-20/mes
```

### 🥈 **Más barata (pero más trabajo)**:
```bash
Año 1: VM f1-micro = $0/mes  
Año 2+: VM e2-micro = $6-8/mes
```

---

## 🤔 ¿Vale la pena Google Cloud vs alternativas?

| Aspecto | Google Cloud | Vercel+Railway | VPS Externo |
|---------|--------------|----------------|-------------|
| **Costo año 1** | $0 | $0-5 | $60 |
| **Costo año 2+** | $13-20 | $25-40 | $60 |
| **Escalabilidad** | ✅ Automática | ✅ Automática | ❌ Manual |
| **Mantenimiento** | ✅ Mínimo | ✅ Mínimo | ❌ Alto |
| **Performance** | ✅ Excelente | ✅ Bueno | ⚠️ Variable |
| **Seguridad** | ✅ Enterprise | ✅ Buena | ⚠️ Tu responsabilidad |