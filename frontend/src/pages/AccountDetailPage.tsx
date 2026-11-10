import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AppLayout from '../components/AppLayout'
import { getAccount, listTransactions, withdraw } from '../lib/accounts'
import { confirmTopUp, createTopUp } from '../lib/payments'
import { formatDateTime, formatMoney } from '../lib/format'
import { apiErrorMessage } from '../lib/errors'

export default function AccountDetailPage() {
  const { id = '' } = useParams()
  const qc = useQueryClient()
  const [amount, setAmount] = useState('')
  const [error, setError] = useState<string | null>(null)

  const accountQ = useQuery({ queryKey: ['account', id], queryFn: () => getAccount(id) })
  const txnsQ = useQuery({ queryKey: ['account', id, 'txns'], queryFn: () => listTransactions(id) })

  function refresh() {
    qc.invalidateQueries({ queryKey: ['account', id] })
    qc.invalidateQueries({ queryKey: ['accounts'] })
    setAmount('')
    setError(null)
  }

  const withdrawM = useMutation({
    mutationFn: () => withdraw(id, Number(amount)),
    onSuccess: refresh,
    onError: (e) => setError(apiErrorMessage(e)),
  })
  // Top-up via the payment gateway: create an intent then settle it. The simulated
  // gateway confirms here; with real Stripe this is where Stripe.js would confirm.
  const topUpM = useMutation({
    mutationFn: async () => {
      const res = await createTopUp(id, Number(amount))
      if (res.manualConfirm) {
        await confirmTopUp(res.paymentId)
      } else {
        throw new Error('Complete the payment with Stripe to finish this top-up')
      }
    },
    onSuccess: refresh,
    onError: (e) => setError(apiErrorMessage(e)),
  })

  const account = accountQ.data
  const busy = withdrawM.isPending || topUpM.isPending
  const valid = Number(amount) > 0

  return (
    <AppLayout>
      <Link to="/" className="text-sm text-slate-500 hover:text-slate-900">
        ← Back to dashboard
      </Link>

      {accountQ.isLoading && <p className="mt-4 text-slate-500">Loading…</p>}
      {accountQ.isError && <p className="mt-4 text-red-600">Account not found.</p>}

      {account && (
        <>
          <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">
                  {account.type} · <span className="font-mono">{account.accountNumber}</span>
                </div>
                <div className="mt-1 text-3xl font-bold">{formatMoney(account.balance, account.currency)}</div>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">{account.status}</span>
            </div>

            <div className="mt-6 flex flex-wrap items-end gap-3">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Amount</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-40 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
                  placeholder="0.00"
                />
              </label>
              <button
                onClick={() => topUpM.mutate()}
                disabled={!valid || busy}
                className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
                title="Add money via the payment gateway (card)"
              >
                Add money
              </button>
              <button
                onClick={() => withdrawM.mutate()}
                disabled={!valid || busy}
                className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800 disabled:opacity-50"
              >
                Withdraw
              </button>
            </div>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </section>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold">Transaction history</h2>
            {txnsQ.isLoading ? (
              <p className="mt-3 text-slate-500">Loading…</p>
            ) : (txnsQ.data?.length ?? 0) === 0 ? (
              <p className="mt-3 text-slate-500">No transactions yet.</p>
            ) : (
              <table className="mt-4 w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400">
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2 text-right">Amount</th>
                    <th className="pb-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {txnsQ.data!.map((e) => (
                    <tr key={e.id} className="border-t border-slate-100">
                      <td className="py-2 text-slate-500">{formatDateTime(e.createdAt)}</td>
                      <td className="py-2">{e.type}</td>
                      <td className={`py-2 text-right ${e.direction === 'CREDIT' ? 'text-green-600' : 'text-slate-900'}`}>
                        {e.direction === 'CREDIT' ? '+' : '−'}
                        {formatMoney(e.amount, account.currency)}
                      </td>
                      <td className="py-2 text-right text-slate-500">
                        {e.balanceAfter != null ? formatMoney(e.balanceAfter, account.currency) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}
    </AppLayout>
  )
}
