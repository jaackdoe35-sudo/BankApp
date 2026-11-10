import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'

type Profile = { userId: string; firstName: string; lastName: string; email: string }
type Account = { id: string; accountNumber: string; type: 'CHECKING' | 'SAVINGS'; balance: number; currency: 'USD'; status: 'ACTIVE' }
type Transaction = { id: string; type: string; description: string; amount: number; createdAt: string }
type Card = { id: string; last4: string; limit: number; status: 'ACTIVE' | 'FROZEN' }
type Loan = { id: string; principal: number; term: number; status: 'PENDING' }
type DemoData = { profile: Profile | null; accounts: Account[]; transactions: Transaction[]; cards: Card[]; loans: Loan[]; notifications: { id: string; title: string; message: string; read: boolean; createdAt: string }[] }

const DATA_KEY = 'bankapp.demo.data.v1'
const SESSION_KEY = 'bankapp.demo.session.v1'
const EVENT_KEY = 'bankapp.experiment.events.v1'
const CHANNEL_NAME = 'bankapp-experiments'
const emptyData: DemoData = { profile: null, accounts: [], transactions: [], cards: [], loans: [], notifications: [] }
const readData = (): DemoData => {
  try { return { ...emptyData, ...JSON.parse(localStorage.getItem(DATA_KEY) || '{}') } }
  catch { return emptyData }
}
const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
const id = () => globalThis.crypto?.randomUUID?.() ?? `demo-${Date.now()}-${Math.random().toString(16).slice(2)}`
const stamp = () => new Date().toISOString()

function emitExperiment(type: string, experimentId: string, snapshot: Record<string, unknown>, extra: Record<string, unknown> = {}) {
  const event = { id: id(), type, experimentId, createdAt: stamp(), snapshot, ...extra }
  try {
    const events = JSON.parse(localStorage.getItem(EVENT_KEY) || '[]') as unknown[]
    events.push(event)
    localStorage.setItem(EVENT_KEY, JSON.stringify(events.slice(-3000)))
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel(CHANNEL_NAME)
      channel.postMessage(event)
      channel.close()
    }
  } catch (error) {
    console.error('Test Ledger event could not be persisted', error)
  }
}

export default function DemoApp() {
  const navigate = useNavigate()
  const location = useLocation()
  const [data, setData] = useState<DemoData>(readData)
  const [signedIn, setSignedIn] = useState(() => localStorage.getItem(SESSION_KEY) === 'active' && Boolean(readData().profile))
  useEffect(() => { localStorage.setItem(DATA_KEY, JSON.stringify(data)) }, [data])
  const profile = data.profile
  const page = location.pathname
  const accountId = page.match(/^\/accounts\/([^/]+)/)?.[1]
  const currentAccount = data.accounts.find(account => account.id === accountId) ?? data.accounts[0]

  function register(values: { firstName: string; lastName: string; email: string }) {
    const account: Account = { id: id(), accountNumber: '•••• 4821', type: 'CHECKING', balance: 5250, currency: 'USD', status: 'ACTIVE' }
    const nextProfile: Profile = { ...values, userId: id() }
    setData({
      ...emptyData,
      profile: nextProfile,
      accounts: [account],
      transactions: [{ id: id(), type: 'DEPOSIT', description: 'Opening demo balance', amount: 5250, createdAt: stamp() }],
      notifications: [{ id: id(), title: 'Welcome to Northstar Bank', message: 'Your fictional demo account is ready to explore.', read: false, createdAt: stamp() }],
    })
    localStorage.setItem(SESSION_KEY, 'active')
    setSignedIn(true)
    navigate('/dashboard')
  }

  function login(email: string) {
    if (!profile || profile.email.toLowerCase() !== email.toLowerCase()) return false
    localStorage.setItem(SESSION_KEY, 'active')
    setSignedIn(true)
    navigate('/dashboard')
    return true
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY)
    setSignedIn(false)
    navigate('/login')
  }

  if (!signedIn || !profile) {
    if (page === '/signup') return <AuthPage mode="signup" onRegister={register} />
    return <AuthPage mode="login" onLogin={login} hasProfile={Boolean(profile)} />
  }

  const navItems = [
    { path: '/dashboard', label: 'Overview', icon: '⌂' },
    { path: currentAccount ? `/accounts/${currentAccount.id}` : '/dashboard', label: 'Withdrawals', icon: '↗' },
    { path: '/transfer', label: 'Transfers', icon: '⇄' },
    { path: '/cards', label: 'Cards', icon: '▤' },
    { path: '/loans', label: 'Loans', icon: '▱' },
    { path: '/notifications', label: 'Activity', icon: '◷' },
    { path: '/profile', label: 'Profile & settings', icon: '◎' },
  ]

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-slate-900">
      <div className="bg-[#10233f] px-4 py-2 text-center text-xs font-medium tracking-wide text-blue-100">
        DEMO ENVIRONMENT · FICTIONAL ACCOUNTS · NO REAL BANKING OR PAYMENTS
      </div>
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/dashboard" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#102c50] text-lg font-bold text-white">N</span>
            <span><span className="block text-base font-bold tracking-tight">Northstar</span><span className="block text-[10px] font-semibold uppercase tracking-[.18em] text-slate-400">Digital banking</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <a href="/test-ledger/" target="_blank" rel="noreferrer" className="hidden rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 sm:inline-flex">Open Test Ledger ↗</a>
            <div className="hidden text-right sm:block"><p className="text-sm font-semibold">{profile.firstName} {profile.lastName}</p><p className="text-xs text-slate-400">{profile.email}</p></div>
            <button onClick={logout} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">Sign out</button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:py-8">
        <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
          <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
            {navItems.map(item => <Link key={item.path + item.label} to={item.path} className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${page === item.path || (item.label === 'Withdrawals' && Boolean(accountId)) ? 'bg-[#eaf0f8] text-[#16385f]' : 'text-slate-500 hover:bg-white hover:text-slate-900'}`}><span className="w-5 text-center text-base">{item.icon}</span>{item.label}</Link>)}
          </nav>
          <div className="mt-8 hidden rounded-2xl border border-blue-100 bg-blue-50/70 p-4 lg:block"><p className="text-xs font-bold uppercase tracking-wider text-blue-800">Testing workspace</p><p className="mt-2 text-xs leading-5 text-blue-900/70">Withdrawal attempts are automatically recorded in the separate Test Ledger on this origin.</p><a href="/test-ledger/" target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs font-bold text-blue-800 underline">View experiment records</a></div>
        </aside>
        <main className="min-w-0">
          {page === '/dashboard' || page === '/' ? <Dashboard data={data} onOpenAccount={() => setData(d => ({ ...d, accounts: [...d.accounts, { id: id(), accountNumber: '•••• ' + String(Math.floor(1000 + Math.random() * 9000)), type: 'SAVINGS', balance: 0, currency: 'USD', status: 'ACTIVE' }] }))} /> :
           accountId ? <WithdrawalPage account={currentAccount} /> :
           page === '/transfer' ? <TransferPage data={data} setData={setData} /> :
           page === '/cards' ? <CardsPage data={data} setData={setData} /> :
           page === '/loans' ? <LoansPage data={data} setData={setData} /> :
           page === '/profile' ? <ProfilePage profile={profile} setData={setData} /> :
           page === '/notifications' ? <NotificationsPage data={data} setData={setData} /> :
           <Dashboard data={data} onOpenAccount={() => setData(d => ({ ...d, accounts: [...d.accounts, { id: id(), accountNumber: '•••• 7314', type: 'SAVINGS', balance: 0, currency: 'USD', status: 'ACTIVE' }] }))} />}
        </main>
      </div>
      <footer className="border-t border-slate-200 bg-white px-4 py-5 text-center text-xs text-slate-400">Northstar Bank is a fictional training application. All balances, accounts and transactions are synthetic.</footer>
    </div>
  )
}

function AuthPage({ mode, onRegister, onLogin, hasProfile }: { mode: 'signup' | 'login'; onRegister?: (v: { firstName: string; lastName: string; email: string }) => void; onLogin?: (email: string) => boolean; hasProfile?: boolean }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [error, setError] = useState('')
  const signup = mode === 'signup'
  function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (signup) {
      if (!form.firstName.trim() || !form.lastName.trim() || !form.email.includes('@') || form.password.length < 8) { setError('Enter your name, a valid email and a password of at least 8 characters.'); return }
      onRegister?.({ firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim() })
    } else {
      if (!form.email.trim() || !form.password) { setError('Enter your registered email and a non-empty demo password.'); return }
      if (!onLogin?.(form.email.trim())) setError('No demo profile matches that email. Create an account first.')
    }
  }
  return <div className="grid min-h-screen bg-white lg:grid-cols-2">
    <div className="hidden flex-col justify-between bg-[#10233f] p-12 text-white lg:flex"><Link to="/login" className="flex items-center gap-3 text-xl font-bold"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10">N</span>Northstar</Link><div className="max-w-lg"><p className="text-xs font-bold uppercase tracking-[.2em] text-blue-200">Banking, made clearer</p><h1 className="mt-5 text-5xl font-semibold leading-tight tracking-tight">Your money. Your view. Your next move.</h1><p className="mt-5 text-lg leading-8 text-blue-100/75">Explore a fictional digital banking experience in a controlled testing environment.</p></div><p className="text-xs text-blue-100/50">Fictional training application · No real funds or payments</p></div>
    <div className="flex items-center justify-center px-5 py-12"><div className="w-full max-w-md">
      <div className="mb-9 lg:hidden"><span className="text-xl font-bold">Northstar</span><p className="mt-1 text-xs text-slate-400">FICTIONAL DIGITAL BANKING</p></div>
      <p className="text-xs font-bold uppercase tracking-[.18em] text-blue-700">{signup ? 'Get started' : 'Customer access'}</p><h1 className="mt-3 text-3xl font-bold tracking-tight">{signup ? 'Create your account' : 'Welcome back'}</h1><p className="mt-2 text-sm text-slate-500">{signup ? 'Set up a fictional customer profile to explore the application.' : 'Sign in to your Northstar demo account.'}</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        {signup && <div className="grid grid-cols-2 gap-3"><Field label="First name" value={form.firstName} onChange={v => setForm(f => ({ ...f, firstName: v }))} /><Field label="Last name" value={form.lastName} onChange={v => setForm(f => ({ ...f, lastName: v }))} /></div>}
        <Field label="Email address" type="email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} />
        <Field label={signup ? 'Demo password (8+ characters)' : 'Demo password'} type="password" value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))} />
        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <button className="w-full rounded-xl bg-[#173b64] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#102c50]">{signup ? 'Create demo account' : 'Sign in'}</button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">{signup ? 'Already registered?' : 'New to Northstar?'} <button onClick={() => navigate(signup ? '/login' : '/signup')} className="font-semibold text-blue-800 hover:underline">{signup ? 'Sign in' : 'Create an account'}</button></p>
      <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">{hasProfile && !signup ? 'Demo authentication is local to this browser. Your profile is synthetic; no password is sent to a server or stored.' : 'Demo mode: account details are stored locally in this browser. No real banking services are connected.'}</div>
    </div></div>
  </div>
}

function Field({ label, value, onChange, type = 'text', ...props }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; placeholder?: string; inputMode?: 'text' | 'numeric' | 'decimal' }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span><input type={type} value={value} onChange={e => onChange(e.target.value)} required {...props} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" /></label>
}

function PageHeading({ eyebrow, title, subtitle, action }: { eyebrow: string; title: string; subtitle: string; action?: ReactNode }) {
  return <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-blue-700">{eyebrow}</p><h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1><p className="mt-2 text-sm text-slate-500">{subtitle}</p></div>{action}</div>
}
function Panel({ children, className = '' }: { children: ReactNode; className?: string }) { return <section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,.03)] sm:p-6 ${className}`}>{children}</section> }
function Dashboard({ data, onOpenAccount }: { data: DemoData; onOpenAccount: () => void }) {
  const total = data.accounts.reduce((sum, a) => sum + a.balance, 0)
  return <><PageHeading eyebrow="Customer overview" title={`Good day, ${data.profile?.firstName ?? 'Customer'}`} subtitle="Here is a summary of your Northstar demo banking activity." action={<button onClick={onOpenAccount} className="rounded-xl bg-[#173b64] px-4 py-2.5 text-sm font-semibold text-white">+ Open account</button>} />
    <div className="grid gap-4 sm:grid-cols-3"><Metric label="Total demo balance" value={money(total)} note="Across all accounts" /><Metric label="Open accounts" value={String(data.accounts.length)} note="Checking and savings" /><Metric label="Recent activity" value={String(data.transactions.length)} note="Recorded transactions" /></div>
    <Panel className="mt-5 overflow-hidden bg-gradient-to-br from-[#10233f] to-[#1e4b78] text-white"><div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-blue-200">Available demo balance</p><p className="mt-3 text-3xl font-bold tracking-tight">{money(total)}</p><p className="mt-2 text-xs text-blue-100/70">Fictional funds · Not redeemable</p></div><span className="rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold">NORTHSTAR</span></div><div className="mt-8 flex flex-wrap gap-2"><Link to={data.accounts[0] ? `/accounts/${data.accounts[0].id}` : '/dashboard'} className="rounded-lg bg-white px-4 py-2 text-xs font-bold text-[#173b64]">Make a withdrawal</Link><Link to="/transfer" className="rounded-lg border border-white/30 px-4 py-2 text-xs font-bold text-white">Send a transfer</Link></div></Panel>
    <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_.8fr]"><Panel><div className="mb-4 flex items-center justify-between"><h2 className="font-bold">Your accounts</h2><span className="text-xs text-slate-400">{data.accounts.length} accounts</span></div><div className="space-y-3">{data.accounts.map(a => <Link key={a.id} to={`/accounts/${a.id}`} className="flex items-center justify-between rounded-xl border border-slate-100 p-4 hover:border-blue-200 hover:bg-blue-50/30"><div><p className="text-sm font-semibold">{a.type === 'CHECKING' ? 'Everyday checking' : 'Personal savings'}</p><p className="mt-1 font-mono text-xs text-slate-400">{a.accountNumber}</p></div><div className="text-right"><p className="font-bold">{money(a.balance)}</p><p className="mt-1 text-[10px] font-semibold uppercase text-emerald-700">Active</p></div></Link>)}</div></Panel><Panel><h2 className="font-bold">Recent activity</h2><div className="mt-4 space-y-4">{data.transactions.slice(0,5).map(t => <div key={t.id} className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold">{t.description}</p><p className="mt-1 text-xs text-slate-400">{new Date(t.createdAt).toLocaleDateString()}</p></div><span className="text-sm font-bold">{money(t.amount)}</span></div>)}{data.transactions.length === 0 && <p className="text-sm text-slate-400">No activity yet.</p>}</div></Panel></div>
  </>
}
function Metric({ label, value, note }: { label: string; value: string; note: string }) { return <Panel><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold tracking-tight">{value}</p><p className="mt-1 text-xs text-slate-400">{note}</p></Panel> }

function WithdrawalPage({ account }: { account?: Account }) {
  const [form, setForm] = useState({ amount: '', codeChecked: false, codeValue: '', bankName: '', accountName: '', accountNumber: '' })
  const [result, setResult] = useState('')
  const [experimentId] = useState(id)
  const snapshot = () => ({ accountId: account?.id ?? '', amount: form.amount, codeChecked: form.codeChecked, codeValue: form.codeValue, bankName: form.bankName, accountName: form.accountName, accountNumber: form.accountNumber, balanceBefore: account?.balance ?? null, balanceAfter: account?.balance ?? null })
  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm(current => ({ ...current, [key]: value }))
    const next = { ...form, [key]: value }
    emitExperiment('withdrawal_input', experimentId, { ...next, accountId: account?.id ?? '', balanceBefore: account?.balance ?? null, balanceAfter: account?.balance ?? null })
  }
  function submit(e: FormEvent) {
    e.preventDefault()
    emitExperiment('withdrawal_submitted', experimentId, snapshot(), { request: { method: 'SIMULATED_POST', path: '/demo/withdrawals', body: snapshot() } })
    const message = 'Withdrawal rejected'
    setResult(message)
    emitExperiment('withdrawal_result', experimentId, snapshot(), { outcome: 'blocked', response: message, backendVerified: false })
  }
  return <><PageHeading eyebrow="Withdrawal centre" title="Withdraw funds" subtitle="Submit a withdrawal request to a fictional external bank account." />
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]"><Panel><div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4"><div><p className="text-sm font-bold">From account</p><p className="mt-1 text-xs text-slate-400">{account?.type ?? 'Checking'} · {account?.accountNumber ?? '•••• 4821'}</p></div><div className="text-right"><p className="text-xs text-slate-400">Available demo balance</p><p className="mt-1 text-lg font-bold">{money(account?.balance ?? 5250)}</p></div></div>
      <form onSubmit={submit} className="space-y-5"><div><p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">01 · Withdrawal amount</p><Field label="Amount (USD)" type="number" value={form.amount} onChange={v => update('amount',v)} placeholder="0.00" inputMode="decimal" required /></div>
        <div><p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">02 · Verification</p><label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4"><input type="checkbox" checked={form.codeChecked} onChange={e => update('codeChecked',e.target.checked)} className="h-4 w-4 accent-[#173b64]" /><span><span className="block text-sm font-semibold">Enter a Code</span><span className="mt-0.5 block text-xs text-slate-400">Select this option to reveal the code field.</span></span></label>
          {form.codeChecked && <div className="mt-3"><Field label="Verification code" value={form.codeValue} onChange={v => update('codeValue',v)} placeholder="Enter your synthetic test code" required /></div>}
        </div>
        <div><p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">03 · Destination bank details</p><div className="grid gap-4 sm:grid-cols-2"><Field label="Bank name" value={form.bankName} onChange={v => update('bankName',v)} placeholder="Fictional Test Bank" required /><Field label="Account name" value={form.accountName} onChange={v => update('accountName',v)} placeholder="Name on account" required /><div className="sm:col-span-2"><Field label="Account number" value={form.accountNumber} onChange={v => update('accountNumber',v)} placeholder="Synthetic account number" inputMode="numeric" required /></div></div></div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">Controlled test environment. Use synthetic codes and fictional bank details only. No external bank or payment network is contacted.</div>
        <button type="submit" className="w-full rounded-xl bg-[#173b64] px-5 py-3 text-sm font-bold text-white hover:bg-[#102c50]">Submit withdrawal request</button>
        {result && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4"><p className="font-bold text-red-800">{result}</p><p className="mt-1 text-xs text-red-700">Baseline frontend response · No backend request was made · No balance was changed</p></div>}
      </form>
    </Panel><div className="space-y-4"><Panel><p className="text-sm font-bold">Withdrawal status</p><div className="mt-3 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-500"></span><span className="text-sm text-slate-600">Requests are simulated</span></div><p className="mt-3 text-xs leading-5 text-slate-400">The baseline response is intentionally rejected. This stage tests client-side behavior only.</p></Panel><Panel><p className="text-sm font-bold">Experiment capture</p><p className="mt-2 text-xs leading-5 text-slate-500">Form changes, checkbox state, code entry, bank details, submitted request and visible result are sent to Test Ledger automatically.</p><a href="/test-ledger/" target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs font-bold text-blue-800 underline">Open Test Ledger ↗</a><p className="mt-3 break-all font-mono text-[10px] text-slate-400">Experiment: {experimentId}</p></Panel></div></div>
  </>
}

function TransferPage({ data, setData }: { data: DemoData; setData: React.Dispatch<React.SetStateAction<DemoData>> }) {
  const [amount,setAmount] = useState(''); const [destination,setDestination] = useState(''); const [message,setMessage] = useState('')
  function submit(e: FormEvent) { e.preventDefault(); if(Number(amount)<=0 || !destination.trim()) return; setMessage('Demo transfer recorded. No external payment was made.'); setData(d => ({ ...d, transactions: [{ id:id(), type:'TRANSFER', description:`Demo transfer to ${destination}`, amount:Number(amount), createdAt:stamp() },...d.transactions] })); setAmount(''); setDestination('') }
  return <><PageHeading eyebrow="Payments" title="Send money" subtitle="Explore a simulated transfer workflow."/><Panel><form onSubmit={submit} className="max-w-xl space-y-4"><label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600">From account</span><select className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm">{data.accounts.map(a=><option key={a.id}>{a.type} · {a.accountNumber} · {money(a.balance)}</option>)}</select></label><Field label="Recipient account (synthetic)" value={destination} onChange={setDestination} placeholder="Synthetic account number" required/><Field label="Amount (USD)" type="number" value={amount} onChange={setAmount} placeholder="0.00" required/><button className="rounded-xl bg-[#173b64] px-5 py-3 text-sm font-semibold text-white">Review demo transfer</button>{message&&<p role="status" className="text-sm text-emerald-700">{message}</p>}</form></Panel></>
}
function CardsPage({ data, setData }: { data: DemoData; setData: React.Dispatch<React.SetStateAction<DemoData>> }) {
  function issue(){setData(d=>({...d,cards:[...d.cards,{id:id(),last4:String(Math.floor(1000+Math.random()*9000)),limit:1000,status:'ACTIVE'}]}))}
  return <><PageHeading eyebrow="Cards" title="Your cards" subtitle="Manage fictional virtual cards in this demo environment." action={<button onClick={issue} className="rounded-xl bg-[#173b64] px-4 py-2.5 text-sm font-semibold text-white">+ Issue virtual card</button>}/><div className="grid gap-4 md:grid-cols-2">{data.cards.map(card=><Panel key={card.id}><div className="rounded-xl bg-gradient-to-br from-[#10233f] to-[#28608c] p-5 text-white"><div className="flex justify-between text-xs"><b>NORTHSTAR</b><span>VIRTUAL</span></div><p className="mt-9 font-mono text-xl tracking-[.18em]">•••• •••• •••• {card.last4}</p><div className="mt-5 flex justify-between text-xs text-blue-100"><span>DEMO CUSTOMER</span><span>VISA</span></div></div><div className="mt-4 flex items-center justify-between"><span className="text-sm font-semibold">{card.status}</span><button onClick={()=>setData(d=>({...d,cards:d.cards.map(c=>c.id===card.id?{...c,status:c.status==='ACTIVE'?'FROZEN':'ACTIVE'}:c)}))} className="text-xs font-bold text-blue-800">{card.status==='ACTIVE'?'Freeze card':'Unfreeze card'}</button></div></Panel>)}</div>{!data.cards.length&&<Panel><p className="text-sm text-slate-500">No virtual cards have been issued.</p></Panel>}</>
}
function LoansPage({ data, setData }: { data: DemoData; setData: React.Dispatch<React.SetStateAction<DemoData>> }) {
  const [amount,setAmount]=useState(''); const [term,setTerm]=useState('12')
  function apply(e:FormEvent){e.preventDefault();if(Number(amount)<=0)return;setData(d=>({...d,loans:[{id:id(),principal:Number(amount),term:Number(term),status:'PENDING'},...d.loans]}));setAmount('')}
  return <><PageHeading eyebrow="Credit" title="Loans" subtitle="Review a fictional loan application and its status."/><Panel><h2 className="font-bold">Apply for a demo loan</h2><form onSubmit={apply} className="mt-4 grid gap-4 sm:grid-cols-3"><Field label="Requested amount (USD)" type="number" value={amount} onChange={setAmount} placeholder="0.00" required/><label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600">Repayment term</span><select value={term} onChange={e=>setTerm(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"><option value="6">6 months</option><option value="12">12 months</option><option value="24">24 months</option><option value="36">36 months</option></select></label><div className="flex items-end"><button className="w-full rounded-xl bg-[#173b64] px-4 py-3 text-sm font-semibold text-white">Submit demo application</button></div></form></Panel><div className="mt-4 space-y-3">{data.loans.map(loan=><Panel key={loan.id}><div className="flex items-center justify-between"><div><p className="font-bold">{money(loan.principal)}</p><p className="mt-1 text-xs text-slate-400">{loan.term} month term</p></div><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">{loan.status}</span></div></Panel>)}</div>{!data.loans.length&&<p className="mt-4 text-sm text-slate-400">No loan applications yet.</p>}</>
}
function ProfilePage({ profile, setData }: { profile: Profile; setData: React.Dispatch<React.SetStateAction<DemoData>> }) {
  const [firstName,setFirst]=useState(profile.firstName);const [lastName,setLast]=useState(profile.lastName);const [saved,setSaved]=useState(false)
  function save(e:FormEvent){e.preventDefault();setData(d=>({...d,profile:d.profile?{...d.profile,firstName,lastName}:null}));setSaved(true)}
  return <><PageHeading eyebrow="Personal details" title="Profile & settings" subtitle="Manage the synthetic customer profile for this browser."/><Panel><form onSubmit={save} className="max-w-xl space-y-4"><div className="grid gap-4 sm:grid-cols-2"><Field label="First name" value={firstName} onChange={setFirst}/><Field label="Last name" value={lastName} onChange={setLast}/></div><Field label="Email address" value={profile.email} onChange={()=>{}}/><button className="rounded-xl bg-[#173b64] px-5 py-3 text-sm font-semibold text-white">Save profile</button>{saved&&<p className="text-sm text-emerald-700">Profile updated locally.</p>}</form></Panel><Panel className="mt-4"><h2 className="font-bold">Privacy and demo data</h2><p className="mt-2 text-sm leading-6 text-slate-500">This application stores synthetic profile and account data in this browser only. Do not enter real banking credentials, card numbers or personal financial information.</p></Panel></>
}
function NotificationsPage({ data, setData }: { data: DemoData; setData: React.Dispatch<React.SetStateAction<DemoData>> }) {
  return <><PageHeading eyebrow="Updates" title="Activity & notifications" subtitle="Messages associated with your fictional account." action={<button onClick={()=>setData(d=>({...d,notifications:d.notifications.map(n=>({...n,read:true}))}))} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold">Mark all read</button>}/><div className="space-y-3">{data.notifications.map(n=><Panel key={n.id} className={n.read?'':'border-blue-200 bg-blue-50/30'}><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{n.title}</p><p className="mt-1 text-sm text-slate-600">{n.message}</p><p className="mt-2 text-xs text-slate-400">{new Date(n.createdAt).toLocaleString()}</p></div>{!n.read&&<button onClick={()=>setData(d=>({...d,notifications:d.notifications.map(x=>x.id===n.id?{...x,read:true}:x)}))} className="text-xs font-bold text-blue-800">Mark read</button>}</div></Panel>)}</div>{!data.notifications.length&&<Panel><p className="text-sm text-slate-500">You're all caught up.</p></Panel>}</>
}
