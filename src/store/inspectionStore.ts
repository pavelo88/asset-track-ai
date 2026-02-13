import { create } from 'zustand'
import type { Asset, InspectionFormData, CheckStatus } from '@/types'

interface InspectionState {
  // Asset seleccionado
  selectedComunidadId: string | null
  selectedAeropuertoId: string | null
  selectedAsset: Asset | null

  // Formulario de inspección
  formData: Partial<InspectionFormData>

  // Estado
  isOnline: boolean
  isSaving: boolean
  error: string | null

  // Acciones
  setSelectedComunidad: (id: string | null) => void
  setSelectedAeropuerto: (id: string | null) => void
  setSelectedAsset: (asset: Asset | null) => void
  updateFormData: (data: Partial<InspectionFormData>) => void
  updateCheckStatus: (field: string, status: CheckStatus) => void
  setOnlineStatus: (isOnline: boolean) => void
  resetForm: () => void
  clearError: () => void
}

const initialFormData: Partial<InspectionFormData> = {
  horasMotor: 0,
  presionAceite: 0,
  temperaturaBloque: 0,
  nivelCombustible: 100,
  tension: 400,
  frecuencia: 50,
  nivelLubricante: 'OK',
  nivelRefrigerante: 'OK',
  correaVentilador: 'OK',
  filtroCombustible: 'OK',
  filtroAire: 'OK',
  filtroAceite: 'OK',
  tuboEscape: 'OK',
  recambiosRealizados: [],
  observaciones: '',
  notasTecnicas: '',
  firmaTecnico: '',
}

export const useInspectionStore = create<InspectionState>((set) => ({
  selectedComunidadId: null,
  selectedAeropuertoId: null,
  selectedAsset: null,
  formData: initialFormData,
  isOnline: navigator.onLine,
  isSaving: false,
  error: null,

  setSelectedComunidad: (id) => set({ 
    selectedComunidadId: id,
    selectedAeropuertoId: null,
    selectedAsset: null,
  }),

  setSelectedAeropuerto: (id) => set({ 
    selectedAeropuertoId: id,
    selectedAsset: null,
  }),

  setSelectedAsset: (asset) => set({ 
    selectedAsset: asset,
    // Pre-cargar datos si es el asset de prueba
    formData: asset?.codigo === 'M-3209' ? {
      ...initialFormData,
      horasMotor: 9504,
      presionAceite: 5.1,
      temperaturaBloque: 62,
      nivelCombustible: 100,
      tension: 400,
      frecuencia: 50,
    } : initialFormData,
  }),

  updateFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data },
  })),

  updateCheckStatus: (field, status) => set((state) => ({
    formData: { ...state.formData, [field]: status },
  })),

  setOnlineStatus: (isOnline) => set({ isOnline }),

  resetForm: () => set({
    selectedComunidadId: null,
    selectedAeropuertoId: null,
    selectedAsset: null,
    formData: initialFormData,
    error: null,
  }),

  clearError: () => set({ error: null }),
}))
