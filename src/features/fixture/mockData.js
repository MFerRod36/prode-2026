// TODO: reemplazar con datos reales desde API-Football
// Estructura de `partido` espeja la respuesta mapeada de GET /fixtures?league=1&season=2026
// Campos: id, local, flag_local, visitante, flag_visitante,
//         fecha (YYYY-MM-DD), hora (HH:MM local), estadio,
//         estado ('proximo' | 'en_curso' | 'finalizado'),
//         goles_local, goles_visitante

const PRO = 'proximo'
let _id = 100
const p = (local, fl, vis, fv, fecha, hora, estadio, estado = PRO, gl = null, gv = null) => ({
  id: _id++, local, flag_local: fl, visitante: vis, flag_visitante: fv,
  fecha, hora, estadio, estado, goles_local: gl, goles_visitante: gv,
})

export const GRUPOS = [
  {
    id: 'A',
    partidos: [
      p('USA',      '🇺🇸', 'Portugal',  '🇵🇹', '2026-06-12', '13:00', 'MetLife Stadium',        'finalizado', 2, 1),
      p('Ghana',    '🇬🇭', 'Bolivia',   '🇧🇴', '2026-06-12', '16:00', 'AT&T Stadium',           'finalizado', 1, 0),
      p('USA',      '🇺🇸', 'Ghana',     '🇬🇭', '2026-06-17', '16:00', 'SoFi Stadium',           'en_curso',   1, 1),
      p('Portugal', '🇵🇹', 'Bolivia',   '🇧🇴', '2026-06-17', '19:00', 'Rose Bowl'),
      p('USA',      '🇺🇸', 'Bolivia',   '🇧🇴', '2026-06-22', '16:00', 'Lumen Field'),
      p('Portugal', '🇵🇹', 'Ghana',     '🇬🇭', '2026-06-22', '16:00', 'NRG Stadium'),
    ],
  },
  {
    id: 'B',
    partidos: [
      p('México',   '🇲🇽', 'Ecuador',   '🇪🇨', '2026-06-12', '19:00', 'Estadio Azteca'),
      p('Suecia',   '🇸🇪', 'Nigeria',   '🇳🇬', '2026-06-12', '22:00', 'BC Place'),
      p('México',   '🇲🇽', 'Suecia',    '🇸🇪', '2026-06-17', '13:00', 'Estadio BBVA'),
      p('Ecuador',  '🇪🇨', 'Nigeria',   '🇳🇬', '2026-06-17', '22:00', 'Arrowhead Stadium'),
      p('México',   '🇲🇽', 'Nigeria',   '🇳🇬', '2026-06-22', '19:00', 'Estadio Akron'),
      p('Ecuador',  '🇪🇨', 'Suecia',    '🇸🇪', '2026-06-22', '19:00', 'Allegiant Stadium'),
    ],
  },
  {
    id: 'C',
    partidos: [
      p('Canadá',   '🇨🇦', 'Marruecos', '🇲🇦', '2026-06-13', '13:00', 'BMO Field'),
      p('Rumania',  '🇷🇴', 'Honduras',  '🇭🇳', '2026-06-13', '16:00', 'Gillette Stadium'),
      p('Canadá',   '🇨🇦', 'Rumania',   '🇷🇴', '2026-06-18', '16:00', 'Lincoln Financial Field'),
      p('Marruecos','🇲🇦', 'Honduras',  '🇭🇳', '2026-06-18', '19:00', 'Empower Field'),
      p('Canadá',   '🇨🇦', 'Honduras',  '🇭🇳', '2026-06-23', '16:00', 'BC Place'),
      p('Marruecos','🇲🇦', 'Rumania',   '🇷🇴', '2026-06-23', '16:00', 'Levi\'s Stadium'),
    ],
  },
  {
    id: 'D',
    partidos: [
      p('Brasil',   '🇧🇷', 'Noruega',   '🇳🇴', '2026-06-13', '19:00', 'SoFi Stadium'),
      p('Japón',    '🇯🇵', 'Qatar',     '🇶🇦', '2026-06-13', '22:00', 'AT&T Stadium'),
      p('Brasil',   '🇧🇷', 'Japón',     '🇯🇵', '2026-06-18', '13:00', 'MetLife Stadium'),
      p('Noruega',  '🇳🇴', 'Qatar',     '🇶🇦', '2026-06-18', '22:00', 'NRG Stadium'),
      p('Brasil',   '🇧🇷', 'Qatar',     '🇶🇦', '2026-06-23', '19:00', 'Rose Bowl'),
      p('Noruega',  '🇳🇴', 'Japón',     '🇯🇵', '2026-06-23', '19:00', 'Arrowhead Stadium'),
    ],
  },
  {
    id: 'E',
    partidos: [
      p('Argentina','🇦🇷', 'Francia',   '🇫🇷', '2026-06-14', '13:00', 'MetLife Stadium'),
      p('Corea del Sur','🇰🇷','Arabia Saudita','🇸🇦','2026-06-14','16:00','Allegiant Stadium'),
      p('Argentina','🇦🇷', 'Corea del Sur','🇰🇷','2026-06-19','16:00','AT&T Stadium'),
      p('Francia',  '🇫🇷', 'Arabia Saudita','🇸🇦','2026-06-19','19:00','Levi\'s Stadium'),
      p('Argentina','🇦🇷', 'Arabia Saudita','🇸🇦','2026-06-24','16:00','SoFi Stadium'),
      p('Francia',  '🇫🇷', 'Corea del Sur','🇰🇷','2026-06-24','16:00','Gillette Stadium'),
    ],
  },
  {
    id: 'F',
    partidos: [
      p('España',   '🇪🇸', 'Alemania',  '🇩🇪', '2026-06-14', '19:00', 'NRG Stadium'),
      p('Chile',    '🇨🇱', 'Australia', '🇦🇺', '2026-06-14', '22:00', 'Empower Field'),
      p('España',   '🇪🇸', 'Chile',     '🇨🇱', '2026-06-19', '13:00', 'Estadio BBVA'),
      p('Alemania', '🇩🇪', 'Australia', '🇦🇺', '2026-06-19', '22:00', 'Estadio Azteca'),
      p('España',   '🇪🇸', 'Australia', '🇦🇺', '2026-06-24', '19:00', 'Lincoln Financial Field'),
      p('Alemania', '🇩🇪', 'Chile',     '🇨🇱', '2026-06-24', '19:00', 'Lumen Field'),
    ],
  },
  {
    id: 'G',
    partidos: [
      p('Inglaterra','🏴󠁧󠁢󠁥󠁮󠁧󠁿','Países Bajos','🇳🇱','2026-06-11','13:00','Rose Bowl'),
      p('Paraguay', '🇵🇾', 'Senegal',   '🇸🇳', '2026-06-11', '16:00', 'Arrowhead Stadium'),
      p('Inglaterra','🏴󠁧󠁢󠁥󠁮󠁧󠁿','Paraguay','🇵🇾','2026-06-16','16:00','MetLife Stadium'),
      p('Países Bajos','🇳🇱','Senegal', '🇸🇳', '2026-06-16', '19:00', 'Estadio Akron'),
      p('Inglaterra','🏴󠁧󠁢󠁥󠁮󠁧󠁿','Senegal','🇸🇳','2026-06-21','16:00','AT&T Stadium'),
      p('Países Bajos','🇳🇱','Paraguay','🇵🇾','2026-06-21','16:00','SoFi Stadium'),
    ],
  },
  {
    id: 'H',
    partidos: [
      p('Bélgica',  '🇧🇪', 'Colombia',  '🇨🇴', '2026-06-11', '19:00', 'NRG Stadium'),
      p('Irán',     '🇮🇷', 'Jamaica',   '🇯🇲', '2026-06-11', '22:00', 'Allegiant Stadium'),
      p('Bélgica',  '🇧🇪', 'Irán',      '🇮🇷', '2026-06-16', '13:00', 'Lumen Field'),
      p('Colombia', '🇨🇴', 'Jamaica',   '🇯🇲', '2026-06-16', '22:00', 'BC Place'),
      p('Bélgica',  '🇧🇪', 'Jamaica',   '🇯🇲', '2026-06-21', '19:00', 'Empower Field'),
      p('Colombia', '🇨🇴', 'Irán',      '🇮🇷', '2026-06-21', '19:00', 'Estadio BBVA'),
    ],
  },
  {
    id: 'I',
    partidos: [
      p('Croacia',  '🇭🇷', 'Uruguay',   '🇺🇾', '2026-06-13', '13:00', 'Levi\'s Stadium'),
      p('Camerún',  '🇨🇲', 'Costa Rica','🇨🇷', '2026-06-13', '16:00', 'Arrowhead Stadium'),
      p('Croacia',  '🇭🇷', 'Camerún',   '🇨🇲', '2026-06-18', '16:00', 'Estadio Azteca'),
      p('Uruguay',  '🇺🇾', 'Costa Rica','🇨🇷', '2026-06-18', '19:00', 'Allegiant Stadium'),
      p('Croacia',  '🇭🇷', 'Costa Rica','🇨🇷', '2026-06-23', '16:00', 'NRG Stadium'),
      p('Uruguay',  '🇺🇾', 'Camerún',   '🇨🇲', '2026-06-23', '16:00', 'Gillette Stadium'),
    ],
  },
  {
    id: 'J',
    partidos: [
      p('Polonia',  '🇵🇱', 'Perú',      '🇵🇪', '2026-06-14', '13:00', 'Arrowhead Stadium'),
      p('Turquía',  '🇹🇷', 'Serbia',    '🇷🇸', '2026-06-14', '16:00', 'BC Place'),
      p('Polonia',  '🇵🇱', 'Turquía',   '🇹🇷', '2026-06-19', '16:00', 'AT&T Stadium'),
      p('Perú',     '🇵🇪', 'Serbia',    '🇷🇸', '2026-06-19', '19:00', 'BMO Field'),
      p('Polonia',  '🇵🇱', 'Serbia',    '🇷🇸', '2026-06-24', '16:00', 'Estadio Akron'),
      p('Perú',     '🇵🇪', 'Turquía',   '🇹🇷', '2026-06-24', '16:00', 'Empower Field'),
    ],
  },
  {
    id: 'K',
    partidos: [
      p('Dinamarca','🇩🇰', 'Ucrania',   '🇺🇦', '2026-06-15', '13:00', 'Estadio Azteca'),
      p('Panamá',   '🇵🇦', 'Egipto',    '🇪🇬', '2026-06-15', '16:00', 'Rose Bowl'),
      p('Dinamarca','🇩🇰', 'Panamá',    '🇵🇦', '2026-06-20', '16:00', 'SoFi Stadium'),
      p('Ucrania',  '🇺🇦', 'Egipto',    '🇪🇬', '2026-06-20', '19:00', 'MetLife Stadium'),
      p('Dinamarca','🇩🇰', 'Egipto',    '🇪🇬', '2026-06-25', '16:00', 'AT&T Stadium'),
      p('Ucrania',  '🇺🇦', 'Panamá',    '🇵🇦', '2026-06-25', '16:00', 'Levi\'s Stadium'),
    ],
  },
  {
    id: 'L',
    partidos: [
      p('Suiza',    '🇨🇭', 'Venezuela', '🇻🇪', '2026-06-15', '19:00', 'BMO Field'),
      p('Túnez',    '🇹🇳', 'Gales',     '🏴󠁧󠁢󠁷󠁬󠁳󠁿', '2026-06-15', '22:00', 'Lincoln Financial Field'),
      p('Suiza',    '🇨🇭', 'Túnez',     '🇹🇳', '2026-06-20', '13:00', 'Gillette Stadium'),
      p('Venezuela','🇻🇪', 'Gales',     '🏴󠁧󠁢󠁷󠁬󠁳󠁿', '2026-06-20', '22:00', 'NRG Stadium'),
      p('Suiza',    '🇨🇭', 'Gales',     '🏴󠁧󠁢󠁷󠁬󠁳󠁿', '2026-06-25', '19:00', 'Lumen Field'),
      p('Venezuela','🇻🇪', 'Túnez',     '🇹🇳', '2026-06-25', '19:00', 'BC Place'),
    ],
  },
]
