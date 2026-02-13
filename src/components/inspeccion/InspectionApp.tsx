import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { AssetSelector } from './AssetSelector'
import { InspectionForm } from './InspectionForm'
import { StatusIndicator } from '../common/StatusIndicator'
import { useInspectionStore } from '@/store/inspectionStore'
import { ROUTES } from '@/lib/constants'

export function InspectionApp() {
  const navigate = useNavigate()
  const { selectedAsset } = useInspectionStore()
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="min-h-screen bg-ee-slate-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-ee-slate-200 sticky top-0 z-10">
        <div className="container-app py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(ROUTES.MODULE_SELECTOR)}
              className="btn-outline flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver
            </button>
            <div className="flex items-center gap-3">
              <StatusIndicator />
              <img src="/logo-energy-engine.png" alt="Energy Engine" className="h-10" />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      {!selectedAsset || !showForm ? (
        <AssetSelector onAssetSelected={() => setShowForm(true)} />
      ) : (
        <InspectionForm />
      )}
    </div>
  )
}
