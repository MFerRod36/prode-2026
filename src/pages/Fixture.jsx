import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { GroupCard } from '@/features/fixture/GroupCard'
import { Flag } from '@/components/ui/Flag'
import { useFixture } from '@/hooks/useFixture'
import { formatFecha, groupByDate } from '@/utils/date'
import { cn } from '@/lib/cn'

// ── Carousel de grupos ────────────────────────────────────────────────────────

function GruposCarousel({ grupos }) {
  const [current, setCurrent] = useState(0)

  if (grupos.length === 0) return (
    <div className="rounded-xl border border-border bg-surface px-4 py-8 text-center">
      <p className="font-sans text-sm text-muted">Cargando grupos...</p>
    </div>
  )

  function prev() { setCurrent(i => (i - 1 + grupos.length) % grupos.length) }
  function next() { setCurrent(i => (i + 1) % grupos.length) }

  return (
    <div className="flex flex-col gap-3">
      <GroupCard group={grupos[current]} onPrev={prev} onNext={next} />
      <div className="flex items-center justify-center gap-1.5">
        {grupos.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              i === current ? 'w-4 bg-primary' : 'w-1.5 bg-border'
            )}
          />
        ))}
      </div>
    </div>
  )
}

// ── Lista de partidos de llaves ───────────────────────────────────────────────

function ScoreBox({ value, variant }) {
  return (
    <span className={cn(
      'flex h-7 min-w-7 items-center justify-center rounded-tl rounded-br px-1 font-display text-sm font-bold leading-none',
      variant === 'vs'   ? 'bg-surface-high text-muted' :
      variant === 'live' ? 'bg-result/20 text-result'   :
                           'bg-white text-black'
    )}>
      {value}
    </span>
  )
}

function KnockoutRow({ partido }) {
  const { id, local, flag_local, visitante, flag_visitante, hora, estadio, estado, goles_local, goles_visitante } = partido
  const isTBD      = local === 'TBD' || visitante === 'TBD'
  const isProximo  = estado === 'proximo'
  const isEnCurso  = estado === 'en_curso'

  return (
    <Link to={`/fixture/${id}`} className={cn('block py-1.5 transition-opacity active:opacity-70', isTBD && 'pointer-events-none')}>
      <div className="flex items-center gap-2">

        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          {isTBD ? (
            <span className="h-3.5 w-5 shrink-0 rounded-sm bg-border/40" />
          ) : (
            <Flag code={flag_local} className="h-3.5 w-5 shrink-0 rounded-sm" />
          )}
          <span className={cn('truncate font-display-norm text-[11px] uppercase tracking-wider', isTBD ? 'text-muted' : 'text-text')}>
            {isTBD ? 'Por definir' : local}
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
          <span className={cn('truncate text-right font-display-norm text-[11px] uppercase tracking-wider', isTBD ? 'text-muted' : 'text-text')}>
            {isTBD ? 'Por definir' : visitante}
          </span>
          {isTBD ? (
            <span className="h-3.5 w-5 shrink-0 rounded-sm bg-border/40" />
          ) : (
            <Flag code={flag_visitante} className="h-3.5 w-5 shrink-0 rounded-sm" />
          )}
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
        <p className="font-sans text-[11px] text-muted">
          {hora}{estadio ? ` · ${estadio}` : ''}
        </p>
      </div>
    </Link>
  )
}

function KnockoutList({ partidos }) {
  const dateGroups = groupByDate(partidos)

  return (
    <div className="rounded-xl border border-border bg-surface px-4 pb-4 pt-4">
      <div className="flex flex-col">
        {dateGroups.map(({ fecha, partidos: ps }, di) => (
          <div key={fecha}>
            <div className={cn('flex items-center gap-2 py-2', di === 0 ? 'pt-3' : 'pt-4')}>
              <div className="h-px flex-1 bg-border/40" />
              <span className="font-sans text-[10px] uppercase tracking-widest text-muted">
                {formatFecha(fecha)}
              </span>
              <div className="h-px flex-1 bg-border/40" />
            </div>
            <div className="flex flex-col">
              {ps.map((p, pi) => (
                <div key={p.id}>
                  {pi > 0 && <div className="my-2 h-px bg-border/30" />}
                  <KnockoutRow partido={p} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Página Fixture ────────────────────────────────────────────────────────────

const FASES_LLAVES = [
  { fase: '16avos',       label: '16avos'   },
  { fase: '8avos',        label: '8avos'    },
  { fase: 'cuartos',      label: 'Cuartos'  },
  { fase: 'semis',        label: 'Semis'    },
  { fase: 'tercer_puesto',label: '3er Puesto' },
  { fase: 'final',        label: 'Final'    },
]

export default function Fixture() {
  const { grupos, llaves, loading } = useFixture()

  return (
    <div className="flex flex-col">
      <h1 className="mb-4 font-display text-4xl font-bold uppercase text-name">Fixture</h1>

      <div className="flex flex-col gap-8">

        <section className="flex flex-col gap-3">
          <h2 className="font-display text-base font-bold uppercase tracking-wider text-text">Grupos</h2>
          {loading ? (
            <div className="rounded-xl border border-border bg-surface px-4 py-8 text-center">
              <p className="font-sans text-sm text-muted">Cargando grupos...</p>
            </div>
          ) : (
            <GruposCarousel grupos={grupos} />
          )}
        </section>

        {FASES_LLAVES.map(({ fase, label }) => {
          const partidos = llaves[fase]
          if (!partidos?.length) return null
          return (
            <section key={fase} className="flex flex-col gap-3">
              <h2 className="font-display text-base font-bold uppercase tracking-wider text-text">{label}</h2>
              <KnockoutList partidos={partidos} />
            </section>
          )
        })}

      </div>
    </div>
  )
}
