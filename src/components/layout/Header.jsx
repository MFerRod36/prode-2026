import { LogOut } from 'lucide-react'

export function Header() {
  function handleLogout() {
    // TODO: conectar Supabase
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
