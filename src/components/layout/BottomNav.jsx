import { NavLink } from 'react-router-dom'
import { Home, CalendarDays, Trophy, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/cn'

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
            <NavLink to={to} className="flex flex-1 items-center justify-center px-2 py-2">
              {({ isActive }) => (
                <span
                  className="relative flex w-full flex-col items-center gap-1 py-2.5 text-xs font-medium uppercase"
                  style={{
                    color: isActive ? '#ffffff' : 'var(--color-muted)',
                    transition: 'color 300ms ease-in-out',
                  }}
                >
                  <span
                    className="absolute inset-0 rounded-tl-2xl rounded-br-2xl bg-points-card"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transition: 'opacity 300ms ease-in-out',
                    }}
                  />
                  <Icon size={20} className="relative" />
                  <span className="relative">{label}</span>
                </span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
