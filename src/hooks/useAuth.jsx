import { createContext, use } from 'react'

const AuthContext = createContext(null)

// TODO: conectar Supabase cuando trabajemos el backend
export function AuthProvider({ children }) {
  return (
    <AuthContext value={{ user: { id: 'mock' }, loading: false }}>
      {children}
    </AuthContext>
  )
}

export function useAuth() {
  return use(AuthContext)
}
