export function RecentResults({ results }) {
  return (
    <div className="flex flex-col gap-2">
      {results.map((r) => (
        <div
          key={r.id}
          className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3"
        >
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold text-text">
              {r.local} {r.goles_local} - {r.goles_visitante} {r.visitante}
            </p>
            <p className="text-xs text-muted">Mi predicción: {r.mi_prediccion}</p>
          </div>
          <span className="font-display text-base font-bold text-primary">
            +{r.puntos}pts
          </span>
        </div>
      ))}
    </div>
  )
}
