import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, DollarSign, CheckCircle, Users } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { ROUTES } from '@/lib/constants'
import { supabase, toCamelCase } from '@/lib/supabase'
import type { Propuesta } from '@/types'

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444']

export function ProposalDashboard() {
  const navigate = useNavigate()
  const [propuesta, setPropuesta] = useState<Propuesta | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPropuesta()
  }, [])

  const loadPropuesta = async () => {
    try {
      const { data, error } = await supabase
        .from('propuestas_economicas')
        .select('*')
        .limit(1)
        .single()

      if (error) throw error
      setPropuesta(toCamelCase(data))
    } catch (error) {
      console.error('Error cargando propuesta:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ee-slate-50">
        <div className="text-center">
          <div className="spinner w-12 h-12 border-4 border-ee-emerald-500 mx-auto mb-4"></div>
          <p className="text-ee-slate-600">Cargando propuesta...</p>
        </div>
      </div>
    )
  }

  if (!propuesta) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ee-slate-50">
        <div className="text-center">
          <p className="text-ee-slate-600">No se encontró la propuesta</p>
        </div>
      </div>
    )
  }

  const costesData = [
    { nombre: 'Desarrollo', valor: propuesta.costeDesarrollo || 0 },
    { nombre: 'Backend', valor: propuesta.costeBackend || 0 },
    { nombre: 'Integración', valor: propuesta.costeIntegracion || 0 },
    { nombre: 'Capacitación', valor: propuesta.costeCapacitacion || 0 },
    { nombre: 'Soporte', valor: propuesta.costeSoporte || 0 },
  ]

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
              <img src="/logo-energy-engine.png" alt="Energy Engine" className="h-10" />
              <div>
                <h1 className="font-bold text-lg">Propuesta Técnica</h1>
                <p className="text-sm text-ee-slate-600">{propuesta.cliente}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container-app py-8">
        {/* Título */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-ee-slate-900 mb-2">
            {propuesta.nombre}
          </h2>
          <p className="text-ee-slate-600">
            Presupuesto modelo "Super Económico" - Sistema Asset-Track AI
          </p>
        </div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-ee-emerald-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-ee-emerald-600" />
              </div>
            </div>
            <p className="text-sm text-ee-slate-600 mb-1">Presupuesto Total</p>
            <p className="text-3xl font-bold text-ee-slate-900">{propuesta.presupuestoTotal.toFixed(0)}€</p>
          </div>

          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-ee-slate-600 mb-1">ROI Primer Año</p>
            <p className="text-3xl font-bold text-blue-600">{propuesta.roiPorcentaje}%</p>
          </div>

          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-ee-amber-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-ee-amber-600" />
              </div>
            </div>
            <p className="text-sm text-ee-slate-600 mb-1">Ahorro Anual</p>
            <p className="text-3xl font-bold text-ee-amber-600">{propuesta.ahorroAnual?.toFixed(0)}€</p>
          </div>

          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <p className="text-sm text-ee-slate-600 mb-1">Reducción Errores</p>
            <p className="text-3xl font-bold text-red-600">{propuesta.reduccionErrores}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Desglose de Costes */}
          <div className="card">
            <h3 className="text-xl font-bold text-ee-slate-900 mb-6 card-header">
              Desglose de Costes
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="nombre" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '2px solid #e2e8f0',
                    borderRadius: '0.375rem'
                  }}
                />
                <Bar dataKey="valor" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Distribución de Inversión */}
          <div className="card">
            <h3 className="text-xl font-bold text-ee-slate-900 mb-6 card-header">
              Distribución de Inversión
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nombre, percent }) => `${nombre} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {costesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Beneficios Clave */}
        <div className="card mt-8">
          <h3 className="text-xl font-bold text-ee-slate-900 mb-6 card-header">
            Beneficios Clave del Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <div className="p-3 bg-ee-emerald-100 rounded-lg flex-shrink-0 h-fit">
                <CheckCircle className="w-6 h-6 text-ee-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-ee-slate-900 mb-2">Eliminación de Papel</h4>
                <p className="text-ee-slate-600 text-sm">
                  100% digital. Adiós a formularios perdidos, ilegibles o incompletos.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 bg-ee-amber-100 rounded-lg flex-shrink-0 h-fit">
                <TrendingUp className="w-6 h-6 text-ee-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-ee-slate-900 mb-2">Reducción de Errores</h4>
                <p className="text-ee-slate-600 text-sm">
                  40% menos errores gracias a validaciones automáticas y campos estructurados.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0 h-fit">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-ee-slate-900 mb-2">Trazabilidad Total</h4>
                <p className="text-ee-slate-600 text-sm">
                  Historial completo de inspecciones con firmas biométricas y geolocalización.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
