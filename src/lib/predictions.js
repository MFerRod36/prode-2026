const KEY = 'prode_predicciones'

export function getPredictions() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}')
  } catch {
    return {}
  }
}

export function savePrediction(matchId, prediction) {
  const all = getPredictions()
  all[matchId] = prediction
  localStorage.setItem(KEY, JSON.stringify(all))
}

// Mezcla predicciones guardadas sobre la lista de partidos.
// Los valores del mock sirven como fallback; localStorage tiene prioridad.
export function applyPredictions(partidos) {
  const saved = getPredictions()
  return partidos.map(p => ({
    ...p,
    mi_prediccion: saved[p.id] ?? p.mi_prediccion,
  }))
}
