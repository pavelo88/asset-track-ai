import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { LoginScreen } from './components/auth/LoginScreen'
import { ModuleSelector } from './components/ModuleSelector'
import { ProposalDashboard } from './components/propuesta/ProposalDashboard'
import { InspectionApp } from './components/inspeccion/InspectionApp'
import { ROUTES } from './lib/constants'

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }
  
  return <>{children}</>
}

function App() {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    // Verificar autenticación al cargar la app
    checkAuth()
  }, [checkAuth])

  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginScreen />} />
        
        <Route
          path={ROUTES.MODULE_SELECTOR}
          element={
            <ProtectedRoute>
              <ModuleSelector />
            </ProtectedRoute>
          }
        />
        
        <Route
          path={ROUTES.PROPUESTA}
          element={
            <ProtectedRoute>
              <ProposalDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path={ROUTES.INSPECCION}
          element={
            <ProtectedRoute>
              <InspectionApp />
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
