import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export function useFixture() {
  const { user } = useAuth()
  const [grupos, setGrupos]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    async function load() {
      const { data } = await supabase
        .from('partidos')
        .select('*')
        .eq('fase', 'grupos')
        .order('fecha')
        .order('hora')

      const map = {}
      for (const p of (data ?? [])) {
        const letra = p.grupo?.replace('Grupo ', '') ?? '?'
        if (!map[letra]) map[letra] = []
        map[letra].push(p)
      }

      setGrupos(
        Object.keys(map).sort().map(letra => ({ id: letra, partidos: map[letra] }))
      )
      setLoading(false)
    }

    load()
  }, [user])

  return { grupos, loading }
}
