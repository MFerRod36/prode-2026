import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL

export default function AdminRoute() {
  const { user, loading } = useAuth()

  if (loading) return null

  return user?.email === ADMIN_EMAIL ? <Outlet /> : <Navigate to="/home" replace />
}
