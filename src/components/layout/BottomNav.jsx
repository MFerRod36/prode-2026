import { NavLink } from 'react-router-dom'
import { Home, CalendarDays, Trophy, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/cn'

const NAV_ITEMS = [
  { to: '/home',             icon: Home,          label: 'Home'       },
  { to: '/fixture',          icon: CalendarDays,  label: 'Fixture'    },
  { to: '/ranking',          icon: Trophy,        label: 'Ranking'    },
  { to: '/mis-predicciones', icon: ClipboardList, label: 'Mis picks'  },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface">
      <ul className="flex items-stretch">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-muted hover:text-text'
                )
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
