import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { calcPuntos } from '@/lib/predictions'

export function useRanking() {
  const { user } = useAuth()
  const [ranking, setRanking]   = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    if (!user) return

    async function load() {
      const [{ data: perfiles }, { data: partidos }] = await Promise.all([
        supabase.from('perfiles').select('id, username'),
        supabase.from('partidos').select('id, goles_local, goles_visitante').eq('estado', 'finalizado'),
      ])

      const partidoIds = (partidos ?? []).map(p => p.id)

      const { data: predicciones } = partidoIds.length > 0
        ? await supabase.from('predicciones').select('usuario_id, partido_id, goles_local, goles_visitante').in('partido_id', partidoIds)
        : { data: [] }

      const result = (perfiles ?? []).map(perfil => {
        const puntos = (partidos ?? []).reduce((sum, partido) => {
          const pred = (predicciones ?? []).find(
            p => p.usuario_id === perfil.id && p.partido_id === partido.id
          )
          if (!pred) return sum
          return sum + (calcPuntos(
            `${pred.goles_local}-${pred.goles_visitante}`,
            partido.goles_local,
            partido.goles_visitante
          ) ?? 0)
        }, 0)

        return { id: perfil.id, usuario: perfil.username, puntos, es_yo: perfil.id === user.id }
      })

      setRanking(
        result
          .sort((a, b) => b.puntos - a.puntos || a.usuario.localeCompare(b.usuario))
          .map((e, i) => ({ ...e, posicion: i + 1 }))
      )
      setLoading(false)
    }

    load()
  }, [user])

  return { ranking, loading }
}
