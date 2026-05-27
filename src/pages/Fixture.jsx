import { useState } from 'react'
import { GroupCard } from '@/features/fixture/GroupCard'
import { GRUPOS } from '@/features/fixture/mockData'
import { cn } from '@/lib/cn'

function GruposCarousel() {
  const [current, setCurrent] = useState(0)

  function prev() { setCurrent(i => (i - 1 + GRUPOS.length) % GRUPOS.length) }
  function next() { setCurrent(i => (i + 1) % GRUPOS.length) }

  return (
    <div className="flex flex-col gap-3">
      <GroupCard group={GRUPOS[current]} onPrev={prev} onNext={next} />

      <div className="flex items-center justify-center gap-1.5">
        {GRUPOS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              i === current ? 'w-4 bg-primary' : 'w-1.5 bg-border'
            )}
          />
        ))}
      </div>
    </div>
  )
}

function EtapaPlaceholder() {
  return (
    <div className="flex items-center justify-center rounded-xl border border-border bg-surface py-10">
      <p className="font-display-norm text-xs uppercase tracking-widest text-muted">
        Disponible al finalizar la fase de grupos
      </p>
    </div>
  )
}

const ETAPAS = [
  { id: 'grupos',   label: 'Grupos',   content: <GruposCarousel /> },
  { id: '16vos',    label: '16vos',    content: <EtapaPlaceholder /> },
  { id: 'octavos',  label: 'Octavos',  content: <EtapaPlaceholder /> },
  { id: 'cuartos',  label: 'Cuartos',  content: <EtapaPlaceholder /> },
  { id: 'semis',    label: 'Semis',    content: <EtapaPlaceholder /> },
  { id: 'final',    label: 'Final',    content: <EtapaPlaceholder /> },
]

export default function Fixture() {
  return (
    <div className="flex flex-col">

      <h1 className="mb-4 font-display text-4xl font-bold uppercase text-name">Fixture</h1>

      <div className="flex flex-col gap-8">
        {ETAPAS.map(({ id, label, content }) => (
          <section key={id} className="flex flex-col gap-3">
            <h2 className="font-display text-base font-bold uppercase tracking-wider text-text">
              {label}
            </h2>
            {content}
          </section>
        ))}
      </div>

    </div>
  )
}
