import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import {
  listAdminAccounts,
  listAllUsers,
  listAudit,
  setKyc,
  tellerDeposit,
  type KycStatus,
} from '../lib/admin'
import { formatDateTime, formatMoney } from '../lib/format'
import { apiErrorMessage } from '../lib/errors'

const KYC_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  VERIFIED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
}

export default function AdminPage() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const usersQ = useQuery({ queryKey: ['admin-users'], queryFn: listAllUsers, enabled: user?.role === 'ADMIN' })

  const kycM = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: KycStatus }) => setKyc(userId, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  if (user?.role !== 'ADMIN') {
    return (
      <AppLayout>
        <p className="text-slate-500">Admins only.</p>
      </AppLayout>
    )
  }

  const users = usersQ.data ?? []

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold tracking-tight">Admin · KYC approvals</h1>
      <p className="mt-1 text-sm text-slate-500">Verify or reject customer identity checks.</p>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-6">
        {usersQ.isLoading && <p className="text-slate-500">Loading…</p>}
        {!usersQ.isLoading && users.length === 0 && (
          <p className="text-slate-500">No customers yet.</p>
        )}
        {users.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="pb-2">Customer</th>
                <th className="pb-2">Email</th>
                <th className="pb-2">KYC</th>
                <th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const name = [u.firstName, u.lastName].filter(Boolean).join(' ') || '—'
                const pending = kycM.isPending && kycM.variables?.userId === u.userId
                return (
                  <tr key={u.userId} className="border-t border-slate-100">
                    <td className="py-2">{name}</td>
                    <td className="py-2 text-slate-500">{u.email}</td>
                    <td className="py-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${KYC_STYLES[u.kycStatus]}`}>
                        {u.kycStatus}
                      </span>
                    </td>
                    <td className="py-2 text-right">
                      <span className="inline-flex gap-2">
                        <button
                          onClick={() => kycM.mutate({ userId: u.userId, status: 'VERIFIED' })}
                          disabled={pending || u.kycStatus === 'VERIFIED'}
                          className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-40"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => kycM.mutate({ userId: u.userId, status: 'REJECTED' })}
                          disabled={pending || u.kycStatus === 'REJECTED'}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 disabled:opacity-40"
                        >
                          Reject
                        </button>
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
        {kycM.isError && <p className="mt-3 text-sm text-red-600">Could not update KYC.</p>}
      </section>

      <TellerDeposit />
      <AuditLog />
    </AppLayout>
  )
}

function TellerDeposit() {
  const qc = useQueryClient()
  const { data } = useQuery({ queryKey: ['admin-accounts'], queryFn: listAdminAccounts })
  const [amounts, setAmounts] = useState<Record<string, string>>({})
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)

  const depositM = useMutation({
    mutationFn: ({ number, amount }: { number: string; amount: number }) => tellerDeposit(number, amount),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['admin-accounts'] })
      setAmounts((a) => ({ ...a, [vars.number]: '' }))
      setMsg({ kind: 'ok', text: `Deposited to ${vars.number}` })
    },
    onError: (e) => setMsg({ kind: 'err', text: apiErrorMessage(e) }),
  })

  const accounts = data ?? []

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold">Teller deposit</h2>
      <p className="mt-1 text-sm text-slate-500">Record a cash deposit into a customer's account.</p>
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
                className="rounded-lg bg-green-600 px-3 py-1.5 font-medium text-white hover:bg-green-700 disabled:opacity-50"
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
