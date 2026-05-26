import { cn } from '@/lib/cn'

const STATUS_LABEL = {
  proximo:   { text: 'Próximo',   className: 'bg-surface-high text-muted'   },
  en_curso:  { text: 'En curso',  className: 'bg-primary/20 text-primary'   },
  finalizado:{ text: 'Finalizado',className: 'bg-surface-high text-muted'   },
}

export function MatchCard({ match }) {
  const { local, visitante, hora, estado, minuto, goles_local, goles_visitante } = match
  const status = STATUS_LABEL[estado]

  return (
    <div className="flex w-44 flex-none flex-col gap-3 rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-bold text-text">{local}</span>
        {estado === 'en_curso' ? (
          <span className="font-display text-base font-bold text-primary">
            {goles_local} - {goles_visitante}
          </span>
        ) : (
          <span className="text-xs text-muted">vs</span>
        )}
        <span className="text-sm font-bold text-text">{visitante}</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted">
          {estado === 'en_curso' ? `${minuto}'` : hora}
        </span>
        <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', status.className)}>
          {status.text}
        </span>
      </div>
    </div>
  )
}
