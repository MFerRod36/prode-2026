import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { Flag } from '@/components/ui/Flag'

function pointsClass(puntos) {
  if (puntos >= 3) return 'text-success'
  if (puntos >= 1) return 'text-gold'
  return 'text-error'
}

function TeamRow({ flag, name, goals }) {
  return (
    <div className="flex h-8 items-center gap-2">
      <Flag code={flag} className="h-4 w-6 shrink-0 rounded-sm" />
      <span className="flex-1 truncate font-display-norm text-sm uppercase tracking-widest text-text">{name}</span>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-tl rounded-br bg-white font-display text-base font-bold text-black">
        {goals}
      </span>
    </div>
  )
}

export function RecentResults({ results }) {
  return (
    <div className="flex flex-col gap-2">
      {results.map((r) => (
        <Link
          key={r.id}
          to={`/fixture/${r.id}`}
          className="flex flex-col rounded-xl border border-border bg-surface px-4 py-3"
        >
          <TeamRow flag={r.flag_local}     name={r.local}     goals={r.goles_local} />
          <div className="h-px w-1/2 bg-border" />
          <TeamRow flag={r.flag_visitante} name={r.visitante} goals={r.goles_visitante} />
          <div className="-mx-4 -mb-3 mt-2 flex items-center justify-between rounded-b-xl bg-surface-high px-4 py-2.5">
            <p className="text-xs uppercase tracking-wider text-muted">
              Mi predicción: {r.mi_prediccion}
            </p>
            <span className={cn('font-display text-base font-bold', pointsClass(r.puntos))}>
              {r.puntos !== 0 ? `+${r.puntos}` : '0'}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
