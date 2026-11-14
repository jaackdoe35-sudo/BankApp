import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiErrorMessage } from '../lib/errors'
import { AuthShell, Field } from './LoginPage'

export default function SignupPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const set = (key: keyof typeof form) => (value: string) => setForm((current) => ({ ...current, [key]: value }))
  async function onSubmit(e: FormEvent) {
    e.preventDefault(); setError(null); setSubmitting(true)
    try { await register(form); navigate('/') }
    catch (err) { setError(apiErrorMessage(err, 'Registration failed')) }
    finally { setSubmitting(false) }
  }
  return (
    <AuthShell title="Open your account" subtitle="Create your private banking profile">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" value={form.firstName} onChange={set('firstName')} autoComplete="given-name" />
          <Field label="Last name" value={form.lastName} onChange={set('lastName')} autoComplete="family-name" />
        </div>
        <Field label="Email" type="email" value={form.email} onChange={set('email')} autoComplete="email" />
        <Field label="Password (min 8 chars)" type="password" value={form.password} onChange={set('password')} autoComplete="new-password" />
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={submitting}>{submitting ? 'Creating…' : 'Create account'}</button>
      </form>
      <p className="mt-5 text-center text-xs text-slate-500">Already a client? <Link to="/login">Sign in</Link></p>
    </AuthShell>
  )
}
