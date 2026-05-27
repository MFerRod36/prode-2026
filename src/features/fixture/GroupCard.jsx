import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatFecha, groupByDate } from '@/utils/date'
import { Flag } from '@/components/ui/Flag'

function ScoreBox({ value, variant = 'score' }) {
  return (
    <span className={cn(
      'flex h-7 min-w-7 items-center justify-center rounded-tl rounded-br px-1 font-display text-sm font-bold leading-none',
      variant === 'vs'
        ? 'bg-surface-high text-muted'
        : variant === 'live'
          ? 'bg-result/20 text-result'
          : 'bg-white text-black'
    )}>
      {value}
    </span>
  )
}

function MatchRow({ partido }) {
  const { id, local, flag_local, visitante, flag_visitante, hora, estadio, estado, goles_local, goles_visitante } = partido
  const isProximo  = estado === 'proximo'
  const isEnCurso  = estado === 'en_curso'

  return (
    <Link to={`/fixture/${id}`} className="block py-1.5 transition-opacity active:opacity-70">
      <div className="flex items-center gap-2">

        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <Flag code={flag_local} className="h-3.5 w-auto shrink-0 rounded-sm" />
          <span className="truncate font-display-norm text-[11px] uppercase tracking-wider text-text">
            {local}
          </span>
        </div>

        <div className="flex shrink-0 items-center">
          {isProximo ? (
            <ScoreBox value="vs" variant="vs" />
          ) : (
            <div className="flex items-center">
              <ScoreBox value={goles_local}     variant={isEnCurso ? 'live' : 'score'} />
              <span className="mx-1 font-display-norm text-sm text-muted">-</span>
              <ScoreBox value={goles_visitante} variant={isEnCurso ? 'live' : 'score'} />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5">
          <span className="truncate text-right font-display-norm text-[11px] uppercase tracking-wider text-text">
            {visitante}
          </span>
          <Flag code={flag_visitante} className="h-3.5 w-auto shrink-0 rounded-sm" />
        </div>

      </div>

      <div className="mt-1.5 flex items-center justify-center gap-2">
        {isEnCurso && (
          <span className="flex items-center gap-1">
            <span className="h-1 w-1 animate-pulse rounded-full bg-result" />
            <span className="font-sans text-[10px] text-result">
              {partido.minuto != null ? `${partido.minuto}'` : 'En curso'}
            </span>
          </span>
        )}
        {!isEnCurso && (
          <p className="font-sans text-[11px] text-muted">
            {hora}{estadio ? ` · ${estadio}` : ''}
          </p>
        )}
        {isEnCurso && (
          <p className="font-sans text-[11px] text-muted">
            {hora}{estadio ? ` · ${estadio}` : ''}
          </p>
        )}
      </div>
    </Link>
  )
}

export function GroupCard({ group, onPrev, onNext }) {
  const dateGroups = groupByDate(group.partidos)

  return (
    <div className="rounded-xl border border-border bg-surface px-4 pb-4 pt-4">

      <div className="-mx-4 -mt-4 mb-4 flex items-center justify-between rounded-t-xl bg-surface-high px-4 py-3">
        <button onClick={onPrev} className="text-muted transition-colors hover:text-text">
          <ChevronLeft size={18} />
        </button>
        <h2 className="font-display text-2xl uppercase tracking-widest text-primary">
          Grupo {group.id}
        </h2>
        <button onClick={onNext} className="text-muted transition-colors hover:text-text">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="flex flex-col">
        {dateGroups.map(({ fecha, partidos }, di) => (
          <div key={fecha}>
            <div className={cn('flex items-center gap-2 py-2', di === 0 ? 'pt-3' : 'pt-4')}>
              <div className="h-px flex-1 bg-border/40" />
              <span className="font-sans text-[10px] uppercase tracking-widest text-muted">
                {formatFecha(fecha)}
              </span>
              <div className="h-px flex-1 bg-border/40" />
            </div>

            <div className="flex flex-col">
              {partidos.map((partido, pi) => (
                <div key={partido.id}>
                  {pi > 0 && <div className="my-2 h-px bg-border/30" />}
                  <MatchRow partido={partido} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
