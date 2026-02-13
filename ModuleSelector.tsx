import { useNavigate } from 'react-router-dom'
import { FileText, Wrench, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/lib/constants'

export function ModuleSelector() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ee-slate-900 via-ee-slate-800 to-ee-emerald-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20 safe-top">
        <div className="container-app flex justify-between items-center py-4">
          <div className="flex items-center gap-3">
            <img src="/logo-energy-engine.png" alt="Energy Engine" className="h-12" />
            <div>
              <h1 className="text-white font-bold text-xl">Asset-Track AI</h1>
              <p className="text-ee-slate-300 text-sm">Energy Engine</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-white font-medium">{user?.fullName || user?.username}</p>
              <p className="text-ee-slate-300 text-sm capitalize">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="btn-outline text-white hover:bg-white/10 flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container-app py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Selecciona un Módulo
          </h2>
          <p className="text-ee-slate-300 text-center mb-12">
            Elige entre ver la propuesta técnica o abrir la terminal de inspección
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Módulo de Propuesta */}
            <button
              onClick={() => navigate(ROUTES.PROPUESTA)}
              className="card hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
            >
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-ee-emerald-500 to-ee-emerald-600 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform">
                  <FileText className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-ee-slate-900 mb-3">
                  Ver Propuesta Técnica
                </h3>
                <p className="text-ee-slate-600 mb-6">
                  Panel administrativo con presupuesto, gráficos de ROI y desglose de costes para AENA Valencia
                </p>
                <div className="flex items-center justify-center gap-2 text-ee-emerald-600 font-medium">
                  <span>Abrir Panel</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </button>

            {/* Módulo de Inspección */}
            <button
              onClick={() => navigate(ROUTES.INSPECCION)}
              className="card hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
            >
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-ee-amber-500 to-ee-amber-600 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform">
                  <Wrench className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-ee-slate-900 mb-3">
                  Terminal de Inspección
                </h3>
                <p className="text-ee-slate-600 mb-6">
                  Aplicación de campo para registrar inspecciones, firmas biométricas y generar informes PDF
                </p>
                <div className="flex items-center justify-center gap-2 text-ee-amber-600 font-medium">
                  <span>Abrir App</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </button>
          </div>

          {/* Info adicional */}
          <div className="mt-12 text-center text-ee-slate-400">
            <p className="text-sm">
              Sistema de Gestión de Activos Industriales v1.0.0
            </p>
            <p className="text-xs mt-1">
              Desarrollado para Energy Engine | Prototipo Funcional 85%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
