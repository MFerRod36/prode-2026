// TODO: reemplazar con datos reales de Supabase
// Partidos de ejemplo que cubren distintos estados para el mock
export const MOCK_PARTIDOS = [
  // Hoy — 2026-05-27 (editable)
  {
    id: 1,
    local: 'Argentina', flag_local: '🇦🇷', visitante: 'España', flag_visitante: '🇪🇸',
    hora: '15:00', fecha: '2026-05-27', estadio: 'MetLife Stadium',
    estado: 'proximo', goles_local: null, goles_visitante: null,
    mi_prediccion: null, puntos: null,
  },
  {
    id: 2,
    local: 'Brasil', flag_local: '🇧🇷', visitante: 'Francia', flag_visitante: '🇫🇷',
    hora: '18:00', fecha: '2026-05-27', estadio: 'SoFi Stadium',
    estado: 'en_curso', goles_local: 1, goles_visitante: 0,
    mi_prediccion: '1-0', puntos: null,
  },
  // Mañana — 2026-05-28 (editable)
  {
    id: 3,
    local: 'USA', flag_local: '🇺🇸', visitante: 'Portugal', flag_visitante: '🇵🇹',
    hora: '13:00', fecha: '2026-05-28', estadio: 'MetLife Stadium',
    estado: 'proximo', goles_local: null, goles_visitante: null,
    mi_prediccion: '2-1', puntos: null,
  },
  // Pasado mañana — 2026-05-29 (editable)
  {
    id: 4,
    local: 'Alemania', flag_local: '🇩🇪', visitante: 'Italia', flag_visitante: '🇮🇹',
    hora: '20:00', fecha: '2026-05-29', estadio: 'AT&T Stadium',
    estado: 'proximo', goles_local: null, goles_visitante: null,
    mi_prediccion: null, puntos: null,
  },
  // 4 días — 2026-05-31 (NO editable aún)
  {
    id: 5,
    local: 'Japón', flag_local: '🇯🇵', visitante: 'Ghana', flag_visitante: '🇬🇭',
    hora: '22:00', fecha: '2026-05-31', estadio: 'Arrowhead Stadium',
    estado: 'proximo', goles_local: null, goles_visitante: null,
    mi_prediccion: null, puntos: null,
  },
  // Historial — 2026-05-26
  {
    id: 6,
    local: 'Alemania', flag_local: '🇩🇪', visitante: 'Italia', flag_visitante: '🇮🇹',
    hora: '16:00', fecha: '2026-05-26', estadio: 'AT&T Stadium',
    estado: 'finalizado', goles_local: 2, goles_visitante: 1,
    mi_prediccion: '2-1', puntos: 3,
  },
  {
    id: 7,
    local: 'Portugal', flag_local: '🇵🇹', visitante: 'Uruguay', flag_visitante: '🇺🇾',
    hora: '19:00', fecha: '2026-05-26', estadio: 'Rose Bowl',
    estado: 'finalizado', goles_local: 0, goles_visitante: 0,
    mi_prediccion: '1-0', puntos: 0,
  },
  // Historial — 2026-05-25
  {
    id: 8,
    local: 'Japón', flag_local: '🇯🇵', visitante: 'Ghana', flag_visitante: '🇬🇭',
    hora: '22:00', fecha: '2026-05-25', estadio: 'Arrowhead Stadium',
    estado: 'finalizado', goles_local: 1, goles_visitante: 2,
    mi_prediccion: null, puntos: null,
  },
  {
    id: 9,
    local: 'Inglaterra', flag_local: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', visitante: 'Países Bajos', flag_visitante: '🇳🇱',
    hora: '16:00', fecha: '2026-05-25', estadio: 'Rose Bowl',
    estado: 'finalizado', goles_local: 3, goles_visitante: 2,
    mi_prediccion: '2-1', puntos: 1,
  },
]
