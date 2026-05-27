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
