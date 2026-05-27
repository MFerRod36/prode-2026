import { cn } from '@/lib/cn'
import { MapPin } from 'lucide-react'

const STATUS = {
  proximo:    { text: 'Próximo',    className: 'bg-surface-high text-muted' },
  en_curso:   { text: 'En curso',   className: 'bg-primary/20 text-primary' },
  finalizado: { text: 'Finalizado', className: 'bg-surface-high text-muted' },
}

function FlagWithBadge({ flag, goals }) {
  return (
    <div className="relative inline-block">
      <span className="text-4xl">{flag}</span>
      {goals != null && (
        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-primary-fg">
          {goals}
        </span>
      )}
    </div>
  )
}

export function MatchCard({ match }) {
  const {
    local, flag_local, visitante, flag_visitante,
    hora, estado, goles_local, goles_visitante,
    estadio, mi_prediccion,
  } = match

  const status = STATUS[estado]
  const predLocal     = mi_prediccion != null ? Number(mi_prediccion.split('-')[0]) : null
  const predVisitante = mi_prediccion != null ? Number(mi_prediccion.split('-')[1]) : null

  return (
    <div className="rounded-xl border border-border bg-surface px-6 py-5">

      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 flex-col items-center gap-2">
          <FlagWithBadge flag={flag_local} goals={predLocal} />
          <span className="text-sm font-bold text-text">{local}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          {estado === 'en_curso' ? (
            <span className="font-display text-2xl font-bold text-primary">
              {goles_local} - {goles_visitante}
            </span>
          ) : (
            <span className="font-display text-xl text-muted">vs</span>
          )}
          <span className="text-xs text-muted">{hora}</span>
        </div>

        <div className="flex flex-1 flex-col items-center gap-2">
          <FlagWithBadge flag={flag_visitante} goals={predVisitante} />
          <span className="text-sm font-bold text-text">{visitante}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center gap-1.5">
        <span className={cn('rounded-full px-3 py-1 text-xs font-medium', status.className)}>
          {status.text}
        </span>
        {estadio && (
          <span className="flex items-center gap-1 text-xs text-muted">
            <MapPin size={11} />
            {estadio}
          </span>
        )}
      </div>

    </div>
  )
}
