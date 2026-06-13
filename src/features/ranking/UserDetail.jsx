import { cn } from '@/lib/cn'
import { Flag } from '@/components/ui/Flag'

function MatchRow({ item }) {
  const { partido, prediccion, puntos } = item
  const { flag_local, flag_visitante, goles_local, goles_visitante } = partido

  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex flex-1 items-center gap-2">
        <Flag code={flag_local} className="h-4 w-6 rounded-sm" />
        <span className="font-display text-sm font-bold text-gold">
          {goles_local}-{goles_visitante}
        </span>
        <Flag code={flag_visitante} className="h-4 w-6 rounded-sm" />
      </div>
      <span className="font-display-norm text-sm text-muted">
        {prediccion ?? '—'}
      </span>
      <span className={cn(
        'w-8 text-right font-display text-base font-bold',
        puntos >= 3 ? 'text-success' : puntos >= 1 ? 'text-gold' : 'text-error'
      )}>
        {puntos > 0 ? `+${puntos}` : '0'}
      </span>
    </div>
  )
}

export function UserDetail({ predicciones }) {
  if (predicciones.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface px-4 py-8 text-center">
        <p className="font-sans text-sm text-muted">Sin partidos finalizados</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="flex flex-col divide-y divide-border/25 px-4">
        {predicciones.map((item, i) => (
          <MatchRow key={i} item={item} />
        ))}
      </div>
    </div>
  )
}
