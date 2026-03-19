import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/Auth/LoginPage.jsx'
import DashboardPage from '../pages/Dashboard/DashboardPage.jsx'
import ProductsPage from '../pages/Products/ProductsPage.jsx'
import SalesPage from '../pages/Sales/SalesPage.jsx'
import UsersPage from '../pages/Users/UsersPage.jsx'
import ReportsPage from '../pages/Reports/ReportsPage.jsx'
import ProtectedRoute from '../components/common/ProtectedRoute.jsx'
import MainLayout from '../components/layout/MainLayout.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default AppRoutes
