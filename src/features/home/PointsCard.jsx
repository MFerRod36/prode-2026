export function PointsCard({ puntos, posicion }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface py-5 shadow-[0_0_30px_-5px_rgba(85,189,182,0.2)]">
        <span className="font-display text-5xl font-bold text-primary">{puntos}</span>
        <span className="mt-1 text-xs text-muted">puntos</span>
      </div>
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface py-5 shadow-[0_0_30px_-5px_rgba(85,189,182,0.2)]">
        <span className="font-display text-5xl font-bold text-text">#{posicion}</span>
        <span className="mt-1 text-xs text-muted">posición</span>
      </div>
    </div>
  )
}
