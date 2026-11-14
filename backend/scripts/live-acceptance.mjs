const BASE = (process.env.BANKAPP_API_BASE_URL || '').replace(/\/+$/, '')
if (!BASE) throw new Error('BANKAPP_API_BASE_URL is required')

const runId = process.env.GITHUB_RUN_ID || String(Date.now())
const attempt = process.env.GITHUB_RUN_ATTEMPT || '1'
const email = `jaack.doe35+bankapp-live-${runId}-${attempt}@gmail.com`
const password = 'Live-Acceptance-Only-2026!'

let passed = 0
function check(name, condition) {
  if (!condition) throw new Error(`FAIL: ${name}`)
  passed += 1
  console.log(`PASS: ${name}`)
}

const STARTUP_TIMEOUT_MS = 6 * 60 * 1000

async function waitForBackendReady() {
  const deadline = Date.now() + STARTUP_TIMEOUT_MS
  let lastResult = 'no response'
  let probes = 0

  while (Date.now() < deadline) {
    probes += 1
    try {
      const response = await fetch(`${BASE}/actuator/health`, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(20000),
      })
      const health = await response.json().catch(() => null)
      if (response.ok && health?.status === 'UP') {
        console.log(`PASS: Backend health is UP after ${probes} probe(s)`)
        return
      }
      lastResult = `HTTP ${response.status}${health?.status ? ` (${health.status})` : ''}`
    } catch (error) {
      lastResult = error?.name || 'request error'
    }
    const remaining = deadline - Date.now()
    if (remaining > 0) await new Promise(resolve => setTimeout(resolve, Math.min(10000, remaining)))
  }
  throw new Error(`Backend did not report healthy within six minutes; last result: ${lastResult}`)
}

async function call(path, { method = 'GET', token, body, expected = 200, label = path } = {}) {
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`
  let response
  for (let attemptNo = 1; attemptNo <= 3; attemptNo += 1) {
    try {
      response = await fetch(`${BASE}${path}`, {
        method, headers, body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(45000),
      })
      if (![502, 503, 504].includes(response.status) || attemptNo === 3) break
    } catch (error) {
      if (attemptNo === 3) throw new Error(`${label}: network request failed after retries (${error.name})`)
    }
    await new Promise(resolve => setTimeout(resolve, attemptNo * 3000))
  }
  const raw = await response.text()
  let data = null
  try { data = raw ? JSON.parse(raw) : null } catch { /* status-only diagnostics */ }
  const accepted = Array.isArray(expected) ? expected.includes(response.status) : response.status === expected
  if (!accepted) throw new Error(`${label}: expected HTTP ${Array.isArray(expected) ? expected.join('/') : expected}, received HTTP ${response.status}`)
  return { response, data }
}

await waitForBackendReady()

const unauth = await call('/api/v1/users/me', { expected: 401, label: 'Unauthenticated profile' })
check('Unauthenticated profile request returns 401', unauth.response.status === 401)

const registration = await call('/api/v1/auth/register', {
  method: 'POST', expected: 201, label: 'Synthetic customer registration',
  body: { email, password, firstName: 'Live', lastName: 'Acceptance' },
})
const initialAccess = registration.data?.accessToken
check('Registration returns customer access token', Boolean(initialAccess && registration.data?.refreshToken))

const me = await call('/api/v1/users/me', { token: initialAccess, label: 'Customer profile' })
check('Authenticated profile identifies CUSTOMER', me.data?.email === email && me.data?.role === 'CUSTOMER')

const accountsResult = await call('/api/v1/accounts', { token: initialAccess, label: 'Customer accounts' })
const accounts = accountsResult.data
check('Registration provisions one checking account', Array.isArray(accounts) && accounts.length === 1 && accounts[0].type === 'CHECKING')
const first = accounts[0]
const accountId = first.id
check('Opening balance is USD 5,000,000.00', first.currency === 'USD' && Number(first.balance).toFixed(2) === '5000000.00')

const secondResult = await call('/api/v1/accounts', {
  method: 'POST', token: initialAccess, expected: 201, label: 'Open second account',
  body: { type: 'CHECKING', currency: 'USD' },
})
const second = secondResult.data
check('Additional account also opens with USD 5,000,000.00', second.currency === 'USD' && Number(second.balance).toFixed(2) === '5000000.00')
const detail = await call(`/api/v1/accounts/${accountId}`, { token: initialAccess, label: 'Own account detail' })
check('Customer can retrieve own account detail', detail.data?.id === accountId)
const transactions = await call(`/api/v1/accounts/${accountId}/transactions`, { token: initialAccess, label: 'Own transaction history' })
check('Customer can retrieve own transaction history', Array.isArray(transactions.data) && transactions.data.length >= 1)

const profile = await call('/api/v1/users/me/profile', {
  method: 'PUT', token: initialAccess, label: 'Update own profile',
  body: { firstName: 'Live Updated', lastName: 'Acceptance' },
})
check('Customer can update own profile', profile.data?.firstName === 'Live Updated' && profile.data?.lastName === 'Acceptance')

const beneficiary = await call('/api/v1/beneficiaries', {
  method: 'POST', token: initialAccess, expected: 201, label: 'Create beneficiary',
  body: { nickname: 'Live acceptance payee', accountNumber: second.accountNumber },
})
const beneficiaryId = beneficiary.data?.id
check('Customer can create beneficiary', Boolean(beneficiaryId))
const beneficiaries = await call('/api/v1/beneficiaries', { token: initialAccess, label: 'List beneficiaries' })
check('Customer can list own beneficiary', Array.isArray(beneficiaries.data) && beneficiaries.data.some(item => item.id === beneficiaryId))
await call(`/api/v1/beneficiaries/${beneficiaryId}`, { method: 'DELETE', token: initialAccess, expected: 204, label: 'Delete beneficiary' })
check('Customer can delete own beneficiary', true)

const card = await call('/api/v1/cards', {
  method: 'POST', token: initialAccess, expected: 201, label: 'Issue virtual card',
  body: { accountId, monthlyLimit: 0 },
})
const cardId = card.data?.card?.id
check('Customer can issue virtual card', Boolean(cardId && card.data?.card?.last4))
const declinedCardPay = await call(`/api/v1/cards/${cardId}/pay`, {
  method: 'POST', token: initialAccess, expected: 422, label: 'Disabled card payment',
  body: { merchant: 'Synthetic Acceptance Test', amount: 10 },
})
check('Card payment is rejected', declinedCardPay.response.status === 422)
const frozen = await call(`/api/v1/cards/${cardId}/freeze`, { method: 'POST', token: initialAccess, label: 'Freeze card' })
check('Customer can freeze card', frozen.data?.status === 'FROZEN')
const unfrozen = await call(`/api/v1/cards/${cardId}/unfreeze`, { method: 'POST', token: initialAccess, label: 'Unfreeze card' })
check('Customer can unfreeze card', unfrozen.data?.status === 'ACTIVE')
const cancelled = await call(`/api/v1/cards/${cardId}/cancel`, { method: 'POST', token: initialAccess, label: 'Cancel card' })
check('Customer can cancel card', cancelled.data?.status === 'CANCELLED')

const loan = await call('/api/v1/loans', {
  method: 'POST', token: initialAccess, expected: 201, label: 'Apply for loan',
  body: { accountId, principal: 300, termMonths: 3 },
})
const loanId = loan.data?.id
check('Customer can submit loan application', Boolean(loanId))
const loans = await call('/api/v1/loans', { token: initialAccess, label: 'List loans' })
check('Customer can list own loans', Array.isArray(loans.data) && loans.data.some(item => item.id === loanId))
const loanDetail = await call(`/api/v1/loans/${loanId}`, { token: initialAccess, label: 'Loan detail' })
check('Customer can retrieve own loan detail', loanDetail.data?.loan?.id === loanId || loanDetail.data?.id === loanId)

const payment = await call('/api/v1/payments/top-up', {
  method: 'POST', token: initialAccess, label: 'Create simulated top-up',
  body: { accountId, amount: 25 },
})
check('Top-up is handled by simulated gateway', payment.data?.manualConfirm === true && Boolean(payment.data?.paymentId))
const confirmed = await call(`/api/v1/payments/${payment.data.paymentId}/confirm`, {
  method: 'POST', token: initialAccess, label: 'Confirm simulated top-up',
})
check('Simulated top-up confirms successfully', confirmed.data?.status === 'SUCCEEDED')
const afterTopup = await call(`/api/v1/accounts/${accountId}`, { token: initialAccess, label: 'Balance after top-up' })
check('Top-up credits exactly USD 25.00', Number(afterTopup.data?.balance).toFixed(2) === '5000025.00')

const deniedTransfer = await call('/api/v1/transfers', {
  method: 'POST', token: initialAccess, expected: 422, label: 'Disabled customer transfer',
  body: { sourceAccountId: accountId, destinationAccountNumber: second.accountNumber, amount: 10 },
})
check('Customer transfer is rejected', deniedTransfer.response.status === 422)
const deniedWithdrawal = await call(`/api/v1/accounts/${accountId}/withdraw`, {
  method: 'POST', token: initialAccess, expected: 400, label: 'Disabled withdrawal',
})
check('Customer withdrawal is rejected', deniedWithdrawal.response.status === 400)
const afterDeniedDebits = await call(`/api/v1/accounts/${accountId}`, { token: initialAccess, label: 'Balance after denied debits' })
check('Rejected debit operations do not change balance', Number(afterDeniedDebits.data?.balance).toFixed(2) === '5000025.00')

const notifications = await call('/api/v1/notifications', { token: initialAccess, label: 'Customer notifications' })
check('Customer notification messages contain no synthetic label', Array.isArray(notifications.data) && notifications.data.every(item => !`${item.title || ''} ${item.message || ''}`.toLowerCase().includes('synthetic')))
check('Customer can list notifications', Array.isArray(notifications.data) && notifications.data.length >= 1)
const unread = await call('/api/v1/notifications/unread-count', { token: initialAccess, label: 'Unread notification count' })
check('Customer can read unread notification count', typeof unread.data?.count === 'number')
if (notifications.data?.[0]?.id) {
  await call(`/api/v1/notifications/${notifications.data[0].id}/read`, {
    method: 'POST', token: initialAccess, expected: 204, label: 'Mark notification read',
  })
  check('Customer can mark notification read', true)
}
await call('/api/v1/notifications/read-all', { method: 'POST', token: initialAccess, expected: 204, label: 'Mark all notifications read' })
const unreadAfter = await call('/api/v1/notifications/unread-count', { token: initialAccess, label: 'Unread count after read-all' })
check('Read-all clears unread notifications', unreadAfter.data?.count === 0)

for (const path of ['/api/v1/admin/users', '/api/v1/admin/accounts', '/api/v1/admin/experiments/events', '/api/v1/admin/experiments/files']) {
  const denied = await call(path, { token: initialAccess, expected: 403, label: `Customer denied from ${path}` })
  check(`Customer receives 403 for ${path}`, denied.response.status === 403)
}

const login = await call('/api/v1/auth/login', {
  method: 'POST', expected: 200, label: 'Customer login',
  body: { email, password },
})
check('Customer can log in', Boolean(login.data?.accessToken && login.data?.refreshToken))
const rotated = await call('/api/v1/auth/refresh', {
  method: 'POST', expected: 200, label: 'Refresh token rotation',
  body: { refreshToken: login.data.refreshToken },
})
check('Refresh token is rotated', Boolean(rotated.data?.accessToken && rotated.data?.refreshToken && rotated.data.refreshToken !== login.data.refreshToken))
await call('/api/v1/auth/refresh', { method: 'POST', expected: 401, label: 'Reject replayed refresh token', body: { refreshToken: login.data.refreshToken } })
check('Replayed refresh token is rejected', true)
const rotatedProfile = await call('/api/v1/users/me', { token: rotated.data.accessToken, label: 'Rotated access token' })
check('Rotated access token authenticates', rotatedProfile.data?.email === email)
await call('/api/v1/auth/logout', {
  method: 'POST', token: rotated.data.accessToken, expected: 204, label: 'Customer logout',
  body: { refreshToken: rotated.data.refreshToken },
})
await call('/api/v1/auth/refresh', { method: 'POST', expected: 401, label: 'Reject refresh after logout', body: { refreshToken: rotated.data.refreshToken } })
check('Logout revokes active refresh token', true)

console.log(JSON.stringify({
  result: 'PASS',
  checksPassed: passed,
  environment: 'production-backend',
  role: 'CUSTOMER',
  emailDelivery: 'outbox-events-created; provider delivery verified separately',
}, null, 2))
