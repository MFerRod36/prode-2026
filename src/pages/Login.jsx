import { LoginForm } from '@/features/auth/LoginForm'

export default function Login() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">

        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-text">
            PRODE <span className="text-primary">2026</span>
          </h1>
          <p className="mt-2 text-sm text-muted">Mundial FIFA · Grupo cerrado</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <LoginForm />
        </div>

      </div>
    </main>
  )
}
