import { createContext, use, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [perfil, setPerfil]   = useState(null)
  const [loading, setLoading] = useState(true)

  // Efecto 1: maneja la sesión de auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Efecto 2: busca el perfil cuando cambia el usuario
  useEffect(() => {
    if (!user) { setPerfil(null); return }
    supabase
      .from('perfiles')
      .select('username')
      .eq('id', user.id)
      .single()
      .then(({ data }) => setPerfil(data))
  }, [user])

  return (
    <AuthContext value={{ user, perfil, loading }}>
      {children}
    </AuthContext>
  )
}

export function useAuth() {
  return use(AuthContext)
}
