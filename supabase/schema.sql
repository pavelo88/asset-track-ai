-- Asset-Track AI - Schema SQL para Supabase
-- Este script crea todas las tablas necesarias para la aplicación

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =======================
-- TABLA: users
-- =======================
CREATE TABLE IF NOT EXISTS users (
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

-- Usuario de prueba (contraseña: SinergIA)
INSERT INTO users (username, email, password_hash, role, full_name) 
VALUES ('Prueba 1', 'prueba1@energyengine.es', '$2a$10$dummyhash', 'technician', 'Técnico de Prueba')
ON CONFLICT (username) DO NOTHING;

-- =======================
-- TABLA: comunidades
-- =======================
CREATE TABLE IF NOT EXISTS comunidades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT UNIQUE NOT NULL,
  codigo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO comunidades (nombre, codigo) VALUES 
  ('Comunidad Valenciana', 'CV'),
  ('Comunidad de Madrid', 'CM')
ON CONFLICT (nombre) DO NOTHING;

-- =======================
-- TABLA: aeropuertos
-- =======================
CREATE TABLE IF NOT EXISTS aeropuertos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comunidad_id UUID REFERENCES comunidades(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  codigo TEXT UNIQUE NOT NULL,
  ciudad TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO aeropuertos (comunidad_id, nombre, codigo, ciudad) VALUES
  ((SELECT id FROM comunidades WHERE codigo='CV'), 'Aeropuerto de Valencia', 'VLC', 'Valencia'),
  ((SELECT id FROM comunidades WHERE codigo='CM'), 'Aeropuerto Adolfo Suárez Madrid-Barajas', 'MAD', 'Madrid')
ON CONFLICT (codigo) DO NOTHING;

-- =======================
-- TABLA: assets
-- =======================
CREATE TABLE IF NOT EXISTS assets (
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
)
ON CONFLICT (aeropuerto_id, codigo) DO NOTHING;

-- Segundo asset de prueba (Madrid)
INSERT INTO assets (aeropuerto_id, codigo, motor_modelo, motor_serial, motor_potencia, cliente, instalacion, direccion)
VALUES (
  (SELECT id FROM aeropuertos WHERE codigo='MAD'),
  'M-4501',
  'CATERPILLAR C15',
  '00892445',
  '150kVA',
  'AENA Madrid',
  'Terminal 4',
  'Aeropuerto Adolfo Suárez Madrid-Barajas'
)
ON CONFLICT (aeropuerto_id, codigo) DO NOTHING;

-- =======================
-- TABLA: inspecciones
-- =======================
CREATE TABLE IF NOT EXISTS inspecciones (
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

-- Índices para mejoras de performance
CREATE INDEX IF NOT EXISTS idx_inspecciones_asset ON inspecciones(asset_id);
CREATE INDEX IF NOT EXISTS idx_inspecciones_technician ON inspecciones(technician_id);
CREATE INDEX IF NOT EXISTS idx_inspecciones_fecha ON inspecciones(fecha_inspeccion DESC);

-- =======================
-- TABLA: propuestas_economicas
-- =======================
CREATE TABLE IF NOT EXISTS propuestas_economicas (
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
)
ON CONFLICT DO NOTHING;

-- =======================
-- ROW LEVEL SECURITY (RLS)
-- =======================

-- Habilitar RLS en tablas sensibles
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspecciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajustar según necesidades de producción)
-- NOTA: Estas políticas son permisivas para el prototipo

-- Usuarios: todos pueden leer (para login)
CREATE POLICY "Public can read users" ON users
  FOR SELECT USING (true);

-- Assets: todos pueden leer
CREATE POLICY "Public can read assets" ON assets
  FOR SELECT USING (true);

-- Aeropuertos: todos pueden leer
CREATE POLICY "Public can read airports" ON aeropuertos
  FOR SELECT USING (true);

-- Comunidades: todos pueden leer
CREATE POLICY "Public can read communities" ON comunidades
  FOR SELECT USING (true);

-- Propuestas: todos pueden leer
CREATE POLICY "Public can read proposals" ON propuestas_economicas
  FOR SELECT USING (true);

-- Inspecciones: pueden insertarse y leerse
CREATE POLICY "Users can insert inspections" ON inspecciones
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can read inspections" ON inspecciones
  FOR SELECT USING (true);

CREATE POLICY "Users can update inspections" ON inspecciones
  FOR UPDATE USING (true);

-- =======================
-- FUNCIONES AUXILIARES
-- =======================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inspecciones_updated_at BEFORE UPDATE ON inspecciones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =======================
-- FUNCIÓN PARA GENERAR NÚMEROS DE INSPECCIÓN
-- =======================
CREATE OR REPLACE FUNCTION generate_inspection_number()
RETURNS TRIGGER AS $$
DECLARE
  year_prefix TEXT;
  next_number INTEGER;
  new_inspection_number TEXT;
BEGIN
  -- Obtener el año actual
  year_prefix := TO_CHAR(NOW(), 'YYYY');
  
  -- Obtener el siguiente número secuencial
  SELECT COALESCE(MAX(CAST(SUBSTRING(numero_inspeccion FROM '[0-9]+$') AS INTEGER)), 0) + 1
  INTO next_number
  FROM inspecciones
  WHERE numero_inspeccion LIKE 'R - ' || year_prefix || '%';
  
  -- Formatear el número de inspección: R - 20260001
  new_inspection_number := 'R - ' || year_prefix || LPAD(next_number::TEXT, 4, '0');
  
  NEW.numero_inspeccion := new_inspection_number;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para generar número de inspección automáticamente
CREATE TRIGGER generate_inspection_number_trigger
  BEFORE INSERT ON inspecciones
  FOR EACH ROW
  WHEN (NEW.numero_inspeccion IS NULL)
  EXECUTE FUNCTION generate_inspection_number();

-- =======================
-- FINALIZACIÓN
-- =======================
-- Schema creado exitosamente para Asset-Track AI
-- Versión: 1.0.0
-- Fecha: Febrero 2026
