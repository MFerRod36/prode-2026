export function pointsClass(puntos) {
  if (puntos >= 3) return 'text-success'
  if (puntos >= 1) return 'text-gold'
  return 'text-error'
}
