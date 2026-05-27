import { RankingCard } from '@/features/ranking/RankingCard'
import { MOCK_RANKING } from '@/features/ranking/mockData'

export default function Ranking() {
  return (
    <div className="flex flex-col">
      <h1 className="mb-4 font-display text-4xl font-bold uppercase text-name">Ranking</h1>
      <RankingCard entries={MOCK_RANKING} />
    </div>
  )
}
