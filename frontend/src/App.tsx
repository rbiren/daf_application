import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/auth'
import Layout from './components/layout/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import UnitsPage from './pages/UnitsPage'
import UnitDetailPage from './pages/UnitDetailPage'
import AcceptancePage from './pages/AcceptancePage'
import AcceptanceDetailPage from './pages/AcceptanceDetailPage'
// Manufacturer pages
import ManufacturerDashboardPage from './pages/ManufacturerDashboardPage'
import CreateUnitPage from './pages/CreateUnitPage'
import StartInspectionPage from './pages/StartInspectionPage'
import ManufacturerInspectionPage from './pages/ManufacturerInspectionPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

// Redirect based on user role
function RoleBasedRedirect() {
  const user = useAuthStore((state) => state.user)

  // Manufacturer roles go to manufacturer dashboard
  if (user?.role === 'MFG_QA' || user?.role === 'MFG_ADMIN' || user?.role === 'SYSTEM_ADMIN') {
    return <Navigate to="/manufacturer" replace />
  }

  // Dealer roles go to dealer dashboard
  return <DashboardPage />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Default route - redirects based on role */}
          <Route index element={<RoleBasedRedirect />} />

          {/* Dealer routes */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="units" element={<UnitsPage />} />
          <Route path="units/:vin" element={<UnitDetailPage />} />
          <Route path="acceptance" element={<AcceptancePage />} />
          <Route path="acceptance/:id" element={<AcceptanceDetailPage />} />

          {/* Manufacturer routes */}
          <Route path="manufacturer" element={<ManufacturerDashboardPage />} />
          <Route path="manufacturer/units/new" element={<CreateUnitPage />} />
          <Route path="manufacturer/inspection/start/:unitId" element={<StartInspectionPage />} />
          <Route path="manufacturer/inspection/:id" element={<ManufacturerInspectionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
