import { cn } from '@/lib/cn'

const POSITION_COLOR = {
  1: 'text-gold',
  2: 'text-muted',
  3: 'text-name',
}

function RankingRow({ entry }) {
  const { posicion, usuario, puntos, es_yo } = entry
  const posColor = POSITION_COLOR[posicion] ?? 'text-muted'

  return (
    <div className={cn(
      'flex items-center gap-3 py-3',
      es_yo && '-mx-4 bg-primary/10 px-4'
    )}>
      <span className={cn('w-5 shrink-0 text-center font-display text-lg font-bold', posColor)}>
        {posicion}
      </span>

      <span className={cn(
        'flex-1 font-display-norm text-sm uppercase tracking-widest',
        es_yo ? 'text-primary' : 'text-text'
      )}>
        {usuario}
        {es_yo && (
          <span className="ml-2 font-sans text-[10px] normal-case tracking-normal text-muted">
            vos
          </span>
        )}
      </span>

      <span className="font-display text-xl font-bold text-primary">{puntos}</span>
      <span className="w-5 shrink-0 font-sans text-[10px] uppercase text-muted">pts</span>
    </div>
  )
}

export function RankingCard({ entries }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 pb-2 pt-4">
      <div className="-mx-4 -mt-4 mb-2 rounded-t-xl bg-surface-high px-4 py-3 text-center">
        <h2 className="font-display text-base uppercase tracking-widest text-text">General</h2>
      </div>

      <div className="flex flex-col divide-y divide-border/25">
        {entries.map(entry => (
          <RankingRow key={entry.posicion} entry={entry} />
        ))}
      </div>
    </div>
  )
}
