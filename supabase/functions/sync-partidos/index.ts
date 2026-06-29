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
  bosniaherzegovina:             'bosnia',
  bosniah:                       'bosnia',
}

const ROUND_TO_FASE: Record<string, string> = {
  R32: '16avos', R16: '8avos', QF: 'cuartos', SF: 'semis', F: 'final',
}

// Flags que no matchean por nombre exacto entre la DB de grupos y la API de llaves
const EXTRA_FLAGS: Record<string, string> = {
  'Democratic Republic of the Congo': 'cd',
  'Congo DR': 'cd',
  'Bosnia and Herzegovina': 'ba',
  'Bosnia-H.': 'ba',
  'United States': 'us',
  'USA': 'us',
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

function parseScore(v: string | null | undefined): number | null {
  return v != null && v !== 'null' && v !== '' ? Number(v) : null
}

function parseLocalDate(localDate: string | undefined): number {
  if (!localDate) return Infinity
  const [dp, tp] = localDate.split(' ')
  const [m, d, y] = dp.split('/')
  const [h, min] = tp.split(':')
  return Date.UTC(+y, +m - 1, +d, +h, +min)
}

type Partido = {
  id: string
  local: string
  visitante: string
  fase: string
  cierre_prediccion: string | null
  estado: string
  flag_local: string | null
  flag_visitante: string | null
}

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

Deno.serve(async () => {
  try {
    const [{ data: partidos, error: errP }, fixturesRes] = await Promise.all([
      supabase.from('partidos').select('id, local, visitante, fase, estado, cierre_prediccion, flag_local, flag_visitante'),
      fetch('https://worldcup26.ir/get/games'),
    ])

    if (errP) throw new Error(`Supabase: ${errP.message}`)
    if (!fixturesRes.ok) throw new Error(`worldcup26.ir [${fixturesRes.status}]`)

    const json = await fixturesRes.json()
    const fixtures: Record<string, string>[] =
      Array.isArray(json) ? json : (json.data ?? json.games ?? [])

    // Mapa de flags desde los registros existentes con nombres reales
    const flagMap: Record<string, string> = { ...EXTRA_FLAGS }
    for (const p of (partidos ?? [])) {
      if (p.local     !== 'TBD' && p.flag_local)     flagMap[p.local]     = p.flag_local
      if (p.visitante !== 'TBD' && p.flag_visitante) flagMap[p.visitante] = p.flag_visitante
    }

    let actualizados = 0
    const sinMatch: string[] = []
    const debugMatched: object[] = []
    const ahora = Date.now()
    const matchedApiIds = new Set<string>()

    // ── Fase 1: match por nombre de equipo (grupos + llaves ya pobladas) ──────
    for (const f of fixtures) {
      const partido = encontrarPartido(f, partidos ?? [])
      if (!partido) {
        sinMatch.push(`${f.home_team_name_en} vs ${f.away_team_name_en}`)
        continue
      }

      matchedApiIds.add(f._id)

      let nuevoEstado = estadoDesde(f)

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
      const golesLocal     = tieneGoles ? (parseScore(f.home_score) ?? (esEnCurso ? 0 : null)) : null
      const golesVisitante = tieneGoles ? (parseScore(f.away_score) ?? (esEnCurso ? 0 : null)) : null

      let query = supabase
        .from('partidos')
        .update({ estado: nuevoEstado, goles_local: golesLocal, goles_visitante: golesVisitante })
        .eq('id', partido.id)

      if (!esFinalizado) query = query.neq('estado', 'finalizado')

      const { error } = await query
      if (!error) actualizados++
    }

    // ── Fase 2: match por orden cronológico para registros TBD ───────────────
    // Aplica cuando la API ya conoce los equipos de una ronda pero Supabase aún tiene TBD
    const unmatchedKnockout = fixtures.filter(f =>
      ROUND_TO_FASE[f.group] &&
      f.type !== 'group' &&
      (f.home_team_name_en || f.away_team_name_en) &&
      !matchedApiIds.has(f._id)
    )

    if (unmatchedKnockout.length > 0) {
      const apiByFase: Record<string, typeof unmatchedKnockout> = {}
      for (const f of unmatchedKnockout) {
        const fase = ROUND_TO_FASE[f.group]!
        if (!apiByFase[fase]) apiByFase[fase] = []
        apiByFase[fase].push(f)
      }
      for (const list of Object.values(apiByFase)) {
        list.sort((a, b) => parseLocalDate(a.local_date) - parseLocalDate(b.local_date))
      }

      const fasesNecesarias = Object.keys(apiByFase)
      const { data: tbdPartidos } = await supabase
        .from('partidos')
        .select('id, fase, cierre_prediccion, estado')
        .in('fase', fasesNecesarias)
        .or('local.eq.TBD,visitante.eq.TBD')

      const dbByFase: Record<string, { id: string; fase: string; cierre_prediccion: string; estado: string }[]> = {}
      for (const p of (tbdPartidos ?? [])) {
        if (!dbByFase[p.fase]) dbByFase[p.fase] = []
        dbByFase[p.fase].push(p)
      }
      for (const list of Object.values(dbByFase)) {
        list.sort((a, b) => new Date(a.cierre_prediccion).getTime() - new Date(b.cierre_prediccion).getTime())
      }

      for (const [fase, apiList] of Object.entries(apiByFase)) {
        const dbList = dbByFase[fase] ?? []
        if (apiList.length !== dbList.length) continue

        for (let i = 0; i < apiList.length; i++) {
          const f = apiList[i]
          const p = dbList[i]!

          const nuevoEstado  = estadoDesde(f)
          const esEnCurso    = nuevoEstado === 'en_curso'
          const tieneGoles   = nuevoEstado !== 'proximo'
          const golesLocal     = tieneGoles ? (parseScore(f.home_score) ?? (esEnCurso ? 0 : null)) : null
          const golesVisitante = tieneGoles ? (parseScore(f.away_score) ?? (esEnCurso ? 0 : null)) : null

          let query = supabase.from('partidos').update({
            local:           f.home_team_name_en,
            visitante:       f.away_team_name_en,
            flag_local:      flagMap[f.home_team_name_en] ?? null,
            flag_visitante:  flagMap[f.away_team_name_en] ?? null,
            estado:          nuevoEstado,
            goles_local:     golesLocal,
            goles_visitante: golesVisitante,
          }).eq('id', p.id)

          if (nuevoEstado !== 'finalizado') query = query.neq('estado', 'finalizado')

          const { error } = await query
          if (!error) actualizados++
        }
      }
    }

    return Response.json({ ok: true, actualizados, sinMatch, debug: debugMatched })
  } catch (err) {
    return Response.json({ ok: false, error: (err as Error).message }, { status: 500 })
  }
})
