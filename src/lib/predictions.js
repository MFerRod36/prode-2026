// +3 marcador exacto, +1 ganador/empate correcto, 0 si falla todo
export function calcPuntos(prediction, goles_local, goles_visitante) {
  if (!prediction || goles_local == null || goles_visitante == null) return null
  const [pl, pv] = prediction.split('-').map(Number)
  if (pl === goles_local && pv === goles_visitante) return 3
  if (Math.sign(pl - pv) === Math.sign(goles_local - goles_visitante)) return 1
  return 0
}
