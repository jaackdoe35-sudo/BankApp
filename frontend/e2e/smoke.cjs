const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const binDir = process.env.PATH.split(path.delimiter).find(
  (entry) => entry.includes('/_npx/') && entry.endsWith('/node_modules/.bin'),
)
if (!binDir) throw new Error('Playwright package directory was not found in the npx PATH')
const { chromium } = require(path.resolve(binDir, '../playwright'))

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))

  try {
    await page.goto('http://127.0.0.1:4173/signup', { waitUntil: 'networkidle' })
    await page.getByLabel('First name').fill('Test')
    await page.getByLabel('Last name').fill('Customer')
    await page.getByLabel('Email').fill('e2e.customer@example.test')
    await page.getByLabel('Password (min 8 chars)').fill('Synthetic-Only-Password-2026!')
    await page.getByRole('button', { name: 'Create account' }).click()
    await page.waitForURL('http://127.0.0.1:4173/')
    await page.getByText('$1,500,000.00').first().waitFor()

    // Payment-page optional code control: verify its conditional visibility,
    // required validation, and clearing behavior without submitting a payment.
    await page.goto('http://127.0.0.1:4173/transfer', { waitUntil: 'networkidle' })
    await page.getByRole('heading', { name: 'Send money' }).waitFor()
    await page.getByLabel('From account').selectOption({ index: 1 })
    await page.getByLabel('Destination account number').fill('1234567890')
    await page.getByLabel('Amount').fill('25.00')
    const paymentButton = page.getByRole('button', { name: 'Continue payment' })
    const paymentCode = page.getByPlaceholder('Enter code')
    assert.equal(await paymentCode.count(), 0, 'payment code input must be hidden by default')
    await page.getByLabel('Enter a Code').check()
    await paymentCode.waitFor({ state: 'visible' })
    assert.equal(await paymentCode.getAttribute('required'), '', 'payment code must be required when enabled')
    assert.equal(await paymentButton.isDisabled(), true, 'payment cannot continue while enabled code is empty')
    await paymentCode.fill('482913')
    assert.equal(await paymentButton.isDisabled(), false, 'payment can continue after required code is entered')
    await page.getByLabel('Enter a Code').uncheck()
    assert.equal(await paymentCode.count(), 0, 'payment code input must disappear when disabled')
    assert.equal(await paymentButton.isDisabled(), false, 'payment can continue without the optional code')
    await page.goto('http://127.0.0.1:4173/accounts/acct-northstar-001', { waitUntil: 'networkidle' })

    await page.waitForURL('**/accounts/acct-northstar-001')
    await page.getByPlaceholder('0.00').fill('125.50')
    await page.getByLabel('Bank name').fill('Synthetic Test Bank')
    await page.getByLabel('Account name').fill('Test Customer')
    await page.getByLabel('Account number').fill('1234567890')
    await page.getByLabel('Enter a Code').check()
    await page.getByPlaceholder('Enter code').fill('482913')

    const ledger = await context.newPage()
    await ledger.goto('http://127.0.0.1:4173/test-ledger/', { waitUntil: 'networkidle' })
    await ledger.getByText('Live event channel ready').waitFor()

    await page.getByRole('button', { name: 'Continue withdrawal' }).click()
    await page.getByRole('status').getByText('Withdrawal rejected').waitFor()
    await ledger.getByText('Observed result').waitFor()
    await ledger.getByText('482913').first().waitFor()
    await ledger.getByText('Synthetic Test Bank').first().waitFor()

    const [jsonDownload] = await Promise.all([
      ledger.waitForEvent('download'),
      ledger.getByRole('button', { name: 'Export JSON' }).click(),
    ])
    const exported = JSON.parse(fs.readFileSync(await jsonDownload.path(), 'utf8'))
    assert.ok(exported.events.some((event) => event.type === 'withdrawal_result'), 'JSON export must include the result event')

    const [csvDownload] = await Promise.all([
      ledger.waitForEvent('download'),
      ledger.getByRole('button', { name: 'Export CSV' }).click(),
    ])
    const csv = fs.readFileSync(await csvDownload.path(), 'utf8')
    assert.ok(csv.includes('withdrawal_result'), 'CSV export must include the result event')

    const accountState = await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('northstar.local-simulation.v1') || '{}')
      return state.accounts?.find((account) => account.id === 'acct-northstar-001')
    })
    assert.equal(accountState.balance, '1500000.00', 'rejected withdrawal must not change balance')

    const events = await page.evaluate(() => JSON.parse(localStorage.getItem('bankapp.experiment.events.v1') || '[]'))
    assert.ok(events.some((event) => event.type === 'withdrawal_submitted'), 'submission event must be persisted')
    assert.ok(events.some((event) => event.type === 'withdrawal_result' && event.outcome === 'blocked'), 'rejection event must be persisted')
    assert.ok(events.some((event) => event.type === 'withdrawal_input' && event.field === 'codeChecked' && event.value === true), 'code checkbox change must be recorded')

    await page.reload({ waitUntil: 'networkidle' })
    await page.getByText('Withdraw funds').waitFor()
    await page.getByText('$1,500,000.00').first().waitFor()
    await page.getByRole('button', { name: 'Sign out' }).click()
    await page.waitForURL('**/login')
    assert.deepEqual(errors, [], 'browser must not emit uncaught page errors')

    console.log(JSON.stringify({
      result: 'PASS',
      checks: [
        'signup and authenticated dashboard',
        'account detail navigation',
        'conditional code field on withdrawal form',
        'payment-page Enter a Code checkbox visibility, required validation and clearing',
        'withdrawal rejection result',
        'Test Ledger cross-tab BroadcastChannel updates',
        'event persistence and event contents',
        'JSON and CSV event exports',
        'unchanged simulated balance',
        'session persistence after reload',
        'logout and protected-route redirect',
        'no uncaught browser page errors',
      ],
    }, null, 2))
  } finally {
    await browser.close()
  }
})().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
