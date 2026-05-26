import { LoginForm } from '@/features/auth/LoginForm'

export default function Login() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">

        <div className="mb-8 flex flex-col items-center gap-6">
          <img
            src="/logo.png"
            alt="Prode 2026"
            className="h-40 w-auto drop-shadow-[0_0_20px_rgba(85,189,182,0.7)]"
          />
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold tracking-tight text-text">
              PRODE <span className="text-primary">2026</span>
            </h1>
            <p className="mt-1 text-sm text-muted">Mundial FIFA · Grupo cerrado</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-[0_0_50px_-5px_rgba(85,189,182,0.2)]">
          <LoginForm />
        </div>

      </div>
    </main>
  )
}
