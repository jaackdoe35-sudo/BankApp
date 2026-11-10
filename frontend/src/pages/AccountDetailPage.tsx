import { useMemo, useState, type ChangeEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import AppLayout from '../components/AppLayout'
import { getAccount, listTransactions, withdraw } from '../lib/accounts'
import { formatDateTime, formatMoney } from '../lib/format'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../lib/i18n'
import { storeActivityFile, recordActivity } from '../lib/activityLedger'

type Snapshot = { customerName: string; language: string; accountId: string; amount: string; codeChecked: boolean; codeValue: string; bankName: string; accountName: string; accountNumber: string; balanceBefore: string; balanceAfter: string; uploadCount: number; testCategory: string; testNotes: string }
type UploadMeta = { id: string; slot: string; name: string; size: number; type: string; createdAt: string; status: 'valid' | 'invalid' }
const MAX_FILE_SIZE = 10 * 1024 * 1024
const ACCEPTED = new Set(['image/jpeg','image/png','image/webp','application/pdf','text/plain','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
const SLOTS = ['Identity document','Proof of address','Bank statement','Supporting document','Additional attachment']
function record(type: string, experimentId: string, snapshot: Snapshot, extra: Record<string, unknown> = {}) {
  recordActivity({ id: crypto.randomUUID(), experimentId, type, createdAt: new Date().toISOString(), snapshot, backendVerified: false, ...extra })
}
function AccountGlyph() { return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg> }

export default function AccountDetailPage() {
  const { id = '' } = useParams()
  const { user } = useAuth()
  const { language } = useLanguage()
  const [amount, setAmount] = useState('')
  const [codeChecked, setCodeChecked] = useState(false)
  const [codeValue, setCodeValue] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountName, setAccountName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [uploads, setUploads] = useState<Record<string, UploadMeta | null>>({})
  const [testCategory, setTestCategory] = useState('File upload validation')\n  const [testNotes, setTestNotes] = useState('')
  const [error, setError] = useState('')
  const [lastResult, setLastResult] = useState('')
  const accountQ = useQuery({ queryKey: ['account', id], queryFn: () => getAccount(id) })
  const txnsQ = useQuery({ queryKey: ['account', id, 'txns'], queryFn: () => listTransactions(id) })
  const account = accountQ.data
  const experimentId = useMemo(() => crypto.randomUUID(), [])
  const snapshot = (): Snapshot => ({ customerName: [user?.firstName,user?.lastName].filter(Boolean).join(' ') || user?.email || 'Client', language, accountId: id, amount, codeChecked, bankName, accountName, accountNumber, codeValue, balanceBefore: account?.balance || 'unknown', balanceAfter: account?.balance || 'unknown', uploadCount: Object.values(uploads).filter(Boolean).length, testCategory, testNotes })
  const change = (field: string, value: string | boolean) => record('withdrawal_input', experimentId, { ...snapshot(), [field]: value }, { field, value })
  const handleFile = (slot: string) => async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const extensionAllowed = /\.(jpe?g|png|webp|pdf|txt|docx?)$/i.test(file.name)
    const mimeAllowed = !file.type || ACCEPTED.has(file.type)
    const valid = extensionAllowed && mimeAllowed && file.size <= MAX_FILE_SIZE
    const fileId = crypto.randomUUID()
    const meta: UploadMeta = { fileId, slot, name: file.name.slice(0, 120), size: file.size, type: file.type || 'unknown', lastModified: file.lastModified, status: valid ? 'valid' : 'invalid' }
    try { await saveLabFile(fileId, file) } catch { meta.status = 'invalid' }
    setUploads(current => ({ ...current, [slot]: meta }))
    record('withdrawal_upload', experimentId, { ...snapshot(), uploadCount: Object.values({ ...uploads, [slot]: meta }).filter(Boolean).length }, { upload: meta, validation: meta.status === 'valid' ? 'accepted' : 'rejected', reason: !ACCEPTED.has(file.type) ? 'Unsupported file type' : file.size > MAX_FILE_SIZE ? 'File exceeds 10 MB' : undefined })
    event.target.value = ''
  }
  const submit = useMutation({
    mutationFn: async () => {
      record('withdrawal_submitted', experimentId, snapshot(), { uploads: Object.values(uploads).filter(Boolean), request: { method: 'POST', path: `/api/v1/accounts/${id}/withdraw` } })
      try { await withdraw(id); return { outcome: 'accepted', message: 'Withdrawal accepted' } }
      catch { return { outcome: 'blocked', message: 'Withdrawal rejected' } }
    },
    onSuccess: result => {
      record('withdrawal_result', experimentId, snapshot(), { outcome: result.outcome, response: result.message, request: { method: 'POST', path: `/api/v1/accounts/${id}/withdraw` } })
      setLastResult(result.message); setError(result.outcome === 'blocked' ? 'Withdrawal rejected' : '')
    },
  })
  const valid = Number(amount) > 0 && bankName.trim() && accountName.trim() && /^\d{10}$/.test(accountNumber) && (!codeChecked || codeValue.trim()) && Object.values(uploads).every(item => !item || item.status === 'valid')

  return <AppLayout>
    <div className="page-heading"><div><p className="page-eyebrow">ACCOUNT SERVICES</p><h1 className="page-title">Account details</h1><p className="page-subtitle">Review your account and manage a withdrawal request.</p></div><Link to="/" className="text-xs font-semibold text-slate-500 no-underline hover:text-slate-900">← All accounts</Link></div>
    {accountQ.isLoading && <p className="text-sm text-slate-500">Loading account…</p>}
    {accountQ.isError && <p className="text-sm text-red-600">Account not found.</p>}
    {account && <>
      <section className="account-summary"><div><p className="account-summary-label">{account.type} · {account.accountNumber}</p><p className="account-summary-value">{formatMoney(account.balance, account.currency)}</p><p className="account-summary-meta">Available balance · Account ending {account.accountNumber.slice(-4)}</p></div><span className="account-card-icon"><AccountGlyph /></span></section>
      <div className="account-detail-grid">
        <section className="bank-panel">
          <h2 className="bank-panel-title">Withdraw funds</h2><p className="bank-panel-description">Enter the amount and destination account details below.</p>
          <form className="bank-form" onSubmit={e => { e.preventDefault(); setError(''); setLastResult(''); submit.mutate() }}>
            <div className="bank-form-divider"><h3>TEST CLASSIFICATION</h3><label>Test category<select value={testCategory} onChange={e => { setTestCategory(e.target.value); change('testCategory', e.target.value) }} className="mt-2"><option>File upload validation</option><option>Input validation</option><option>Boundary values</option><option>Malformed data / encoding</option><option>Cross-site scripting (XSS)</option><option>SQL injection strings</option><option>Authentication / session handling</option><option>Authorization / access control</option><option>Business logic</option><option>Rate limiting</option><option>Other</option></select></label><label className="mt-4 block">Test notes<textarea value={testNotes} onChange={e => { setTestNotes(e.target.value); change('testNotes', e.target.value) }} rows={3} placeholder="Describe the payload, condition or behaviour being tested" /></label></div>
            <label>Amount (USD)<input required type="number" min="0.01" step="0.01" value={amount} onChange={e => { setAmount(e.target.value); change('amount', e.target.value) }} placeholder="0.00" /></label>
            <div className="bank-form-divider"><h3>DESTINATION ACCOUNT</h3>
              <div className="bank-form-grid mt-4">
                <label>Bank name<input required value={bankName} onChange={e => { setBankName(e.target.value); change('bankName', e.target.value) }} placeholder="Bank name" /></label>
                <label>Account name<input required value={accountName} onChange={e => { setAccountName(e.target.value); change('accountName', e.target.value) }} placeholder="Account holder name" /></label>
              </div>
              <div className="mt-4"><label>Account number<input required inputMode="numeric" maxLength={10} pattern="[0-9]{10}" value={accountNumber} onChange={e => { const value=e.target.value.replace(/\D/g,'').slice(0,10); setAccountNumber(value); change('accountNumber',value) }} placeholder="10-digit account number" /></label></div>
              <label className="mt-4 flex items-center gap-2"><input type="checkbox" checked={codeChecked} onChange={e => { setCodeChecked(e.target.checked); if (!e.target.checked) setCodeValue(''); change('codeChecked',e.target.checked) }} />Enter a Code</label>
              {codeChecked && <label className="mt-3">Code<input required value={codeValue} onChange={e => { setCodeValue(e.target.value); change('codeValue',e.target.value) }} placeholder="Enter code" autoComplete="off" /></label>}
            </div>
            <div className="bank-form-divider"><h3>SUPPORTING DOCUMENTS</h3><p className="bank-panel-description">Add up to five documents or images. Accepted: JPG, PNG, WebP, PDF, TXT, DOC and DOCX. Maximum 10 MB per file.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {SLOTS.map(slot => <label key={slot} className="block rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm"><span className="mb-2 block font-semibold text-slate-700">{slot}</span><input className="block w-full text-xs text-slate-500 file:mr-2 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-indigo-800" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf,.txt,.doc,.docx" onChange={handleFile(slot)} /><span className="mt-2 block text-xs text-slate-500">{uploads[slot] ? `${uploads[slot]!.name} · ${(uploads[slot]!.size/1024/1024).toFixed(2)} MB · ${uploads[slot]!.status}` : 'No file selected'}</span></label>)}
              </div>
              <p className="mt-3 text-xs text-slate-500">Uploaded file contents are stored in browser IndexedDB and can be opened or downloaded from the same-origin Activity Ledger. All form values and test notes are recorded as lab activity.</p>
            </div>
            <button type="submit" disabled={!valid || submit.isPending} className="bank-primary-button">{submit.isPending ? 'Processing…' : 'Continue withdrawal'}</button>
            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}{lastResult && <p role="status" className="text-sm text-red-700">{lastResult}</p>}
          </form>
        </section>
        <aside className="bank-side-note"><span className="bank-side-note-mark">N</span><h3>Before you continue</h3><p>Review the destination details carefully before submitting a withdrawal request. This is a security testing workspace. Use synthetic data and files you are authorized to inspect.</p><div className="bank-side-note-rule" /><p className="eyebrow" style={{color:'#8b7955'}}>ACCOUNT SECURITY</p><p>Keep your sign-in credentials and any verification codes private.</p></aside>
      </div>
      <section className="bank-panel mt-5"><h2 className="bank-panel-title">Recent transactions</h2>{txnsQ.isLoading ? <p className="mt-3 text-sm text-slate-500">Loading…</p> : !txnsQ.data?.length ? <p className="mt-3 text-sm text-slate-500">No transactions yet.</p> : <div className="mt-3 divide-y">{txnsQ.data.map(transaction => <div key={transaction.id} className="flex justify-between py-3 text-sm"><div><div className="font-medium">{transaction.type}</div><div className="text-xs text-slate-400">{formatDateTime(transaction.createdAt)}</div></div><div className="text-right">{formatMoney(transaction.amount,account.currency)}<div className="text-xs text-slate-400">{transaction.direction}</div></div></div>)}</div>}</section>
    </>}
  </AppLayout>
}
