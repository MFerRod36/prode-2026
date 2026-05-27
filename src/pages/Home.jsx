import { useAuth } from '@/hooks/useAuth'
import { PointsCard } from '@/features/home/PointsCard'
import { MatchCard } from '@/features/home/MatchCard'
import { RecentResults } from '@/features/home/RecentResults'
import { Carousel } from '@/components/ui/Carousel'

// TODO: reemplazar con datos reales de Supabase
const MOCK_PUNTOS = 5
const MOCK_POSICION = 2

const MOCK_HOY = [
  {
    id: 1,
    local: 'Argentina',   flag_local: '🇦🇷',
    visitante: 'España',  flag_visitante: '🇪🇸',
    hora: '15:00', estadio: 'MetLife Stadium',
    estado: 'proximo', mi_prediccion: '2-1',
  },
  {
    id: 2,
    local: 'Brasil',      flag_local: '🇧🇷',
    visitante: 'Francia', flag_visitante: '🇫🇷',
    hora: '18:00', estadio: 'SoFi Stadium',
    estado: 'en_curso', minuto: 67, goles_local: 1, goles_visitante: 0,
    mi_prediccion: '1-0',
  },
  {
    id: 3,
    local: 'USA',         flag_local: '🇺🇸',
    visitante: 'México',  flag_visitante: '🇲🇽',
    hora: '21:00', estadio: 'AT&T Stadium',
    estado: 'proximo', mi_prediccion: '0-1',
  },
]

const MOCK_RECIENTES = [
  { id: 4, local: 'Alemania',   flag_local: '🇩🇪', visitante: 'Italia',        flag_visitante: '🇮🇹', goles_local: 2, goles_visitante: 1, mi_prediccion: '2-1', puntos: 3 },
  { id: 5, local: 'Portugal',   flag_local: '🇵🇹', visitante: 'Uruguay',       flag_visitante: '🇺🇾', goles_local: 0, goles_visitante: 0, mi_prediccion: '1-0', puntos: 1 },
  { id: 6, local: 'Inglaterra', flag_local: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', visitante: 'Países Bajos', flag_visitante: '🇳🇱', goles_local: 3, goles_visitante: 2, mi_prediccion: '2-1', puntos: 1 },
]

export default function Home() {
  const { user } = useAuth()
  const nombre = user?.user_metadata?.name ?? 'jugadora'

  return (
    <div className="flex flex-col gap-6">

      <div>
        <p className="font-display text-lg uppercase tracking-widest text-muted">Hola,</p>
        <p className="font-display text-4xl font-bold uppercase text-primary">{nombre}</p>
      </div>

      <PointsCard puntos={MOCK_PUNTOS} posicion={MOCK_POSICION} />

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-base font-bold text-text">Partidos de hoy</h2>
        <Carousel
          items={MOCK_HOY}
          renderItem={match => <MatchCard match={match} />}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-base font-bold text-text">Últimos resultados</h2>
        <RecentResults results={MOCK_RECIENTES} />
      </section>

    </div>
  )
}
