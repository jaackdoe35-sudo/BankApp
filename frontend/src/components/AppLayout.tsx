import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { unreadCount } from '../lib/notifications'
import { useLanguage } from '../lib/i18n'
import LanguagePicker from './LanguagePicker'

type IconName = 'overview' | 'payments' | 'cards' | 'loans' | 'profile' | 'activity'
function NavIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    overview: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    payments: <><path d="M4 12h15"/><path d="m13 6 6 6-6 6"/><path d="M5 5v14"/></>,
    cards: <><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M3 10h18"/></>,
    loans: <><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/></>,
    profile: <><circle cx="12" cy="8" r="3.5"/><path d="M4 21c.7-4 3.4-6 8-6s7.3 2 8 6"/></>,
    activity: <><path d="M3 12h4l3-8 4 16 3-8h4"/></>,
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const { pathname } = useLocation()
  const { data: unread = 0 } = useQuery({ queryKey: ['notifications', 'unread-count'], queryFn: unreadCount, refetchInterval: 15000 })
  const links: { to: string; label: string; icon: IconName }[] = [
    { to: '/', label: t('overview'), icon: 'overview' },
    { to: '/transfer', label: t('payments'), icon: 'payments' },
    { to: '/cards', label: t('cards'), icon: 'cards' },
    { to: '/loans', label: t('loans'), icon: 'loans' },
    { to: '/profile', label: t('profile'), icon: 'profile' },
    { to: '/notifications', label: t('activity'), icon: 'activity' },
  ]
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email || 'Private client'
  const initials = fullName.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'N'

  return (
    <div className="bank-shell">
      <aside className="bank-sidebar">
        <Link to="/" className="bank-brand" aria-label="Northstar Private home">
          <span className="bank-brand-mark">N</span>
          <span><span className="bank-brand-name">Northstar</span><span className="bank-brand-caption">PRIVATE BANKING</span></span>
        </Link>
        <div className="bank-sidebar-rule" />
        <p className="bank-nav-caption">YOUR FINANCES</p>
        <nav className="bank-nav" aria-label="Primary navigation">
          {links.map(({ to, label, icon }) => {
            const active = to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(to + '/')
            return (
              <Link key={to} to={to} aria-current={active ? 'page' : undefined} className={'bank-nav-link' + (active ? ' is-active' : '')}>
                <span className="bank-nav-icon"><NavIcon name={icon} /></span>
                <span>{label}</span>
                {to === '/notifications' && unread > 0 && <span className="bank-nav-count">{unread}</span>}
              </Link>
            )
          })}
          {user?.role === 'ADMIN' && <Link to="/admin" aria-current={pathname === '/admin' ? 'page' : undefined} className={'bank-nav-link' + (pathname === '/admin' ? ' is-active' : '')}><span className="bank-nav-icon"><NavIcon name="profile" /></span><span>Administration</span></Link>}
        </nav>
        <div className="bank-sidebar-bottom">
          <div className="bank-secure-state"><span className="bank-secure-dot" />Demo session</div>
          <div className="bank-user-row">
            <span className="bank-avatar">{initials}</span>
            <span className="bank-user-copy"><strong>{fullName}</strong><span>Private client</span></span>
          </div>
          <button className="bank-signout" onClick={logout}>{t('signOut')}</button>
        </div>
      </aside>
      <div className="bank-main">
        <header className="bank-topbar">
          <div className="bank-topbar-left"><span className="bank-topbar-kicker">PRIVATE CLIENT PORTAL</span><span className="bank-topbar-divider" /><span>Digital banking</span></div>
          <div className="bank-topbar-right">
            <LanguagePicker className="language-picker flex items-center gap-2 text-xs text-slate-600" />
            <Link to="/notifications" className="bank-activity-link"><NavIcon name="activity" />Activity{unread > 0 && <span className="bank-nav-count">{unread}</span>}</Link>
            <span className="bank-topbar-secure"><span />Demo environment</span>
            <button className="bank-signout mobile-signout" onClick={logout}>Sign out</button>
          </div>
        </header>
        <main className="bank-content">{children}</main>
        <footer className="bank-footer"><span>© Northstar Private Banking</span></footer>
      </div>
    </div>
  )
}
