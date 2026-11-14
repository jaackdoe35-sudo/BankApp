import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../context/AuthContext'
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
  const { user } = useAuth()
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
            className="bank-primary-button"
          >
            {issueM.isPending ? 'Issuing…' : 'Issue card'}
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}


      </section>

      <div className="mt-6 space-y-3">
        {cardsQ.isLoading && <p className="text-slate-500">Loading cards…</p>}
        {!cardsQ.isLoading && (cardsQ.data?.length ?? 0) === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
            No cards yet.
          </div>
        )}
        {(cardsQ.data ?? []).map((card) => (
          <CardRow key={card.id} card={card} cardNumber={revealed?.endsWith(card.last4) ? revealed : undefined} holderName={[user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'CARDHOLDER'} />
        ))}
      </div>
    </AppLayout>
  )
}

function CardFace({ card, cardNumber, holderName }: { card: Card; cardNumber?: string; holderName: string }) {
  const number = cardNumber
    ? cardNumber.replace(/(.{4})/g, '$1 ').trim()
    : `••••  ••••  ••••  ${card.last4}`
  return (
    <div className={`bank-card-face bank-card-${card.status.toLowerCase()}`} aria-label={`${card.brand} card ending in ${card.last4}, ${card.status.toLowerCase()}`}>
      <div className="bank-card-orbit bank-card-orbit-one" />
      <div className="bank-card-orbit bank-card-orbit-two" />
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <div className="text-[10px] font-semibold tracking-[.24em] text-white/65">NORTHSTAR PRIVATE</div>
          <div className="mt-1 text-xs font-medium tracking-[.18em] text-white/90">WORLD ELITE</div>
        </div>
        <div className="text-right text-xl font-semibold italic tracking-tight text-white">{card.brand}</div>
      </div>
      <div className="relative z-10 mt-8 flex items-center gap-3">
        <svg viewBox="0 0 48 36" className="h-9 w-12 drop-shadow-sm" aria-hidden="true">
          <rect x="1" y="1" width="46" height="34" rx="6" fill="#D9D4B9" stroke="#F4EED8" strokeWidth="1.2"/>
          <path d="M16 2v32M32 2v32M2 12h44M2 24h44M16 12l-5 6 5 6M32 12l5 6-5 6" fill="none" stroke="#9D987F" strokeWidth="1"/>
        </svg>
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-white/80" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          <path d="M2 9a14 14 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0M12 19h.01" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="relative z-10 mt-4 font-mono text-[clamp(15px,2.1vw,19px)] tracking-[.12em] text-white drop-shadow-sm">{number}</div>
      <div className="relative z-10 mt-5 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[8px] tracking-[.2em] text-white/55">CARDHOLDER</div>
          <div className="mt-1 truncate text-xs font-semibold uppercase tracking-[.13em] text-white">{holderName}</div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-[8px] tracking-[.2em] text-white/55">VALID THRU</div>
          <div className="mt-1 text-xs font-semibold tracking-widest text-white">{String(card.expMonth).padStart(2, '0')}/{String(card.expYear).slice(-2)}</div>
        </div>
      </div>
      {card.status !== 'ACTIVE' && <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[22px] bg-slate-950/55"><span className="rounded-full border border-white/50 px-5 py-2 text-sm font-semibold tracking-[.24em] text-white">{card.status}</span></div>}
    </div>
  )
}

function CardRow({ card, cardNumber, holderName }: { card: Card; cardNumber?: string; holderName: string }) {
  const qc = useQueryClient()
  const [merchant, setMerchant] = useState('')
  const [amount, setAmount] = useState('')
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)
  const [showNumber, setShowNumber] = useState(false)

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['cards'] })
    qc.invalidateQueries({ queryKey: ['accounts'] })
  }

  const freezeM = useMutation({
    mutationFn: () => (card.status === 'FROZEN' ? unfreezeCard(card.id) : freezeCard(card.id)),
    onSuccess: () => { invalidate(); setMsg({ kind: 'ok', text: card.status === 'FROZEN' ? 'Your card is active again.' : 'Your card has been frozen.' }) },
    onError: (e) => setMsg({ kind: 'err', text: apiErrorMessage(e) }),
  })
  const cancelM = useMutation({ mutationFn: () => cancelCard(card.id), onSuccess: () => { invalidate(); setMsg({ kind: 'ok', text: 'Your card has been cancelled.' }) }, onError: (e) => setMsg({ kind: 'err', text: apiErrorMessage(e) }) })
  const payM = useMutation({
    mutationFn: () => payWithCard(card.id, merchant, Number(amount)),
    onSuccess: (res) => {
      invalidate()
      setMsg({ kind: 'ok', text: `withdrawal declined for ${formatMoney(res.amount)} at ${merchant}. Reference: ${res.reference}.` })
      setMerchant('')
      setAmount('')
    },
    onError: (e) => setMsg({ kind: 'err', text: apiErrorMessage(e) }),
  })

  const active = card.status === 'ACTIVE'

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <CardFace card={card} cardNumber={showNumber ? cardNumber : undefined} holderName={holderName} />
      <div className="mt-5 flex items-center justify-between">
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

      {cardNumber && card.status !== 'CANCELLED' && (
        <button type="button" onClick={() => setShowNumber((visible) => !visible)} className="mt-3 text-sm font-medium text-indigo-700 hover:text-indigo-900">
          {showNumber ? 'Hide card number' : 'Show card number'}
        </button>
      )}
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
            disabled={!active || !merchant.trim() || Number(amount) <= 0 || payM.isPending}
            className="bank-primary-button"
          >
            Pay
          </button>
          <button
            onClick={() => freezeM.mutate()}
            disabled={freezeM.isPending || cancelM.isPending}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
          >
            {freezeM.isPending ? 'Updating…' : card.status === 'FROZEN' ? 'Unfreeze' : 'Freeze'}
          </button>
          <button
            onClick={() => cancelM.mutate()}
            disabled={cancelM.isPending || freezeM.isPending}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            {cancelM.isPending ? 'Cancelling…' : 'Cancel'}
          </button>
        </div>
      )}
      {msg && (
        <p className={`mt-2 text-sm ${msg.kind === 'ok' ? 'text-green-600' : 'text-red-600'}`}>{msg.text}</p>
      )}
    </div>
  )
}
