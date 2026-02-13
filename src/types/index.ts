import { Database } from './database.types'

export type CheckStatus = 'OK' | 'Defectuoso' | 'Cambio'
export type InspectionStatus = 'borrador' | 'completada' | 'aprobada'

export interface InspectionFormData {
  // Información del Asset
  assetId: string
  
  // Datos del Motor
  horasMotor: number
  presionAceite: number
  temperaturaBloque: number
  nivelCombustible: number
  
  // Cuadro Eléctrico
  tension: number
  frecuencia: number
  corrienteFaseR?: number
  corrienteFaseS?: number
  corrienteFaseT?: number
  
  // Inspección Motor
  nivelLubricante: CheckStatus
  nivelRefrigerante: CheckStatus
  correaVentilador: CheckStatus
  filtroCombustible: CheckStatus
  filtroAire: CheckStatus
  filtroAceite: CheckStatus
  tuboEscape: CheckStatus
  
  // Recambios y Notas
  recambiosRealizados: string[]
  observaciones: string
  notasTecnicas: string
  
  // Firma
  firmaTecnico: string
  firmaCliente?: string
}

export interface Asset {
  id: string
  aeropuertoId: string
  codigo: string
  tipo: string
  motorModelo: string | null
  motorSerial: string | null
  motorPotencia: string | null
  cliente: string | null
  instalacion: string | null
  direccion: string | null
  activo: boolean
  ultimaRevision: string | null
  
  // Relaciones
  aeropuerto?: {
    id: string
    nombre: string
    codigo: string
    comunidad?: {
      id: string
      nombre: string
      codigo: string
    }
  }
}

export interface Inspection extends InspectionFormData {
  id: string
  numeroInspeccion: string
  technicianId: string
  fechaInspeccion: string
  estado: InspectionStatus
  sincronizado: boolean
  createdAt: string
  updatedAt: string
  
  // Relaciones
  asset?: Asset
  technician?: {
    id: string
    username: string
    fullName: string | null
  }
}

export interface Comunidad {
  id: string
  nombre: string
  codigo: string | null
}

export interface Aeropuerto {
  id: string
  comunidadId: string
  nombre: string
  codigo: string
  ciudad: string | null
  comunidad?: Comunidad
}

export interface Propuesta {
  id: string
  nombre: string
  cliente: string | null
  presupuestoTotal: number
  costeDesarrollo: number | null
  costeBackend: number | null
  costeIntegracion: number | null
  costeCapacitacion: number | null
  costeSoporte: number | null
  roiPorcentaje: number | null
  ahorroAnual: number | null
  reduccionErrores: number | null
  descripcion: string | null
  vigenciaHasta: string | null
  createdAt: string
}
