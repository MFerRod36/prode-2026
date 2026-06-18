import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const ALIASES: Record<string, string> = {
  unitedstates:                  'usa',
  unitedstatesofamerica:         'usa',
  southkorea:                    'korea',
  korearepublic:                 'korea',
  republicofkorea:               'korea',
  democraticrepublicofthecongo:  'drcongo',
  drcongo:                       'drcongo',
  congodr:                       'drcongo',
  rdcongo:                       'drcongo',
  czechrepublic:                 'czech',
  czechia:                       'czech',
  turkey:                        'turkey',
  turkiye:                       'turkey',
  cotedivoire:                   'ivorycoast',
  ivorycoast:                    'ivorycoast',
  capeverde:                     'capeverde',
  caboverde:                     'capeverde',
}

function normalize(name: string): string {
  return (name ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .replace(/^(.+)$/, s => ALIASES[s] ?? s)
}

function similitud(a: string, b: string): number {
  const na = normalize(a)
  const nb = normalize(b)
  if (na === nb) return 1
  if (na.includes(nb) || nb.includes(na)) return 0.9
  if (na.slice(0, 4) === nb.slice(0, 4)) return 0.7
  return 0
}

function estadoDesde(f: Record<string, string>): string {
  if (String(f.finished ?? '').toUpperCase() === 'TRUE') return 'finalizado'
  const t = (f.time_elapsed ?? '').toUpperCase()
  if (!t || t === 'NOTSTARTED') return 'proximo'
  if (t === 'FT' || t === 'AET' || t === 'PEN') return 'finalizado'
  return 'en_curso'
}

// deno-lint-ignore no-explicit-any
type Partido = { id: string; local: string; visitante: string; cierre_prediccion: string | null; estado: string }

function encontrarPartido(f: Record<string, string>, partidos: Partido[]): Partido | null {
  const apiLocal     = f.home_team_name_en ?? ''
  const apiVisitante = f.away_team_name_en ?? ''
  let mejor: Partido | null = null
  let mejorScore = -1
  for (const p of partidos) {
    const score = similitud(p.local, apiLocal) + similitud(p.visitante, apiVisitante)
    if (score > mejorScore) { mejorScore = score; mejor = p }
  }
  return mejorScore >= 1.4 ? mejor : null
}

function parseScore(v: string | null | undefined): number | null {
  return v != null && v !== 'null' && v !== '' ? Number(v) : null
}

Deno.serve(async () => {
  try {
    const [{ data: partidos, error: errP }, fixturesRes] = await Promise.all([
      supabase.from('partidos').select('id, local, visitante, estado, cierre_prediccion'),
      fetch('https://worldcup26.ir/get/games'),
    ])

    if (errP) throw new Error(`Supabase: ${errP.message}`)
    if (!fixturesRes.ok) throw new Error(`worldcup26.ir [${fixturesRes.status}]`)

    const json = await fixturesRes.json()
    const fixtures: Record<string, string>[] =
      Array.isArray(json) ? json : (json.data ?? json.games ?? [])

    let actualizados = 0
    const sinMatch: string[] = []
    const debugMatched: object[] = []
    const ahora = Date.now()

    for (const f of fixtures) {
      const partido = encontrarPartido(f, partidos ?? [])
      if (!partido) {
        sinMatch.push(`${f.home_team_name_en} vs ${f.away_team_name_en}`)
        continue
      }

      let nuevoEstado = estadoDesde(f)

      // Fallback temporal: si la API dice proximo pero cierre_prediccion + 60min ya pasó, forzar en_curso
      if (nuevoEstado === 'proximo' && partido.cierre_prediccion) {
        const inicioMs = new Date(partido.cierre_prediccion).getTime() + 60 * 60 * 1000
        if (ahora > inicioMs + 10 * 60 * 1000) nuevoEstado = 'en_curso'
      }

      debugMatched.push({
        partido: `${partido.local} vs ${partido.visitante}`,
        estadoDB: partido.estado,
        estadoAPI: estadoDesde(f),
        estadoFinal: nuevoEstado,
        finished: f.finished,
        time_elapsed: f.time_elapsed,
        home_score: f.home_score,
        away_score: f.away_score,
      })

      const esFinalizado = nuevoEstado === 'finalizado'
      const esEnCurso    = nuevoEstado === 'en_curso'
      const tieneGoles   = nuevoEstado !== 'proximo'
      // En curso: defaultear a 0 si la API no manda score (0-0 es válido)
      const golesLocal     = tieneGoles ? (parseScore(f.home_score) ?? (esEnCurso ? 0 : null)) : null
      const golesVisitante = tieneGoles ? (parseScore(f.away_score) ?? (esEnCurso ? 0 : null)) : null
      let query = supabase
        .from('partidos')
        .update({
          estado:          nuevoEstado,
          goles_local:     golesLocal,
          goles_visitante: golesVisitante,
        })
        .eq('id', partido.id)

      // Never downgrade a finalizado match — API data can lag behind reality
      if (!esFinalizado) query = query.neq('estado', 'finalizado')

      const { error } = await query

      if (!error) actualizados++
    }

    return Response.json({ ok: true, actualizados, sinMatch, debug: debugMatched })
  } catch (err) {
    return Response.json({ ok: false, error: (err as Error).message }, { status: 500 })
  }
})
