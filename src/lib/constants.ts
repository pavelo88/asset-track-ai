export const APP_NAME = 'Asset-Track AI'
export const COMPANY_NAME = 'Energy Engine'
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0'

// Credenciales de prueba
export const DEMO_CREDENTIALS = {
  username: 'Prueba 1',
  password: 'SinergIA',
}

// Rutas de la aplicación
export const ROUTES = {
  LOGIN: '/',
  MODULE_SELECTOR: '/selector',
  PROPUESTA: '/propuesta',
  INSPECCION: '/inspeccion',
} as const

// Estados de inspección
export const INSPECTION_STATUS = {
  BORRADOR: 'borrador',
  COMPLETADA: 'completada',
  APROBADA: 'aprobada',
} as const

// Estados de check
export const CHECK_STATUS = {
  OK: 'OK',
  DEFECTUOSO: 'Defectuoso',
  CAMBIO: 'Cambio',
} as const

// Colores del tema
export const THEME_COLORS = {
  primary: '#10b981', // ee-emerald-500
  secondary: '#f59e0b', // ee-amber-500
  dark: '#0f172a', // ee-slate-900
  light: '#f8fafc', // ee-slate-50
} as const

// Configuración de PDF
export const PDF_CONFIG = {
  format: 'a4',
  orientation: 'portrait',
  marginLeft: 15,
  marginTop: 15,
  marginRight: 15,
  marginBottom: 15,
} as const

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'admin',
  TECHNICIAN: 'technician',
  VIEWER: 'viewer',
} as const

// Límites de la aplicación
export const LIMITS = {
  MAX_SIGNATURE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_RECAMBIOS: 20,
  MAX_OBSERVACIONES_LENGTH: 2000,
} as const
