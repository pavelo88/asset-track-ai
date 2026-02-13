// Database Types - Generado desde el esquema de Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          email: string
          password_hash: string
          role: 'admin' | 'technician' | 'viewer'
          full_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          email: string
          password_hash: string
          role?: 'admin' | 'technician' | 'viewer'
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
          password_hash?: string
          role?: 'admin' | 'technician' | 'viewer'
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      comunidades: {
        Row: {
          id: string
          nombre: string
          codigo: string | null
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          codigo?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          codigo?: string | null
          created_at?: string
        }
      }
      aeropuertos: {
        Row: {
          id: string
          comunidad_id: string
          nombre: string
          codigo: string
          ciudad: string | null
          created_at: string
        }
        Insert: {
          id?: string
          comunidad_id: string
          nombre: string
          codigo: string
          ciudad?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          comunidad_id?: string
          nombre?: string
          codigo?: string
          ciudad?: string | null
          created_at?: string
        }
      }
      assets: {
        Row: {
          id: string
          aeropuerto_id: string
          codigo: string
          tipo: string
          motor_modelo: string | null
          motor_serial: string | null
          motor_potencia: string | null
          cliente: string | null
          instalacion: string | null
          direccion: string | null
          activo: boolean
          ultima_revision: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          aeropuerto_id: string
          codigo: string
          tipo?: string
          motor_modelo?: string | null
          motor_serial?: string | null
          motor_potencia?: string | null
          cliente?: string | null
          instalacion?: string | null
          direccion?: string | null
          activo?: boolean
          ultima_revision?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          aeropuerto_id?: string
          codigo?: string
          tipo?: string
          motor_modelo?: string | null
          motor_serial?: string | null
          motor_potencia?: string | null
          cliente?: string | null
          instalacion?: string | null
          direccion?: string | null
          activo?: boolean
          ultima_revision?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      inspecciones: {
        Row: {
          id: string
          numero_inspeccion: string | null
          asset_id: string
          technician_id: string
          fecha_inspeccion: string
          horas_motor: number | null
          presion_aceite: number | null
          temperatura_bloque: number | null
          nivel_combustible: number | null
          tension: number | null
          frecuencia: number | null
          corriente_fase_r: number | null
          corriente_fase_s: number | null
          corriente_fase_t: number | null
          nivel_lubricante: 'OK' | 'Defectuoso' | 'Cambio' | null
          nivel_refrigerante: 'OK' | 'Defectuoso' | 'Cambio' | null
          correa_ventilador: 'OK' | 'Defectuoso' | 'Cambio' | null
          filtro_combustible: 'OK' | 'Defectuoso' | 'Cambio' | null
          filtro_aire: 'OK' | 'Defectuoso' | 'Cambio' | null
          filtro_aceite: 'OK' | 'Defectuoso' | 'Cambio' | null
          tubo_escape: 'OK' | 'Defectuoso' | 'Cambio' | null
          recambios_realizados: string[] | null
          observaciones: string | null
          notas_tecnicas: string | null
          firma_tecnico: string | null
          firma_cliente: string | null
          estado: 'borrador' | 'completada' | 'aprobada'
          sincronizado: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          numero_inspeccion?: string | null
          asset_id: string
          technician_id: string
          fecha_inspeccion?: string
          horas_motor?: number | null
          presion_aceite?: number | null
          temperatura_bloque?: number | null
          nivel_combustible?: number | null
          tension?: number | null
          frecuencia?: number | null
          corriente_fase_r?: number | null
          corriente_fase_s?: number | null
          corriente_fase_t?: number | null
          nivel_lubricante?: 'OK' | 'Defectuoso' | 'Cambio' | null
          nivel_refrigerante?: 'OK' | 'Defectuoso' | 'Cambio' | null
          correa_ventilador?: 'OK' | 'Defectuoso' | 'Cambio' | null
          filtro_combustible?: 'OK' | 'Defectuoso' | 'Cambio' | null
          filtro_aire?: 'OK' | 'Defectuoso' | 'Cambio' | null
          filtro_aceite?: 'OK' | 'Defectuoso' | 'Cambio' | null
          tubo_escape?: 'OK' | 'Defectuoso' | 'Cambio' | null
          recambios_realizados?: string[] | null
          observaciones?: string | null
          notas_tecnicas?: string | null
          firma_tecnico?: string | null
          firma_cliente?: string | null
          estado?: 'borrador' | 'completada' | 'aprobada'
          sincronizado?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          numero_inspeccion?: string | null
          asset_id?: string
          technician_id?: string
          fecha_inspeccion?: string
          horas_motor?: number | null
          presion_aceite?: number | null
          temperatura_bloque?: number | null
          nivel_combustible?: number | null
          tension?: number | null
          frecuencia?: number | null
          corriente_fase_r?: number | null
          corriente_fase_s?: number | null
          corriente_fase_t?: number | null
          nivel_lubricante?: 'OK' | 'Defectuoso' | 'Cambio' | null
          nivel_refrigerante?: 'OK' | 'Defectuoso' | 'Cambio' | null
          correa_ventilador?: 'OK' | 'Defectuoso' | 'Cambio' | null
          filtro_combustible?: 'OK' | 'Defectuoso' | 'Cambio' | null
          filtro_aire?: 'OK' | 'Defectuoso' | 'Cambio' | null
          filtro_aceite?: 'OK' | 'Defectuoso' | 'Cambio' | null
          tubo_escape?: 'OK' | 'Defectuoso' | 'Cambio' | null
          recambios_realizados?: string[] | null
          observaciones?: string | null
          notas_tecnicas?: string | null
          firma_tecnico?: string | null
          firma_cliente?: string | null
          estado?: 'borrador' | 'completada' | 'aprobada'
          sincronizado?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      propuestas_economicas: {
        Row: {
          id: string
          nombre: string
          cliente: string | null
          presupuesto_total: number
          coste_desarrollo: number | null
          coste_backend: number | null
          coste_integracion: number | null
          coste_capacitacion: number | null
          coste_soporte: number | null
          roi_porcentaje: number | null
          ahorro_anual: number | null
          reduccion_errores: number | null
          descripcion: string | null
          vigencia_hasta: string | null
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          cliente?: string | null
          presupuesto_total: number
          coste_desarrollo?: number | null
          coste_backend?: number | null
          coste_integracion?: number | null
          coste_capacitacion?: number | null
          coste_soporte?: number | null
          roi_porcentaje?: number | null
          ahorro_anual?: number | null
          reduccion_errores?: number | null
          descripcion?: string | null
          vigencia_hasta?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          cliente?: string | null
          presupuesto_total?: number
          coste_desarrollo?: number | null
          coste_backend?: number | null
          coste_integracion?: number | null
          coste_capacitacion?: number | null
          coste_soporte?: number | null
          roi_porcentaje?: number | null
          ahorro_anual?: number | null
          reduccion_errores?: number | null
          descripcion?: string | null
          vigencia_hasta?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
