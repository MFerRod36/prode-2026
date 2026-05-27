import { NavLink } from 'react-router-dom'
import { Home, CalendarDays, Trophy, ClipboardList } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/home',             icon: Home,          label: 'Home'    },
  { to: '/fixture',          icon: CalendarDays,  label: 'Fixture' },
  { to: '/ranking',          icon: Trophy,        label: 'Ranking' },
  { to: '/mis-predicciones', icon: ClipboardList, label: 'Predic.' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface">
      <ul className="flex">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <li key={to} className="flex flex-1">
            <NavLink to={to} className="flex flex-1 items-center justify-center py-2">
              {({ isActive }) =>
                isActive ? (
                  <span className="flex w-full flex-col items-center gap-1 rounded-tl-2xl rounded-br-2xl bg-points-card py-2.5 text-xs font-medium uppercase text-white">
                    <Icon size={20} />
                    {label}
                  </span>
                ) : (
                  <span className="flex w-full flex-col items-center gap-1 py-2.5 text-xs font-medium uppercase text-muted transition-colors hover:text-text">
                    <Icon size={20} />
                    {label}
                  </span>
                )
              }
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
