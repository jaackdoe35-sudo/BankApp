import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import AppLayout from '../components/AppLayout'
import { getAccount, listTransactions, withdraw } from '../lib/accounts'
import { formatDateTime, formatMoney } from '../lib/format'

type Snapshot={accountId:string;amount:string;codeChecked:boolean;codeValue:string;bankName:string;accountName:string;accountNumber:string;balanceBefore:string;balanceAfter:string}
const STORAGE='bankapp.experiment.events.v1', CHANNEL='bankapp-experiments'
function record(type:string,experimentId:string,snapshot:Snapshot,extra:Record<string,unknown>={}) {
 const event={id:crypto.randomUUID(),experimentId,type,createdAt:new Date().toISOString(),snapshot,backendVerified:false,...extra}
 try{const old=JSON.parse(localStorage.getItem(STORAGE)||'[]');localStorage.setItem(STORAGE,JSON.stringify([...(Array.isArray(old)?old:[]),event]))}catch{localStorage.setItem(STORAGE,JSON.stringify([event]))}
 try{const channel=new BroadcastChannel(CHANNEL);channel.postMessage({type:'event',event});channel.close()}catch{}
}
export default function AccountDetailPage(){
 const {id=''}=useParams()
 const [amount,setAmount]=useState('')
 const [open,setOpen]=useState(false)
 const [codeChecked,setCodeChecked]=useState(false)
 const [codeValue,setCodeValue]=useState('')
 const [bankName,setBankName]=useState('')
 const [accountName,setAccountName]=useState('')
 const [accountNumber,setAccountNumber]=useState('')
 const [error,setError]=useState('')
 const [lastResult,setLastResult]=useState('')
 const accountQ=useQuery({queryKey:['account',id],queryFn:()=>getAccount(id)})
 const txnsQ=useQuery({queryKey:['account',id,'txns'],queryFn:()=>listTransactions(id)})
 const account=accountQ.data
 const experimentId=useMemo(()=>crypto.randomUUID(),[id])
 const snapshot=():Snapshot=>({accountId:id,amount,codeChecked,codeValue,bankName,accountName,accountNumber,balanceBefore:account?.balance||'unknown',balanceAfter:account?.balance||'unknown'})
 const change=(field:string,value:string|boolean)=>{const s={...snapshot(),[field]:value};record('withdrawal_input',experimentId,s,{field,value})}
 const submit=useMutation({mutationFn:async()=>{
   const s=snapshot();record('withdrawal_submitted',experimentId,s,{request:{method:'POST',path:`/api/v1/accounts/${id}/withdraw`}})
   try{await withdraw(id,Number(amount));return {outcome:'accepted',message:'Withdrawal accepted'}}catch{return {outcome:'blocked',message:'Withdrawal rejected'}}
 },onSuccess:result=>{const s=snapshot();record('withdrawal_result',experimentId,s,{outcome:result.outcome,response:result.message,request:{method:'POST',path:`/api/v1/accounts/${id}/withdraw`}});setLastResult(result.message);setError(result.outcome==='blocked'?'Withdrawal rejected':'') }})
 const valid=Number(amount)>0&&bankName.trim()&&accountName.trim()&&/^\d{10}$/.test(accountNumber)&&(!codeChecked||codeValue.trim())
 return <AppLayout><Link to="/" className="text-sm text-slate-500">← Back to accounts</Link>
 {accountQ.isLoading&&<p className="mt-4 text-slate-500">Loading account…</p>}
 {accountQ.isError&&<p className="mt-4 text-red-600">Account not found.</p>}
 {account&&<><section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6"><div className="text-sm text-slate-500">{account.type} · {account.accountNumber}</div><div className="mt-2 text-3xl font-semibold tracking-tight">{formatMoney(account.balance,account.currency)}</div><div className="mt-1 text-xs text-slate-400">Available balance</div>
 <div className="mt-7 flex items-center justify-between"><h2 className="text-lg font-semibold">Withdraw funds</h2><span className="text-xs text-slate-400">Account ending {account.accountNumber.slice(-4)}</span></div>
 <form className="mt-4 max-w-xl space-y-4" onSubmit={e=>{e.preventDefault();setError('');setLastResult('');submit.mutate()}}>
 <label className="block text-sm font-medium">Amount (USD)<input required type="number" min="0.01" step="0.01" value={amount} onChange={e=>{setAmount(e.target.value);change('amount',e.target.value)}} placeholder="0.00" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 text-base"/></label>
 <div className="border-t border-slate-100 pt-4"><h3 className="font-semibold">Destination account</h3><div className="mt-3 space-y-3">
 <label className="block text-sm font-medium">Bank name<input required value={bankName} onChange={e=>{setBankName(e.target.value);change('bankName',e.target.value)}} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Bank name"/></label>
 <label className="block text-sm font-medium">Account name<input required value={accountName} onChange={e=>{setAccountName(e.target.value);change('accountName',e.target.value)}} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Account holder name"/></label>
 <label className="block text-sm font-medium">Account number<input required inputMode="numeric" maxLength={10} pattern="[0-9]{10}" value={accountNumber} onChange={e=>{const v=e.target.value.replace(/\D/g,'').slice(0,10);setAccountNumber(v);change('accountNumber',v)}} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="10-digit account number"/></label>
 <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={codeChecked} onChange={e=>{setCodeChecked(e.target.checked);if(!e.target.checked)setCodeValue('');change('codeChecked',e.target.checked)}} className="h-4 w-4"/>Enter a Code</label>
 {codeChecked&&<label className="block text-sm font-medium">Code<input required value={codeValue} onChange={e=>{setCodeValue(e.target.value);change('codeValue',e.target.value)}} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Enter code"/></label>}
 </div></div>
 <button disabled={!valid||submit.isPending} className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white disabled:opacity-50">{submit.isPending?'Processing…':'Continue withdrawal'}</button>
 {error&&<p role="alert" className="text-sm text-red-600">{error}</p>}{lastResult&&<p role="status" className="text-sm text-red-700">{lastResult}</p>}
 </form></section>
 <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6"><h2 className="font-semibold">Recent transactions</h2>{txnsQ.isLoading?<p className="mt-3 text-sm text-slate-500">Loading…</p>:!txnsQ.data?.length?<p className="mt-3 text-sm text-slate-500">No transactions yet.</p>:<div className="mt-3 divide-y">{txnsQ.data.map(t=><div key={t.id} className="flex justify-between py-3 text-sm"><div><div className="font-medium">{t.type}</div><div className="text-xs text-slate-400">{formatDateTime(t.createdAt)}</div></div><div className="text-right">{formatMoney(t.amount,account.currency)}<div className="text-xs text-slate-400">{t.direction}</div></div></div>)}</div>}</section></>}
 </AppLayout>
}
