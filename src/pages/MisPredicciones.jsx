import { useState } from 'react'
import { ProximaDateCard, HistorialCard } from '@/features/predictions/PredictionCard'
import { MOCK_PARTIDOS } from '@/features/predictions/mockData'
import { applyPredictions, savePrediction } from '@/lib/predictions'
import { isEditableDate, groupByDate } from '@/utils/date'
import { cn } from '@/lib/cn'

function ProximasCarousel({ partidos, onSave }) {
  const dateGroups = groupByDate(partidos)
  const [current, setCurrent] = useState(0)

  if (dateGroups.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface px-4 py-8 text-center">
        <p className="font-sans text-sm text-muted">No hay partidos próximos</p>
      </div>
    )
  }

  const { fecha, partidos: ps } = dateGroups[current]

  function prev() { setCurrent(i => (i - 1 + dateGroups.length) % dateGroups.length) }
  function next() { setCurrent(i => (i + 1) % dateGroups.length) }

  return (
    <div className="flex flex-col gap-3">
      <ProximaDateCard
        fecha={fecha}
        partidos={ps}
        onSave={onSave}
        onPrev={prev}
        onNext={next}
      />
      {dateGroups.length > 1 && (
        <div className="flex items-center justify-center gap-1.5">
          {dateGroups.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i === current ? 'w-4 bg-primary' : 'w-1.5 bg-border'
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function MisPredicciones() {
  const [partidos, setPartidos] = useState(() => applyPredictions(MOCK_PARTIDOS))

  function guardarPrediccion(id, prediccion) {
    savePrediction(id, prediccion)
    setPartidos(prev =>
      prev.map(p => p.id === id ? { ...p, mi_prediccion: prediccion } : p)
    )
  }

  const proximos  = partidos.filter(p =>
    p.estado === 'en_curso' || (p.estado === 'proximo' && isEditableDate(p.fecha))
  )
  const historial = partidos.filter(p => p.estado === 'finalizado')

  return (
    <div className="flex flex-col">
      <h1 className="mb-4 font-display text-4xl font-bold uppercase text-name">
        Mi Prode
      </h1>
      <div className="flex flex-col gap-8">
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-base font-bold uppercase tracking-wider text-text">
            Próximas
          </h2>
          <ProximasCarousel partidos={proximos} onSave={guardarPrediccion} />
        </section>

        {historial.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="font-display text-base font-bold uppercase tracking-wider text-text">
              Historial
            </h2>
            <HistorialCard partidos={historial} />
          </section>
        )}
      </div>
    </div>
  )
}
