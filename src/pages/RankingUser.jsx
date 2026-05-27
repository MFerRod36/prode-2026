import { useParams, useNavigate } from 'react-router-dom'
import { useRanking } from '@/hooks/useRanking'
import { useUserStats } from '@/hooks/useUserStats'
import { UserDetail } from '@/features/ranking/UserDetail'

export default function RankingUser() {
  const { usuario }           = useParams()
  const navigate              = useNavigate()
  const { ranking, loading: loadingRanking } = useRanking()
  const entry                 = ranking.find(r => r.usuario === usuario)
  const { predicciones, loading: loadingStats } = useUserStats(entry?.id)

  if (loadingRanking) return null

  if (!entry) return (
    <div className="flex flex-col gap-4">
      <button onClick={() => navigate(-1)} className="font-sans text-sm text-muted">← Volver</button>
      <p className="font-sans text-sm text-muted">Usuaria no encontrada</p>
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="mb-4 font-sans text-xs uppercase tracking-wider text-muted"
        >
          ← Ranking
        </button>
        <p className="font-display text-4xl font-bold uppercase text-name">{entry.usuario}</p>
        <p className="font-sans text-sm text-muted">#{entry.posicion} · {entry.puntos} pts</p>
      </div>

      {loadingStats ? (
        <div className="rounded-xl border border-border bg-surface px-4 py-8 text-center">
          <p className="font-sans text-sm text-muted">Cargando...</p>
        </div>
      ) : (
        <UserDetail predicciones={predicciones} />
      )}
    </div>
  )
}
