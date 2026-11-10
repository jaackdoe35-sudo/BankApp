import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { unreadCount } from '../lib/notifications'

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const { data: unread = 0 } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: unreadCount,
    refetchInterval: 15_000,
  })

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      className={`text-sm ${
        pathname === to ? 'font-semibold text-slate-900' : 'text-slate-500 hover:text-slate-900'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-semibold">
              🏦 Banking System
            </Link>
            {navLink('/', 'Dashboard')}
            {navLink('/transfer', 'Transfer')}
            {navLink('/cards', 'Cards')}
            {navLink('/loans', 'Loans')}
            {navLink('/profile', 'Profile')}
            {user?.role === 'ADMIN' && navLink('/admin', 'Admin')}
          </div>
          <div className="flex items-center gap-3">
            <Link to="/notifications" className="relative text-lg" title="Notifications">
              🔔
              {unread > 0 && (
                <span className="absolute -right-2 -top-1 rounded-full bg-red-600 px-1.5 text-[10px] font-semibold text-white">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </Link>
            <span className="text-sm text-slate-500">{user?.email}</span>
            <button
              onClick={logout}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
    </div>
  )
}
