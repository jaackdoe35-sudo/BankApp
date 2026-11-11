import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../context/AuthContext'
import { createAccount, listAccounts, type AccountType } from '../lib/accounts'
import { formatMoney } from '../lib/format'
import { apiErrorMessage } from '../lib/errors'
import { useLanguage } from '../lib/i18n'

function AccountMark() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h3"/></svg>
}

export default function DashboardPage() {
  const qc = useQueryClient()
  const { user } = useAuth()
  const { t } = useLanguage()
  const [type, setType] = useState<AccountType>('CHECKING')
  const { data: accounts, isLoading, isError } = useQuery({ queryKey: ['accounts'], queryFn: listAccounts })
  const open = useMutation({ mutationFn: () => createAccount(type), onSuccess: () => qc.invalidateQueries({ queryKey: ['accounts'] }) })
  const list = accounts ?? []
  const total = list.reduce((sum, account) => sum + Number(account.balance), 0)
  const firstName = user?.firstName?.trim() || user?.email?.split('@')[0] || 'there'

  return (
    <AppLayout>
      <div className="page-heading">
        <div>
          <p className="page-eyebrow">{t('position')}</p>
          <h1 className="page-title">{t('welcome')}, {firstName}</h1>
          <p className="page-subtitle">A clear view of your accounts and everyday banking.</p>
        </div>
        <span className="page-meta">Private client · Overview</span>
      </div>

      <div className="overview-grid">
        <section className="wealth-card">
          <div className="wealth-card-top"><span className="wealth-card-label">Relationship overview</span><span className="wealth-card-status">Account overview</span></div>
          <div className="wealth-card-main">
            <p className="wealth-card-caption">{t('balance')}</p>
            <p className="wealth-card-amount">{formatMoney(total)}</p>
            <p className="wealth-card-support">Across {list.length} {list.length === 1 ? 'account' : 'accounts'}</p>
          </div>
          <div className="wealth-card-bottom"><span>Northstar Private · Client portfolio</span><span>USD · Consolidated</span></div>
        </section>

        <section className="service-card">
          <div>
            <p className="service-card-kicker">PERSONAL BANKING</p>
            <h2>At your service.</h2>
            <p>Explore payments, cards and account details in one place.</p>
          </div>
          <div className="service-links">
            <Link className="service-link" to="/transfer"><span>Make a payment</span><span>↗</span></Link>
            <Link className="service-link" to="/cards"><span>Manage your cards</span><span>↗</span></Link>
          </div>
        </section>
      </div>

      <div className="section-heading">
        <div><h2>{t('accounts')}</h2><p>Account details and available balances</p></div>
        <div className="flex items-center gap-2">
          <select aria-label="New account type" value={type} onChange={(e) => setType(e.target.value as AccountType)} className="max-w-32 rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm">
            <option value="CHECKING">Checking</option><option value="SAVINGS">Savings</option>
          </select>
          <button onClick={() => open.mutate()} disabled={open.isPending} className="bank-primary-button">{open.isPending ? 'Opening…' : 'Open account'}</button>
        </div>
      </div>
      {open.isError && <p className="mb-3 text-sm text-red-600">{apiErrorMessage(open.error)}</p>}
      <div id="account-list" className="account-list">
        {isLoading && <p className="py-5 text-sm text-slate-500">Loading accounts…</p>}
        {isError && <p className="py-5 text-sm text-red-600">Unable to load accounts.</p>}
        {list.map((account) => (
          <Link key={account.id} to={'/accounts/' + account.id} className="account-card">
            <span className="account-card-left">
              <span className="account-card-icon"><AccountMark /></span>
              <span><span className="account-card-title">{account.type} account</span><span className="account-card-meta">{account.accountNumber} · {account.status}</span></span>
            </span>
            <span className="flex items-center"><span className="account-card-balance">{formatMoney(account.balance, account.currency)}</span><span className="account-card-arrow">›</span></span>
          </Link>
        ))}
      </div>
    </AppLayout>
  )
}
