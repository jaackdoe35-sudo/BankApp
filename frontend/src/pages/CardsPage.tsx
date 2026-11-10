import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AppLayout from '../components/AppLayout'
import { listAccounts } from '../lib/accounts'
import {
  cancelCard,
  freezeCard,
  issueCard,
  listCards,
  payWithCard,
  unfreezeCard,
  type Card,
} from '../lib/cards'
import { formatMoney } from '../lib/format'
import { apiErrorMessage } from '../lib/errors'

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  FROZEN: 'bg-amber-100 text-amber-800',
  CANCELLED: 'bg-slate-200 text-slate-600',
}

export default function CardsPage() {
  const qc = useQueryClient()
  const accountsQ = useQuery({ queryKey: ['accounts'], queryFn: listAccounts })
  const cardsQ = useQuery({ queryKey: ['cards'], queryFn: listCards })
  const ownAccounts = (accountsQ.data ?? []).filter((a) => a.type !== 'SYSTEM')

  const [accountId, setAccountId] = useState('')
  const [limit, setLimit] = useState('0')
  const [revealed, setRevealed] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const issueM = useMutation({
    mutationFn: () => issueCard(accountId || ownAccounts[0]?.id, Number(limit)),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['cards'] })
      setRevealed(res.cardNumber)
      setError(null)
    },
    onError: (e) => setError(apiErrorMessage(e)),
  })

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold tracking-tight">Cards</h1>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold">Issue a virtual card</h2>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Account</span>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2"
            >
              {ownAccounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.type} · {a.accountNumber}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Monthly limit (0 = none)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="w-40 rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <button
            onClick={() => issueM.mutate()}
            disabled={issueM.isPending || ownAccounts.length === 0}
            className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {issueM.isPending ? 'Issuing…' : 'Issue card'}
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        {revealed && (
          <div className="mt-4 rounded-xl border border-green-300 bg-green-50 p-4">
            <p className="text-sm font-medium text-green-800">
              Card issued. Copy the number now — it won't be shown again.
            </p>
            <p className="mt-1 font-mono text-lg tracking-widest">
              {revealed.replace(/(.{4})/g, '$1 ').trim()}
            </p>
            <button
              onClick={() => setRevealed(null)}
              className="mt-2 text-sm text-green-700 underline"
            >
              I've saved it
            </button>
          </div>
        )}
      </section>

      <div className="mt-6 space-y-3">
        {cardsQ.isLoading && <p className="text-slate-500">Loading cards…</p>}
        {!cardsQ.isLoading && (cardsQ.data?.length ?? 0) === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
            No cards yet.
          </div>
        )}
        {(cardsQ.data ?? []).map((card) => (
          <CardRow key={card.id} card={card} />
        ))}
      </div>
    </AppLayout>
  )
}

function CardRow({ card }: { card: Card }) {
  const qc = useQueryClient()
  const [merchant, setMerchant] = useState('')
  const [amount, setAmount] = useState('')
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['cards'] })
    qc.invalidateQueries({ queryKey: ['accounts'] })
  }

  const freezeM = useMutation({
    mutationFn: () => (card.status === 'FROZEN' ? unfreezeCard(card.id) : freezeCard(card.id)),
    onSuccess: invalidate,
  })
  const cancelM = useMutation({ mutationFn: () => cancelCard(card.id), onSuccess: invalidate })
  const payM = useMutation({
    mutationFn: () => payWithCard(card.id, merchant, Number(amount)),
    onSuccess: (res) => {
      invalidate()
      setMsg({ kind: 'ok', text: `Paid ${formatMoney(res.amount)} · bal ${formatMoney(res.accountBalanceAfter)}` })
      setMerchant('')
      setAmount('')
    },
    onError: (e) => setMsg({ kind: 'err', text: apiErrorMessage(e) }),
  })

  const active = card.status === 'ACTIVE'

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-lg">
            {card.brand} •••• {card.last4}
          </div>
          <div className="text-xs text-slate-400">
            exp {String(card.expMonth).padStart(2, '0')}/{card.expYear} · limit{' '}
            {Number(card.monthlyLimit) > 0 ? formatMoney(card.monthlyLimit) : 'none'}
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[card.status]}`}>
          {card.status}
        </span>
      </div>

      {card.status !== 'CANCELLED' && (
        <div className="mt-4 flex flex-wrap items-end gap-2">
          <input
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            placeholder="Merchant"
            className="w-40 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-28 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            onClick={() => payM.mutate()}
            disabled={!active || !merchant || Number(amount) <= 0 || payM.isPending}
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            Pay
          </button>
          <button
            onClick={() => freezeM.mutate()}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
          >
            {card.status === 'FROZEN' ? 'Unfreeze' : 'Freeze'}
          </button>
          <button
            onClick={() => cancelM.mutate()}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Cancel
          </button>
        </div>
      )}
      {msg && (
        <p className={`mt-2 text-sm ${msg.kind === 'ok' ? 'text-green-600' : 'text-red-600'}`}>{msg.text}</p>
      )}
    </div>
  )
}
