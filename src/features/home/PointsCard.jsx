export function PointsCard({ puntos, posicion }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex flex-col items-center justify-center gap-2 rounded-tl-2xl rounded-br-2xl border border-border bg-points-card py-5">
        <span className="font-display-norm text-7xl font-bold text-primary">{puntos}</span>
        <span className="rounded-full bg-points-tag px-2 py-0.5 text-[10px] font-medium uppercase text-points-card">
          Puntos
        </span>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 rounded-tr-2xl rounded-bl-2xl border border-border bg-position-card py-5">
        <span className="font-display-norm text-7xl font-bold text-position">#{posicion}</span>
        <span className="rounded-full bg-position-pill px-2 py-0.5 text-[10px] font-medium uppercase text-position-card">
          Posición
        </span>
      </div>
    </div>
  )
}
