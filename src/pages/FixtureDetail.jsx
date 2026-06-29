import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { usePartido } from '@/hooks/usePartido'
import { MatchDetail } from '@/features/fixture/MatchDetail'

export default function FixtureDetail() {
  const { id }                        = useParams()
  const navigate                      = useNavigate()
  const { partido, loading, guardar } = usePartido(Number(id))

  if (loading) return null

  if (!partido) return (
    <div className="flex flex-col items-center gap-4 py-16">
      <p className="font-sans text-sm text-muted">Partido no encontrado</p>
      <button onClick={() => navigate('/fixture')} className="font-sans text-sm text-primary">
        Volver al fixture
      </button>
    </div>
  )

  return (
    <div className="flex flex-col">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1 self-start font-sans text-sm text-muted transition-colors hover:text-text"
      >
        <ChevronLeft size={16} />
        Volver
      </button>
      <MatchDetail partido={partido} onGuardar={guardar} />
    </div>
  )
}
