import { supabase, toCamelCase, toSnakeCase } from '@/lib/supabase'
import type { Inspection, InspectionFormData } from '@/types'

class InspectionsService {
  /**
   * Crear nueva inspección
   */
  async createInspection(
    formData: InspectionFormData,
    technicianId: string
  ): Promise<Inspection> {
    try {
      // Convertir formData a formato snake_case para Supabase
      const inspectionData = {
        asset_id: formData.assetId,
        technician_id: technicianId,
        fecha_inspeccion: new Date().toISOString(),
        
        // Datos del motor
        horas_motor: formData.horasMotor,
        presion_aceite: formData.presionAceite,
        temperatura_bloque: formData.temperaturaBloque,
        nivel_combustible: formData.nivelCombustible,
        
        // Cuadro eléctrico
        tension: formData.tension,
        frecuencia: formData.frecuencia,
        corriente_fase_r: formData.corrienteFaseR,
        corriente_fase_s: formData.corrienteFaseS,
        corriente_fase_t: formData.corrienteFaseT,
        
        // Checklist
        nivel_lubricante: formData.nivelLubricante,
        nivel_refrigerante: formData.nivelRefrigerante,
        correa_ventilador: formData.correaVentilador,
        filtro_combustible: formData.filtroCombustible,
        filtro_aire: formData.filtroAire,
        filtro_aceite: formData.filtroAceite,
        tubo_escape: formData.tuboEscape,
        
        // Recambios y notas
        recambios_realizados: formData.recambiosRealizados,
        observaciones: formData.observaciones,
        notas_tecnicas: formData.notasTecnicas,
        
        // Firmas
        firma_tecnico: formData.firmaTecnico,
        firma_cliente: formData.firmaCliente,
        
        // Estado
        estado: 'completada',
        sincronizado: true,
      }

      const { data, error } = await supabase
        .from('inspecciones')
        .insert(inspectionData)
        .select(`
          *,
          asset:assets(*),
          technician:users(id, username, full_name)
        `)
        .single()

      if (error) throw error

      return toCamelCase(data)
    } catch (error) {
      console.error('Error creando inspección:', error)
      throw error
    }
  }

  /**
   * Obtener inspección por ID
   */
  async getInspectionById(id: string): Promise<Inspection> {
    try {
      const { data, error } = await supabase
        .from('inspecciones')
        .select(`
          *,
          asset:assets(
            *,
            aeropuerto:aeropuertos(
              *,
              comunidad:comunidades(*)
            )
          ),
          technician:users(id, username, full_name)
        `)
        .eq('id', id)
        .single()

      if (error) throw error

      return toCamelCase(data)
    } catch (error) {
      console.error('Error obteniendo inspección:', error)
      throw error
    }
  }

  /**
   * Obtener todas las inspecciones de un asset
   */
  async getInspectionsByAsset(assetId: string): Promise<Inspection[]> {
    try {
      const { data, error } = await supabase
        .from('inspecciones')
        .select(`
          *,
          asset:assets(*),
          technician:users(id, username, full_name)
        `)
        .eq('asset_id', assetId)
        .order('fecha_inspeccion', { ascending: false })

      if (error) throw error

      return data.map(toCamelCase)
    } catch (error) {
      console.error('Error obteniendo inspecciones:', error)
      throw error
    }
  }

  /**
   * Obtener inspecciones del técnico actual
   */
  async getMyInspections(technicianId: string, limit = 20): Promise<Inspection[]> {
    try {
      const { data, error } = await supabase
        .from('inspecciones')
        .select(`
          *,
          asset:assets(*),
          technician:users(id, username, full_name)
        `)
        .eq('technician_id', technicianId)
        .order('fecha_inspeccion', { ascending: false })
        .limit(limit)

      if (error) throw error

      return data.map(toCamelCase)
    } catch (error) {
      console.error('Error obteniendo mis inspecciones:', error)
      throw error
    }
  }

  /**
   * Actualizar inspección
   */
  async updateInspection(
    id: string,
    updates: Partial<InspectionFormData>
  ): Promise<Inspection> {
    try {
      const updateData = toSnakeCase(updates)

      const { data, error } = await supabase
        .from('inspecciones')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          asset:assets(*),
          technician:users(id, username, full_name)
        `)
        .single()

      if (error) throw error

      return toCamelCase(data)
    } catch (error) {
      console.error('Error actualizando inspección:', error)
      throw error
    }
  }

  /**
   * Eliminar inspección
   */
  async deleteInspection(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('inspecciones')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error eliminando inspección:', error)
      throw error
    }
  }

  /**
   * Cambiar estado de inspección
   */
  async changeInspectionStatus(
    id: string,
    estado: 'borrador' | 'completada' | 'aprobada'
  ): Promise<Inspection> {
    try {
      const { data, error } = await supabase
        .from('inspecciones')
        .update({ estado })
        .eq('id', id)
        .select(`
          *,
          asset:assets(*),
          technician:users(id, username, full_name)
        `)
        .single()

      if (error) throw error

      return toCamelCase(data)
    } catch (error) {
      console.error('Error cambiando estado:', error)
      throw error
    }
  }

  /**
   * Marcar inspección como sincronizada
   */
  async markAsSynced(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('inspecciones')
        .update({ sincronizado: true })
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error marcando como sincronizado:', error)
      throw error
    }
  }

  /**
   * Obtener inspecciones pendientes de sincronizar
   */
  async getPendingSync(): Promise<Inspection[]> {
    try {
      const { data, error } = await supabase
        .from('inspecciones')
        .select(`
          *,
          asset:assets(*),
          technician:users(id, username, full_name)
        `)
        .eq('sincronizado', false)
        .order('created_at', { ascending: true })

      if (error) throw error

      return data.map(toCamelCase)
    } catch (error) {
      console.error('Error obteniendo pendientes:', error)
      throw error
    }
  }
}

export const inspectionsService = new InspectionsService()
