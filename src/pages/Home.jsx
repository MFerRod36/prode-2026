import { useAuth } from '@/hooks/useAuth'
import { PointsCard } from '@/features/home/PointsCard'
import { MatchCard } from '@/features/home/MatchCard'
import { RecentResults } from '@/features/home/RecentResults'
import { Carousel } from '@/components/ui/Carousel'
import { MOCK_PARTIDOS } from '@/features/predictions/mockData'
import { MOCK_RANKING } from '@/features/ranking/mockData'
import { applyPredictions } from '@/lib/predictions'

const TODAY = new Date().toISOString().slice(0, 10)

function getHomeData() {
  const partidos = applyPredictions(MOCK_PARTIDOS)
  const hoy      = partidos.filter(p => p.fecha === TODAY && (p.estado === 'proximo' || p.estado === 'en_curso'))
  const recientes = partidos.filter(p => p.estado === 'finalizado' && p.puntos != null).slice(-3).reverse()
  const me        = MOCK_RANKING.find(r => r.es_yo) ?? { puntos: 0, posicion: 0 }
  return { hoy, recientes, me }
}

export default function Home() {
  const { user } = useAuth()
  const nombre = user?.user_metadata?.name ?? 'jugadora'
  const { hoy, recientes, me } = getHomeData()

  return (
    <div className="flex flex-col gap-6">

      <div>
        <p className="font-display text-lg uppercase tracking-widest text-muted">Hola,</p>
        <p className="font-display text-4xl font-bold uppercase text-name">{nombre}</p>
      </div>

      <PointsCard puntos={me.puntos} posicion={me.posicion} />

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-base font-bold uppercase tracking-wider text-text">Partidos de hoy</h2>
        {hoy.length > 0 ? (
          <Carousel items={hoy} renderItem={match => <MatchCard match={match} />} />
        ) : (
          <div className="rounded-xl border border-border bg-surface px-4 py-8 text-center">
            <p className="font-sans text-sm text-muted">No hay partidos hoy</p>
          </div>
        )}
      </section>

      {recientes.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-base font-bold uppercase tracking-wider text-text">Últimos resultados</h2>
          <RecentResults results={recientes} />
        </section>
      )}

    </div>
  )
}
