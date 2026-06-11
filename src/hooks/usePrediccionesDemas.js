import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { calcPuntos } from '@/lib/predictions'

export function usePrediccionesDemas(partido) {
  const { user } = useAuth()
  const [otras, setOtras] = useState([])

  useEffect(() => {
    if (!user || partido.estado !== 'finalizado') return

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
  }, [user, partido.id, partido.estado])

  return otras
}
