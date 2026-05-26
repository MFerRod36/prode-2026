export function PointsCard({ puntos, posicion }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 text-center shadow-[0_0_50px_-5px_rgba(85,189,182,0.2)]">
      <p className="font-display text-6xl font-bold text-primary">{puntos}</p>
      <p className="mt-1 text-sm text-muted">puntos totales</p>
      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-surface-high px-3 py-1">
        <span className="text-xs text-muted">Posición</span>
        <span className="text-sm font-bold text-text">#{posicion}</span>
      </div>
    </div>
  )
}
