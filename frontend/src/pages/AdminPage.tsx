import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import {
  listAdminAccounts,
  listAudit,
  tellerDeposit,
} from '../lib/admin'
import { formatDateTime, formatMoney } from '../lib/format'
import { apiErrorMessage } from '../lib/errors'
import { api } from '../lib/api'

export default function AdminPage() {
  const { user } = useAuth()

  if (user?.role !== 'ADMIN') {
    return (
      <AppLayout>
        <p className="text-slate-500">Admins only.</p>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold tracking-tight">Admin</h1>

      <GmailConnection />
      <TellerDeposit />
      <AuditLog />
    </AppLayout>
  )
}


function GmailConnection() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-email-gmail-status'],
    queryFn: async () => (await api.get<{
      oauthConfigured: boolean
      connected: boolean
      senderEmail: string
    }>('/api/v1/admin/email/status')).data,
  })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function connect() {
    setBusy(true)
    setError('')
    try {
      const response = await api.get<{ authorizationUrl: string }>('/api/v1/admin/email/oauth/authorize')
      window.location.assign(response.data.authorizationUrl)
    } catch (e) {
      setError(apiErrorMessage(e))
      setBusy(false)
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold">Transactional email · Gmail</h2>
      <p className="mt-1 text-sm text-slate-500">
        Connect the bank's Gmail sender using Google's secure authorization. The refresh token is encrypted in the backend database.
      </p>
      {isLoading ? <p className="mt-3 text-sm text-slate-500">Checking connection…</p> : (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className={'rounded-full px-3 py-1 text-xs font-medium ' + (data?.connected ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700')}>
            {data?.connected ? 'Connected' : 'Not connected'}
          </span>
          {data?.senderEmail && <span className="text-sm text-slate-600">{data.senderEmail}</span>}
          {!data?.oauthConfigured && <span className="text-sm text-amber-700">Google OAuth client settings are not configured in Render.</span>}
          <button onClick={connect} disabled={!data?.oauthConfigured || busy} className="bank-primary-button">
            {busy ? 'Opening Google…' : data?.connected ? 'Reconnect Gmail' : 'Connect Gmail'}
          </button>
          <button onClick={() => refetch()} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">Refresh status</button>
        </div>
      )}
      {error && <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}
    </section>
  )
}

function TellerDeposit() {
  const qc = useQueryClient()
  const { data } = useQuery({ queryKey: ['admin-accounts'], queryFn: listAdminAccounts })
  const [amounts, setAmounts] = useState<Record<string, string>>({})
  const [accountNumber, setAccountNumber] = useState('')
  const [sendAmount, setSendAmount] = useState('')
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)

  const depositM = useMutation({
    mutationFn: ({ number, amount }: { number: string; amount: number }) => tellerDeposit(number, amount),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['admin-accounts'] })
      setAmounts((a) => ({ ...a, [vars.number]: '' }))
      setMsg({ kind: 'ok', text: `Deposit request recorded for ${vars.number}` })
    },
    onError: (e) => setMsg({ kind: 'err', text: apiErrorMessage(e) }),
  })

  const accounts = data ?? []
  const sendM = useMutation({ mutationFn: () => tellerDeposit(accountNumber.trim(), Number(sendAmount)), onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-accounts'] }); setAccountNumber(''); setSendAmount(''); setMsg({ kind: 'ok', text: 'Funds sent. The account holder has been notified.' }) }, onError: (e) => setMsg({ kind: 'err', text: apiErrorMessage(e) }) })

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold">Send money to any account</h2>
      <p className="mt-1 text-sm text-slate-500">Enter any existing customer account number and the amount to credit. The recipient receives an account notification.</p>
      <div className="mt-4 flex flex-wrap items-end gap-3"><label className="block text-sm">Account number<input value={accountNumber} onChange={e => setAccountNumber(e.target.value)} inputMode="numeric" autoComplete="off" placeholder="Enter account number" className="mt-1 block w-56 rounded-lg border border-slate-300 px-3 py-2 font-mono" /></label><label className="block text-sm">Amount (USD)<input type="number" min="0.01" step="0.01" value={sendAmount} onChange={e => setSendAmount(e.target.value)} placeholder="0.00" className="mt-1 block w-36 rounded-lg border border-slate-300 px-3 py-2" /></label><button onClick={() => sendM.mutate()} disabled={!accountNumber.trim() || !(Number(sendAmount)>0) || sendM.isPending} className="bank-primary-button">{sendM.isPending ? 'Sending…' : 'Send funds'}</button></div>
      <h3 className="mt-8 text-sm font-semibold text-slate-700">Customer account directory</h3>
      <p className="mt-1 text-xs text-slate-500">You can also credit a listed account directly.</p>
      <div className="mt-4 space-y-2">
        {accounts.length === 0 && <p className="text-sm text-slate-500">No customer accounts yet.</p>}
        {accounts.map((a) => (
          <div key={a.accountNumber} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm">
            <span>
              <span className="font-mono">{a.accountNumber}</span> · {a.type} ·{' '}
              <span className="text-slate-500">{a.ownerEmail}</span> · {formatMoney(a.balance, a.currency)}
            </span>
            <span className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="0.01"
                value={amounts[a.accountNumber] ?? ''}
                onChange={(e) => setAmounts((m) => ({ ...m, [a.accountNumber]: e.target.value }))}
                placeholder="0.00"
                className="w-28 rounded-lg border border-slate-300 px-2 py-1.5"
              />
              <button
                onClick={() =>
                  depositM.mutate({ number: a.accountNumber, amount: Number(amounts[a.accountNumber]) })
                }
                disabled={!(Number(amounts[a.accountNumber]) > 0) || depositM.isPending}
                className="bank-primary-button"
              >
                Deposit
              </button>
            </span>
          </div>
        ))}
      </div>
      {msg && <p className={`mt-2 text-sm ${msg.kind === 'ok' ? 'text-green-600' : 'text-red-600'}`}>{msg.text}</p>}
    </section>
  )
}

function AuditLog() {
  const { data, isLoading } = useQuery({ queryKey: ['admin-audit'], queryFn: () => listAudit(50) })
  const entries = data ?? []

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold">Audit log</h2>
      <p className="mt-1 text-sm text-slate-500">Recent domain events (append-only).</p>
      {isLoading ? (
        <p className="mt-3 text-slate-500">Loading…</p>
      ) : entries.length === 0 ? (
        <p className="mt-3 text-slate-500">No audit entries yet.</p>
      ) : (
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400">
              <th className="pb-2">Time</th>
              <th className="pb-2">Action</th>
              <th className="pb-2">Entity</th>
              <th className="pb-2">Detail</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id} className="border-t border-slate-100">
                <td className="py-1.5 text-slate-500">{formatDateTime(e.createdAt)}</td>
                <td className="py-1.5 font-medium">{e.action}</td>
                <td className="py-1.5 text-slate-500">{e.entityType}</td>
                <td className="py-1.5">{e.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
