import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiErrorMessage } from '../lib/errors'
import { languages, useLanguage } from '../lib/i18n'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  async function onSubmit(e: FormEvent) {
    e.preventDefault(); setError(null); setSubmitting(true)
    try { await login(email, password); navigate('/') }
    catch (err) { setError(apiErrorMessage(err, 'Login failed')) }
    finally { setSubmitting(false) }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your private banking account">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
        <Field label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" />
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <p className="mt-5 text-center text-xs text-slate-500">No account yet? <Link to="/signup">Create an account</Link></p>
    </AuthShell>
  )
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  const { language, setLanguage, t } = useLanguage()
  return (
    <div className="auth-shell">
      <section className="auth-brand-panel">
        <div className="auth-brand-top">
          <Link to="/login" className="auth-brand-wordmark" style={{ color: 'inherit', textDecoration: 'none' }}>
            <span className="bank-brand-mark">N</span><span><strong>Northstar</strong><small>PRIVATE BANKING</small></span>
          </Link>
        </div>
        <div className="auth-brand-message">
          <p className="eyebrow">A MORE CONSIDERED APPROACH</p>
          <h2>Clarity for your financial life.</h2>
          <p>Thoughtful banking, with a clear view of what matters and the tools to manage it with confidence.</p>
        </div>
        <div className="auth-brand-bottom">Private client services · Northstar Private</div>
      </section>
      <section className="auth-form-panel">
        <div className="auth-form-card">
          <label className="mb-4 flex items-center justify-end gap-2 text-xs text-slate-600"><span>{t('language')}</span><><input aria-label={t('language')} list="northstar-languages" value={language} onChange={e => setLanguage(e.target.value)} placeholder="en / fr / ja / sw / zh-CN" className="w-36 rounded-lg border border-slate-200 bg-white px-2 py-1.5 "/><datalist id="northstar-languages">{languages.map(item => <option key={item.code} value={item.code}>{item.label}</option>)}</datalist></></label>
          <p className="page-eyebrow">NORTHSTAR PRIVATE · CLIENT ACCESS</p>
          <h1>{title}</h1>
          <p>{subtitle}</p>
          {children}
          <div className="auth-form-footnote">Protected client access · Please keep your sign-in details confidential.</div>
        </div>
      </section>
    </div>
  )
}

export function Field({ label, type = 'text', value, onChange, autoComplete }: { label: string; type?: string; value: string; onChange: (value: string) => void; autoComplete?: string }) {
  return <label><span>{label}</span><input type={type} value={value} autoComplete={autoComplete} onChange={(e) => onChange(e.target.value)} required /></label>
}
