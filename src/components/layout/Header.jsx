import { LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

export function Header() {
  const { user } = useAuth()

  // TODO: reemplazar con nombre real de la tabla usuarios cuando tengamos backend
  const nombre = user?.email?.split('@')[0] ?? 'jugadora'

  function handleLogout() {
    // TODO: conectar Supabase
  }

  return (
    <header className="flex items-center justify-between px-4 pt-6 pb-2">
      <p className="text-base font-medium text-text">
        Hola, <span className="font-bold text-primary">{nombre}</span> 👋
      </p>
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-text"
      >
        <LogOut size={16} />
        Salir
      </button>
    </header>
  )
}
