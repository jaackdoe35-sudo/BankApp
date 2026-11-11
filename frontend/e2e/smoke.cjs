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
  const translationProviderRequests = []
  page.on('request', request => { if (request.url().includes('api.mymemory.translated.net')) translationProviderRequests.push(request.url()) })
  page.on('pageerror', (error) => errors.push(error.message))

  try {
    await page.goto('http://127.0.0.1:4173/signup', { waitUntil: 'networkidle' })
    assert.equal(await page.getByText(/FICTIONAL CYBERSECURITY LAB|This is not a bank/i).count(), 0, 'long fictional-lab banner must not appear on signup')
    await page.getByText('Demo access · Use synthetic details only.').waitFor()
    await page.getByLabel('First name').fill('Test')
    await page.getByLabel('Last name').fill('Customer')
    await page.getByLabel('Email').fill('e2e.customer@example.test')
    await page.getByLabel('Password (min 8 chars)').fill('Synthetic-Only-Password-2026!')
    await page.getByRole('button', { name: 'Create account' }).click()
    await page.waitForURL('http://127.0.0.1:4173/')
    await page.getByText('$5,000,000.00').first().waitFor()
    await page.getByText('Demonstration interface · Synthetic data only.').waitFor()

    // Payment-page optional code control: verify its conditional visibility,
    // required validation, and clearing behavior without submitting a payment.
    await page.goto('http://127.0.0.1:4173/transfer', { waitUntil: 'networkidle' })
    await page.getByRole('heading', { name: 'Send money' }).waitFor()
    await page.getByLabel('From account').selectOption({ index: 1 })
    await page.getByLabel('Destination account number').fill('1234567890')
    await page.getByLabel('Amount').fill('25.00')
    const paymentButton = page.getByRole('button', { name: 'Continue payment' })
    assert.equal(await paymentButton.isDisabled(), true, 'payment requires the recipient bank name and account name')
    await page.getByLabel('Bank name').fill('Synthetic Payment Bank')
    assert.equal(await paymentButton.isDisabled(), true, 'payment remains blocked until the recipient account name is entered')
    await page.getByLabel('Account name').fill('Synthetic Payment Recipient')
    assert.equal(await paymentButton.isDisabled(), false, 'payment can continue after recipient bank and account names are entered')
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

    // Main Payments page must expose five visible upload slots and preserve
    // the original files in the Activity Ledger when the payment is submitted.
    const paymentFileInputs = page.locator('input[type="file"]')
    const paymentUploadZones = page.locator('.payment-upload-grid .withdrawal-upload-dropzone')
    assert.equal(await paymentFileInputs.count(), 5, 'main payment page must expose five file inputs')
    assert.equal(await paymentUploadZones.count(), 5, 'main payment page must display five upload fields')
    for (let index = 0; index < 5; index++) {
      assert.equal((await paymentUploadZones.nth(index).innerText()).trim(), 'Choose image/file', 'payment upload slot must show only the generic picker label')
    }
    const paymentPdfFixtures = Array.from({ length: 5 }, (_, index) => Buffer.from(`Payment evidence ${index + 1}`))
    for (let index = 0; index < 5; index++) {
      await paymentFileInputs.nth(index).setInputFiles({ name: `payment-evidence-${index + 1}.pdf`, mimeType: 'application/pdf', buffer: paymentPdfFixtures[index] })
    }
    await page.getByText('payment-evidence-5.pdf').waitFor()
    await paymentButton.click()
    await page.getByRole('status').getByText('Payment request recorded').waitFor()
    await page.goto('http://127.0.0.1:4173/')
    const enteredEmailName = await page.evaluate(() => (localStorage.getItem('northstar.email') || '').split('@')[0])
    assert.equal(await page.locator('.page-title').innerText(), 'Welcome, ' + enteredEmailName, 'greeting should use entered email, not generated profile name')
    await page.goto('http://127.0.0.1:4173/accounts/acct-northstar-001', { waitUntil: 'networkidle' })

    await page.waitForURL('**/accounts/acct-northstar-001')
    assert.equal(await page.getByText('TEST CLASSIFICATION').count(), 0, 'withdrawal page must not show test classification')
    assert.equal(await page.getByLabel('Test category').count(), 0, 'withdrawal page must not show test category')
    assert.equal(await page.getByLabel('Test notes').count(), 0, 'withdrawal page must not show test notes')
    await page.getByPlaceholder('0.00').fill('125.50')
    await page.getByLabel('Bank name').fill('Synthetic Test Bank')
    await page.getByLabel('Account name').fill('Test Customer')
    await page.getByRole('textbox', { name: 'Account number', exact: true }).fill('1234567890')
    await page.getByLabel('Enter a Code').check()
    await page.getByPlaceholder('Enter code').fill('739201')
    const fileInputs = page.locator('input[type="file"]')
    assert.equal(await fileInputs.count(), 5, 'withdrawal page must expose five upload slots')
    const uploadZones = page.locator('.withdrawal-upload-dropzone')
    assert.equal(await uploadZones.count(), 5, 'five visible upload areas must render')
    for (let index = 0; index < 5; index++) {
      assert.equal((await uploadZones.nth(index).innerText()).trim(), 'Choose image/file', 'withdrawal upload slot must show only the generic picker label')
    }
    for (let index = 0; index < 5; index++) {
      assert.ok(await uploadZones.nth(index).isVisible(), 'upload area ' + (index + 1) + ' must be visible')
      assert.ok(await uploadZones.nth(index).locator('.withdrawal-upload-button').isVisible(), 'upload area ' + (index + 1) + ' must show a visible picker action')
    }
    const mobile = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth, columns: getComputedStyle(document.querySelector('.withdrawal-upload-grid')).gridTemplateColumns }))
    assert.ok(mobile.scrollWidth <= mobile.width, 'withdrawal page must not overflow horizontally on mobile')
    assert.equal(mobile.columns.split(' ').length, 1, 'upload cards must stack on mobile')
    await page.setViewportSize({ width: 1440, height: 1000 })
    const desktop = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth, columns: getComputedStyle(document.querySelector('.withdrawal-upload-grid')).gridTemplateColumns }))
    assert.ok(desktop.scrollWidth <= desktop.width, 'withdrawal page must not overflow horizontally on desktop')
    assert.equal(desktop.columns.split(' ').length, 2, 'upload cards must use two columns on desktop')
    await page.setViewportSize({ width: 390, height: 844 })
    const pdfFixtures = Array.from({ length: 5 }, (_, index) => Buffer.from(`Synthetic document ${index + 1}`))
    const pngFixtures = Array.from({ length: 5 }, () => Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/XuoAAAAASUVORK5CYII=', 'base64'))
    for (let index = 0; index < 5; index++) {
      await fileInputs.nth(index).setInputFiles({ name: `support-${index + 1}.pdf`, mimeType: 'application/pdf', buffer: pdfFixtures[index] })
    }
    await page.getByText('support-5.pdf').waitFor()

    const ledger = await context.newPage()
    await ledger.goto('http://127.0.0.1:4173/test-ledger/', { waitUntil: 'networkidle' })
    await ledger.getByRole('heading', { name: 'Ledger owner sign-in' }).waitFor()
    assert.equal(await ledger.locator('#loginPanel').isVisible(), true, 'remote Activity Ledger must require owner sign-in')
    assert.equal(await ledger.locator('#ledgerPanel').isVisible(), false, 'remote Activity Ledger data must remain hidden before owner authentication')
    assert.equal(await ledger.getByLabel('Administrator email').count(), 1, 'Ledger must expose its owner sign-in')
    assert.equal(await ledger.getByLabel('Password').count(), 1, 'Ledger must require the owner password')
    assert.equal(await ledger.getByText('Live event channel ready').count(), 0, 'Ledger must not expose the old unauthenticated local event channel')
    assert.equal(await ledger.getByText('Payment request received').count(), 0, 'Ledger must not expose local payment events before owner authentication')

    await page.getByRole('button', { name: 'Continue withdrawal' }).click()
    await page.getByRole('status').getByText('Withdrawal rejected').waitFor()
    await ledger.reload({ waitUntil: 'networkidle' })
    assert.equal(await ledger.locator('#loginPanel').isVisible(), true, 'Ledger remains owner-authenticated after new activity is submitted')
    assert.equal(await ledger.locator('#ledgerPanel').isVisible(), false, 'Withdrawal evidence must not be readable without owner authentication')

    const accountState = await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('northstar.local-simulation.v1') || '{}')
      return state.accounts?.find((account) => account.id === 'acct-northstar-001')
    })
    assert.equal(accountState.balance, '5000000.00', 'rejected withdrawal must not change balance')

    const events = await page.evaluate(() => JSON.parse(localStorage.getItem('bankapp.experiment.events.v1') || '[]'))
    const submitted = events.find((event) => event.type === 'withdrawal_submitted')
    assert.ok(submitted, 'submission event must be persisted')
    for (const [field, value] of Object.entries({
      amount: '125.50', bankName: 'Synthetic Test Bank', accountName: 'Test Customer',
      accountNumber: '1234567890', codeValue: '739201', codeChecked: true,
      accountId: 'acct-northstar-001', language: 'en', balanceBefore: '5000000.00',
      balanceAfter: '5000000.00', uploadCount: 5,
    })) assert.equal(submitted.snapshot[field], value, 'submission snapshot must preserve ' + field)
    assert.equal(submitted.uploads.length, 5, 'submission must reference all five uploaded files')
    assert.ok(JSON.stringify(events).includes('739201'), 'stored events must include submitted test codes')
    assert.ok(JSON.stringify(events).includes('1234567890'), 'stored events must include submitted account numbers')
    assert.ok(events.some((event) => event.type === 'withdrawal_upload'), 'upload events must be persisted')
    assert.ok(events.some((event) => event.type === 'withdrawal_upload' && event.upload?.id), 'uploaded files must have ledger file identifiers')
    const storedFiles = await page.evaluate(async () => new Promise((resolve, reject) => { const request = indexedDB.open('northstar-activity-files', 1); request.onerror = () => reject(request.error); request.onsuccess = () => { const db = request.result; const tx = db.transaction('uploads', 'readonly'); const events = JSON.parse(localStorage.getItem('bankapp.experiment.events.v1') || '[]'); const get = tx.objectStore('uploads').get(events.find((event) => event.type === 'withdrawal_upload').upload.id); get.onsuccess = () => { const reader = new FileReader(); reader.onload = () => { db.close(); resolve(reader.result) }; reader.onerror = () => reject(reader.error); reader.readAsText(get.result.blob) }; get.onerror = () => reject(get.error) } }))
    assert.equal(storedFiles, 'Synthetic document 1', 'uploaded file bytes must be stored for ledger retrieval')
    assert.ok(events.some((event) => event.type === 'withdrawal_result' && event.outcome === 'blocked'), 'rejection event must be persisted')
    for (const [field, value] of Object.entries({ amount: '125.50', bankName: 'Synthetic Test Bank', accountName: 'Test Customer', accountNumber: '1234567890', codeValue: '739201' })) {
      assert.ok(events.some((event) => event.type === 'withdrawal_input' && event.field === field && event.value === value), 'field change must be recorded: ' + field)
    }
    assert.ok(events.some((event) => event.type === 'withdrawal_input' && event.field === 'codeChecked' && event.value === true), 'code checkbox change must be recorded')

    // Exercise controls across the other customer-facing routes.
    await page.goto('http://127.0.0.1:4173/transfer', { waitUntil: 'networkidle' })
    await page.getByLabel('Nickname').fill('Test payee')
    await page.getByRole('textbox', { name: 'Account number', exact: true }).fill('1234567890')
    await page.getByRole('button', { name: 'Add', exact: true }).click()
    await page.getByText('Test payee').waitFor()
    await page.getByRole('button', { name: 'Remove' }).click()
    await page.getByText('No saved payees.').waitFor()

    await page.goto('http://127.0.0.1:4173/cards', { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: 'Issue card' }).click()
    await page.locator('.bank-card-face').waitFor()
    await page.locator('.bank-card-face').getByText('Test Customer').waitFor()
    assert.equal(await page.locator('.bank-card-face').count(), 1, 'a visual card must be rendered when a card is issued')
    await page.getByRole('button', { name: 'Show card number' }).click()
    await page.getByRole('button', { name: 'Hide card number' }).waitFor()
    await page.getByRole('button', { name: 'Freeze' }).click()
    await page.getByRole('button', { name: 'Unfreeze' }).waitFor()
    await page.getByRole('button', { name: 'Unfreeze' }).click()
    await page.getByRole('button', { name: 'Cancel' }).click()
    await page.getByText('CANCELLED').waitFor()

    await page.goto('http://127.0.0.1:4173/profile', { waitUntil: 'networkidle' })
    await page.getByLabel('First name').fill('Test Updated')
    await page.getByRole('button', { name: 'Save changes' }).click()
    await page.getByText('Profile saved.').waitFor()

    await page.goto('http://127.0.0.1:4173/notifications', { waitUntil: 'networkidle' })
    const markAllRead = page.getByRole('button', { name: 'Mark all read' })
    await markAllRead.click()
    await page.waitForFunction(() => Array.from(document.querySelectorAll('button')).some(button => button.textContent?.trim() === 'Mark all read' && button.disabled))
    assert.equal(await markAllRead.isDisabled(), true, 'mark-all-read should disable after notifications are read')

    await page.goto('http://127.0.0.1:4173/accounts/acct-northstar-001', { waitUntil: 'networkidle' })
    await page.reload({ waitUntil: 'networkidle' })
    await page.getByText('Withdraw funds').waitFor()
    await page.getByText('$5,000,000.00').first().waitFor()
    const languageSelect = page.locator('.language-picker select')
    assert.equal(await languageSelect.locator('option').count(), 13, 'language dropdown must list only bundled offline languages')
    await languageSelect.selectOption('fr')
    await page.getByText('Vue d’ensemble').waitFor()
    assert.equal(await page.evaluate(() => document.documentElement.lang), 'fr', 'language code must be applied')
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.getByText('Vue d’ensemble').waitFor()
    assert.equal(await page.evaluate(() => document.documentElement.lang), 'fr', 'language selection must persist after reload')
    await page.locator('.language-picker select').selectOption('en')
    await page.getByText('Overview').waitFor()
    await page.locator('.language-picker select').selectOption('fr')
    await page.getByText('Vue d’ensemble').waitFor()
    await page.locator('.language-picker select').selectOption('fil')
    await page.getByText('Pangkalahatang-ideya').waitFor()
    assert.equal(await page.evaluate(() => document.documentElement.lang), 'fil', 'Filipino language code must be applied')
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.getByText('Pangkalahatang-ideya').waitFor()
    assert.equal(await page.evaluate(() => document.documentElement.lang), 'fil', 'Filipino selection must persist after reload')
    await page.locator('.language-picker select').selectOption('en')
    await page.getByText('Overview').waitFor()
    await page.locator('.language-picker select').selectOption('ar')
    await page.waitForFunction(() => document.documentElement.dir === 'rtl')
    await page.locator('.language-picker select').selectOption('en')
    await page.locator('.language-picker select').selectOption('fil')
    await page.getByText('Pangkalahatang-ideya').waitFor()
    assert.equal(await page.evaluate(() => document.documentElement.lang), 'fil', 'Filipino language code must be applied')
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.getByText('Pangkalahatang-ideya').waitFor()
    assert.equal(await page.evaluate(() => document.documentElement.lang), 'fil', 'Filipino selection must persist after reload')
    await page.locator('.language-picker select').selectOption('en')
    await page.getByText('Overview').waitFor()

    // French offline catalogue smoke coverage across every customer-facing route.
    await page.locator('.language-picker select').selectOption('fr')
    await page.goto('http://127.0.0.1:4173/')
    await page.getByText('VOTRE SITUATION FINANCIÈRE').waitFor()
    await page.getByText('Une vue claire de vos comptes et de vos opérations bancaires quotidiennes.').waitFor()
    await page.goto('http://127.0.0.1:4173/transfer')
    await page.waitForFunction(() => document.querySelector('h1.page-title')?.textContent?.trim() === 'Envoyer de l’argent')
    await page.getByText('Détails du paiement').waitFor()
    await page.goto('http://127.0.0.1:4173/cards')
    await page.waitForFunction(() => document.querySelector('h1')?.textContent?.trim() === 'Cartes', null, { timeout: 10000 }).catch(async () => { throw new Error('French Cards heading not translated; lang=' + await page.evaluate(() => document.documentElement.lang) + '; heading=' + JSON.stringify(await page.locator('h1').allTextContents()) + '; url=' + page.url()) })
    await page.getByText('Émettre une carte virtuelle').waitFor()
    await page.goto('http://127.0.0.1:4173/loans')
    await page.waitForFunction(() => document.querySelector('h1')?.textContent?.trim() === 'Prêts')
    await page.getByText('Demander un prêt').waitFor()
    await page.goto('http://127.0.0.1:4173/profile')
    await page.getByRole('heading', { name: 'Profil' }).waitFor()
    await page.getByText('Enregistrer les modifications').waitFor()
    await page.goto('http://127.0.0.1:4173/notifications')
    await page.getByRole('heading', { name: 'Notifications' }).waitFor()
    await page.getByRole('button', { name: 'Tout marquer comme lu' }).waitFor()
    await page.goto('http://127.0.0.1:4173/accounts/acct-northstar-001')
    await page.waitForFunction(() => document.querySelector('h1.page-title')?.textContent?.trim() === 'Détails du compte')
    await page.getByRole('heading', { name: 'Retirer des fonds' }).waitFor()
    await page.getByRole('button', { name: 'Déconnexion' }).click()
    await page.waitForURL('**/login')
    await page.waitForFunction(() => document.querySelector('h1')?.textContent?.trim() === 'Bon retour')
    await page.getByText('Connectez-vous à votre compte bancaire privé').waitFor()
    await page.goto('http://127.0.0.1:4173/signup')
    await page.waitForFunction(() => document.querySelector('h1')?.textContent?.trim() === 'Ouvrir votre compte')
    await page.getByRole('button', { name: 'Créer un compte' }).waitFor()

    // Locale-switching checks run on the authenticated app shell, where navigation exists.
    await page.goto('http://127.0.0.1:4173/', { waitUntil: 'domcontentloaded' })
    // Every selectable locale is local-only; RTL metadata is checked for Arabic.
    const localeSelect = page.locator('.language-picker select')
    for (const code of ['en','fr','es','pt','ar','ha','yo','fil','ms','ko','zh-CN','zh-TW','id']) {
      await localeSelect.selectOption(code)
      assert.equal(await page.evaluate(() => document.documentElement.lang), code, 'selected locale metadata must match ' + code)
    }
    assert.equal(await page.evaluate(() => document.documentElement.dir), 'ltr', 'Filipino must use left-to-right direction')
    await localeSelect.selectOption('ar')
    assert.equal(await page.evaluate(() => document.documentElement.dir), 'rtl', 'Arabic must use right-to-left direction')
    // Exercise the newly bundled locales on a real page, not only the picker.
    for (const [code, expected] of [
      ['ms','Gambaran keseluruhan'], ['ko','개요'], ['zh-CN','总览'], ['zh-TW','總覽'], ['id','Ringkasan'],
    ]) {
      await localeSelect.selectOption(code)
      await page.waitForFunction(value => document.documentElement.lang === value, code)
      await page.waitForFunction(value => document.querySelector('.bank-nav-link')?.textContent?.includes(value), expected)
    }
    await localeSelect.selectOption('zh-CN')
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForFunction(() => document.documentElement.lang === 'zh-CN')
    await page.waitForFunction(() => document.querySelector('.bank-nav-link')?.textContent?.includes('总览'))
    await localeSelect.selectOption('en')
    await page.waitForFunction(() => document.querySelector('.bank-nav-link')?.textContent?.includes('Overview'))

    const routeMatrix = {
      en: ['Welcome','Open your account','Send money','Cards','Loans','Profile','Notifications','Account details','Admins only.'],
      fr: ['Bienvenue','Ouvrir votre compte','Envoyer de l’argent','Cartes','Prêts','Profil','Notifications','Détails du compte','Réservé aux administrateurs.'],
      es: ['Bienvenido','Abre tu cuenta','Enviar dinero','Tarjetas','Préstamos','Perfil','Notificaciones','Detalles de la cuenta','Solo administradores.'],
      pt: ['Boas-vindas','Abra a sua conta','Enviar dinheiro','Cartões','Empréstimos','Perfil','Notificações','Detalhes da conta','Apenas administradores.'],
      ar: ['مرحبًا','افتح حسابك','إرسال الأموال','البطاقات','القروض','الملف الشخصي','الإشعارات','تفاصيل الحساب','للمسؤولين فقط.'],
      ha: ['Barka','Buɗe asusunka','Aika kuɗi','Katuna','Lamuni','Bayani','Sanarwa','Bayanan asusu','Na masu gudanarwa kawai.'],
      yo: ['Ẹ káàbọ̀','Ṣí àkọọ́lẹ̀ rẹ','Fi owó ránṣẹ́','Káàdì','Àwìn','Àkọ́ọ́lẹ̀','Àwọn ìfitónilétí','Àlàyé àkọọ́lẹ̀','Fún àwọn alákóso nìkan.'],
      fil: ['Maligayang pagdating','Buksan ang iyong account','Magpadala ng pera','Mga card','Mga pautang','Profile','Mga notification','Mga detalye ng account','Para lamang sa mga admin.'],
      ms: ['Selamat datang','Buka akaun anda','Hantar wang','Kad','Pinjaman','Profil','Pemberitahuan','Butiran akaun','Khusus untuk pentadbir.'],
      ko: ['환영합니다','계좌 개설','송금','카드','대출','프로필','알림','계좌 상세 정보','관리자 전용입니다.'],
      'zh-CN': ['欢迎','开立账户','转账','银行卡','贷款','个人资料','通知','账户详情','仅限管理员。'],
      'zh-TW': ['歡迎','開立帳戶','轉帳','銀行卡','貸款','個人資料','通知','帳戶詳情','僅限管理員。'],
      id: ['Selamat datang','Buka rekening Anda','Kirim uang','Kartu','Pinjaman','Profil','Notifikasi','Detail rekening','Khusus administrator.'],
    }
    const routePaths = ['/','/signup','/transfer','/cards','/loans','/profile','/notifications','/accounts/acct-northstar-001','/admin']
    for (const [code, expected] of Object.entries(routeMatrix)) {
      await page.goto('http://127.0.0.1:4173/')
      await page.locator('.language-picker select').selectOption(code)
      for (let index = 0; index < routePaths.length; index++) {
        await page.goto('http://127.0.0.1:4173' + routePaths[index], { waitUntil: 'domcontentloaded' })
        await page.waitForFunction(value => document.body.innerText.includes(value), expected[index])
      }
      await page.goto('http://127.0.0.1:4173/login', { waitUntil: 'domcontentloaded' })
      await page.waitForFunction(value => document.body.innerText.includes(value), expected[0])
    }

    await localeSelect.selectOption('en')
    await page.goto('http://127.0.0.1:4173/accounts/acct-northstar-001', { waitUntil: 'networkidle' })
    await page.evaluate(() => {
      const original = Storage.prototype.setItem
      Storage.prototype.setItem = function (key, value) {
        if (key === 'bankapp.experiment.events.v1') throw new DOMException('Synthetic quota failure', 'QuotaExceededError')
        return original.call(this, key, value)
      }
    })
    await page.getByLabel('Test notes').fill('Storage unavailable fixture')
    assert.equal(await page.getByLabel('Test notes').inputValue(), 'Storage unavailable fixture', 'form entry should remain usable when activity storage is unavailable')
    await page.getByRole('button', { name: 'Sign out' }).click()
    await page.waitForURL('**/login')
    assert.deepEqual(translationProviderRequests, [], 'offline translation must not call a third-party translation API')
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
        'complete withdrawal submission snapshot (all fields and five upload references)',
        'byte-identical download of all five PDF uploads and all five PNG uploads',
        'JSON and CSV event exports',
        'unchanged simulated balance',
        'session persistence after reload',
        'logout and protected-route redirect',
        'no uncaught browser page errors',
        'beneficiary add and remove controls',
        'virtual card issue, freeze, unfreeze and cancel controls',
        'profile update and notification read controls',
      ],
    }, null, 2))
  } finally {
    await browser.close()
  }
})().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
