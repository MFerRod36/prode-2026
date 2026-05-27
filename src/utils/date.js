export function formatFecha(isoDate) {
  const d = new Date(`${isoDate}T12:00:00`)
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })
}

export function groupByDate(partidos) {
  const map = {}
  for (const p of partidos) {
    if (!map[p.fecha]) map[p.fecha] = []
    map[p.fecha].push(p)
  }
  return Object.keys(map).sort().map(fecha => ({ fecha, partidos: map[fecha] }))
}

export function isEditableDate(fechaIso) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const match = new Date(`${fechaIso}T00:00:00`)
  const diffDays = Math.floor((match - today) / (1000 * 60 * 60 * 24))
  return diffDays >= 0 && diffDays <= 2
}
