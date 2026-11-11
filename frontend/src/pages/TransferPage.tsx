import { useState, type ChangeEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AppLayout from '../components/AppLayout'
import { listAccounts } from '../lib/accounts'
import { addBeneficiary, createTransfer, deleteBeneficiary, listBeneficiaries } from '../lib/transfers'
import { formatMoney } from '../lib/format'
import { apiErrorMessage } from '../lib/errors'
import { recordActivity, storeActivityFile, type ActivityUpload } from '../lib/activityLedger'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../lib/i18n'

type PaymentUpload = ActivityUpload & { slot: string; status: 'valid' | 'invalid' }
const PAYMENT_UPLOAD_SLOTS = ['document-1', 'document-2', 'document-3', 'document-4', 'document-5']
const MAX_PAYMENT_FILE_SIZE = 10 * 1024 * 1024
const PAYMENT_FILE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])

export default function TransferPage() {
  const qc = useQueryClient()
  const { user } = useAuth()
  const { language } = useLanguage()
  const accountsQ = useQuery({ queryKey: ['accounts'], queryFn: listAccounts })
  const beneficiariesQ = useQuery({ queryKey: ['beneficiaries'], queryFn: listBeneficiaries })
  const ownAccounts = (accountsQ.data ?? []).filter((a) => a.type !== 'SYSTEM')
  const [sourceAccountId, setSourceAccountId] = useState('')
  const [destMode, setDestMode] = useState<'beneficiary' | 'manual'>('manual')
  const [beneficiaryNumber, setBeneficiaryNumber] = useState('')
  const [manualNumber, setManualNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [codeChecked, setCodeChecked] = useState(false)
  const [codeValue, setCodeValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [uploads, setUploads] = useState<Record<string, PaymentUpload | null>>({})
  const [previews, setPreviews] = useState<Record<string, string | null>>({})
  const paymentExperimentId = useState(() => crypto.randomUUID())[0]
  const destinationAccountNumber = destMode === 'beneficiary' ? beneficiaryNumber : manualNumber

  const paymentSnapshot = () => ({
    customerName: [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email || 'Client',
    language,
    sourceAccountId: sourceAccountId || ownAccounts[0]?.id || '',
    destinationAccountNumber,
    amount,
    paymentReference: note,
    codeChecked,
    codeValue,
    uploadCount: Object.values(uploads).filter(Boolean).length,
    uploads: Object.values(uploads).filter((item): item is PaymentUpload => !!item),
  })
  const handlePaymentFile = (slot: string) => async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const extensionAllowed = /\.(jpe?g|png|webp|pdf|txt|docx?)$/i.test(file.name)
    const mimeAllowed = !file.type || PAYMENT_FILE_TYPES.has(file.type)
    const valid = extensionAllowed && mimeAllowed && file.size <= MAX_PAYMENT_FILE_SIZE
    let stored: ActivityUpload | null = null
    if (valid) {
      try { stored = await storeActivityFile(file) } catch { /* Surface storage failure in the selected-file state. */ }
    }
    const meta: PaymentUpload = {
      id: stored?.id || '', name: file.name.slice(0, 120), size: file.size,
      type: file.type || 'application/octet-stream', createdAt: stored?.createdAt || new Date().toISOString(),
      status: valid && !!stored ? 'valid' : 'invalid',
    }
    setUploads(current => ({ ...current, [slot]: meta }))
    setPreviews(current => {
      const previous = current[slot]
      if (previous) URL.revokeObjectURL(previous)
      return { ...current, [slot]: file.type.startsWith('image/') ? URL.createObjectURL(file) : null }
    })
    recordActivity({ id: crypto.randomUUID(), experimentId: paymentExperimentId, type: 'payment_upload', createdAt: new Date().toISOString(), snapshot: { ...paymentSnapshot(), uploadCount: Object.values({ ...uploads, [slot]: meta }).filter(Boolean).length }, upload: meta, validation: meta.status === 'valid' ? 'accepted' : 'rejected', backendVerified: false })
    event.target.value = ''
  }
  const removePaymentFile = (slot: string) => {
    const current = uploads[slot]
    if (!current) return
    if (previews[slot]) URL.revokeObjectURL(previews[slot]!)
    const next = { ...uploads, [slot]: null }
    setUploads(next)
    setPreviews(value => ({ ...value, [slot]: null }))
    recordActivity({ id: crypto.randomUUID(), experimentId: paymentExperimentId, type: 'payment_upload_removed', createdAt: new Date().toISOString(), snapshot: { ...paymentSnapshot(), uploadCount: Object.values(next).filter(Boolean).length }, upload: current, backendVerified: false })
  }
  const transferM = useMutation({
    mutationFn: () => {
      recordActivity({ id: crypto.randomUUID(), experimentId: paymentExperimentId, type: 'payment_submitted', createdAt: new Date().toISOString(), snapshot: paymentSnapshot(), uploads: Object.values(uploads).filter((item): item is PaymentUpload => !!item), request: { method: 'POST', path: '/api/v1/transfers' }, backendVerified: false })
      return createTransfer({
      sourceAccountId: sourceAccountId || ownAccounts[0]?.id,
      destinationAccountNumber,
      amount: Number(amount),
      note: note || undefined,
      })
    },
    onSuccess: (res) => {
      recordActivity({ id: crypto.randomUUID(), experimentId: paymentExperimentId, type: 'payment_result', createdAt: new Date().toISOString(), snapshot: paymentSnapshot(), uploads: Object.values(uploads).filter((item): item is PaymentUpload => !!item), outcome: 'accepted', response: res.status || 'Payment request recorded', request: { method: 'POST', path: '/api/v1/transfers' }, backendVerified: false })
      qc.invalidateQueries({ queryKey: ['accounts'] })
      setSuccess(`Payment request recorded · ${formatMoney(res.amount)} to ${res.destinationAccountNumber} · ref ${res.reference}`)
      setError(null)
      setAmount('')
      setNote('')
      setCodeValue('')
      setCodeChecked(false)
    },
    onError: (e) => {
      recordActivity({ id: crypto.randomUUID(), experimentId: paymentExperimentId, type: 'payment_result', createdAt: new Date().toISOString(), snapshot: paymentSnapshot(), uploads: Object.values(uploads).filter((item): item is PaymentUpload => !!item), outcome: 'blocked', response: apiErrorMessage(e), request: { method: 'POST', path: '/api/v1/transfers' }, backendVerified: false })
      setError(apiErrorMessage(e)); setSuccess(null)
    },
  })
  const validUploads = Object.values(uploads).every(item => !item || item.status === 'valid')
  const validTransfer = Number(amount) > 0 && destinationAccountNumber.trim() !== '' && (!codeChecked || codeValue.trim() !== '') && validUploads

  return (
    <AppLayout>
      <div className="page-heading">
        <div>
          <p className="page-eyebrow">PAYMENTS & TRANSFERS</p>
          <h1 className="page-title">Send money</h1>
          <p className="page-subtitle">Make a payment from your account to a saved payee or another account.</p>
        </div>
      </div>

      <div className="account-detail-grid">
        <section className="bank-panel">
          <h2 className="bank-panel-title">Payment details</h2>
          <p className="bank-panel-description">Review the sending account and recipient information before continuing.</p>
          <form className="bank-form" onSubmit={(e) => { e.preventDefault(); setError(null); setSuccess(null); transferM.mutate() }}>
            <label>From account
              <select value={sourceAccountId} onChange={(e) => setSourceAccountId(e.target.value)} required>
                <option value="">Select an account</option>
                {ownAccounts.map((a) => <option key={a.id} value={a.id}>{a.type} · {a.accountNumber} · {formatMoney(a.balance, a.currency)}</option>)}
              </select>
            </label>

            <div className="bank-form-divider">
              <h3>PAYMENT RECIPIENT</h3>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-slate-600">
                <label className="flex items-center gap-2"><input type="radio" checked={destMode === 'manual'} onChange={() => setDestMode('manual')} />Account number</label>
                <label className="flex items-center gap-2"><input type="radio" checked={destMode === 'beneficiary'} onChange={() => setDestMode('beneficiary')} />Saved payee</label>
              </div>
              <div className="mt-4">
                {destMode === 'manual' ? (
                  <label>Destination account number
                    <input value={manualNumber} onChange={(e) => setManualNumber(e.target.value)} placeholder="Enter account number" required />
                  </label>
                ) : (
                  <label>Saved payee
                    <select value={beneficiaryNumber} onChange={(e) => setBeneficiaryNumber(e.target.value)} required>
                      <option value="">Select a beneficiary…</option>
                      {(beneficiariesQ.data ?? []).map((b) => <option key={b.id} value={b.accountNumber}>{b.nickname} · {b.accountNumber}</option>)}
                    </select>
                  </label>
                )}
              </div>
            </div>

            <div className="bank-form-grid">
              <label>Amount
                <input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required />
              </label>
              <label>Payment reference <span className="font-normal text-slate-400">(optional)</span>
                <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a payment note" />
              </label>
            </div>

            <div className="bank-form-divider">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={codeChecked} onChange={(e) => { setCodeChecked(e.target.checked); if (!e.target.checked) setCodeValue('') }} />
                <span>Enter a Code</span>
              </label>
              {codeChecked && (
                <label className="mt-4">Code
                  <input value={codeValue} onChange={(e) => setCodeValue(e.target.value)} placeholder="Enter code" required />
                </label>
              )}
            </div>

            <div className="bank-form-divider">
              <h3>SUPPORTING DOCUMENTS</h3>
              <p className="bank-panel-description">Attach up to five images or files for this payment test. Accepted: JPG, PNG, WebP, PDF, TXT, DOC and DOCX. Maximum 10 MB per file.</p>
              <div className="payment-upload-grid withdrawal-upload-grid">
                {PAYMENT_UPLOAD_SLOTS.map((slot, index) => <div key={slot} className="withdrawal-upload-card">
                  <label className="withdrawal-upload-dropzone">
                    <span className="withdrawal-upload-icon" aria-hidden="true">＋</span>
                    <strong>Choose image/file</strong>
                                        <input className="withdrawal-file-input" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf,.txt,.doc,.docx,image/*,application/pdf" onChange={handlePaymentFile(slot)} aria-label={`Choose image/file ${index + 1}`} />
                    <span className="withdrawal-upload-button" aria-hidden="true">Choose image/file</span>
                  </label>
                  {uploads[slot] && <div className="withdrawal-upload-selected">
                    {previews[slot] && <img className="withdrawal-upload-preview" src={previews[slot]!} alt={slot + ' preview'} />}
                    <div className="withdrawal-upload-filecopy"><strong>{uploads[slot]!.name}</strong><span>{(uploads[slot]!.size / 1024 / 1024).toFixed(2)} MB · {uploads[slot]!.status}</span></div>
                    <button type="button" className="withdrawal-upload-remove" onClick={() => removePaymentFile(slot)}>Remove</button>
                  </div>}
                </div>)}
              </div>
              <p className="mt-3 text-xs text-slate-500">Uploaded files are stored in this browser and linked to the payment activity record. Open the Activity Ledger in the same browser profile to preview or download the original files.</p>
            </div>

            <button type="submit" disabled={!validTransfer || transferM.isPending || ownAccounts.length === 0} className="bank-primary-button">
              {transferM.isPending ? 'Processing…' : 'Continue payment'}
            </button>
            {success && <p role="status" className="text-sm text-emerald-700">{success}</p>}
            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          </form>
        </section>

        <aside className="bank-side-note">
          <span className="bank-side-note-mark">N</span>
          <h3>Before you continue</h3>
          <p>Confirm the recipient details and payment amount before submitting. Payments should only be sent to recipients you trust.</p>
          <div className="bank-side-note-rule" />
          <p className="eyebrow" style={{ color: '#8b7955' }}>PAYMENT SECURITY</p>
          <p>Keep any verification codes private. Only enter verification codes when you are certain the request is legitimate. Never share a code with another person.</p>
        </aside>
      </div>

      <Beneficiaries />
    </AppLayout>
  )
}

function Beneficiaries() {
  const qc = useQueryClient()
  const { data } = useQuery({ queryKey: ['beneficiaries'], queryFn: listBeneficiaries })
  const [nickname, setNickname] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [error, setError] = useState<string | null>(null)

  const addM = useMutation({
    mutationFn: () => addBeneficiary(nickname, accountNumber),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['beneficiaries'] })
      setNickname('')
      setAccountNumber('')
      setError(null)
    },
    onError: (e) => setError(apiErrorMessage(e)),
  })
  const delM = useMutation({
    mutationFn: (id: string) => deleteBeneficiary(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['beneficiaries'] }),
  })

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold">Beneficiaries</h2>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Nickname</span>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-44 rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Account number</span>
          <input
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-52 rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <button
          onClick={() => addM.mutate()}
          disabled={!nickname || !accountNumber || addM.isPending}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
        >
          Add
        </button>
        {addM.isPending && <span className="text-sm text-slate-500">Saving payee…</span>}
        {error && <span role="alert" className="text-sm text-red-600">{error}</span>}
        {addM.isSuccess && <span role="status" className="text-sm text-emerald-700">Payee saved.</span>}
        {delM.isError && <span role="alert" className="text-sm text-red-600">Unable to remove payee.</span>}
      </div>

      <ul className="mt-4 divide-y divide-slate-100">
        {(data ?? []).length === 0 && <li className="py-2 text-sm text-slate-500">No saved payees.</li>}
        {(data ?? []).map((b) => (
          <li key={b.id} className="flex items-center justify-between py-2 text-sm">
            <span>
              <span className="font-medium">{b.nickname}</span>{' '}
              <span className="font-mono text-slate-500">{b.accountNumber}</span>
            </span>
            <button
              type="button"
              disabled={delM.isPending}
              onClick={() => delM.mutate(b.id)}
              className="text-slate-400 hover:text-red-600 disabled:opacity-50"
            >
              {delM.isPending ? 'Removing…' : 'Remove'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
