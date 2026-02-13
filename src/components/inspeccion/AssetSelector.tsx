import { useState, useEffect } from 'react'
import { Building2, Plane, Cog, ChevronRight } from 'lucide-react'
import { useInspectionStore } from '@/store/inspectionStore'
import { assetsService } from '@/services/assets.service'
import type { Comunidad, Aeropuerto, Asset } from '@/types'

interface AssetSelectorProps {
  onAssetSelected: () => void
}

export function AssetSelector({ onAssetSelected }: AssetSelectorProps) {
  const [comunidades, setComunidades] = useState<Comunidad[]>([])
  const [aeropuertos, setAeropuertos] = useState<Aeropuerto[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(false)

  const {
    selectedComunidadId,
    selectedAeropuertoId,
    selectedAsset,
    setSelectedComunidad,
    setSelectedAeropuerto,
    setSelectedAsset,
  } = useInspectionStore()

  // Cargar comunidades al montar
  useEffect(() => {
    loadComunidades()
  }, [])

  // Cargar aeropuertos cuando se selecciona comunidad
  useEffect(() => {
    if (selectedComunidadId) {
      loadAeropuertos(selectedComunidadId)
    }
  }, [selectedComunidadId])

  // Cargar assets cuando se selecciona aeropuerto
  useEffect(() => {
    if (selectedAeropuertoId) {
      loadAssets(selectedAeropuertoId)
    }
  }, [selectedAeropuertoId])

  const loadComunidades = async () => {
    setLoading(true)
    try {
      const data = await assetsService.getComunidades()
      setComunidades(data)
    } catch (error) {
      console.error('Error cargando comunidades:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAeropuertos = async (comunidadId: string) => {
    setLoading(true)
    try {
      const data = await assetsService.getAeropuertosByComunidad(comunidadId)
      setAeropuertos(data)
    } catch (error) {
      console.error('Error cargando aeropuertos:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAssets = async (aeropuertoId: string) => {
    setLoading(true)
    try {
      const data = await assetsService.getAssetsByAeropuerto(aeropuertoId)
      setAssets(data)
    } catch (error) {
      console.error('Error cargando assets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAsset = (asset: Asset) => {
    setSelectedAsset(asset)
    onAssetSelected()
  }

  return (
    <div className="container-app py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-ee-slate-900 mb-2">
          Seleccionar Activo
        </h2>
        <p className="text-ee-slate-600 mb-8">
          Navega por la jerarquía para seleccionar el grupo electrógeno a inspeccionar
        </p>

        <div className="space-y-6">
          {/* Paso 1: Seleccionar Comunidad */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-ee-emerald-100 rounded-lg">
                <Building2 className="w-5 h-5 text-ee-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-ee-slate-900">
                1. Selecciona Comunidad Autónoma
              </h3>
            </div>

            {loading && !comunidades.length ? (
              <div className="text-center py-8">
                <div className="spinner w-8 h-8 border-4 border-ee-emerald-500 mx-auto mb-2"></div>
                <p className="text-ee-slate-600 text-sm">Cargando...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {comunidades.map((comunidad) => (
                  <button
                    key={comunidad.id}
                    onClick={() => setSelectedComunidad(comunidad.id)}
                    className={`p-4 border-2 rounded-industrial text-left transition-all hover:border-ee-emerald-500 ${
                      selectedComunidadId === comunidad.id
                        ? 'border-ee-emerald-500 bg-ee-emerald-50'
                        : 'border-ee-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-ee-slate-900">{comunidad.nombre}</p>
                        <p className="text-sm text-ee-slate-600">{comunidad.codigo}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-ee-slate-400" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Paso 2: Seleccionar Aeropuerto */}
          {selectedComunidadId && (
            <div className="card animate-slide-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Plane className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-ee-slate-900">
                  2. Selecciona Aeropuerto
                </h3>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="spinner w-8 h-8 border-4 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-ee-slate-600 text-sm">Cargando...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {aeropuertos.map((aeropuerto) => (
                    <button
                      key={aeropuerto.id}
                      onClick={() => setSelectedAeropuerto(aeropuerto.id)}
                      className={`p-4 border-2 rounded-industrial text-left transition-all hover:border-blue-500 ${
                        selectedAeropuertoId === aeropuerto.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-ee-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-ee-slate-900">{aeropuerto.nombre}</p>
                          <p className="text-sm text-ee-slate-600">
                            {aeropuerto.codigo} - {aeropuerto.ciudad}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-ee-slate-400" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Paso 3: Seleccionar Asset */}
          {selectedAeropuertoId && (
            <div className="card animate-slide-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-ee-amber-100 rounded-lg">
                  <Cog className="w-5 h-5 text-ee-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-ee-slate-900">
                  3. Selecciona Grupo Electrógeno
                </h3>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="spinner w-8 h-8 border-4 border-ee-amber-500 mx-auto mb-2"></div>
                  <p className="text-ee-slate-600 text-sm">Cargando...</p>
                </div>
              ) : assets.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-ee-slate-600">No se encontraron grupos electrógenos</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {assets.map((asset) => (
                    <button
                      key={asset.id}
                      onClick={() => handleSelectAsset(asset)}
                      className="w-full p-4 border-2 border-ee-slate-200 rounded-industrial text-left transition-all hover:border-ee-amber-500 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-bold text-xl text-ee-slate-900 mb-1">
                            {asset.codigo}
                          </p>
                          <p className="text-sm text-ee-slate-600">{asset.tipo}</p>
                        </div>
                        <span className="badge-success">Activo</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-ee-slate-500">Motor</p>
                          <p className="font-medium text-ee-slate-900">{asset.motorModelo}</p>
                        </div>
                        <div>
                          <p className="text-ee-slate-500">S/N</p>
                          <p className="font-medium text-ee-slate-900">{asset.motorSerial}</p>
                        </div>
                        <div>
                          <p className="text-ee-slate-500">Potencia</p>
                          <p className="font-medium text-ee-slate-900">{asset.motorPotencia}</p>
                        </div>
                      </div>
                      {asset.cliente && (
                        <div className="mt-3 pt-3 border-t border-ee-slate-200">
                          <p className="text-sm text-ee-slate-600">
                            <span className="font-medium">Cliente:</span> {asset.cliente}
                          </p>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
