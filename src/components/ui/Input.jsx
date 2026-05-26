import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/cn'

export function Input({ label, error, type = 'text', className, ref, ...props }) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-text">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={resolvedType}
          className={cn(
            'w-full rounded-xl border bg-surface-high px-4 py-3 text-sm text-text placeholder:text-muted',
            'transition-colors duration-150 focus:outline-none',
            error
              ? 'border-error focus:border-error'
              : 'border-border focus:border-primary',
            isPassword && 'pr-12',
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-text"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-error">{error}</p>
      )}
    </div>
  )
}
