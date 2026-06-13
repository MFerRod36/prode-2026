import { cn } from '@/lib/cn'

export function Flag({ code, className = 'h-5 w-8' }) {
  if (!code) return null
  return (
    <div className={cn('overflow-hidden', className)}>
      <img
        src={`https://flagcdn.com/${code}.svg`}
        alt=""
        className="h-full w-full object-contain"
      />
    </div>
  )
}
