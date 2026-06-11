// Sincroniza estado y goles del Mundial 2026 desde worldcup26.ir a Supabase.
// Modo normal: sincroniza una vez y sale.
// Modo live:   cuando hay partidos en curso, sincroniza cada 60s hasta que finalicen.
//
// Uso local:   npm run sync
// En CI:       node scripts/sync-partidos.mjs  (env vars vía GitHub Secrets)
//
// NO modifica IDs de Supabase — matchea por nombre de equipo para preservar predicciones.
// API sin key: https://worldcup26.ir (datos en vivo, gratuita)

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL         = process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_URL)         console.error('Falta: VITE_SUPABASE_URL')
if (!SUPABASE_SERVICE_KEY) console.error('Falta: SUPABASE_SERVICE_KEY')
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) process.exit(1)

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const TZ = 'America/Argentina/Buenos_Aires'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

const ALIASES = {
  // USA
  unitedstates:               'usa',
  unitedstatesofamerica:      'usa',
  // Korea
  southkorea:                 'korea',
  korearepublic:              'korea',
  republicofkorea:            'korea',
  skorea:                     'korea',
  // DR Congo
  democraticrepublicofthecongo: 'drcongo',
  drcongo:                    'drcongo',
  congodr:                    'drcongo',
  congodrc:                   'drcongo',
  rdcongo:                    'drcongo',
  // Czech
  czechrepublic:              'czech',
  czechia:                    'czech',
  // Turkey
  turkey:                     'turkey',
  turkiye:                    'turkey',
  // Ivory Coast
  cotedivoire:                'ivorycoast',
  ivorycoast:                 'ivorycoast',
}

function normalize(name) {
  const n = (name ?? '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '')
  return ALIASES[n] ?? n
}

function similitud(a, b) {
  const na = normalize(a)
  const nb = normalize(b)
  if (na === nb) return 1
  if (na.includes(nb) || nb.includes(na)) return 0.9
  if (na.slice(0, 4) === nb.slice(0, 4)) return 0.7
  return 0
}

function estadoDesde(fixture) {
  if (fixture.finished === 'TRUE') return 'finalizado'
  const t = fixture.time_elapsed
  if (t && t !== 'notstarted') return 'en_curso'
  return 'proximo'
}

function esEnVivo(fixture) {
  const t = fixture.time_elapsed
  return fixture.finished !== 'TRUE' && t && t !== 'notstarted'
}

// ─── API worldcup26.ir ────────────────────────────────────────────────────────

async function fetchFixtures(attempt = 1) {
  const res = await fetch('https://worldcup26.ir/get/games')
  if (!res.ok) {
    if (attempt < 4) {
      await sleep(attempt * 10_000)
      return fetchFixtures(attempt + 1)
    }
    throw new Error(`worldcup26.ir [${res.status}] tras ${attempt} intentos`)
  }
  const json = await res.json()
  return Array.isArray(json) ? json : (json.data ?? json.games ?? [])
}

// ─── Matching por nombre de equipo ────────────────────────────────────────────

function encontrarPartido(fixture, partidos) {
  const apiLocal     = fixture.home_team_name_en ?? ''
  const apiVisitante = fixture.away_team_name_en ?? ''

  let mejor = null
  let mejorScore = -1

  for (const p of partidos) {
    const score = similitud(p.local, apiLocal) + similitud(p.visitante, apiVisitante)
    if (score > mejorScore) { mejorScore = score; mejor = p }
  }

  // Score mínimo 1.4 para considerar un match válido (ambos nombres tienen que ser razonablemente similares)
  return mejorScore >= 1.4 ? mejor : null
}

// ─── Sync ─────────────────────────────────────────────────────────────────────

async function syncEstados(fixtures, partidos) {
  const sinMatch = []
  let actualizados = 0

  for (const f of fixtures) {
    const partido = encontrarPartido(f, partidos)
    if (!partido) {
      sinMatch.push(`${f.home_team_name_en} vs ${f.away_team_name_en}`)
      continue
    }

    const parseScore = v => (v != null && v !== 'null' && v !== '') ? Number(v) : null

    const { error } = await supabase
      .from('partidos')
      .update({
        estado:          estadoDesde(f),
        goles_local:     parseScore(f.home_score),
        goles_visitante: parseScore(f.away_score),
      })
      .eq('id', partido.id)

    if (error) console.error(`Error actualizando ${partido.local} vs ${partido.visitante}:`, error.message)
    else actualizados++
  }

  if (sinMatch.length > 0)
    console.warn('⚠ Sin match en Supabase:', sinMatch.join(' | '))

  return actualizados
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const ts = () => new Date().toLocaleTimeString('es-AR', { timeZone: TZ })

  const { data: partidos, error } = await supabase
    .from('partidos')
    .select('id, local, visitante, fecha, hora')
  if (error) throw new Error(`Supabase: ${error.message}`)
  console.log(`[${ts()}] ${partidos.length} partidos cargados de Supabase`)

  let fixtures = await fetchFixtures()
  console.log(`[${ts()}] ${fixtures.length} fixtures obtenidos de worldcup26.ir`)

  const n = await syncEstados(fixtures, partidos)
  console.log(`[${ts()}] ✓ ${n} partidos actualizados`)

  const hayEnCurso = fixtures.some(esEnVivo)
  if (!hayEnCurso) return

  console.log(`[${ts()}] Partido en curso — modo live activo (sync cada 60s)`)
  const deadline = Date.now() + 180 * 60_000

  while (Date.now() < deadline) {
    await sleep(60_000)

    try {
      fixtures = await fetchFixtures()
      const n = await syncEstados(fixtures, partidos)
      console.log(`[${ts()}] ✓ sync live — ${n} partidos actualizados`)
    } catch (err) {
      console.error(`[${ts()}] Error en loop:`, err.message)
      continue
    }

    if (!fixtures.some(esEnVivo)) {
      console.log(`[${ts()}] Partidos finalizados — saliendo del modo live`)
      break
    }
  }
}

main().catch(err => { console.error(err); process.exit(1) })
