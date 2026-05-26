import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { AppLayout } from './AppLayout'

export default function PrivateRoute() {
  const { user, loading } = useAuth()

  if (loading) return null

  return user ? <AppLayout /> : <Navigate to="/login" replace />
}
