import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { ROUTES, DEMO_CREDENTIALS } from '@/lib/constants'

export function LoginScreen() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showHint, setShowHint] = useState(false)
  
  const { login, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    clearError()

    try {
      await login({ username, password })
      navigate(ROUTES.MODULE_SELECTOR)
    } catch (err) {
      console.error('Login error:', err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ee-slate-900 via-ee-slate-800 to-ee-emerald-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <img 
            src="/logo-energy-engine.png" 
            alt="Energy Engine" 
            className="h-24 mx-auto mb-4 drop-shadow-2xl"
          />
          <h1 className="text-3xl font-bold text-white mb-2">
            Asset-Track AI
          </h1>
          <p className="text-ee-slate-300">
            Sistema de Gestión de Activos Industriales
          </p>
        </div>

        {/* Card de Login */}
        <div className="card animate-slide-up">
          <h2 className="text-2xl font-bold text-ee-slate-900 mb-6 text-center">
            Iniciar Sesión
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-industrial flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Usuario */}
            <div>
              <label htmlFor="username" className="label">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ee-slate-400" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input pl-10"
                  placeholder="Ingrese su usuario"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="label">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ee-slate-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10"
                  placeholder="Ingrese su contraseña"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Botón de Login */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full btn-large disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="spinner"></span>
                  Iniciando sesión...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Hint de credenciales */}
          <div className="mt-6 pt-4 border-t-2 border-ee-slate-100">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="text-sm text-ee-slate-600 hover:text-ee-emerald-600 transition-colors w-full text-center"
            >
              {showHint ? '🔒 Ocultar' : '💡 Ver'} credenciales de prueba
            </button>
            
            {showHint && (
              <div className="mt-3 p-3 bg-ee-emerald-50 rounded-industrial text-sm">
                <p className="font-semibold text-ee-emerald-900 mb-2">
                  Credenciales de Demostración:
                </p>
                <div className="space-y-1 text-ee-emerald-800">
                  <p>👤 Usuario: <code className="font-mono bg-white px-2 py-0.5 rounded">{DEMO_CREDENTIALS.username}</code></p>
                  <p>🔑 Contraseña: <code className="font-mono bg-white px-2 py-0.5 rounded">{DEMO_CREDENTIALS.password}</code></p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-ee-slate-400 text-sm">
          <p>&copy; 2026 Energy Engine. Todos los derechos reservados.</p>
          <p className="mt-1">v1.0.0 - Prototipo Funcional</p>
        </div>
      </div>
    </div>
  )
}
