// Sincroniza los partidos del Mundial 2026 desde football-data.org a Supabase.
// Modo normal: sincroniza una vez y sale.
// Modo live:   cuando hay partidos en curso, sincroniza cada 60s hasta que finalicen.
//
// Uso local:   npm run sync
// En CI:       node scripts/sync-partidos.mjs  (env vars vía GitHub Secrets)

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL         = process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const FOOTBALL_API_TOKEN   = process.env.FOOTBALL_API_TOKEN

if (!SUPABASE_URL)         console.error('Falta: VITE_SUPABASE_URL')
if (!SUPABASE_SERVICE_KEY) console.error('Falta: SUPABASE_SERVICE_KEY')
if (!FOOTBALL_API_TOKEN)   console.error('Falta: FOOTBALL_API_TOKEN')
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !FOOTBALL_API_TOKEN) process.exit(1)

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const FLAG = {
  // CONMEBOL
  ARG: 'ar', BRA: 'br', URU: 'uy', URY: 'uy', COL: 'co', ECU: 'ec',
  VEN: 've', PAR: 'py', PER: 'pe', BOL: 'bo', CHI: 'cl',
  // CONCACAF
  USA: 'us', MEX: 'mx', CAN: 'ca', HON: 'hn', JAM: 'jm',
  CRC: 'cr', PAN: 'pa', GUA: 'gt', TRI: 'tt', CUB: 'cu',
  HAI: 'ht', CUW: 'cw', CUR: 'cw',
  // UEFA
  GER: 'de', FRA: 'fr', ESP: 'es', ENG: 'gb-eng', POR: 'pt',
  NED: 'nl', BEL: 'be', ITA: 'it', AUT: 'at', CHE: 'ch', SUI: 'ch',
  DEN: 'dk', SWE: 'se', NOR: 'no', FIN: 'fi', SCO: 'gb-sct',
  WAL: 'gb-wls', IRL: 'ie', CZE: 'cz', POL: 'pl', HUN: 'hu',
  ROU: 'ro', SVK: 'sk', SVN: 'si', SRB: 'rs', CRO: 'hr',
  ALB: 'al', TUR: 'tr', GEO: 'ge', UKR: 'ua', GRE: 'gr',
  ISL: 'is', MKD: 'mk', MNE: 'me', BIH: 'ba', ARM: 'am',
  KAZ: 'kz', AZE: 'az',
  // AFC
  JPN: 'jp', KOR: 'kr', IRN: 'ir', SAU: 'sa', KSA: 'sa', AUS: 'au',
  QAT: 'qa', IRQ: 'iq', JOR: 'jo', UZB: 'uz', OMA: 'om',
  CHN: 'cn', THA: 'th', IDN: 'id', UAE: 'ae', BHR: 'bh',
  // CAF
  MAR: 'ma', SEN: 'sn', NGA: 'ng', GHA: 'gh', CMR: 'cm',
  CIV: 'ci', EGY: 'eg', TUN: 'tn', ALG: 'dz', MLI: 'ml',
  ZIM: 'zw', ANG: 'ao', BEN: 'bj', GIN: 'gn', MOZ: 'mz',
  RSA: 'za', COD: 'cd', CPV: 'cv',
  // OFC
  NZL: 'nz', FIJ: 'fj',
}

const ESTADO_MAP = {
  SCHEDULED: 'proximo', TIMED: 'proximo', POSTPONED: 'proximo', CANCELLED: 'proximo',
  IN_PLAY: 'en_curso', PAUSED: 'en_curso', HALFTIME: 'en_curso',
  FINISHED: 'finalizado',
}

const FASE_MAP = {
  GROUP_STAGE:    'grupos',
  LAST_32:        '32avos',
  LAST_16:        '16avos',
  QUARTER_FINALS: 'cuartos',
  SEMI_FINALS:    'semis',
  THIRD_PLACE:    'tercer_puesto',
  FINAL:          'final',
}

const LIVE_STATUSES = new Set(['IN_PLAY', 'PAUSED', 'HALFTIME'])

const TZ = 'America/Argentina/Buenos_Aires'

// ─── 60s sleep ───────────────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// ─── Fetch desde football-data.org ───────────────────────────────────────────
async function fetchMatches() {
  const res = await fetch('https://api.football-data.org/v4/competitions/WC/matches', {
    headers: { 'X-Auth-Token': FOOTBALL_API_TOKEN }
  })
  if (!res.ok) throw new Error(`API [${res.status}]: ${await res.text()}`)
  return (await res.json()).matches
}

// ─── Mapeo y upsert a Supabase ────────────────────────────────────────────────
function mapPartido(m) {
  const utcDate = new Date(m.utcDate)
  return {
    id:              m.id,
    local:           m.homeTeam.shortName ?? m.homeTeam.name ?? 'TBD',
    visitante:       m.awayTeam.shortName ?? m.awayTeam.name ?? 'TBD',
    flag_local:      FLAG[m.homeTeam.tla] ?? null,
    flag_visitante:  FLAG[m.awayTeam.tla] ?? null,
    fecha:           utcDate.toLocaleDateString('en-CA', { timeZone: TZ }),
    hora:            utcDate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', timeZone: TZ }),
    estadio:         m.venue ?? null,
    estado:          ESTADO_MAP[m.status] ?? 'proximo',
    goles_local:     m.score?.fullTime?.home ?? null,
    goles_visitante: m.score?.fullTime?.away ?? null,
    grupo:           m.group ? m.group.replace('GROUP_', 'Grupo ') : null,
    fase:            FASE_MAP[m.stage] ?? 'grupos',
    cierre_prediccion: new Date(utcDate.getTime() - 60 * 60 * 1000).toISOString(),
    eventos:         [],
  }
}

async function syncToSupabase(matches) {
  const sinBandera = new Set(
    matches.flatMap(m => [m.homeTeam.tla, m.awayTeam.tla]).filter(tla => tla && !FLAG[tla])
  )
  if (sinBandera.size > 0) console.warn('⚠ TLA sin bandera:', [...sinBandera].join(', '))

  const { error } = await supabase
    .from('partidos')
    .upsert(matches.map(mapPartido), { onConflict: 'id' })

  if (error) throw new Error(`Supabase: ${error.message}`)
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const ts = () => new Date().toLocaleTimeString('es-AR', { timeZone: TZ })

  let matches = await fetchMatches()
  console.log(`[${ts()}] Sincronizando ${matches.length} partidos...`)
  await syncToSupabase(matches)
  console.log(`[${ts()}] ✓ ${matches.length} partidos sincronizados`)

  const hayEnCurso = matches.some(m => LIVE_STATUSES.has(m.status))
  if (!hayEnCurso) return

  // Modo live: loop de 60s hasta que no queden partidos activos
  // Máximo 3 horas (cubre tiempo extra + penales)
  console.log(`[${ts()}] Partido en curso — modo live activo (sync cada 60s)`)
  const deadline = Date.now() + 180 * 60_000

  while (Date.now() < deadline) {
    await sleep(60_000)

    try {
      matches = await fetchMatches()
      await syncToSupabase(matches)
      console.log(`[${ts()}] ✓ sync live`)
    } catch (err) {
      console.error(`[${ts()}] Error en loop:`, err.message)
      continue
    }

    const stillLive = matches.some(m => LIVE_STATUSES.has(m.status))
    if (!stillLive) {
      console.log(`[${ts()}] Partidos finalizados — saliendo del modo live`)
      break
    }
  }
}

main().catch(err => { console.error(err); process.exit(1) })
