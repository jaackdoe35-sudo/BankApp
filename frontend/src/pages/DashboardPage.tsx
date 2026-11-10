import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AppLayout from '../components/AppLayout'
import { createAccount, listAccounts, type AccountType } from '../lib/accounts'
import { formatMoney } from '../lib/format'
import { apiErrorMessage } from '../lib/errors'

export default function DashboardPage() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const [type, setType] = useState<AccountType>('CHECKING')

  const { data: accounts, isLoading, isError } = useQuery({
    queryKey: ['accounts'],
    queryFn: listAccounts,
  })

  const open = useMutation({
    mutationFn: () => createAccount(type),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['accounts'] }),
  })

  const customerAccounts = accounts ?? []
  const total = customerAccounts.reduce((sum, a) => sum + Number(a.balance), 0)

  return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Accounts</h1>
          {!isLoading && (
            <p className="mt-1 text-sm text-slate-500">
              Total balance: <span className="font-semibold text-slate-900">{formatMoney(total)}</span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/transfer')}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Send money
          </button>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as AccountType)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="CHECKING">Checking</option>
            <option value="SAVINGS">Savings</option>
          </select>
          <button
            onClick={() => open.mutate()}
            disabled={open.isPending}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {open.isPending ? 'Opening…' : 'Open account'}
          </button>
        </div>
      </div>

      {open.isError && <p className="mt-3 text-sm text-red-600">{apiErrorMessage(open.error)}</p>}

      <div className="mt-6 space-y-3">
        {isLoading && <p className="text-slate-500">Loading accounts…</p>}
        {isError && <p className="text-red-600">Failed to load accounts.</p>}
        {!isLoading && customerAccounts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
            No accounts yet. Open your first account to get started.
            <div className="mt-1 text-xs text-slate-400">
              Your KYC must be verified by an admin before you can open an account.
            </div>
          </div>
        )}
        {customerAccounts.map((a) => (
          <Link
            key={a.id}
            to={`/accounts/${a.id}`}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 hover:border-slate-400"
          >
            <div>
              <div className="font-medium">
                {a.type} · <span className="font-mono text-sm text-slate-500">{a.accountNumber}</span>
              </div>
              <div className="text-xs text-slate-400">{a.status}</div>
            </div>
            <div className="text-xl font-semibold">{formatMoney(a.balance, a.currency)}</div>
          </Link>
        ))}
      </div>
    </AppLayout>
  )
}
