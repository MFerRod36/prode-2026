import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Flag } from '@/components/ui/Flag'
import { pointsClass } from '@/utils/points'
import { usePrediccionesDemas } from '@/hooks/usePrediccionesDemas'

const STATUS_LABEL = {
  proximo:    'Próximo',
  en_curso:   'En curso',
  finalizado: 'Finalizado',
}

const STATUS_STYLE = {
  proximo:    'bg-primary/20 text-primary',
  en_curso:   'bg-result/20 text-result',
  finalizado: 'bg-surface-high text-muted',
}

function MatchHeader({ partido }) {
  const { local, flag_local, visitante, flag_visitante, hora, estadio, estado, goles_local, goles_visitante, minuto } = partido

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="flex items-center gap-4 px-6 pt-6 pb-4">

        <div className="flex flex-1 flex-col items-center gap-2">
          <Flag code={flag_local} className="h-12 w-20 rounded" />
          <span className="text-center font-display-norm text-xs uppercase tracking-widest text-text">{local}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          {estado === 'proximo' ? (
            <span className="font-display text-2xl text-muted">VS</span>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className={cn('font-display text-4xl font-bold', estado === 'en_curso' ? 'text-result' : 'text-gold')}>
                  {goles_local}
                </span>
                <span className="font-display text-2xl text-border">-</span>
                <span className={cn('font-display text-4xl font-bold', estado === 'en_curso' ? 'text-result' : 'text-gold')}>
                  {goles_visitante}
                </span>
              </div>
              {estado === 'en_curso' && minuto != null && (
                <span className="font-sans text-xs font-medium text-result">{minuto}'</span>
              )}
            </>
          )}
        </div>

        <div className="flex flex-1 flex-col items-center gap-2">
          <Flag code={flag_visitante} className="h-12 w-20 rounded" />
          <span className="text-center font-display-norm text-xs uppercase tracking-widest text-text">{visitante}</span>
        </div>

      </div>

      <div className="flex flex-col items-center gap-1 rounded-b-xl bg-surface-high px-6 py-3">
        {estado === 'en_curso' ? (
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-result" />
            <span className="font-sans text-[10px] font-medium uppercase tracking-wider text-result">En vivo</span>
          </span>
        ) : (
          <span className={cn('rounded-full px-2.5 py-0.5 font-sans text-[10px] font-medium uppercase tracking-wider', STATUS_STYLE[estado])}>
            {STATUS_LABEL[estado]}
          </span>
        )}
        <p className="font-sans text-xs text-muted">
          {hora}{estadio ? ` · ${estadio}` : ''}
        </p>
      </div>
    </div>
  )
}

// ── Panel de predicción ───────────────────────────────────────────────────────

function StepBox({ value, onChange }) {
  return (
    <div className="flex flex-col items-center">
      <button
        className="flex h-5 w-7 items-center justify-center text-muted active:text-primary"
        onClick={() => onChange(value + 1)}
      >
        <ChevronUp size={12} />
      </button>
      <span className="flex h-7 min-w-7 items-center justify-center rounded-tl rounded-br bg-primary/20 font-display text-sm font-bold text-primary">
        {value}
      </span>
      <button
        className="flex h-5 w-7 items-center justify-center text-muted active:text-primary"
        onClick={() => onChange(Math.max(0, value - 1))}
      >
        <ChevronDown size={12} />
      </button>
    </div>
  )
}

function MiPrediccionPanel({ partido, onGuardar }) {
  const { estado, mi_prediccion, puntos, cierre_prediccion } = partido

  const canEdit = (estado === 'proximo' || estado === 'en_curso')
    && new Date() < new Date(cierre_prediccion)

  const initGl = mi_prediccion != null ? +mi_prediccion.split('-')[0] : 0
  const initGv = mi_prediccion != null ? +mi_prediccion.split('-')[1] : 0

  const [gl, setGl] = useState(initGl)
  const [gv, setGv] = useState(initGv)
  const [saved, setSaved] = useState(mi_prediccion)
  const [editing, setEditing] = useState(canEdit && mi_prediccion == null)

  function handleSave() {
    const pred = `${gl}-${gv}`
    setSaved(pred)
    onGuardar(pred)
    setEditing(false)
  }

  // Si el partido finalizó, mostrar resultado de mi predicción
  if (estado === 'finalizado') {
    if (!saved) return null
    return (
      <div className="rounded-xl border border-border bg-surface px-4 py-4">
        <p className="mb-3 font-display-norm text-[10px] uppercase tracking-widest text-muted">Mi predicción</p>
        <div className="flex items-center justify-between">
          <span className="font-display text-xl font-bold text-text">{saved}</span>
          {puntos != null && (
            <span className={cn('font-display text-xl font-bold', pointsClass(puntos))}>
              {puntos > 0 ? `+${puntos}` : '0'}
            </span>
          )}
        </div>
      </div>
    )
  }

  // Partido próximo o en curso
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-display-norm text-[10px] uppercase tracking-widest text-muted">Mi predicción</p>
        {canEdit && !editing && saved && (
          <button
            onClick={() => setEditing(true)}
            className="font-sans text-[10px] uppercase tracking-wider text-error"
          >
            Editar
          </button>
        )}
      </div>

      {canEdit && editing ? (
        <div className="flex items-center justify-center gap-4">
          <StepBox value={gl} onChange={setGl} />
          <span className="font-display-norm text-xl text-muted">-</span>
          <StepBox value={gv} onChange={setGv} />
          <button
            onClick={handleSave}
            className="ml-2 rounded-full bg-primary px-4 py-1.5 font-sans text-[10px] font-medium uppercase tracking-wider text-white"
          >
            Guardar
          </button>
        </div>
      ) : saved ? (
        <p className="font-display text-xl font-bold text-text">{saved}</p>
      ) : (
        <p className="font-sans text-xs text-muted">
          {canEdit ? 'Ingresá tu predicción' : 'No hiciste una predicción'}
        </p>
      )}
    </div>
  )
}

// ── Eventos del partido ───────────────────────────────────────────────────────

function EventosPanel({ partido }) {
  const { eventos_goles = [], tarjetas = [] } = partido
  const hayEventos = eventos_goles.length > 0 || tarjetas.length > 0

  if (!hayEventos) return null

  return (
    <div className="rounded-xl border border-border bg-surface">

      {eventos_goles.length > 0 && (
        <div className="px-4 pt-4 pb-3">
          <p className="mb-3 font-display-norm text-[10px] uppercase tracking-widest text-muted">Goles</p>
          <div className="flex flex-col gap-2">
            {eventos_goles.map((e, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-8 shrink-0 font-display text-sm text-muted">{e.minuto}'</span>
                <span className="text-base leading-none">⚽</span>
                <span className="flex-1 font-display-norm text-sm uppercase tracking-wide text-text">{e.jugador}</span>
                <span className="font-sans text-[11px] text-muted">
                  {e.equipo === 'local' ? partido.local : partido.visitante}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {eventos_goles.length > 0 && tarjetas.length > 0 && (
        <div className="mx-4 h-px bg-border/30" />
      )}

      {tarjetas.length > 0 && (
        <div className="px-4 pt-3 pb-4">
          <p className="mb-3 font-display-norm text-[10px] uppercase tracking-widest text-muted">Tarjetas</p>
          <div className="flex flex-col gap-2">
            {tarjetas.map((t, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-8 shrink-0 font-display text-sm text-muted">{t.minuto}'</span>
                <span className="text-base leading-none">{t.tipo === 'amarilla' ? '🟡' : '🔴'}</span>
                <span className="flex-1 font-display-norm text-sm uppercase tracking-wide text-text">{t.jugador}</span>
                <span className="font-sans text-[11px] text-muted">
                  {t.equipo === 'local' ? partido.local : partido.visitante}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

// ── Predicciones de las demás ─────────────────────────────────────────────────

function LasDemas({ partido }) {
  const otras = usePrediccionesDemas(partido)

  if (otras.length === 0) return null

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="rounded-t-xl bg-surface-high px-4 py-2.5 text-center">
        <h3 className="font-display text-sm uppercase tracking-widest text-text">Las demás</h3>
      </div>
      <div className="flex flex-col divide-y divide-border/25 px-4">
        {otras.map(o => (
          <div key={o.usuario} className="flex items-center gap-3 py-3">
            <span className="flex-1 font-display-norm text-sm uppercase tracking-widest text-text">
              {o.usuario}
            </span>
            <span className="font-display-norm text-sm text-muted">{o.prediccion}</span>
            <span className={cn(
              'w-14 text-right font-display text-base font-bold',
              o.puntos >= 3 ? 'text-success' : o.puntos >= 1 ? 'text-gold' : 'text-error'
            )}>
              {o.puntos > 0 ? `+${o.puntos}` : '0'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────

export function MatchDetail({ partido, onGuardar }) {
  return (
    <div className="flex flex-col gap-4">
      <MatchHeader partido={partido} />
      <MiPrediccionPanel partido={partido} onGuardar={onGuardar} />
      {partido.estado === 'finalizado' && <EventosPanel partido={partido} />}
      {partido.estado === 'finalizado' && <LasDemas    partido={partido} />}
    </div>
  )
}
