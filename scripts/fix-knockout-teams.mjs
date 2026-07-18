// Popula los equipos reales en los partidos de llaves que tienen TBD.
// Matchea cronológicamente (API local_date vs Supabase cierre_prediccion).
// Uso: node --env-file=.env scripts/fix-knockout-teams.mjs

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL         = process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Faltan VITE_SUPABASE_URL y/o SUPABASE_SERVICE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const ALIASES = {
  unitedstates: 'usa', unitedstatesofamerica: 'usa',
  southkorea: 'korea', korearepublic: 'korea', republicofkorea: 'korea',
  democraticrepublicofthecongo: 'drcongo', drcongo: 'drcongo',
  congodr: 'drcongo', rdcongo: 'drcongo',
  czechrepublic: 'czech', czechia: 'czech',
  turkey: 'turkey', turkiye: 'turkey',
  cotedivoire: 'ivorycoast', ivorycoast: 'ivorycoast',
}

const ROUND_TO_FASE = {
  R32: '16avos', R16: '8avos', QF: 'cuartos', SF: 'semis', FINAL: 'final', '3RD': 'tercer_puesto',
}

// Flags que no matchean por nombre exacto entre grupos y llaves
const EXTRA_FLAGS = {
  'Democratic Republic of the Congo': 'cd',
  'Congo DR': 'cd',
  'Bosnia and Herzegovina': 'ba',
  'Bosnia-H.': 'ba',
  'United States': 'us',
  'USA': 'us',
  'South Korea': 'kr',
  'Korea Republic': 'kr',
}

function normalize(name) {
  const n = (name ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '')
  return ALIASES[n] ?? n
}

function parseApiDate(localDate) {
  if (!localDate) return Infinity
  const [dp, tp] = localDate.split(' ')
  const [m, d, y] = dp.split('/')
  const [h, min] = tp.split(':')
  return new Date(+y, +m - 1, +d, +h, +min).getTime()
}

function estadoDesde(f) {
  if (f.finished === 'TRUE') return 'finalizado'
  const t = f.time_elapsed
  if (t && t !== 'notstarted') return 'en_curso'
  return 'proximo'
}

function parseScore(v) {
  return v != null && v !== 'null' && v !== '' ? Number(v) : null
}

async function main() {
  // 1. Buildear mapa de flags desde partidos de grupos existentes
  const { data: grupoRows } = await supabase
    .from('partidos')
    .select('local, visitante, flag_local, flag_visitante')
    .eq('fase', 'grupos')

  const flagMap = { ...EXTRA_FLAGS }
  for (const p of (grupoRows ?? [])) {
    if (p.local     && p.flag_local)      flagMap[p.local]     = p.flag_local
    if (p.visitante && p.flag_visitante)  flagMap[p.visitante] = p.flag_visitante
  }

  // 2. Fetch fixtures de la API
  const res = await fetch('https://worldcup26.ir/get/games')
  if (!res.ok) throw new Error(`API ${res.status}`)
  const json = await res.json()
  const all = Array.isArray(json) ? json : (json.data ?? json.games ?? [])

  // 3. Agrupar fixtures de llaves con equipos reales por fase, ordenados cronológicamente
  const apiByFase = {}
  for (const f of all) {
    const fase = ROUND_TO_FASE[f.group]
    if (!fase) continue
    if (f.type === 'group') continue
    if (!f.home_team_name_en && !f.away_team_name_en) continue
    if (!apiByFase[fase]) apiByFase[fase] = []
    apiByFase[fase].push(f)
  }
  for (const list of Object.values(apiByFase)) {
    list.sort((a, b) => parseApiDate(a.local_date) - parseApiDate(b.local_date))
  }

  // 4. Fetch registros TBD de Supabase por fase, ordenados por cierre_prediccion
  const fasesConDatos = Object.keys(apiByFase)
  if (fasesConDatos.length === 0) {
    console.log('No hay fixtures de llaves con equipos conocidos en la API.')
    return
  }

  const { data: tbdRows, error } = await supabase
    .from('partidos')
    .select('id, local, visitante, fase, cierre_prediccion, estado')
    .in('fase', fasesConDatos)
    .or('local.eq.TBD,visitante.eq.TBD')
    .order('cierre_prediccion')

  if (error) throw error

  const dbByFase = {}
  for (const p of (tbdRows ?? [])) {
    if (!dbByFase[p.fase]) dbByFase[p.fase] = []
    dbByFase[p.fase].push(p)
  }

  // 5. Match posicional y actualización
  let totalActualizados = 0

  for (const [fase, apiList] of Object.entries(apiByFase)) {
    const dbList = dbByFase[fase] ?? []
    console.log(`\n[${fase}] API con equipos: ${apiList.length} | DB con TBD: ${dbList.length}`)

    if (apiList.length !== dbList.length) {
      console.warn(`  ⚠ Conteos no coinciden — saltando`)
      continue
    }

    for (let i = 0; i < apiList.length; i++) {
      const f  = apiList[i]
      const p  = dbList[i]

      const estado    = estadoDesde(f)
      const tieneGoles = estado !== 'proximo'
      const esEnCurso  = estado === 'en_curso'

      const golesLocal     = tieneGoles ? (parseScore(f.home_score) ?? (esEnCurso ? 0 : null)) : null
      const golesVisitante = tieneGoles ? (parseScore(f.away_score) ?? (esEnCurso ? 0 : null)) : null

      const flagLocal     = flagMap[f.home_team_name_en] ?? null
      const flagVisitante = flagMap[f.away_team_name_en] ?? null

      if (!flagLocal)     console.warn(`  ⚠ Sin flag para "${f.home_team_name_en}"`)
      if (!flagVisitante) console.warn(`  ⚠ Sin flag para "${f.away_team_name_en}"`)

      console.log(`  ${i + 1}. ${f.home_team_name_en} vs ${f.away_team_name_en} → ID ${p.id} [${estado}]`)

      let query = supabase.from('partidos').update({
        local:           f.home_team_name_en,
        visitante:       f.away_team_name_en,
        flag_local:      flagLocal,
        flag_visitante:  flagVisitante,
        estado,
        goles_local:     golesLocal,
        goles_visitante: golesVisitante,
      }).eq('id', p.id)

      if (estado !== 'finalizado') query = query.neq('estado', 'finalizado')

      const { error: updErr } = await query
      if (updErr) console.error(`  ✗ ${updErr.message}`)
      else { console.log(`  ✓ OK`); totalActualizados++ }
    }
  }

  console.log(`\n✅ ${totalActualizados} registros actualizados`)
}

main().catch(err => { console.error(err); process.exit(1) })
