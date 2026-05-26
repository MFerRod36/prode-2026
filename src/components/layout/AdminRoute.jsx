import { Navigate } from 'react-router-dom'
import { AppLayout } from './AppLayout'
import { useAuth } from '@/hooks/useAuth'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL

export default function AdminRoute() {
  const { user, loading } = useAuth()

  if (loading) return null

  return user?.email === ADMIN_EMAIL ? <AppLayout /> : <Navigate to="/home" replace />
}
