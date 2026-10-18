import { useState, type FormEvent } from 'react'
import { signIn, signUp } from '../lib/auth'

export function AuthForm() {
  const [registering, setRegistering] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    const data = new FormData(event.currentTarget)
    try {
      const email = String(data.get('email') ?? '')
      const password = String(data.get('password') ?? '')
      if (registering) await signUp(email, password)
      else await signIn(email, password)
    } catch {
      setError(registering ? 'Não foi possível criar a conta. Verifique o e-mail e use uma senha com pelo menos 6 caracteres.' : 'E-mail ou senha inválidos.')
    } finally {
      setBusy(false)
    }
  }

  return <main className="auth-page"><form className="auth-card" onSubmit={submit}><div className="logo">✓</div><h1>Conta Certa</h1><p>{registering ? 'Crie sua conta para proteger seus gastos.' : 'Entre para acessar seus gastos.'}</p><label>E-mail<input name="email" type="email" autoComplete="email" required /></label><label>Senha<input name="password" type="password" minLength={6} autoComplete={registering ? 'new-password' : 'current-password'} required /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="primary" disabled={busy}>{busy ? 'Aguarde...' : registering ? 'Criar conta' : 'Entrar'}</button><button type="button" onClick={() => setRegistering((value) => !value)}>{registering ? 'Já tenho uma conta' : 'Criar uma conta'}</button></form></main>
}
