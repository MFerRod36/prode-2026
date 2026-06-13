import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export function useLogin() {
  const navigate = useNavigate()
  const [authError, setAuthError] = useState(null)

  async function login({ email, password }) {
    setAuthError(null)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setAuthError('Email o contraseña incorrectos')
        return
      }
      navigate('/home')
    } catch {
      setAuthError('Error de conexión. Intentá de nuevo.')
    }
  }

  return { login, authError }
}
