import { useRef } from 'react'
import SignatureCanvasLib from 'react-signature-canvas'
import { RotateCcw, Check } from 'lucide-react'

interface SignatureCanvasProps {
  onSave: (signature: string) => void
}

export function SignatureCanvas({ onSave }: SignatureCanvasProps) {
  const sigCanvas = useRef<SignatureCanvasLib>(null)

  const clear = () => {
    sigCanvas.current?.clear()
  }

  const save = () => {
    if (sigCanvas.current?.isEmpty()) {
      alert('Por favor, firme antes de guardar')
      return
    }
    
    const signature = sigCanvas.current?.toDataURL() || ''
    onSave(signature)
  }

  return (
    <div>
      <div className="signature-canvas-wrapper">
        <SignatureCanvasLib
          ref={sigCanvas}
          canvasProps={{
            className: 'signature-canvas w-full h-64 border-2 border-dashed border-ee-slate-300 rounded-industrial bg-white',
            style: { touchAction: 'none' }
          }}
          backgroundColor="#ffffff"
          penColor="#0f172a"
        />
      </div>
      
      <div className="flex gap-3 mt-4">
        <button
          onClick={clear}
          className="btn-outline flex-1 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Limpiar
        </button>
        <button
          onClick={save}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" />
          Guardar Firma
        </button>
      </div>
      
      <p className="text-sm text-ee-slate-600 mt-3 text-center">
        Firme con su dedo o mouse en el área blanca
      </p>
    </div>
  )
}
