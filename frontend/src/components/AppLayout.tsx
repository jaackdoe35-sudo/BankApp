import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { unreadCount } from '../lib/notifications'
export default function AppLayout({children}:{children:ReactNode}){
 const {user,logout}=useAuth(),{pathname}=useLocation();const {data:unread=0}=useQuery({queryKey:['notifications','unread-count'],queryFn:unreadCount,refetchInterval:15000})
 const links=[['/','Overview'],['/transfer','Transfers'],['/cards','Cards'],['/loans','Loans'],['/profile','Profile']]
 return <div className="min-h-screen bg-[#f5f6f8] text-slate-900"><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4"><Link to="/" className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-sm font-bold text-white">N</span><span className="text-lg font-semibold tracking-tight">Northstar <span className="font-normal text-slate-400">Private</span></span></Link><nav className="flex flex-wrap items-center gap-5">{links.map(([to,label])=><Link key={to} to={to} className={'text-sm '+(pathname===to?'font-semibold text-slate-950':'text-slate-500 hover:text-slate-950')}>{label}</Link>)}{user?.role==='ADMIN'&&<Link to="/admin" className="text-sm">Admin</Link>}</nav><div className="flex items-center gap-3"><Link to="/notifications" className="relative text-sm text-slate-600">Activity{unread>0&&<span className="ml-1 rounded-full bg-red-600 px-1.5 text-xs text-white">{unread}</span>}</Link><span className="hidden text-sm text-slate-500 sm:block">{user?.email}</span><button onClick={logout} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold">Sign out</button></div></div></header><main className="mx-auto max-w-6xl px-5 py-8">{children}</main></div>
}
