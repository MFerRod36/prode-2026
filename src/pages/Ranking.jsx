import { RankingCard } from '@/features/ranking/RankingCard'
import { useRanking } from '@/hooks/useRanking'

export default function Ranking() {
  const { ranking, loading } = useRanking()

  return (
    <div className="flex flex-col">
      <h1 className="mb-4 font-display text-4xl font-bold uppercase text-name">Ranking</h1>
      {loading ? (
        <div className="rounded-xl border border-border bg-surface px-4 py-8 text-center">
          <p className="font-sans text-sm text-muted">Cargando...</p>
        </div>
      ) : (
        <RankingCard entries={ranking} />
      )}
    </div>
  )
}
