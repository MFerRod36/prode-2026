import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { calcPuntos } from '@/lib/predictions'

export function useUserStats(usuarioId) {
  const [predicciones, setPredicciones] = useState([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    if (!usuarioId) return

    async function load() {
      const { data: partidos } = await supabase
        .from('partidos')
        .select('id, local, visitante, flag_local, flag_visitante, goles_local, goles_visitante')
        .eq('estado', 'finalizado')

      const partidoIds = (partidos ?? []).map(p => p.id)

      const { data: preds } = partidoIds.length > 0
        ? await supabase
            .from('predicciones')
            .select('partido_id, goles_local, goles_visitante')
            .eq('usuario_id', usuarioId)
            .in('partido_id', partidoIds)
        : { data: [] }

      const result = (partidos ?? []).map(partido => {
        const pred = (preds ?? []).find(p => p.partido_id === partido.id)
        const predStr = pred ? `${pred.goles_local}-${pred.goles_visitante}` : null
        return {
          partido,
          prediccion: predStr,
          puntos: calcPuntos(predStr, partido.goles_local, partido.goles_visitante) ?? 0,
        }
      })

      setPredicciones(result)
      setLoading(false)
    }

    load()
  }, [usuarioId])

  return { predicciones, loading }
}
