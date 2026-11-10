import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AppLayout from '../components/AppLayout'
import { listAccounts } from '../lib/accounts'
import {
  addBeneficiary,
  createTransfer,
  deleteBeneficiary,
  listBeneficiaries,
} from '../lib/transfers'
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
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const destinationAccountNumber = destMode === 'beneficiary' ? beneficiaryNumber : manualNumber

  const transferM = useMutation({
    mutationFn: () =>
      createTransfer({
        sourceAccountId: sourceAccountId || ownAccounts[0]?.id,
        destinationAccountNumber,
        amount: Number(amount),
        note: note || undefined,
      }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['accounts'] })
      setSuccess(
        `Sent ${formatMoney(res.amount)} to ${res.destinationAccountNumber} · ref ${res.reference}`,
      )
      setError(null)
      setAmount('')
      setNote('')
    },
    onError: (e) => {
      setError(apiErrorMessage(e))
      setSuccess(null)
    },
  })

  const validTransfer = Number(amount) > 0 && destinationAccountNumber.trim() !== ''

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold tracking-tight">Send money</h1>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="grid gap-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">From account</span>
            <select
              value={sourceAccountId}
              onChange={(e) => setSourceAccountId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              {ownAccounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.type} · {a.accountNumber} · {formatMoney(a.balance, a.currency)}
                </option>
              ))}
            </select>
          </label>

          <div>
            <div className="mb-1 flex items-center gap-4 text-sm font-medium text-slate-700">
              <span>To</span>
              <label className="flex items-center gap-1 font-normal">
                <input
                  type="radio"
                  checked={destMode === 'manual'}
                  onChange={() => setDestMode('manual')}
                />
                Account number
              </label>
              <label className="flex items-center gap-1 font-normal">
                <input
                  type="radio"
                  checked={destMode === 'beneficiary'}
                  onChange={() => setDestMode('beneficiary')}
                />
                Saved payee
              </label>
            </div>
            {destMode === 'manual' ? (
              <input
                value={manualNumber}
                onChange={(e) => setManualNumber(e.target.value)}
                placeholder="Destination account number"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            ) : (
              <select
                value={beneficiaryNumber}
                onChange={(e) => setBeneficiaryNumber(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="">Select a beneficiary…</option>
                {(beneficiariesQ.data ?? []).map((b) => (
                  <option key={b.id} value={b.accountNumber}>
                    {b.nickname} · {b.accountNumber}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Amount</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Note (optional)</span>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => transferM.mutate()}
              disabled={!validTransfer || transferM.isPending}
              className="rounded-lg bg-slate-900 px-5 py-2 font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {transferM.isPending ? 'Sending…' : 'Send transfer'}
            </button>
            {success && <span className="text-sm text-green-600">{success}</span>}
            {error && <span className="text-sm text-red-600">{error}</span>}
          </div>
        </div>
      </section>

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
        {error && <span className="text-sm text-red-600">{error}</span>}
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
