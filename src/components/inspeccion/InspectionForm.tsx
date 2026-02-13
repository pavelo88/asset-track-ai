import { useState } from 'react'
import { Save, FileText, AlertCircle, Download, CheckCircle } from 'lucide-react'
import { useInspectionStore } from '@/store/inspectionStore'
import { useAuthStore } from '@/store/authStore'
import { SignatureCanvas } from './SignatureCanvas'
import { inspectionsService } from '@/services/inspections.service'
import { generateInspectionPDF } from '@/services/pdf-generator.service'

export function InspectionForm() {
  const { selectedAsset, formData, updateFormData, updateCheckStatus, resetForm } = useInspectionStore()
  const { user } = useAuthStore()
  const [showSignature, setShowSignature] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedInspection, setSavedInspection] = useState<any>(null)

  if (!selectedAsset) {
    return (
      <div className="container-app py-8">
        <div className="card">
          <p className="text-center text-ee-slate-600">No hay activo seleccionado</p>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    try {
      setError(null)
      setIsSaving(true)

      // Validaciones
      if (!formData.firmaTecnico) {
        setError('Debe firmar la inspección antes de guardar')
        return
      }

      if (!user?.id) {
        setError('No hay usuario autenticado')
        return
      }

      // Guardar en Supabase
      const inspection = await inspectionsService.createInspection(
        {
          assetId: selectedAsset.id,
          horasMotor: formData.horasMotor || 0,
          presionAceite: formData.presionAceite || 0,
          temperaturaBloque: formData.temperaturaBloque || 0,
          nivelCombustible: formData.nivelCombustible || 100,
          tension: formData.tension || 400,
          frecuencia: formData.frecuencia || 50,
          corrienteFaseR: formData.corrienteFaseR,
          corrienteFaseS: formData.corrienteFaseS,
          corrienteFaseT: formData.corrienteFaseT,
          nivelLubricante: formData.nivelLubricante || 'OK',
          nivelRefrigerante: formData.nivelRefrigerante || 'OK',
          correaVentilador: formData.correaVentilador || 'OK',
          filtroCombustible: formData.filtroCombustible || 'OK',
          filtroAire: formData.filtroAire || 'OK',
          filtroAceite: formData.filtroAceite || 'OK',
          tuboEscape: formData.tuboEscape || 'OK',
          recambiosRealizados: formData.recambiosRealizados || [],
          observaciones: formData.observaciones || '',
          notasTecnicas: formData.notasTecnicas || '',
          firmaTecnico: formData.firmaTecnico,
          firmaCliente: formData.firmaCliente,
        },
        user.id
      )

      setSavedInspection(inspection)
      setSuccess(true)
    } catch (err) {
      console.error('Error guardando inspección:', err)
      setError('Error al guardar la inspección. Por favor, intente nuevamente.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleGeneratePDF = async () => {
    if (!savedInspection || !selectedAsset) return

    try {
      await generateInspectionPDF({
        inspection: savedInspection,
        asset: selectedAsset,
        technicianName: user?.fullName || user?.username || 'Técnico',
      })
    } catch (err) {
      console.error('Error generando PDF:', err)
      setError('Error al generar el PDF')
    }
  }

  const handleNewInspection = () => {
    resetForm()
    setSuccess(false)
    setSavedInspection(null)
  }

  return (
    <div className="container-app py-8 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Información del Asset */}
        <div className="card mb-6 industrial-border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-ee-slate-900 mb-2">
                Inspección - {selectedAsset.codigo}
              </h2>
              <div className="space-y-1 text-sm text-ee-slate-600">
                <p><span className="font-medium">Motor:</span> {selectedAsset.motorModelo}</p>
                <p><span className="font-medium">S/N:</span> {selectedAsset.motorSerial}</p>
                <p><span className="font-medium">Potencia:</span> {selectedAsset.motorPotencia}</p>
              </div>
            </div>
            <span className="badge-success">Activo</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-industrial flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Datos del Motor */}
        <div className="card mb-6">
          <h3 className="text-lg font-bold text-ee-slate-900 mb-4 card-header">
            Datos del Motor
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Horas Motor</label>
              <input
                type="number"
                value={formData.horasMotor || ''}
                onChange={(e) => updateFormData({ horasMotor: Number(e.target.value) })}
                className="input"
                placeholder="Ej: 9504"
              />
            </div>
            <div>
              <label className="label">Presión Aceite (bar)</label>
              <input
                type="number"
                step="0.1"
                value={formData.presionAceite || ''}
                onChange={(e) => updateFormData({ presionAceite: Number(e.target.value) })}
                className="input"
                placeholder="Ej: 5.1"
              />
            </div>
            <div>
              <label className="label">Temperatura Bloque (°C)</label>
              <input
                type="number"
                value={formData.temperaturaBloque || ''}
                onChange={(e) => updateFormData({ temperaturaBloque: Number(e.target.value) })}
                className="input"
                placeholder="Ej: 62"
              />
            </div>
            <div>
              <label className="label">Nivel Combustible (%)</label>
              <input
                type="number"
                value={formData.nivelCombustible || ''}
                onChange={(e) => updateFormData({ nivelCombustible: Number(e.target.value) })}
                className="input"
                placeholder="Ej: 100"
              />
            </div>
          </div>
        </div>

        {/* Cuadro Eléctrico */}
        <div className="card mb-6">
          <h3 className="text-lg font-bold text-ee-slate-900 mb-4 card-header">
            Cuadro Eléctrico
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Tensión (V)</label>
              <input
                type="number"
                value={formData.tension || ''}
                onChange={(e) => updateFormData({ tension: Number(e.target.value) })}
                className="input"
                placeholder="Ej: 400"
              />
            </div>
            <div>
              <label className="label">Frecuencia (Hz)</label>
              <input
                type="number"
                value={formData.frecuencia || ''}
                onChange={(e) => updateFormData({ frecuencia: Number(e.target.value) })}
                className="input"
                placeholder="Ej: 50"
              />
            </div>
          </div>
        </div>

        {/* Checklist de Recambios */}
        <div className="card mb-6">
          <h3 className="text-lg font-bold text-ee-slate-900 mb-4 card-header">
            Inspección Visual y Recambios
          </h3>
          <div className="space-y-4">
            {[
              { key: 'nivelLubricante', label: 'Nivel de lubricante' },
              { key: 'nivelRefrigerante', label: 'Nivel de refrigerante' },
              { key: 'correaVentilador', label: 'Correa del ventilador' },
              { key: 'filtroCombustible', label: 'Filtro de combustible' },
              { key: 'filtroAire', label: 'Filtro de aire' },
              { key: 'filtroAceite', label: 'Filtro de aceite' },
              { key: 'tuboEscape', label: 'Tubo de escape' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 bg-ee-slate-50 rounded-industrial">
                <label className="font-medium text-ee-slate-900">{item.label}</label>
                <div className="flex gap-2">
                  {['OK', 'Defectuoso', 'Cambio'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateCheckStatus(item.key, status as any)}
                      className={`px-4 py-2 rounded-industrial text-sm font-medium transition-all touch-target ${
                        (formData as any)[item.key] === status
                          ? status === 'OK'
                            ? 'bg-ee-emerald-500 text-white'
                            : status === 'Defectuoso'
                            ? 'bg-ee-amber-500 text-white'
                            : 'bg-red-500 text-white'
                          : 'bg-white border-2 border-ee-slate-200 text-ee-slate-700'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Observaciones */}
        <div className="card mb-6">
          <h3 className="text-lg font-bold text-ee-slate-900 mb-4 card-header">
            Observaciones
          </h3>
          <textarea
            value={formData.observaciones || ''}
            onChange={(e) => updateFormData({ observaciones: e.target.value })}
            className="input min-h-[120px] resize-none"
            placeholder="Ingrese cualquier observación relevante sobre la inspección..."
          />
        </div>

        {/* Firma */}
        {!showSignature ? (
          <button
            onClick={() => setShowSignature(true)}
            className="btn-secondary w-full btn-large mb-6"
          >
            <FileText className="w-5 h-5 inline mr-2" />
            Firmar Inspección
          </button>
        ) : (
          <div className="card mb-6">
            <h3 className="text-lg font-bold text-ee-slate-900 mb-4">
              Firma del Técnico
            </h3>
            <SignatureCanvas
              onSave={(signature) => {
                updateFormData({ firmaTecnico: signature })
                setShowSignature(false)
                setError(null)
              }}
            />
          </div>
        )}

        {/* Botón Guardar */}
        {!success ? (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary w-full btn-large disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <span className="spinner w-5 h-5 inline mr-2"></span>
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 inline mr-2" />
                Guardar Inspección
              </>
            )}
          </button>
        ) : (
          <div className="space-y-4">
            {/* Mensaje de éxito */}
            <div className="card bg-ee-emerald-50 border-2 border-ee-emerald-500">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-ee-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-ee-emerald-900 mb-2">
                    ¡Inspección Guardada Exitosamente!
                  </h3>
                  <p className="text-sm text-ee-emerald-800 mb-3">
                    Número de inspección: <span className="font-mono font-bold">{savedInspection?.numeroInspeccion}</span>
                  </p>
                  <p className="text-sm text-ee-emerald-700">
                    Los datos se han sincronizado correctamente con la base de datos.
                  </p>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={handleGeneratePDF}
                  className="btn-secondary flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Descargar PDF
                </button>
                <button
                  onClick={handleNewInspection}
                  className="btn-outline flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  Nueva Inspección
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
