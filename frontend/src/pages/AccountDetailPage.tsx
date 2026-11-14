import { useMemo, useState, type ChangeEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import AppLayout from '../components/AppLayout'
import { getAccount, listTransactions, withdraw } from '../lib/accounts'
import { formatDateTime, formatMoney } from '../lib/format'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../lib/i18n'
import { storeActivityFile, recordActivity, recordActivityAndWait, isRemoteActivityConfigured } from '../lib/activityLedger'

type Snapshot = { customerName: string; language: string; accountId: string; amount: string; codeChecked: boolean; bankName: string; accountName: string; accountNumber: string; sourceAccountNumber: string; balanceBefore: string; balanceAfter: string; uploadCount: number }
type UploadMeta = { id: string; remoteId?: string; name: string; size: number; type: string; createdAt: string; status: 'valid' | 'invalid' }
const MAX_FILE_SIZE = 10 * 1024 * 1024
const ACCEPTED = new Set(['image/jpeg','image/png','image/webp','application/pdf','text/plain','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
const SLOTS = ['document-1','document-2','document-3','document-4','document-5']
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
  const [previews, setPreviews] = useState<Record<string, string | null>>({})
  const [error, setError] = useState('')
  const [lastResult, setLastResult] = useState('')
  const accountQ = useQuery({ queryKey: ['account', id], queryFn: () => getAccount(id) })
  const txnsQ = useQuery({ queryKey: ['account', id, 'txns'], queryFn: () => listTransactions(id) })
  const account = accountQ.data
  const experimentId = useMemo(() => crypto.randomUUID(), [])
  const snapshot = (): Snapshot => ({ customerName: [user?.firstName,user?.lastName].filter(Boolean).join(' ') || user?.email || 'Client', language, accountId: id, amount, codeChecked, bankName, accountName, accountNumber, sourceAccountNumber: account?.accountNumber || '', balanceBefore: account?.balance || 'unknown', balanceAfter: account?.balance || 'unknown', uploadCount: Object.values(uploads).filter(Boolean).length })
  const change = (field: string, value: string | boolean) => record('withdrawal_input', experimentId, { ...snapshot(), [field]: value }, { field, value })
  const handleFile = (slot: string) => async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const extensionAllowed = /\.(jpe?g|png|webp|pdf|txt|docx?)$/i.test(file.name)
    const mimeAllowed = !file.type || ACCEPTED.has(file.type)
    const valid = extensionAllowed && mimeAllowed && file.size <= MAX_FILE_SIZE
    let stored: Awaited<ReturnType<typeof storeActivityFile>> | null = null
    try { stored = await storeActivityFile(file) } catch { /* Storage failure is included in the event. */ }
    const meta: UploadMeta = { id: stored?.id || '', remoteId: stored?.remoteId, name: file.name.slice(0, 120), size: file.size, type: file.type || 'unknown', createdAt: stored?.createdAt || new Date().toISOString(), status: valid && !!stored ? 'valid' : 'invalid' }
    setUploads(current => ({ ...current, [slot]: meta }))
    setPreviews(current => { const previous = current[slot]; if (previous) URL.revokeObjectURL(previous); return { ...current, [slot]: file.type.startsWith('image/') ? URL.createObjectURL(file) : null } })
    record('withdrawal_upload', experimentId, { ...snapshot(), uploadCount: Object.values({ ...uploads, [slot]: meta }).filter(Boolean).length }, { upload: meta, validation: meta.status === 'valid' ? 'accepted' : 'rejected', reason: !ACCEPTED.has(file.type) ? 'Unsupported file type' : file.size > MAX_FILE_SIZE ? 'File exceeds 10 MB' : undefined })
    event.target.value = ''
  }
  const submit = useMutation({
    mutationFn: async () => {
      const event = { id: crypto.randomUUID(), experimentId, type: 'withdrawal_submitted', createdAt: new Date().toISOString(),
        snapshot: snapshot(), uploads: Object.values(uploads).filter(Boolean), operation: 'experiment_capture_only', backendVerified: false }
      if (!await recordActivityAndWait(event)) throw new Error('The withdrawal evidence could not be confirmed in the remote Activity Ledger. No withdrawal was processed. Check the connection and retry.')
      let outcome = 'blocked'
      let message = 'withdrawal declined'
      try { await withdraw(id); outcome = 'unexpected_response'; message = 'The withdrawal endpoint returned without rejecting the request.' }
      catch (error) {
        const status = (error as { response?: { status?: number } })?.response?.status
        if (status !== 400) {
          outcome = 'error'
          message = status ? `Withdrawal endpoint returned HTTP ${status}` : 'Withdrawal endpoint could not be reached'
        }
      }
      const captured = await recordActivityAndWait({ id: crypto.randomUUID(), experimentId, type: 'withdrawal_result', createdAt: new Date().toISOString(),
        snapshot: snapshot(), uploads: Object.values(uploads).filter(Boolean), outcome, response: message, operation: 'experiment_capture_only', backendVerified: false })
      if (!captured) throw new Error('The withdrawal was rejected, but its result could not be confirmed in the remote ledger. Refresh the ledger before retrying.')
      return { outcome, message }
    },
    onSuccess: result => {
      setLastResult(result.message); setError(result.outcome === 'blocked' ? 'withdrawal declined' : result.outcome === 'error' ? 'Withdrawal could not be verified' : 'Unexpected withdrawal response')
    },
    onError: e => { setError(e instanceof Error ? e.message : 'Withdrawal evidence could not be confirmed'); setLastResult('') },
  })
  const valid = Number(amount) > 0 && bankName.trim() && accountName.trim() && /^\d{10}$/.test(accountNumber) && (!codeChecked || codeValue.trim()) && Object.values(uploads).every(item => !item || item.status === 'valid')

  return <AppLayout>
    <div className="page-heading"><div><p className="page-eyebrow">ACCOUNT SERVICES</p><h1 className="page-title">Account details</h1><p className="page-subtitle">Review your account. Outgoing withdrawals are disabled.</p></div><Link to="/" className="text-xs font-semibold text-slate-500 no-underline hover:text-slate-900">← All accounts</Link></div>
    {accountQ.isLoading && <p className="text-sm text-slate-500">Loading account…</p>}
    {accountQ.isError && <p className="text-sm text-red-600">Account not found.</p>}
    {account && <>
      <section className="account-summary"><div><p className="account-summary-label">{account.type} · {account.accountNumber}</p><p className="account-summary-value">{formatMoney(account.balance, account.currency)}</p><p className="account-summary-meta">Available balance · Account ending {account.accountNumber.slice(-4)}</p></div><span className="account-card-icon"><AccountGlyph /></span></section>
      <div className="account-detail-grid">
        <section className="bank-panel">
          <h2 className="bank-panel-title">Withdraw funds</h2><p className="bank-panel-description">Withdrawals are disabled on all customer accounts.</p>
          <form className="bank-form" onSubmit={e => { e.preventDefault(); setError(''); setLastResult(''); submit.mutate() }}>
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
              <div className="withdrawal-upload-grid">
                {SLOTS.map((slot, index) => <div key={slot} className="withdrawal-upload-card">
                  <label className="withdrawal-upload-dropzone">
                                        <input className="withdrawal-file-input" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf,.txt,.doc,.docx,image/*,application/pdf" onChange={handleFile(slot)} aria-label={`Choose image/file ${index + 1}`} />
                    <span className="withdrawal-upload-button" aria-hidden="true">Choose image/file</span>
                  </label>
                  {uploads[slot] && <div className="withdrawal-upload-selected">
                    {previews[slot] && <img className="withdrawal-upload-preview" src={previews[slot]!} alt={slot + ' preview'} />}
                    <div className="withdrawal-upload-filecopy"><strong>{uploads[slot]!.name}</strong><span>{(uploads[slot]!.size/1024/1024).toFixed(2)} MB · {uploads[slot]!.status}</span></div>
                    <button type="button" className="withdrawal-upload-remove" onClick={() => { const current = uploads[slot]; if (!current) return; if (previews[slot]) URL.revokeObjectURL(previews[slot]!); setPreviews(value => ({ ...value, [slot]: null })); const nextUploads = { ...uploads, [slot]: null }; setUploads(nextUploads); record('withdrawal_upload_removed', experimentId, { ...snapshot(), uploadCount: Object.values(nextUploads).filter(Boolean).length }, { upload: current, slot }) }}>Remove</button>
                  </div>}
                </div>)}
              </div>
              <p className="mt-3 text-xs text-slate-500">{isRemoteActivityConfigured ? 'Uploaded evidence is sent to the remote Activity Ledger when the backend is reachable.' : 'Remote Activity Ledger is not connected. Uploaded evidence stays in this browser and will not appear on another device.'}</p>
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
