import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { translatePartido } from '@/utils/countries'

export function useFixture() {
  const { user } = useAuth()
  const [grupos,  setGrupos]  = useState([])
  const [llaves,  setLlaves]  = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    async function load() {
      const [{ data: dataGrupos }, { data: dataLlaves }] = await Promise.all([
        supabase.from('partidos').select('*').eq('fase', 'grupos').order('fecha').order('hora'),
        supabase.from('partidos').select('*').neq('fase', 'grupos').order('fecha').order('hora'),
      ])

      // Grupos: agrupar por letra de grupo
      const map = {}
      for (const p of (dataGrupos ?? [])) {
        const letra = p.grupo?.replace('Grupo ', '') ?? '?'
        if (!map[letra]) map[letra] = []
        map[letra].push(translatePartido(p))
      }
      setGrupos(Object.keys(map).sort().map(letra => ({ id: letra, partidos: map[letra] })))

      // Llaves: agrupar por fase
      const llavesMap = {}
      for (const p of (dataLlaves ?? [])) {
        if (!llavesMap[p.fase]) llavesMap[p.fase] = []
        llavesMap[p.fase].push(translatePartido(p))
      }
      setLlaves(llavesMap)

      setLoading(false)
    }

    load()
  }, [user])

  return { grupos, llaves, loading }
}
