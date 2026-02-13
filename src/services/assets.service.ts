import { supabase, toCamelCase } from '@/lib/supabase'
import type { Comunidad, Aeropuerto, Asset } from '@/types'

class AssetsService {
  /**
   * Obtener todas las comunidades
   */
  async getComunidades(): Promise<Comunidad[]> {
    const { data, error } = await supabase
      .from('comunidades')
      .select('*')
      .order('nombre')

    if (error) throw error
    return data.map(toCamelCase)
  }

  /**
   * Obtener aeropuertos por comunidad
   */
  async getAeropuertosByComunidad(comunidadId: string): Promise<Aeropuerto[]> {
    const { data, error } = await supabase
      .from('aeropuertos')
      .select(`
        *,
        comunidad:comunidades(*)
      `)
      .eq('comunidad_id', comunidadId)
      .order('nombre')

    if (error) throw error
    return data.map(toCamelCase)
  }

  /**
   * Obtener assets por aeropuerto
   */
  async getAssetsByAeropuerto(aeropuertoId: string): Promise<Asset[]> {
    const { data, error } = await supabase
      .from('assets')
      .select(`
        *,
        aeropuerto:aeropuertos(
          *,
          comunidad:comunidades(*)
        )
      `)
      .eq('aeropuerto_id', aeropuertoId)
      .eq('activo', true)
      .order('codigo')

    if (error) throw error
    return data.map(toCamelCase)
  }

  /**
   * Obtener un asset por ID
   */
  async getAssetById(assetId: string): Promise<Asset> {
    const { data, error } = await supabase
      .from('assets')
      .select(`
        *,
        aeropuerto:aeropuertos(
          *,
          comunidad:comunidades(*)
        )
      `)
      .eq('id', assetId)
      .single()

    if (error) throw error
    return toCamelCase(data)
  }

  /**
   * Buscar asset por código
   */
  async getAssetByCodigo(codigo: string): Promise<Asset | null> {
    const { data, error } = await supabase
      .from('assets')
      .select(`
        *,
        aeropuerto:aeropuertos(
          *,
          comunidad:comunidades(*)
        )
      `)
      .eq('codigo', codigo)
      .eq('activo', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // No encontrado
      throw error
    }
    return toCamelCase(data)
  }
}

export const assetsService = new AssetsService()
