import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { MapPin } from 'lucide-react'
import { Flag } from '@/components/ui/Flag'

const STATUS = {
  proximo:    { text: 'Próximo',    className: 'bg-primary/20 text-primary' },
  en_curso:   { text: 'En curso',   className: 'bg-result/20 text-result' },
  finalizado: { text: 'Finalizado', className: 'bg-surface-high text-muted' },
}

const SCORE_STYLES = {
  live:  'bg-result/15 text-result ring-1 ring-result/30',
  final: 'bg-gold/15 text-gold ring-1 ring-gold/30',
  empty: 'bg-surface-high text-muted',
}

function ScoreBox({ value, variant }) {
  return (
    <span className={cn(
      'flex h-10 min-w-10 items-center justify-center rounded-lg font-display-norm text-lg',
      SCORE_STYLES[variant]
    )}>
      {value ?? '-'}
    </span>
  )
}

function FlagWithBadge({ flag, goals }) {
  return (
    <div className="relative inline-block">
      <Flag code={flag} className="h-10 w-16 rounded-sm" />
      {goals != null && (
        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-name px-1 text-xs font-bold text-bg">
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
  const scoreVariant  = estado === 'en_curso' ? 'live' : estado === 'finalizado' ? 'final' : 'empty'

  return (
    <Link to={`/fixture/${match.id}`} className="block rounded-xl border border-border bg-surface px-6 py-5">

      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 flex-col items-center gap-2">
          <FlagWithBadge flag={flag_local} goals={predLocal} />
          <span className="text-center font-display-norm text-sm uppercase tracking-widest text-text">{local}</span>
        </div>

        <div className="flex flex-col items-center">
          {estado === 'proximo' ? (
            <span className="flex h-10 min-w-12 items-center justify-center rounded-lg bg-surface-high font-display-norm text-base uppercase text-muted">
              vs
            </span>
          ) : (
            <div className="flex items-center gap-1.5">
              <ScoreBox value={goles_local} variant={scoreVariant} />
              <span className="font-display-norm text-lg text-muted">-</span>
              <ScoreBox value={goles_visitante} variant={scoreVariant} />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col items-center gap-2">
          <FlagWithBadge flag={flag_visitante} goals={predVisitante} />
          <span className="text-center font-display-norm text-sm uppercase tracking-widest text-text">{visitante}</span>
        </div>
      </div>

      <div className="-mx-6 -mb-5 mt-4 flex flex-col items-center gap-1.5 rounded-b-xl bg-surface-high px-6 py-3">
        <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider', status.className)}>
          {status.text}
        </span>
        <div className="flex items-center gap-2 text-xs text-muted">
          <span>{hora}</span>
          {estadio && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin size={11} />
                {estadio}
              </span>
            </>
          )}
        </div>
      </div>

    </Link>
  )
}
