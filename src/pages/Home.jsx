import { useAuth } from '@/hooks/useAuth'
import { PointsCard } from '@/features/home/PointsCard'
import { MatchCard } from '@/features/home/MatchCard'
import { RecentResults } from '@/features/home/RecentResults'

// TODO: reemplazar con datos reales de Supabase
const MOCK_PUNTOS = 5
const MOCK_POSICION = 2

const MOCK_HOY = [
  { id: 1, local: 'ARG', visitante: 'ESP', hora: '15:00', estado: 'proximo' },
  { id: 2, local: 'BRA', visitante: 'FRA', hora: '18:00', estado: 'en_curso', minuto: 67, goles_local: 1, goles_visitante: 0 },
  { id: 3, local: 'USA', visitante: 'MEX', hora: '21:00', estado: 'proximo' },
]

const MOCK_RECIENTES = [
  { id: 4, local: 'ALE', visitante: 'ITA', goles_local: 2, goles_visitante: 1, mi_prediccion: '2-1', puntos: 3 },
  { id: 5, local: 'POR', visitante: 'URU', goles_local: 0, goles_visitante: 0, mi_prediccion: '1-0', puntos: 1 },
  { id: 6, local: 'ENG', visitante: 'NED', goles_local: 3, goles_visitante: 2, mi_prediccion: '2-1', puntos: 1 },
]

export default function Home() {
  const { user } = useAuth()
  const nombre = user?.user_metadata?.name ?? 'jugadora'

  return (
    <div className="flex flex-col gap-6">

      <div>
        <p className="font-display text-lg text-muted">Hola,</p>
        <p className="font-display text-4xl font-bold text-primary">{nombre}</p>
      </div>

      <PointsCard puntos={MOCK_PUNTOS} posicion={MOCK_POSICION} />

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-base font-bold text-text">Partidos de hoy</h2>
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
          {MOCK_HOY.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-base font-bold text-text">Últimos resultados</h2>
        <RecentResults results={MOCK_RECIENTES} />
      </section>

    </div>
  )
}
