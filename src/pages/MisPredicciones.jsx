import { useState } from 'react'
import { ProximaDateCard, HistorialCard } from '@/features/predictions/PredictionCard'
import { usePredicciones } from '@/hooks/usePredicciones'
import { groupByDate } from '@/utils/date'
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
  const { partidos, loading, guardar } = usePredicciones()

  const proximos  = partidos.filter(p => p.estado === 'proximo' || p.estado === 'en_curso')
  const historial = partidos.filter(p => p.estado === 'finalizado')

  return (
    <div className="flex flex-col">
      <h1 className="mb-4 font-display text-4xl font-bold uppercase text-name">Mi Prode</h1>
      {loading ? (
        <div className="rounded-xl border border-border bg-surface px-4 py-8 text-center">
          <p className="font-sans text-sm text-muted">Cargando...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <section className="flex flex-col gap-3">
            <h2 className="font-display text-base font-bold uppercase tracking-wider text-text">Próximas</h2>
            <ProximasCarousel partidos={proximos} onSave={guardar} />
          </section>

          {historial.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="font-display text-base font-bold uppercase tracking-wider text-text">Historial</h2>
              <HistorialCard partidos={historial} />
            </section>
          )}
        </div>
      )}
    </div>
  )
}
