import type { AxiosAdapter, AxiosResponse } from 'axios'

type Account = { id: string; accountNumber: string; type: 'CHECKING' | 'SAVINGS'; currency: string; balance: string; status: 'ACTIVE'; createdAt: string }
type LocalCard = { id: string; accountId: string; last4: string; brand: string; expMonth: number; expYear: number; status: 'ACTIVE' | 'FROZEN' | 'CANCELLED'; monthlyLimit: string; createdAt: string }
type LocalLoan = { id: string; accountId: string; principal: string; annualRate: string; termMonths: number; status: 'PENDING' | 'REJECTED' | 'ACTIVE' | 'PAID_OFF'; outstanding: string; nextDueDate: string | null; createdAt: string }
type LocalBeneficiary = { id: string; nickname: string; accountNumber: string; createdAt: string }
type LocalNotification = { id: string; type: string; title: string; message: string; read: boolean; createdAt: string }
type LocalAudit = { id: string; actorUserId: string | null; action: string; entityType: string; entityId: string | null; message: string; createdAt: string }

const ACCOUNT_KEY = 'northstar.local-simulation.v1'
const PROFILE_KEY = 'northstar.profile.v1'
const STORE_KEY = 'northstar.local-simulation.data.v1'
const now = () => new Date().toISOString()
const id = (prefix: string) => `${prefix}-${crypto.randomUUID()}`
const money = (value: number) => value.toFixed(2)
function readStore<T>(key: string, fallback: T): T {
  try { const value = JSON.parse(localStorage.getItem(key) || 'null'); return value == null ? fallback : value as T } catch { return fallback }
}
function readData(): any { return readStore(STORE_KEY, { cards: [], loans: [], beneficiaries: [], notifications: [], audit: [], schedules: {} }) }
function writeData(data: any) { localStorage.setItem(STORE_KEY, JSON.stringify(data)) }
function updateData(fn: (data: any) => void) { const data = readData(); fn(data); writeData(data); return data }
function readAccounts(): Account[] {
  try { const x = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || '{}'); if (Array.isArray(x.accounts) && x.accounts.length) return x.accounts } catch {}
  const accounts: Account[] = [{ id: 'acct-northstar-001', accountNumber: '•••• 4821', type: 'CHECKING', currency: 'USD', balance: '1500000.00', status: 'ACTIVE', createdAt: now() }]
  writeAccounts(accounts)
  return accounts
}
function writeAccounts(accounts: Account[]) { localStorage.setItem(ACCOUNT_KEY, JSON.stringify({ accounts })) }
function profile() {
  try { const p = JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null'); if (p) return p } catch {}
  return { userId: 'customer-northstar-001', email: localStorage.getItem('northstar.email') || 'customer@example.com', role: 'CUSTOMER', firstName: 'Alex', lastName: 'Morgan', dateOfBirth: null, phone: null, addressLine1: null, city: null, country: null, kycStatus: 'VERIFIED' }
}
function addNotification(type: string, title: string, message: string) {
  updateData((data) => data.notifications.unshift({ id: id('notification'), type, title, message, read: false, createdAt: now() } satisfies LocalNotification))
}
function addAudit(action: string, entityType: string, entityId: string | null, message: string) {
  updateData((data) => data.audit.unshift({ id: id('audit'), actorUserId: profile().userId, action, entityType, entityId, message, createdAt: now() } satisfies LocalAudit))
}
function res(config: any, data: any, status = 200): AxiosResponse {
  return { data, status, statusText: 'OK', headers: {}, config }
}
function error(config: any, message: string, status = 400) {
  const e: any = new Error(message)
  e.config = config
  e.response = { data: { message }, status, statusText: 'Error', headers: {}, config }
  return Promise.reject(e)
}
function loanSchedule(loan: LocalLoan) {
  const principal = Number(loan.principal), rate = Number(loan.annualRate) / 12, n = loan.termMonths
  const payment = rate === 0 ? principal / n : principal * rate / (1 - Math.pow(1 + rate, -n))
  let balance = Number(loan.outstanding)
  return Array.from({ length: n }, (_, index) => {
    const interest = balance * rate
    const principalDue = Math.min(balance, payment - interest)
    balance = Math.max(0, balance - principalDue)
    const due = new Date(loan.createdAt); due.setMonth(due.getMonth() + index + 1)
    return { seq: index + 1, dueDate: due.toISOString().slice(0, 10), principalDue: money(principalDue), interestDue: money(interest), totalDue: money(principalDue + interest), status: index === 0 && loan.status === 'PAID_OFF' ? 'PAID' : 'PENDING' }
  })
}
export const localSimulationAdapter: AxiosAdapter = async (config) => {
  const method = (config.method || 'get').toLowerCase()
  const path = (config.url || '').split('?')[0]
  const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {})
  const ok = (data: any) => Promise.resolve(res(config, data))
  const accounts = () => readAccounts()
  const findAccount = (accountId: string) => accounts().find((a) => a.id === accountId)

  if (path.endsWith('/auth/login') && method === 'post') {
    if (!body.email || !body.password) return error(config, 'Enter your email and password', 401)
    localStorage.setItem('northstar.email', body.email)
    return ok({ accessToken: 'local-access', refreshToken: 'local-refresh', tokenType: 'Bearer', expiresInSeconds: 86400 })
  }
  if (path.endsWith('/auth/register') && method === 'post') {
    localStorage.setItem('northstar.email', body.email)
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...profile(), email: body.email, firstName: body.firstName, lastName: body.lastName }))
    return ok({ accessToken: 'local-access', refreshToken: 'local-refresh', tokenType: 'Bearer', expiresInSeconds: 86400 })
  }
  if (path.endsWith('/auth/refresh')) return ok({ accessToken: 'local-access', refreshToken: 'local-refresh', tokenType: 'Bearer', expiresInSeconds: 86400 })
  if (path.endsWith('/auth/logout')) return ok({})
  if (path.endsWith('/users/me') && method === 'get') return ok(profile())
  if (path.endsWith('/users/me/profile') && method === 'put') {
    const p = { ...profile(), ...body }; localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); return ok(p)
  }

  if (path === '/api/v1/accounts' && method === 'get') return ok(accounts())
  if (path === '/api/v1/accounts' && method === 'post') {
    const item: Account = { id: id('acct'), accountNumber: '•••• ' + String(Math.floor(1000 + Math.random() * 9000)), type: body.type || 'CHECKING', currency: 'USD', balance: '0.00', status: 'ACTIVE', createdAt: now() }
    writeAccounts([...accounts(), item]); addNotification('ACCOUNT', 'Account opened', `Your new ${item.type.toLowerCase()} account is ready.`)
    return ok(item)
  }
  const accountMatch = path.match(/^\/api\/v1\/accounts\/([^/]+)(?:\/(transactions|withdraw))?$/)
  if (accountMatch) {
    const account = findAccount(accountMatch[1])
    if (!account) return error(config, 'Account not found', 404)
    if (accountMatch[2] === 'transactions' && method === 'get') return ok([])
    if (accountMatch[2] === 'withdraw' && method === 'post') return error(config, 'withdrawal rejected', 400)
    if (!accountMatch[2] && method === 'get') return ok(account)
  }

  const data = readData()
  if (path === '/api/v1/beneficiaries' && method === 'get') return ok(data.beneficiaries)
  if (path === '/api/v1/beneficiaries' && method === 'post') {
    if (!String(body.nickname || '').trim() || !/^\d{6,20}$/.test(String(body.accountNumber || ''))) return error(config, 'Enter a nickname and a valid account number')
    if (data.beneficiaries.some((b: LocalBeneficiary) => b.accountNumber === body.accountNumber)) return error(config, 'That payee is already saved')
    const item: LocalBeneficiary = { id: id('payee'), nickname: String(body.nickname).trim(), accountNumber: String(body.accountNumber), createdAt: now() }
    data.beneficiaries.unshift(item); writeData(data); addNotification('PAYEE', 'Payee saved', `${item.nickname} was added to your saved payees.`)
    return ok(item, 201)
  }
  const beneficiaryMatch = path.match(/^\/api\/v1\/beneficiaries\/([^/]+)$/)
  if (beneficiaryMatch && method === 'delete') {
    const before = data.beneficiaries.length
    data.beneficiaries = data.beneficiaries.filter((b: LocalBeneficiary) => b.id !== beneficiaryMatch[1])
    if (before === data.beneficiaries.length) return error(config, 'Saved payee not found', 404)
    writeData(data); return ok({})
  }

  if (path === '/api/v1/transfers' && method === 'post') {
    if (!findAccount(body.sourceAccountId)) return error(config, 'Choose a valid sending account')
    if (!/^\d{6,20}$/.test(String(body.destinationAccountNumber || ''))) return error(config, 'Enter a valid destination account number')
    if (!(Number(body.amount) > 0)) return error(config, 'Enter a valid payment amount')
    const result = { reference: 'SIM-' + crypto.randomUUID().slice(0, 8).toUpperCase(), sourceAccountId: body.sourceAccountId, destinationAccountNumber: body.destinationAccountNumber, amount: money(Number(body.amount)), sourceBalanceAfter: findAccount(body.sourceAccountId)!.balance, status: 'SIMULATED_NOT_POSTED', createdAt: now() }
    addAudit('PAYMENT_SIMULATED', 'TRANSFER', result.reference, `Payment request for ${result.amount} was simulated; no funds moved.`)
    addNotification('PAYMENT', 'Payment simulation complete', 'The payment request was recorded for this prototype. No funds were moved.')
    return ok(result)
  }

  if (path === '/api/v1/cards' && method === 'get') return ok(data.cards)
  if (path === '/api/v1/cards' && method === 'post') {
    if (!findAccount(body.accountId)) return error(config, 'Choose a valid account')
    if (Number(body.monthlyLimit) < 0) return error(config, 'Monthly limit cannot be negative')
    const number = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('')
    const card: LocalCard = { id: id('card'), accountId: body.accountId, last4: number.slice(-4), brand: 'VISA', expMonth: new Date().getMonth() + 1, expYear: new Date().getFullYear() + 4, status: 'ACTIVE', monthlyLimit: money(Number(body.monthlyLimit) || 0), createdAt: now() }
    data.cards.unshift(card); writeData(data); addNotification('CARD', 'Virtual card issued', `A virtual card ending ${card.last4} was issued in simulation.`)
    return ok({ card, cardNumber: number }, 201)
  }
  const cardMatch = path.match(/^\/api\/v1\/cards\/([^/]+)(?:\/(freeze|unfreeze|cancel|pay))?$/)
  if (cardMatch) {
    const card = data.cards.find((c: LocalCard) => c.id === cardMatch[1]) as LocalCard | undefined
    if (!card) return error(config, 'Card not found', 404)
    const action = cardMatch[2]
    if (action === 'freeze' && method === 'post') { card.status = 'FROZEN'; writeData(data); addAudit('CARD_FROZEN', 'CARD', card.id, `Card ending ${card.last4} frozen.`); return ok(card) }
    if (action === 'unfreeze' && method === 'post') { card.status = 'ACTIVE'; writeData(data); addAudit('CARD_UNFROZEN', 'CARD', card.id, `Card ending ${card.last4} reactivated.`); return ok(card) }
    if (action === 'cancel' && method === 'post') { card.status = 'CANCELLED'; writeData(data); addAudit('CARD_CANCELLED', 'CARD', card.id, `Card ending ${card.last4} cancelled.`); return ok(card) }
    if (action === 'pay' && method === 'post') {
      if (card.status !== 'ACTIVE') return error(config, 'This card is not active')
      if (!String(body.merchant || '').trim() || !(Number(body.amount) > 0)) return error(config, 'Enter a merchant and a valid amount')
      const account = findAccount(card.accountId)
      const result = { reference: 'SIM-' + crypto.randomUUID().slice(0, 8).toUpperCase(), merchant: body.merchant, amount: money(Number(body.amount)), accountBalanceAfter: account?.balance || '0.00', status: 'SIMULATED_NOT_POSTED' }
      addAudit('CARD_PAYMENT_SIMULATED', 'CARD', card.id, `Card payment at ${body.merchant} simulated; no funds moved.`)
      return ok(result)
    }
  }

  if (path === '/api/v1/loans' && method === 'get') return ok(data.loans)
  if (path === '/api/v1/loans' && method === 'post') {
    if (!findAccount(body.accountId)) return error(config, 'Choose an account')
    if (!(Number(body.principal) > 0) || !(Number(body.termMonths) >= 1) || Number(body.termMonths) > 60) return error(config, 'Enter a valid loan amount and term')
    const loan: LocalLoan = { id: id('loan'), accountId: body.accountId, principal: money(Number(body.principal)), annualRate: '0.1200', termMonths: Number(body.termMonths), status: 'PENDING', outstanding: money(Number(body.principal)), nextDueDate: null, createdAt: now() }
    data.loans.unshift(loan); data.schedules[loan.id] = loanSchedule(loan); writeData(data)
    addNotification('LOAN', 'Application received', 'Your loan application is pending review in this prototype.')
    return ok(loan, 201)
  }
  const loanMatch = path.match(/^\/api\/v1\/(admin\/)?loans\/([^/]+)(?:\/(repay|approve|reject))?$/)
  if (loanMatch) {
    const loan = data.loans.find((l: LocalLoan) => l.id === loanMatch[2]) as LocalLoan | undefined
    if (!loan) return error(config, 'Loan not found', 404)
    const action = loanMatch[3]
    if (!action && method === 'get') return ok({ loan, schedule: data.schedules[loan.id] || loanSchedule(loan) })
    if (action === 'repay' && method === 'post') {
      if (loan.status !== 'ACTIVE') return error(config, 'Only active loans can be repaid')
      loan.status = 'PAID_OFF'; loan.outstanding = '0.00'; loan.nextDueDate = null
      data.schedules[loan.id] = (data.schedules[loan.id] || loanSchedule(loan)).map((row: any) => ({ ...row, status: 'PAID' }))
      writeData(data); addNotification('LOAN', 'Repayment simulated', 'The loan was marked paid in the prototype. No account balance was changed.')
      return ok({ loan, schedule: data.schedules[loan.id] })
    }
    if (action === 'approve' && method === 'post') {
      loan.status = 'ACTIVE'; loan.nextDueDate = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10); writeData(data)
      addAudit('LOAN_APPROVED', 'LOAN', loan.id, 'Loan approval simulated; no funds were disbursed.')
      return ok({ loan, schedule: data.schedules[loan.id] || loanSchedule(loan) })
    }
    if (action === 'reject' && method === 'post') { loan.status = 'REJECTED'; writeData(data); addAudit('LOAN_REJECTED', 'LOAN', loan.id, 'Loan rejection simulated.'); return ok(loan) }
  }
  if (path === '/api/v1/admin/loans' && method === 'get') {
    const status = (config.params as any)?.status
    return ok(data.loans.filter((loan: LocalLoan) => !status || loan.status === status))
  }

  if (path === '/api/v1/notifications/unread-count' && method === 'get') return ok({ count: data.notifications.filter((n: LocalNotification) => !n.read).length })
  if (path === '/api/v1/notifications' && method === 'get') return ok(data.notifications)
  const notificationMatch = path.match(/^\/api\/v1\/notifications\/([^/]+)\/read$/)
  if (notificationMatch && method === 'post') {
    const item = data.notifications.find((n: LocalNotification) => n.id === notificationMatch[1])
    if (!item) return error(config, 'Notification not found', 404)
    item.read = true; writeData(data); return ok(item)
  }
  if (path === '/api/v1/notifications/read-all' && method === 'post') { data.notifications.forEach((n: LocalNotification) => { n.read = true }); writeData(data); return ok({}) }

  if (path === '/api/v1/admin/accounts' && method === 'get') return ok(accounts().map((a) => ({ accountNumber: a.accountNumber, type: a.type, balance: a.balance, currency: a.currency, status: a.status, ownerEmail: profile().email })))
  if (path === '/api/v1/admin/audit' && method === 'get') return ok(data.audit.slice(0, Number((config.params as any)?.size || 50)))
  if (path === '/api/v1/admin/accounts/deposit' && method === 'post') {
    if (!accounts().some((a) => a.accountNumber === body.accountNumber)) return error(config, 'Account not found')
    if (!(Number(body.amount) > 0)) return error(config, 'Enter a valid amount')
    addAudit('DEPOSIT_SIMULATED', 'ACCOUNT', body.accountNumber, `Deposit of ${money(Number(body.amount))} simulated; balance unchanged.`)
    return ok({ status: 'SIMULATED_NOT_POSTED' })
  }

  if (path.endsWith('/payments/top-up') && method === 'post') return error(config, 'Top-ups are unavailable in this local simulation')
  return error(config, 'This feature is not enabled in the local simulation', 404)
}
