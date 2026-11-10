import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AppLayout from '../components/AppLayout'
import { createAccount, listAccounts, type AccountType } from '../lib/accounts'
import { formatMoney } from '../lib/format'
import { apiErrorMessage } from '../lib/errors'
export default function DashboardPage(){
 const qc=useQueryClient(),navigate=useNavigate();const [type,setType]=useState<AccountType>('CHECKING')
 const {data:accounts,isLoading,isError}=useQuery({queryKey:['accounts'],queryFn:listAccounts})
 const open=useMutation({mutationFn:()=>createAccount(type),onSuccess:()=>qc.invalidateQueries({queryKey:['accounts']})})
 const list=accounts??[],total=list.reduce((sum,a)=>sum+Number(a.balance),0)
 return <AppLayout><section className="rounded-2xl bg-slate-950 p-7 text-white"><div className="text-sm text-slate-300">Total balance</div><div className="mt-2 text-4xl font-semibold tracking-tight">{formatMoney(total)}</div><div className="mt-6 flex flex-wrap gap-3"><button onClick={()=>navigate('/transfer')} className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950">Send money</button><button onClick={()=>document.getElementById('account-list')?.scrollIntoView({behavior:'smooth'})} className="rounded-lg border border-white/30 px-4 py-2 text-sm">View accounts</button></div></section>
 <div className="mt-8 flex items-center justify-between"><div><h1 className="text-xl font-semibold">Your accounts</h1><p className="mt-1 text-sm text-slate-500">Manage your accounts and transactions</p></div><div className="flex gap-2"><select value={type} onChange={e=>setType(e.target.value as AccountType)} className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm"><option value="CHECKING">Checking</option><option value="SAVINGS">Savings</option></select><button onClick={()=>open.mutate()} disabled={open.isPending} className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white">Open account</button></div></div>
 {open.isError&&<p className="mt-3 text-sm text-red-600">{apiErrorMessage(open.error)}</p>}
 <div id="account-list" className="mt-4 grid gap-3">{isLoading&&<p>Loading accounts…</p>}{isError&&<p className="text-red-600">Unable to load accounts.</p>}{list.map(a=><Link key={a.id} to={'/accounts/'+a.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-400"><div><div className="font-semibold">{a.type} account</div><div className="mt-1 text-xs text-slate-500">{a.accountNumber} · {a.status}</div></div><div className="text-xl font-semibold">{formatMoney(a.balance,a.currency)}</div></Link>)}</div>
 </AppLayout>
}
