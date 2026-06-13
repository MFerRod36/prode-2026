import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useLogin } from '@/hooks/useLogin'

const loginSchema = z.object({
  email: z.string().min(1, 'El email es requerido').email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

export function LoginForm() {
  const { login, authError } = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) })

  return (
    <form onSubmit={handleSubmit(login)} noValidate className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="tu@email.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      {authError && (
        <p role="alert" className="rounded-lg bg-error-bg px-4 py-3 text-sm font-medium text-error">
          {authError}
        </p>
      )}

      <Button type="submit" isLoading={isSubmitting} fullWidth className="mt-2">
        Ingresar
      </Button>
    </form>
  )
}
