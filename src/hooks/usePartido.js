import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { calcPuntos } from '@/lib/predictions'
import { translatePartido } from '@/utils/countries'

export function usePartido(id) {
  const { user } = useAuth()
  const [partido, setPartido] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !id) return

    async function load() {
      const [{ data: p }, { data: pred }] = await Promise.all([
        supabase.from('partidos').select('*').eq('id', id).single(),
        supabase.from('predicciones')
          .select('goles_local, goles_visitante')
          .eq('partido_id', id)
          .eq('usuario_id', user.id)
          .maybeSingle(),
      ])

      if (!p) { setLoading(false); return }

      const mi_prediccion = pred ? `${pred.goles_local}-${pred.goles_visitante}` : null
      setPartido({
        ...translatePartido(p),
        mi_prediccion,
        puntos: p.estado === 'finalizado'
          ? calcPuntos(mi_prediccion, p.goles_local, p.goles_visitante)
          : null,
      })
      setLoading(false)
    }

    load()
  }, [user, id])

  async function guardar(prediccion) {
    if (!user || !id) return
    const [gl, gv] = prediccion.split('-').map(Number)
    const { error } = await supabase
      .from('predicciones')
      .upsert(
        { usuario_id: user.id, partido_id: id, goles_local: gl, goles_visitante: gv },
        { onConflict: 'usuario_id,partido_id' }
      )
    if (error) { console.error(error); return }
    setPartido(prev => ({ ...prev, mi_prediccion: prediccion }))
  }

  return { partido, loading, guardar }
}
