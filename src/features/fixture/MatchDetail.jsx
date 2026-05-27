import { useState, useEffect } from 'react'
import { cn } from '@/lib/cn'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { calcPuntos } from '@/lib/predictions'
import { Flag } from '@/components/ui/Flag'

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
          <Flag code={flag_local} className="h-12 w-auto rounded" />
          <span className="font-display-norm text-xs uppercase tracking-widest text-text">{local}</span>
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
          <Flag code={flag_visitante} className="h-12 w-auto rounded" />
          <span className="font-display-norm text-xs uppercase tracking-widest text-text">{visitante}</span>
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

function EventosPanel({ partido }) {
  const { eventos_goles, tarjetas } = partido
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

function LasDemas({ partido }) {
  const { user } = useAuth()
  const [otras, setOtras] = useState([])

  useEffect(() => {
    if (!user) return

    async function load() {
      const { data: preds } = await supabase
        .from('predicciones')
        .select('usuario_id, goles_local, goles_visitante')
        .eq('partido_id', partido.id)
        .neq('usuario_id', user.id)

      if (!preds?.length) return

      const { data: perfiles } = await supabase
        .from('perfiles')
        .select('id, username')
        .in('id', preds.map(p => p.usuario_id))

      setOtras(preds.map(pred => {
        const prediccion = `${pred.goles_local}-${pred.goles_visitante}`
        return {
          usuario:    perfiles?.find(p => p.id === pred.usuario_id)?.username ?? 'Usuaria',
          prediccion,
          puntos:     calcPuntos(prediccion, partido.goles_local, partido.goles_visitante) ?? 0,
        }
      }))
    }

    load()
  }, [user, partido.id])

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

export function MatchDetail({ partido }) {
  return (
    <div className="flex flex-col gap-4">
      <MatchHeader partido={partido} />
      {partido.estado === 'finalizado' && <EventosPanel partido={partido} />}
      {partido.estado === 'finalizado' && <LasDemas    partido={partido} />}
    </div>
  )
}
