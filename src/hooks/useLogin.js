import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export function useLogin() {
  const navigate = useNavigate()
  const [authError, setAuthError] = useState(null)

  async function login({ email, password }) {
    setAuthError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setAuthError('Email o contraseña incorrectos')
      return
    }
    navigate('/home')
  }

  return { login, authError }
}
