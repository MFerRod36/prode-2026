import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function useLogin() {
  const navigate = useNavigate()
  const [authError, setAuthError] = useState(null)

  // TODO: conectar Supabase cuando trabajemos el backend
  async function login() {
    navigate('/home')
  }

  return { login, authError }
}
