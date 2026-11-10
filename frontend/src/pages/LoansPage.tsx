import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../context/AuthContext'
import { listAccounts } from '../lib/accounts'
import {
  applyForLoan,
  approveLoan,
  getLoan,
  listAdminLoans,
  listLoans,
  rejectLoan,
  repayLoan,
  type Loan,
} from '../lib/loans'
import { formatMoney } from '../lib/format'
import { apiErrorMessage } from '../lib/errors'

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  ACTIVE: 'bg-blue-100 text-blue-800',
  PAID_OFF: 'bg-green-100 text-green-800',
  REJECTED: 'bg-slate-200 text-slate-600',
}

function pct(rate: string) {
  return `${(Number(rate) * 100).toFixed(1)}%`
}

export default function LoansPage() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const accountsQ = useQuery({ queryKey: ['accounts'], queryFn: listAccounts })
  const loansQ = useQuery({ queryKey: ['loans'], queryFn: listLoans })
  const ownAccounts = (accountsQ.data ?? []).filter((a) => a.type !== 'SYSTEM')

  const [accountId, setAccountId] = useState('')
  const [principal, setPrincipal] = useState('')
  const [term, setTerm] = useState('12')
  const [error, setError] = useState<string | null>(null)

  const applyM = useMutation({
    mutationFn: () => applyForLoan(accountId || ownAccounts[0]?.id, Number(principal), Number(term)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['loans'] })
      setPrincipal('')
      setError(null)
    },
    onError: (e) => setError(apiErrorMessage(e)),
  })

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold tracking-tight">Loans</h1>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold">Apply for a loan</h2>
        <p className="mt-1 text-sm text-slate-500">Requires verified KYC. Fixed-rate, equal monthly payments.</p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Disburse to</span>
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
            <span className="mb-1 block text-sm font-medium text-slate-700">Amount</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="0.00"
              className="w-36 rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Term (months)</span>
            <input
              type="number"
              min="1"
              max="60"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-28 rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <button
            onClick={() => applyM.mutate()}
            disabled={applyM.isPending || Number(principal) <= 0 || ownAccounts.length === 0}
            className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {applyM.isPending ? 'Submitting…' : 'Apply'}
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </section>

      <div className="mt-6 space-y-3">
        {loansQ.isLoading && <p className="text-slate-500">Loading loans…</p>}
        {!loansQ.isLoading && (loansQ.data?.length ?? 0) === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
            No loans yet.
          </div>
        )}
        {(loansQ.data ?? []).map((loan) => (
          <LoanRow key={loan.id} loan={loan} />
        ))}
      </div>

      {user?.role === 'ADMIN' && <PendingApprovals />}
    </AppLayout>
  )
}

function LoanRow({ loan }: { loan: Loan }) {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const detailQ = useQuery({ queryKey: ['loan', loan.id], queryFn: () => getLoan(loan.id), enabled: open })

  const repayM = useMutation({
    mutationFn: () => repayLoan(loan.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['loan', loan.id] })
      qc.invalidateQueries({ queryKey: ['loans'] })
      qc.invalidateQueries({ queryKey: ['accounts'] })
    },
  })

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">
            {formatMoney(loan.principal)} · {loan.termMonths} mo · {pct(loan.annualRate)} APR
          </div>
          <div className="text-xs text-slate-400">
            Outstanding {formatMoney(loan.outstanding)}
            {loan.nextDueDate ? ` · next due ${loan.nextDueDate}` : ''}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[loan.status]}`}>
            {loan.status}
          </span>
          <button onClick={() => setOpen((o) => !o)} className="text-sm text-slate-500 hover:text-slate-900">
            {open ? 'Hide' : 'Schedule'}
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-4">
          {detailQ.isLoading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400">
                    <th className="pb-2">#</th>
                    <th className="pb-2">Due</th>
                    <th className="pb-2 text-right">Principal</th>
                    <th className="pb-2 text-right">Interest</th>
                    <th className="pb-2 text-right">Total</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(detailQ.data?.schedule ?? []).map((i) => (
                    <tr key={i.seq} className="border-t border-slate-100">
                      <td className="py-1.5">{i.seq}</td>
                      <td className="py-1.5 text-slate-500">{i.dueDate}</td>
                      <td className="py-1.5 text-right">{formatMoney(i.principalDue)}</td>
                      <td className="py-1.5 text-right">{formatMoney(i.interestDue)}</td>
                      <td className="py-1.5 text-right">{formatMoney(i.totalDue)}</td>
                      <td className="py-1.5 text-right">{i.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {loan.status === 'ACTIVE' && (
                <button
                  onClick={() => repayM.mutate()}
                  disabled={repayM.isPending}
                  className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  {repayM.isPending ? 'Paying…' : 'Pay next installment'}
                </button>
              )}
              {repayM.isError && <p className="mt-2 text-sm text-red-600">{apiErrorMessage(repayM.error)}</p>}
            </>
          )}
        </div>
      )}
    </div>
  )
}

function PendingApprovals() {
  const qc = useQueryClient()
  const pendingQ = useQuery({ queryKey: ['admin-loans', 'PENDING'], queryFn: () => listAdminLoans('PENDING') })

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin-loans', 'PENDING'] })
    qc.invalidateQueries({ queryKey: ['loans'] })
    qc.invalidateQueries({ queryKey: ['accounts'] })
  }
  const approveM = useMutation({ mutationFn: (id: string) => approveLoan(id), onSuccess: invalidate })
  const rejectM = useMutation({ mutationFn: (id: string) => rejectLoan(id), onSuccess: invalidate })

  return (
    <section className="mt-8 rounded-2xl border border-indigo-200 bg-indigo-50/40 p-6">
      <h2 className="text-lg font-semibold">Pending approvals (admin)</h2>
      <div className="mt-3 space-y-2">
        {(pendingQ.data?.length ?? 0) === 0 && <p className="text-sm text-slate-500">Nothing pending.</p>}
        {(pendingQ.data ?? []).map((loan) => (
          <div key={loan.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-sm">
            <span>
              {formatMoney(loan.principal)} · {loan.termMonths} mo · {pct(loan.annualRate)} APR
            </span>
            <span className="flex gap-2">
              <button
                onClick={() => approveM.mutate(loan.id)}
                className="rounded-lg bg-green-600 px-3 py-1.5 font-medium text-white hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => rejectM.mutate(loan.id)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-red-600 hover:bg-red-50"
              >
                Reject
              </button>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
