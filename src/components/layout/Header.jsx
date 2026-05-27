import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export function Header() {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <header className="flex items-center justify-end px-4 pt-6 pb-2">
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted transition-colors hover:text-text"
      >
        <LogOut size={16} />
        Salir
      </button>
    </header>
  )
}
