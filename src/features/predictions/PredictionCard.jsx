import { useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatFecha, groupByDate, isEditableDate } from '@/utils/date'

function pointsClass(pts) {
  if (pts >= 3) return 'text-success'
  if (pts >= 1) return 'text-gold'
  return 'text-error'
}

// Flechas ▲/▼ para editar (solo cuando está habilitado)
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

// Caja bloqueada — siempre gris
function PredBox({ value }) {
  return (
    <span className="flex h-7 min-w-7 items-center justify-center rounded-tl rounded-br bg-surface-high px-1 font-display text-sm font-bold leading-none text-text">
      {value}
    </span>
  )
}

function ProximaRow({ partido, canEdit, onSave }) {
  const init = partido.mi_prediccion
  const [savedPred, setSavedPred] = useState(init)
  const [gl, setGl] = useState(savedPred ? +savedPred.split('-')[0] : 0)
  const [gv, setGv] = useState(savedPred ? +savedPred.split('-')[1] : 0)
  const [isEditing, setIsEditing] = useState(canEdit && savedPred == null)

  const enCurso = partido.estado === 'en_curso'

  function handleSave() {
    const pred = `${gl}-${gv}`
    setSavedPred(pred)
    onSave(pred)
    setIsEditing(false)
  }

  const predL = savedPred ? +savedPred.split('-')[0] : null
  const predV = savedPred ? +savedPred.split('-')[1] : null

  return (
    <div className="py-2">
      <div className="flex items-center gap-2">

        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <span className="shrink-0 text-[11px] leading-none">{partido.flag_local}</span>
          <span className="truncate font-display-norm text-[11px] uppercase tracking-wider text-text">
            {partido.local}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          {canEdit && isEditing ? (
            <>
              <StepBox value={gl} onChange={setGl} />
              <span className="mx-0.5 font-display-norm text-sm text-muted">-</span>
              <StepBox value={gv} onChange={setGv} />
            </>
          ) : predL != null ? (
            <>
              <PredBox value={predL} />
              <span className="mx-0.5 font-display-norm text-sm text-muted">-</span>
              <PredBox value={predV} />
            </>
          ) : (
            <span className="flex h-7 min-w-10 items-center justify-center rounded-lg bg-surface-high font-display-norm text-xs text-muted">
              vs
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5">
          <span className="truncate text-right font-display-norm text-[11px] uppercase tracking-wider text-text">
            {partido.visitante}
          </span>
          <span className="shrink-0 text-[11px] leading-none">{partido.flag_visitante}</span>
        </div>

      </div>

      <div className="mt-1.5 flex items-center justify-between">
        <p className="font-sans text-[11px] text-muted">
          {partido.hora}{partido.estadio ? ` · ${partido.estadio}` : ''}
        </p>
        <div className="flex items-center gap-2">
          {enCurso && (
            <span className="rounded-full bg-primary/15 px-2 py-0.5 font-sans text-[9px] font-medium uppercase tracking-wider text-primary">
              En curso
            </span>
          )}
          {canEdit && isEditing && (
            <button
              onClick={handleSave}
              className="rounded-full bg-primary px-3 py-0.5 font-sans text-[10px] font-medium uppercase tracking-wider text-white"
            >
              Guardar
            </button>
          )}
          {canEdit && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="font-sans text-[10px] uppercase tracking-wider text-error"
            >
              Editar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function HistorialMatchItem({ partido }) {
  const pred = partido.mi_prediccion

  return (
    <div className="py-2">
      <div className="flex items-center justify-between">
        <span className="font-display-norm text-[11px] uppercase tracking-wider text-text">
          {partido.local}
        </span>
        <span className="font-display text-sm font-bold text-text">{partido.goles_local}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-display-norm text-[11px] uppercase tracking-wider text-text">
          {partido.visitante}
        </span>
        <span className="font-display text-sm font-bold text-text">{partido.goles_visitante}</span>
      </div>
      <div className="mt-1 flex items-center justify-between">
        <span className="font-sans text-[10px] text-muted">
          {pred ? `Mi pred: ${pred}` : 'Sin predicción'}
        </span>
        {partido.puntos != null && (
          <span className={cn('font-display text-sm font-bold', pointsClass(partido.puntos))}>
            {partido.puntos > 0 ? `+${partido.puntos}` : '0'}
          </span>
        )}
      </div>
    </div>
  )
}

// Card de una fecha — va dentro del carrusel de próximas
export function ProximaDateCard({ fecha, partidos, onSave, onPrev, onNext }) {
  const editable = isEditableDate(fecha)

  return (
    <div className="rounded-xl border border-border bg-surface px-4 pb-3 pt-4">
      <div className="-mx-4 -mt-4 mb-3 flex items-center justify-between rounded-t-xl bg-surface-high px-4 py-2.5">
        <button onClick={onPrev} className="text-muted transition-colors hover:text-text">
          <ChevronLeft size={18} />
        </button>
        <p className="font-display text-sm font-bold uppercase text-text">{formatFecha(fecha)}</p>
        <button onClick={onNext} className="text-muted transition-colors hover:text-text">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="flex flex-col">
        {partidos.map((p, pi) => (
          <div key={p.id}>
            {pi > 0 && <div className="my-1.5 h-px bg-border/25" />}
            <ProximaRow
              partido={p}
              canEdit={editable && p.estado === 'proximo'}
              onSave={pred => onSave(p.id, pred)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// Historial — acordeón colapsable por fecha, sin banderas, compacto
export function HistorialCard({ partidos }) {
  const dateGroups = groupByDate(partidos).reverse()
  const [openDates, setOpenDates] = useState(new Set())

  function toggle(fecha) {
    setOpenDates(prev => {
      const next = new Set(prev)
      if (next.has(fecha)) next.delete(fecha)
      else next.add(fecha)
      return next
    })
  }

  return (
    <div className="rounded-xl border border-border bg-surface px-4 pb-2 pt-4">
      <div className="-mx-4 -mt-4 mb-2 rounded-t-xl bg-surface-high px-4 py-2.5 text-center">
        <h3 className="font-display text-sm uppercase tracking-widest text-text">Historial</h3>
      </div>

      <div className="flex flex-col divide-y divide-border/25">
        {dateGroups.map(({ fecha, partidos: ps }) => {
          const isOpen = openDates.has(fecha)
          const totalPts = ps.reduce((s, p) => s + (p.puntos ?? 0), 0)

          return (
            <div key={fecha}>
              <button
                className="flex w-full items-center justify-between py-2.5"
                onClick={() => toggle(fecha)}
              >
                <span className="font-sans text-[11px] uppercase tracking-widest text-muted">
                  {formatFecha(fecha)}
                </span>
                <div className="flex items-center gap-2">
                  {totalPts > 0 && (
                    <span className="font-display text-sm font-bold text-success">+{totalPts}</span>
                  )}
                  <ChevronDown
                    size={14}
                    className={cn('text-muted transition-transform duration-200', isOpen && 'rotate-180')}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="pb-1">
                  {ps.map((p, pi) => (
                    <div key={p.id}>
                      {pi > 0 && <div className="h-px bg-border/20" />}
                      <HistorialMatchItem partido={p} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
