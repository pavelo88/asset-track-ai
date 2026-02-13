# 🏭 Asset-Track AI - Energy Engine

Sistema profesional de gestión de activos industriales desarrollado para **Energy Engine**, especializado en el mantenimiento de grupos electrógenos y plantas de cogeneración.

![Energy Engine Logo](./public/logo-energy-engine.png)

---

## 📋 Características

### ✅ Sistema de Autenticación
- Login con credenciales (Usuario: "Prueba 1" / Contraseña: "SinergIA")
- Gestión de sesiones con localStorage
- Rutas protegidas

### 📊 Panel de Propuesta Económica
- Visualización de presupuesto (7.230€)
- Gráficos interactivos con Recharts
- Métricas de ROI (171% primer año)
- Desglose de costes

### 📱 Aplicación de Campo (85% Funcional)
- **Selector Jerárquico**: Comunidad → Aeropuerto → Grupo Electrógeno
- **Formulario de Inspección Completo**:
  - Datos del motor (horas, presión, temperatura, combustible)
  - Panel eléctrico (tensión, frecuencia)
  - Checklist de recambios (OK/Defectuoso/Cambio)
  - Notas y observaciones
- **Firma Biométrica**: Canvas HTML5 con soporte táctil
- **Modo Offline**: Indicador online/offline simulado
- **Generación de PDF**: Replica exacta del formato Excel

### 🗄️ Base de Datos Real
- **Supabase** (PostgreSQL)
- Row Level Security (RLS)
- Real-time subscriptions
- Storage para firmas

---

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase (gratuita)

### 1. Clonar el proyecto
```bash
# Si tienes el proyecto en GitHub
git clone https://github.com/tu-usuario/asset-track-ai.git
cd asset-track-ai

# O si estás en el directorio local
cd asset-track-ai
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Supabase

#### 3.1. Crear proyecto en Supabase
1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta / inicia sesión
3. Crea un nuevo proyecto
4. Anota la **URL del proyecto** y la **anon key**

#### 3.2. Configurar Base de Datos
1. En Supabase, ve a **SQL Editor**
2. Copia el contenido de `supabase/schema.sql` (ver sección de scripts SQL abajo)
3. Ejecuta el script completo

#### 3.3. Configurar variables de entorno
```bash
# Copia el archivo de ejemplo
cp .env.example .env.local

# Edita .env.local y agrega tus credenciales de Supabase
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

---

## 📦 Scripts Disponibles

```bash
npm run dev          # Inicia servidor de desarrollo
npm run build        # Compila para producción
npm run preview      # Preview de la build de producción
npm run lint         # Ejecuta el linter
```

---

## 🗄️ Scripts SQL para Supabase

### Script completo de Base de Datos

```sql
-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla: users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'technician', 'viewer')) DEFAULT 'technician',
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usuario de prueba (contraseña: SinergIA - NO usar en producción)
INSERT INTO users (username, email, password_hash, role, full_name) 
VALUES ('Prueba 1', 'prueba1@energyengine.es', '$2a$10$dummyhash', 'technician', 'Técnico de Prueba');

-- Tabla: comunidades
CREATE TABLE comunidades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT UNIQUE NOT NULL,
  codigo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO comunidades (nombre, codigo) VALUES 
  ('Comunidad Valenciana', 'CV'),
  ('Comunidad de Madrid', 'CM');

-- Tabla: aeropuertos
CREATE TABLE aeropuertos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comunidad_id UUID REFERENCES comunidades(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  codigo TEXT UNIQUE NOT NULL,
  ciudad TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO aeropuertos (comunidad_id, nombre, codigo, ciudad) VALUES
  ((SELECT id FROM comunidades WHERE codigo='CV'), 'Aeropuerto de Valencia', 'VLC', 'Valencia'),
  ((SELECT id FROM comunidades WHERE codigo='CM'), 'Aeropuerto Adolfo Suárez Madrid-Barajas', 'MAD', 'Madrid');

-- Tabla: assets
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aeropuerto_id UUID REFERENCES aeropuertos(id) ON DELETE CASCADE,
  codigo TEXT NOT NULL,
  tipo TEXT DEFAULT 'Grupo Electrógeno',
  
  motor_modelo TEXT,
  motor_serial TEXT,
  motor_potencia TEXT,
  
  cliente TEXT,
  instalacion TEXT,
  direccion TEXT,
  
  activo BOOLEAN DEFAULT true,
  ultima_revision TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(aeropuerto_id, codigo)
);

-- Asset de prueba (Valencia M-3209)
INSERT INTO assets (aeropuerto_id, codigo, motor_modelo, motor_serial, motor_potencia, cliente, instalacion, direccion)
VALUES (
  (SELECT id FROM aeropuertos WHERE codigo='VLC'),
  'M-3209',
  'DEUTZ BF4M1013EC',
  '00481993',
  '110kVA',
  'AENA Valencia',
  'Terminal T1',
  'Aeropuerto de Valencia, Manises'
);

-- Tabla: inspecciones
CREATE TABLE inspecciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_inspeccion TEXT UNIQUE,
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  technician_id UUID REFERENCES users(id),
  
  fecha_inspeccion TIMESTAMPTZ DEFAULT NOW(),
  
  horas_motor DECIMAL,
  presion_aceite DECIMAL,
  temperatura_bloque DECIMAL,
  nivel_combustible DECIMAL,
  
  tension DECIMAL,
  frecuencia DECIMAL,
  corriente_fase_r DECIMAL,
  corriente_fase_s DECIMAL,
  corriente_fase_t DECIMAL,
  
  nivel_lubricante TEXT CHECK (nivel_lubricante IN ('OK', 'Defectuoso', 'Cambio')),
  nivel_refrigerante TEXT CHECK (nivel_refrigerante IN ('OK', 'Defectuoso', 'Cambio')),
  correa_ventilador TEXT CHECK (correa_ventilador IN ('OK', 'Defectuoso', 'Cambio')),
  filtro_combustible TEXT CHECK (filtro_combustible IN ('OK', 'Defectuoso', 'Cambio')),
  filtro_aire TEXT CHECK (filtro_aire IN ('OK', 'Defectuoso', 'Cambio')),
  filtro_aceite TEXT CHECK (filtro_aceite IN ('OK', 'Defectuoso', 'Cambio')),
  tubo_escape TEXT CHECK (tubo_escape IN ('OK', 'Defectuoso', 'Cambio')),
  
  recambios_realizados TEXT[],
  observaciones TEXT,
  notas_tecnicas TEXT,
  
  firma_tecnico TEXT,
  firma_cliente TEXT,
  
  estado TEXT CHECK (estado IN ('borrador', 'completada', 'aprobada')) DEFAULT 'borrador',
  sincronizado BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_inspecciones_asset ON inspecciones(asset_id);
CREATE INDEX idx_inspecciones_technician ON inspecciones(technician_id);
CREATE INDEX idx_inspecciones_fecha ON inspecciones(fecha_inspeccion DESC);

-- Tabla: propuestas_economicas
CREATE TABLE propuestas_economicas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  cliente TEXT,
  presupuesto_total DECIMAL NOT NULL,
  
  coste_desarrollo DECIMAL,
  coste_backend DECIMAL,
  coste_integracion DECIMAL,
  coste_capacitacion DECIMAL,
  coste_soporte DECIMAL,
  
  roi_porcentaje DECIMAL,
  ahorro_anual DECIMAL,
  reduccion_errores DECIMAL,
  
  descripcion TEXT,
  vigencia_hasta DATE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Propuesta para AENA Valencia
INSERT INTO propuestas_economicas (nombre, cliente, presupuesto_total, coste_desarrollo, coste_backend, coste_integracion, coste_capacitacion, coste_soporte, roi_porcentaje, ahorro_anual, reduccion_errores)
VALUES (
  'Sistema Asset-Track AI - AENA Valencia',
  'AENA Valencia',
  7230.00,
  3200.00,
  1500.00,
  1200.00,
  800.00,
  530.00,
  171.0,
  12400.00,
  40.0
);

-- Habilitar Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspecciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajustar según necesidades)
CREATE POLICY "Public can read all" ON assets FOR SELECT USING (true);
CREATE POLICY "Public can read all" ON aeropuertos FOR SELECT USING (true);
CREATE POLICY "Public can read all" ON comunidades FOR SELECT USING (true);
CREATE POLICY "Public can read all" ON propuestas_economicas FOR SELECT USING (true);
```

---

## 🏗️ Estructura del Proyecto

```
asset-track-ai/
├── public/
│   ├── logo-energy-engine.png       # Logo de Energy Engine
│   └── manifest.json                # PWA manifest
│
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── LoginScreen.tsx      # ✅ Pantalla de inicio de sesión
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── StatusIndicator.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── propuesta/
│   │   │   ├── ProposalDashboard.tsx
│   │   │   ├── CostBreakdownChart.tsx
│   │   │   └── ROIMetrics.tsx
│   │   └── inspeccion/
│   │       ├── AssetSelector.tsx
│   │       ├── InspectionForm.tsx
│   │       ├── SignatureCanvas.tsx
│   │       └── DocumentPreview.tsx
│   │
│   ├── lib/
│   │   ├── supabase.ts              # ✅ Cliente Supabase
│   │   └── constants.ts             # ✅ Constantes
│   │
│   ├── services/
│   │   ├── auth.service.ts          # ✅ Servicio de autenticación
│   │   ├── assets.service.ts        # ✅ Servicio de assets
│   │   ├── inspections.service.ts
│   │   ├── proposals.service.ts
│   │   └── pdf-generator.service.ts
│   │
│   ├── store/
│   │   ├── authStore.ts             # ✅ Estado global auth
│   │   └── inspectionStore.ts       # ✅ Estado global inspección
│   │
│   ├── types/
│   │   ├── database.types.ts        # ✅ Tipos de DB
│   │   └── index.ts                 # ✅ Tipos de app
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useOnlineStatus.ts
│   │   └── useInspection.ts
│   │
│   ├── utils/
│   │   └── validators.ts
│   │
│   ├── App.tsx                      # ✅ Componente principal
│   ├── main.tsx                     # ✅ Punto de entrada
│   ├── index.css                    # ✅ Estilos globales
│   └── vite-env.d.ts               # ✅ Tipos de Vite
│
├── .env.example                     # ✅ Variables de entorno
├── .gitignore                       # ✅
├── package.json                     # ✅ Dependencias
├── tsconfig.json                    # ✅ Config TypeScript
├── vite.config.ts                   # ✅ Config Vite
├── tailwind.config.js               # ✅ Config Tailwind
└── README.md                        # ✅ Este archivo
```

---

## 🎨 Tema de Diseño

El sistema utiliza el esquema de colores corporativo de Energy Engine:

- **Verde Esmeralda** (`ee-emerald-500`): `#10b981` - Color principal
- **Ámbar** (`ee-amber-500`): `#f59e0b` - Acentos y alertas
- **Pizarra** (`ee-slate-900`): `#0f172a` - Fondos oscuros

---

## 📱 Funcionalidades Implementadas

### ✅ Completado (85%)
- [x] Sistema de autenticación
- [x] Selector de módulos
- [x] Panel de propuesta con gráficos
- [x] Selector jerárquico de assets
- [x] Formulario de inspección completo
- [x] Firma biométrica con canvas
- [x] Indicador online/offline
- [x] Generación de PDF
- [x] Base de datos Supabase
- [x] Diseño responsive
- [x] Tema corporativo Energy Engine

### 🔄 Pendiente (15%)
- [ ] Service Worker para PWA completo
- [ ] Sincronización offline real
- [ ] Compresión de imágenes de firma
- [ ] Tests unitarios
- [ ] Optimización de performance

---

## 🚀 Despliegue en Producción

### Opción 1: Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar
vercel

# Producción
vercel --prod
```

### Opción 2: Netlify

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Desplegar
netlify deploy --prod --dir=dist
```

### Variables de Entorno en Producción

Asegúrate de configurar estas variables en tu plataforma de deploy:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
VITE_APP_VERSION=1.0.0
```

---

## 🔒 Seguridad

⚠️ **IMPORTANTE PARA PRODUCCIÓN**:

1. **Contraseñas**: Actualmente la contraseña está hardcodeada. En producción:
   - Usar Supabase Auth con bcrypt
   - Implementar JWT tokens
   - Habilitar MFA

2. **Row Level Security**: Las políticas RLS están simplificadas. Ajustar según necesidades.

3. **HTTPS**: Asegurar que el sitio usa HTTPS en producción.

4. **Variables de Entorno**: Nunca commitear el archivo `.env.local`.

---

## 📞 Soporte

Para soporte técnico, contactar a:

**Energy Engine**
- 📧 Email: info@energyengine.es
- 📞 Teléfono: +34 925 15 43 54
- 🌐 Web: [www.energyengine.es](https://www.energyengine.es/)

---

## 📄 Licencia

Propiedad de Energy Engine. Todos los derechos reservados.

---

## 👨‍💻 Desarrollo

Desarrollado con:
- ⚛️ React 18
- 📘 TypeScript
- ⚡ Vite
- 🎨 Tailwind CSS
- 🗄️ Supabase
- 📊 Recharts
- 📝 jsPDF

---

## 🎯 Roadmap Futuro

- [ ] Integración con ERP de Energy Engine
- [ ] App móvil nativa (React Native)
- [ ] Dashboard de análisis predictivo
- [ ] Notificaciones push
- [ ] Reportes automáticos mensuales
- [ ] Integración con sensores IoT
- [ ] API pública para integraciones

---

**Versión**: 1.0.0  
**Última actualización**: Febrero 2026  
**Estado**: Prototipo Funcional 85%
