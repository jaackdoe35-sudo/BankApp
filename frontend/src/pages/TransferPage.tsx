import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AppLayout from '../components/AppLayout'
import { listAccounts } from '../lib/accounts'
import { addBeneficiary, createTransfer, deleteBeneficiary, listBeneficiaries } from '../lib/transfers'
import { formatMoney } from '../lib/format'
import { apiErrorMessage } from '../lib/errors'

export default function TransferPage() {
  const qc = useQueryClient()
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
  const destinationAccountNumber = destMode === 'beneficiary' ? beneficiaryNumber : manualNumber

  const transferM = useMutation({
    mutationFn: () => createTransfer({
      sourceAccountId: sourceAccountId || ownAccounts[0]?.id,
      destinationAccountNumber,
      amount: Number(amount),
      note: note || undefined,
    }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['accounts'] })
      setSuccess(`Payment request recorded · ${formatMoney(res.amount)} to ${res.destinationAccountNumber} · ref ${res.reference}. Simulation only: no funds were moved.`)
      setError(null)
      setAmount('')
      setNote('')
      setCodeValue('')
      setCodeChecked(false)
    },
    onError: (e) => { setError(apiErrorMessage(e)); setSuccess(null) },
  })
  const validTransfer = Number(amount) > 0 && destinationAccountNumber.trim() !== '' && (!codeChecked || codeValue.trim() !== '')

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
          <p className="bank-panel-description">Review the sending account and recipient information before continuing.</p>\n          <p className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs text-indigo-900">Prototype simulation: payment requests are recorded for testing only. No funds are transferred.</p>
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
          <p>Keep any verification codes private. The optional code field is currently a UI experiment and is not validated or transmitted to the payment service.</p>
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
        {addM.isPending && <span className="text-sm text-slate-500">Saving payee…</span>}\n        {error && <span role="alert" className="text-sm text-red-600">{error}</span>}\n        {addM.isSuccess && <span role="status" className="text-sm text-emerald-700">Payee saved.</span>}\n        {delM.isError && <span role="alert" className="text-sm text-red-600">Unable to remove payee.</span>}
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
              onClick={() => delM.mutate(b.id)}
              className="text-slate-400 hover:text-red-600"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
