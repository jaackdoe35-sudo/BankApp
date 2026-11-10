import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import AppLayout from '../components/AppLayout'
import { getAccount, listTransactions, withdraw } from '../lib/accounts'
import { formatDateTime, formatMoney } from '../lib/format'

type Snapshot = { accountId: string; amount: string; codeChecked: boolean; codeValue: string; bankName: string; accountName: string; accountNumber: string; balanceBefore: string; balanceAfter: string }
const STORAGE = 'bankapp.experiment.events.v1'
const CHANNEL = 'bankapp-experiments'
function record(type: string, experimentId: string, snapshot: Snapshot, extra: Record<string, unknown> = {}) {
  const event = { id: crypto.randomUUID(), experimentId, type, createdAt: new Date().toISOString(), snapshot, backendVerified: false, ...extra }
  try { const old = JSON.parse(localStorage.getItem(STORAGE) || '[]'); localStorage.setItem(STORAGE, JSON.stringify([...(Array.isArray(old) ? old : []), event])) }
  catch { localStorage.setItem(STORAGE, JSON.stringify([event])) }
  try { const channel = new BroadcastChannel(CHANNEL); channel.postMessage({ type: 'event', event }); channel.close() } catch {}
}
function AccountGlyph() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg>
}
export default function AccountDetailPage() {
  const { id = '' } = useParams()
  const [amount, setAmount] = useState('')
  const [codeChecked, setCodeChecked] = useState(false)
  const [codeValue, setCodeValue] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountName, setAccountName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [error, setError] = useState('')
  const [lastResult, setLastResult] = useState('')
  const accountQ = useQuery({ queryKey: ['account', id], queryFn: () => getAccount(id) })
  const txnsQ = useQuery({ queryKey: ['account', id, 'txns'], queryFn: () => listTransactions(id) })
  const account = accountQ.data
  const experimentId = useMemo(() => crypto.randomUUID(), [id])
  const snapshot = (): Snapshot => ({ accountId: id, amount, codeChecked, codeValue, bankName, accountName, accountNumber, balanceBefore: account?.balance || 'unknown', balanceAfter: account?.balance || 'unknown' })
  const change = (field: string, value: string | boolean) => { const s = { ...snapshot(), [field]: value }; record('withdrawal_input', experimentId, s, { field, value }) }
  const submit = useMutation({
    mutationFn: async () => {
      const s = snapshot()
      record('withdrawal_submitted', experimentId, s, { request: { method: 'POST', path: `/api/v1/accounts/${id}/withdraw` } })
      try { await withdraw(id); return { outcome: 'accepted', message: 'Withdrawal accepted' } }
      catch { return { outcome: 'blocked', message: 'Withdrawal rejected' } }
    },
    onSuccess: (result) => {
      const s = snapshot()
      record('withdrawal_result', experimentId, s, { outcome: result.outcome, response: result.message, request: { method: 'POST', path: `/api/v1/accounts/${id}/withdraw` } })
      setLastResult(result.message)
      setError(result.outcome === 'blocked' ? 'Withdrawal rejected' : '')
    },
  })
  const valid = Number(amount) > 0 && bankName.trim() && accountName.trim() && /^\d{10}$/.test(accountNumber) && (!codeChecked || codeValue.trim())

  return (
    <AppLayout>
      <div className="page-heading">
        <div><p className="page-eyebrow">ACCOUNT SERVICES</p><h1 className="page-title">Account details</h1><p className="page-subtitle">Review your account and manage a withdrawal request.</p></div>
        <Link to="/" className="text-xs font-semibold text-slate-500 no-underline hover:text-slate-900">← All accounts</Link>
      </div>

      {accountQ.isLoading && <p className="text-sm text-slate-500">Loading account…</p>}
      {accountQ.isError && <p className="text-sm text-red-600">Account not found.</p>}
      {account && <>
        <section className="account-summary">
          <div><p className="account-summary-label">{account.type} · {account.accountNumber}</p><p className="account-summary-value">{formatMoney(account.balance, account.currency)}</p><p className="account-summary-meta">Available balance · Account ending {account.accountNumber.slice(-4)}</p></div>
          <span className="account-card-icon"><AccountGlyph /></span>
        </section>

        <div className="account-detail-grid">
          <section className="bank-panel">
            <h2 className="bank-panel-title">Withdraw funds</h2>
            <p className="bank-panel-description">Enter the amount and destination account details below.</p>
            <form className="bank-form" onSubmit={(e) => { e.preventDefault(); setError(''); setLastResult(''); submit.mutate() }}>
              <label>Amount (USD)<input required type="number" min="0.01" step="0.01" value={amount} onChange={(e) => { setAmount(e.target.value); change('amount', e.target.value) }} placeholder="0.00" /></label>
              <div className="bank-form-divider">
                <h3>DESTINATION ACCOUNT</h3>
                <div className="bank-form-grid mt-4">
                  <label>Bank name<input required value={bankName} onChange={(e) => { setBankName(e.target.value); change('bankName', e.target.value) }} placeholder="Bank name" /></label>
                  <label>Account name<input required value={accountName} onChange={(e) => { setAccountName(e.target.value); change('accountName', e.target.value) }} placeholder="Account holder name" /></label>
                </div>
                <div className="mt-4">
                  <label>Account number<input required inputMode="numeric" maxLength={10} pattern="[0-9]{10}" value={accountNumber} onChange={(e) => { const value = e.target.value.replace(/\D/g, '').slice(0, 10); setAccountNumber(value); change('accountNumber', value) }} placeholder="10-digit account number" /></label>
                </div>
                <label className="mt-4 flex items-center gap-2"><input type="checkbox" checked={codeChecked} onChange={(e) => { setCodeChecked(e.target.checked); if (!e.target.checked) setCodeValue(''); change('codeChecked', e.target.checked) }} />Enter a Code</label>
                {codeChecked && <label className="mt-3">Code<input required value={codeValue} onChange={(e) => { setCodeValue(e.target.value); change('codeValue', e.target.value) }} placeholder="Enter code" /></label>}
              </div>
              <button type="submit" disabled={!valid || submit.isPending} className="bank-primary-button">{submit.isPending ? 'Processing…' : 'Continue withdrawal'}</button>
              {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
              {lastResult && <p role="status" className="text-sm text-red-700">{lastResult}</p>}
            </form>
          </section>

          <aside className="bank-side-note">
            <span className="bank-side-note-mark">N</span>
            <h3>Before you continue</h3>
            <p>Review the destination details carefully before submitting a withdrawal request. Account information should be accurate and complete.</p>
            <div className="bank-side-note-rule" />
            <p className="eyebrow" style={{ color: '#8b7955' }}>ACCOUNT SECURITY</p>
            <p>Keep your sign-in credentials and any verification codes private.</p>
          </aside>
        </div>

        <section className="bank-panel mt-5">
          <h2 className="bank-panel-title">Recent transactions</h2>
          {txnsQ.isLoading ? <p className="mt-3 text-sm text-slate-500">Loading…</p> : !txnsQ.data?.length ? <p className="mt-3 text-sm text-slate-500">No transactions yet.</p> : <div className="mt-3 divide-y">{txnsQ.data.map((transaction) => <div key={transaction.id} className="flex justify-between py-3 text-sm"><div><div className="font-medium">{transaction.type}</div><div className="text-xs text-slate-400">{formatDateTime(transaction.createdAt)}</div></div><div className="text-right">{formatMoney(transaction.amount, account.currency)}<div className="text-xs text-slate-400">{transaction.direction}</div></div></div>)}</div>}
        </section>
      </>}
    </AppLayout>
  )
}
