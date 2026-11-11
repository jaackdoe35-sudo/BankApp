import { useEffect, useSyncExternalStore } from 'react'

const LANGUAGE_CODES = ['en','fr','es','pt','ar','ha','yo','fil','ms','ko','zh-CN','zh-TW']

function displayName(code: string) {
  try {
    return new Intl.DisplayNames(['en'], { type: 'language' }).of(code) || code
  } catch {
    return code
  }
}

export const languages = LANGUAGE_CODES
  .map((code: string) => ({ code, label: displayName(code) }))
  .sort((a: {code:string;label:string}, b: {code:string;label:string}) => a.label.localeCompare(b.label))

export type Language = typeof LANGUAGE_CODES[number]
const KEY = 'northstar.language.v1'
const messages: Record<string, Record<string,string>> = {
en:{overview:'Overview',payments:'Payments',cards:'Cards',loans:'Lending',profile:'Profile',activity:'Activity',signOut:'Sign out',welcome:'Welcome back',position:'YOUR FINANCIAL POSITION',balance:'Total account balance',accounts:'Your accounts',language:'Language'},
fr:{overview:'Vue d’ensemble',payments:'Paiements',cards:'Cartes',loans:'Crédit',profile:'Profil',activity:'Activité',signOut:'Déconnexion',welcome:'Bon retour',position:'VOTRE SITUATION FINANCIÈRE',balance:'Solde total des comptes',accounts:'Vos comptes',language:'Langue'},
es:{overview:'Resumen',payments:'Pagos',cards:'Tarjetas',loans:'Préstamos',profile:'Perfil',activity:'Actividad',signOut:'Cerrar sesión',welcome:'Te damos la bienvenida',position:'TU SITUACIÓN FINANCIERA',balance:'Saldo total de las cuentas',accounts:'Tus cuentas',language:'Idioma'},
pt:{overview:'Visão geral',payments:'Pagamentos',cards:'Cartões',loans:'Empréstimos',profile:'Perfil',activity:'Atividade',signOut:'Terminar sessão',welcome:'Bem-vindo de volta',position:'A SUA POSIÇÃO FINANCEIRA',balance:'Saldo total das contas',accounts:'As suas contas',language:'Idioma'},
ar:{overview:'نظرة عامة',payments:'المدفوعات',cards:'البطاقات',loans:'القروض',profile:'الملف الشخصي',activity:'النشاط',signOut:'تسجيل الخروج',welcome:'مرحبًا بعودتك',position:'وضعك المالي',balance:'إجمالي رصيد الحسابات',accounts:'حساباتك',language:'اللغة'},
ha:{overview:'Taƙaitawa',payments:'Biyan kuɗi',cards:'Katuna',loans:'Lamuni',profile:'Bayani',activity:'Ayyuka',signOut:'Fita',welcome:'Barka da dawowa',position:'MATSAYIN KUƊIN KA',balance:'Jimillar kuɗin asusu',accounts:'Asusunka',language:'Harshe'},
yo:{overview:'Àkótán',payments:'Ìsanwó',cards:'Káàdì',loans:'Àwìn',profile:'Àkọ́ọ́lẹ̀',activity:'Ìṣe',signOut:'Jáde',welcome:'Ẹ káàbọ̀ padà',position:'IPÒ OWÓ RẸ',balance:'Àpapọ̀ owó inú àkọọ́lẹ̀',accounts:'Àwọn àkọọ́lẹ̀ rẹ',language:'Èdè'},
fil:{overview:'Pangkalahatang-ideya',payments:'Mga pagbabayad',cards:'Mga card',loans:'Mga pautang',profile:'Profile',activity:'Aktibidad',signOut:'Mag-sign out',welcome:'Maligayang pagbabalik',position:'IYONG KALAGAYANG PINANSYAL',balance:'Kabuuang balanse ng account',accounts:'Iyong mga account',language:'Wika'}
}

Object.assign(messages, {
  ms: { overview:'Gambaran keseluruhan',payments:'Pembayaran',cards:'Kad',loans:'Pinjaman',profile:'Profil',activity:'Aktiviti',signOut:'Log keluar',welcome:'Selamat kembali',position:'KEDUDUKAN KEWANGAN ANDA',balance:'Jumlah baki akaun',accounts:'Akaun anda',language:'Bahasa' },
  ko: { overview:'개요',payments:'결제',cards:'카드',loans:'대출',profile:'프로필',activity:'활동',signOut:'로그아웃',welcome:'다시 오신 것을 환영합니다',position:'재정 현황',balance:'총 계좌 잔액',accounts:'내 계좌',language:'언어' },
  'zh-CN': { overview:'总览',payments:'付款',cards:'银行卡',loans:'贷款',profile:'个人资料',activity:'活动',signOut:'退出登录',welcome:'欢迎回来',position:'您的财务状况',balance:'账户总余额',accounts:'您的账户',language:'语言' },
  'zh-TW': { overview:'總覽',payments:'付款',cards:'銀行卡',loans:'貸款',profile:'個人資料',activity:'活動',signOut:'登出',welcome:'歡迎回來',position:'您的財務狀況',balance:'帳戶總餘額',accounts:'您的帳戶',language:'語言' },
})

const stored = typeof localStorage === 'undefined' ? null : localStorage.getItem(KEY)
let current: Language = stored && LANGUAGE_CODES.includes(stored) ? stored : 'en'
const listeners = new Set<() => void>()
function subscribe(fn: () => void) { listeners.add(fn); return () => listeners.delete(fn) }
function snapshot() { return current }
export function setLanguage(language: Language) {
  const normalized = language.trim()
  if (!LANGUAGE_CODES.includes(normalized)) return
  current = normalized
  try { localStorage.setItem(KEY, normalized) } catch { /* Language selection remains active for this session. */ }
  document.documentElement.lang = normalized
  document.documentElement.dir = /^(ar|he|fa|ur)(-|$)/i.test(normalized) ? 'rtl' : 'ltr'
  listeners.forEach(fn => fn())
}

const originalText = new WeakMap<Text, string>()
const translatedText = new WeakMap<Text, string>()
const originalAttributes = new WeakMap<Element, Map<string, string>>()
const translatedAttributes = new WeakMap<Element, Map<string, string>>()
const knownTextNodes = new Set<Text>()
const knownElements = new Set<Element>()
const excludedTags = new Set(['SCRIPT','STYLE','NOSCRIPT','TEXTAREA','INPUT','CODE','PRE','SVG'])

/**
 * Runtime translation is deliberately offline-only. The phrase catalogue is
 * expanded alongside page localization; unknown phrases remain in English
 * rather than being sent to a third-party service or replaced with guesses.
 */
const offlinePhrases: Record<string, Record<string, string>> = {
  fr: {
    'Send money':'Envoyer de l’argent','Payment details':'Détails du paiement','PAYMENT RECIPIENT':'DESTINATAIRE DU PAIEMENT',
    'From account':'Depuis le compte','Select an account':'Sélectionner un compte','Account number':'Numéro de compte',
    'Saved payee':'Bénéficiaire enregistré','Destination account number':'Numéro de compte du destinataire',
    'Enter account number':'Saisir le numéro de compte','Select a beneficiary…':'Sélectionner un bénéficiaire…',
    'Amount':'Montant','Payment reference':'Référence du paiement','(optional)':'(facultatif)',
    'Add a payment note':'Ajouter une note de paiement','Enter a Code':'Saisir un code','Code':'Code',
    'Enter code':'Saisir le code','Processing…':'Traitement…','Continue payment':'Continuer le paiement',
    'Beneficiaries':'Bénéficiaires','Nickname':'Surnom','Add':'Ajouter','Saving payee…':'Enregistrement du bénéficiaire…',
    'Payee saved.':'Bénéficiaire enregistré.','No saved payees.':'Aucun bénéficiaire enregistré.','Remove':'Supprimer',
    'Cards':'Cartes','Issue a virtual card':'Émettre une carte virtuelle','Monthly limit (0 = none)':'Plafond mensuel (0 = aucun)',
    'Issue card':'Émettre la carte','Issuing…':'Émission…','No cards yet.':'Aucune carte pour le moment.',
    'Loans':'Prêts','Apply for a loan':'Demander un prêt','Fixed-rate, equal monthly payments.':'Taux fixe, mensualités égales.',
    'Disburse to':'Verser sur','Term (months)':'Durée (mois)','Apply':'Demander','Submitting…':'Envoi…',
    'No loans yet.':'Aucun prêt pour le moment.','Hide':'Masquer','Schedule':'Échéancier',
    'Profile':'Profil','Activity':'Activité','Sign out':'Déconnexion','Overview':'Vue d’ensemble',
    'Payments':'Paiements','Lending':'Crédit','Language':'Langue',
    'Before you continue':'Avant de continuer','PAYMENT SECURITY':'SÉCURITÉ DES PAIEMENTS',
    'Confirm the recipient details and payment amount before submitting. Payments should only be sent to recipients you trust.':'Vérifiez les coordonnées du destinataire et le montant avant de confirmer. Envoyez uniquement des paiements à des destinataires de confiance.',
  },
  es: {
    'Send money':'Enviar dinero','Payment details':'Detalles del pago','PAYMENT RECIPIENT':'DESTINATARIO DEL PAGO',
    'From account':'Desde la cuenta','Select an account':'Selecciona una cuenta','Account number':'Número de cuenta',
    'Saved payee':'Beneficiario guardado','Destination account number':'Número de cuenta de destino',
    'Enter account number':'Introduce el número de cuenta','Select a beneficiary…':'Selecciona un beneficiario…',
    'Amount':'Importe','Payment reference':'Referencia del pago','(optional)':'(opcional)',
    'Add a payment note':'Añadir una nota de pago','Enter a Code':'Introducir un código','Code':'Código',
    'Enter code':'Introducir código','Processing…':'Procesando…','Continue payment':'Continuar con el pago',
    'Beneficiaries':'Beneficiarios','Nickname':'Alias','Add':'Añadir','Saving payee…':'Guardando beneficiario…',
    'Payee saved.':'Beneficiario guardado.','No saved payees.':'No hay beneficiarios guardados.','Remove':'Eliminar',
    'Cards':'Tarjetas','Issue a virtual card':'Emitir una tarjeta virtual','Monthly limit (0 = none)':'Límite mensual (0 = ninguno)',
    'Issue card':'Emitir tarjeta','Issuing…':'Emitiendo…','No cards yet.':'Todavía no hay tarjetas.',
    'Loans':'Préstamos','Apply for a loan':'Solicitar un préstamo','Fixed-rate, equal monthly payments.':'Tipo fijo, cuotas mensuales iguales.',
    'Disburse to':'Abonar en','Term (months)':'Plazo (meses)','Apply':'Solicitar','Submitting…':'Enviando…',
    'No loans yet.':'Todavía no hay préstamos.','Hide':'Ocultar','Schedule':'Calendario',
    'Profile':'Perfil','Activity':'Actividad','Sign out':'Cerrar sesión','Overview':'Resumen',
    'Payments':'Pagos','Lending':'Préstamos','Language':'Idioma',
    'Before you continue':'Antes de continuar','PAYMENT SECURITY':'SEGURIDAD DE LOS PAGOS',
  },
  pt: {
    'Send money':'Enviar dinheiro','Payment details':'Detalhes do pagamento','PAYMENT RECIPIENT':'DESTINATÁRIO DO PAGAMENTO',
    'From account':'Da conta','Select an account':'Selecionar uma conta','Account number':'Número da conta',
    'Saved payee':'Beneficiário guardado','Destination account number':'Número da conta de destino',
    'Enter account number':'Introduza o número da conta','Select a beneficiary…':'Selecionar um beneficiário…',
    'Amount':'Montante','Payment reference':'Referência do pagamento','(optional)':'(opcional)',
    'Add a payment note':'Adicionar uma nota de pagamento','Enter a Code':'Introduzir um código','Code':'Código',
    'Enter code':'Introduzir código','Processing…':'A processar…','Continue payment':'Continuar pagamento',
    'Beneficiaries':'Beneficiários','Nickname':'Nome de apresentação','Add':'Adicionar','Saving payee…':'A guardar beneficiário…',
    'Payee saved.':'Beneficiário guardado.','No saved payees.':'Sem beneficiários guardados.','Remove':'Remover',
    'Cards':'Cartões','Issue a virtual card':'Emitir um cartão virtual','Monthly limit (0 = none)':'Limite mensal (0 = sem limite)',
    'Issue card':'Emitir cartão','Issuing…':'A emitir…','No cards yet.':'Ainda não existem cartões.',
    'Loans':'Empréstimos','Apply for a loan':'Solicitar um empréstimo','Fixed-rate, equal monthly payments.':'Taxa fixa, prestações mensais iguais.',
    'Disburse to':'Transferir para','Term (months)':'Prazo (meses)','Apply':'Solicitar','Submitting…':'A enviar…',
    'No loans yet.':'Ainda não existem empréstimos.','Hide':'Ocultar','Schedule':'Plano',
    'Profile':'Perfil','Activity':'Atividade','Sign out':'Terminar sessão','Overview':'Visão geral',
    'Payments':'Pagamentos','Lending':'Crédito','Language':'Idioma',
    'Before you continue':'Antes de continuar','PAYMENT SECURITY':'SEGURANÇA DOS PAGAMENTOS',
  },
  ar: {
    'Send money':'إرسال الأموال','Payment details':'تفاصيل الدفع','PAYMENT RECIPIENT':'مستلم الدفع',
    'From account':'من الحساب','Select an account':'اختر حسابًا','Account number':'رقم الحساب',
    'Saved payee':'مستفيد محفوظ','Destination account number':'رقم حساب الوجهة',
    'Enter account number':'أدخل رقم الحساب','Select a beneficiary…':'اختر مستفيدًا…',
    'Amount':'المبلغ','Payment reference':'مرجع الدفع','(optional)':'(اختياري)',
    'Add a payment note':'أضف ملاحظة للدفع','Enter a Code':'أدخل رمزًا','Code':'الرمز',
    'Enter code':'أدخل الرمز','Processing…':'جارٍ المعالجة…','Continue payment':'متابعة الدفع',
    'Beneficiaries':'المستفيدون','Nickname':'الاسم المستعار','Add':'إضافة','Saving payee…':'جارٍ حفظ المستفيد…',
    'Payee saved.':'تم حفظ المستفيد.','No saved payees.':'لا يوجد مستفيدون محفوظون.','Remove':'إزالة',
    'Cards':'البطاقات','Issue a virtual card':'إصدار بطاقة افتراضية','Monthly limit (0 = none)':'الحد الشهري (0 = بلا حد)',
    'Issue card':'إصدار البطاقة','Issuing…':'جارٍ الإصدار…','No cards yet.':'لا توجد بطاقات بعد.',
    'Loans':'القروض','Apply for a loan':'تقديم طلب قرض','Fixed-rate, equal monthly payments.':'سعر فائدة ثابت وأقساط شهرية متساوية.',
    'Disburse to':'إيداع في','Term (months)':'المدة (بالأشهر)','Apply':'تقديم الطلب','Submitting…':'جارٍ الإرسال…',
    'No loans yet.':'لا توجد قروض بعد.','Hide':'إخفاء','Schedule':'الجدول',
    'Profile':'الملف الشخصي','Activity':'النشاط','Sign out':'تسجيل الخروج','Overview':'نظرة عامة',
    'Payments':'المدفوعات','Lending':'الإقراض','Language':'اللغة',
    'Before you continue':'قبل المتابعة','PAYMENT SECURITY':'أمان المدفوعات',
  },
  ha: {
    'Send money':'Aika kuɗi','Payment details':'Bayanan biyan kuɗi','PAYMENT RECIPIENT':'MAI KARƁAR KUƊI',
    'From account':'Daga asusu','Select an account':'Zaɓi asusu','Account number':'Lambar asusu',
    'Saved payee':'Wanda aka ajiye','Destination account number':'Lambar asusun karɓa',
    'Enter account number':'Shigar da lambar asusu','Select a beneficiary…':'Zaɓi wanda zai karɓa…',
    'Amount':'Adadi','Payment reference':'Bayanin biyan kuɗi','(optional)':'(na zaɓi)',
    'Add a payment note':'Ƙara bayanin biyan kuɗi','Enter a Code':'Shigar da lamba','Code':'Lamba',
    'Enter code':'Shigar da lamba','Processing…':'Ana sarrafawa…','Continue payment':'Ci gaba da biya',
    'Beneficiaries':'Masu karɓa','Nickname':'Laƙabi','Add':'Ƙara','Saving payee…':'Ana adana mai karɓa…',
    'Payee saved.':'An adana mai karɓa.','No saved payees.':'Babu wanda aka adana.','Remove':'Cire',
    'Cards':'Katuna','Issue a virtual card':'Ƙirƙiri katin kama-da-wane','Monthly limit (0 = none)':'Iyakar wata (0 = babu)',
    'Issue card':'Ƙirƙiri kati','Issuing…':'Ana ƙirƙira…','No cards yet.':'Babu kati tukuna.',
    'Loans':'Lamuni','Apply for a loan':'Nemi lamuni','Fixed-rate, equal monthly payments.':'Kashi ɗaya daidai na biyan kuɗi kowane wata.',
    'Disburse to':'Aika zuwa','Term (months)':'Tsawon lokaci (watanni)','Apply':'Nema','Submitting…':'Ana aikawa…',
    'No loans yet.':'Babu lamuni tukuna.','Hide':'Ɓoye','Schedule':'Jadawali',
    'Profile':'Bayani','Activity':'Ayyuka','Sign out':'Fita','Overview':'Taƙaitawa',
    'Payments':'Biyan kuɗi','Lending':'Lamuni','Language':'Harshe',
    'Before you continue':'Kafin ka ci gaba','PAYMENT SECURITY':'TSARON BIYAN KUƊI',
  },
  yo: {
    'Send money':'Fi owó ránṣẹ́','Payment details':'Àlàyé ìsanwó','PAYMENT RECIPIENT':'ẸNI TÍ YÓÒ GBA OWÓ',
    'From account':'Láti inú àkọọ́lẹ̀','Select an account':'Yan àkọọ́lẹ̀ kan','Account number':'Nọ́mbà àkọọ́lẹ̀',
    'Saved payee':'Ẹni tí a ti fipamọ́','Destination account number':'Nọ́mbà àkọọ́lẹ̀ olùgbà',
    'Enter account number':'Tẹ nọ́mbà àkọọ́lẹ̀','Select a beneficiary…':'Yan olùgbà…',
    'Amount':'Iye owó','Payment reference':'Ìtọ́kasí ìsanwó','(optional)':'(àṣàyàn)',
    'Add a payment note':'Fi àlàyé ìsanwó kún un','Enter a Code':'Tẹ kóòdù sí i','Code':'Kóòdù',
    'Enter code':'Tẹ kóòdù','Processing…':'Ó ń ṣiṣẹ́…','Continue payment':'Tẹ̀síwájú pẹ̀lú ìsanwó',
    'Beneficiaries':'Àwọn olùgbà','Nickname':'Orúkọ àpèlé','Add':'Fi kún un','Saving payee…':'Ó ń fipamọ́ olùgbà…',
    'Payee saved.':'A ti fipamọ́ olùgbà.','No saved payees.':'Kò sí olùgbà tí a fipamọ́.','Remove':'Yọ kúrò',
    'Cards':'Káàdì','Issue a virtual card':'Ṣẹ̀dá káàdì àfọwọ́ṣe','Monthly limit (0 = none)':'Ààlà oṣooṣù (0 = kò sí)',
    'Issue card':'Ṣẹ̀dá káàdì','Issuing…':'Ó ń ṣẹ̀dá…','No cards yet.':'Kò tíì sí káàdì.',
    'Loans':'Àwìn','Apply for a loan':'Bẹ̀rẹ̀ sí béèrè àwìn','Fixed-rate, equal monthly payments.':'Oṣù kọ̀ọ̀kan ni ìsanwó tó dọ́gba pẹ̀lú èrè tí kò yípadà.',
    'Disburse to':'Fi ránṣẹ́ sí','Term (months)':'Àkókò (oṣù)','Apply':'Bẹ̀rẹ̀','Submitting…':'Ó ń fi ránṣẹ́…',
    'No loans yet.':'Kò tíì sí àwìn.','Hide':'Fi pamọ́','Schedule':'Ètò ìsanwó',
    'Profile':'Àkọ́ọ́lẹ̀','Activity':'Ìṣe','Sign out':'Jáde','Overview':'Àkótán',
    'Payments':'Ìsanwó','Lending':'Àwìn','Language':'Èdè',
    'Before you continue':'Kí o tó tẹ̀síwájú','PAYMENT SECURITY':'ÀÀBÒ ÌSANWÓ',
  },
  fil: {
    'Send money':'Magpadala ng pera','Payment details':'Mga detalye ng bayad','PAYMENT RECIPIENT':'TATANGGAP NG BAYAD',
    'From account':'Mula sa account','Select an account':'Pumili ng account','Account number':'Numero ng account',
    'Saved payee':'Naka-save na tatanggap','Destination account number':'Numero ng account ng tatanggap',
    'Enter account number':'Ilagay ang numero ng account','Select a beneficiary…':'Pumili ng benepisyaryo…',
    'Amount':'Halaga','Payment reference':'Sanggunian ng bayad','(optional)':'(opsyonal)',
    'Add a payment note':'Magdagdag ng tala sa bayad','Enter a Code':'Maglagay ng code','Code':'Code',
    'Enter code':'Ilagay ang code','Processing…':'Pinoproseso…','Continue payment':'Magpatuloy sa pagbabayad',
    'Beneficiaries':'Mga benepisyaryo','Nickname':'Palayaw','Add':'Idagdag','Saving payee…':'Sine-save ang tatanggap…',
    'Payee saved.':'Nai-save ang tatanggap.','No saved payees.':'Walang naka-save na tatanggap.','Remove':'Alisin',
    'Cards':'Mga card','Issue a virtual card':'Gumawa ng virtual card','Monthly limit (0 = none)':'Buwanang limitasyon (0 = wala)',
    'Issue card':'Gumawa ng card','Issuing…':'Ginagawa…','No cards yet.':'Wala pang mga card.',
    'Loans':'Mga pautang','Apply for a loan':'Mag-apply ng pautang','Fixed-rate, equal monthly payments.':'Nakapirming rate at pantay na buwanang hulog.',
    'Disburse to':'Ipadala sa','Term (months)':'Termino (buwan)','Apply':'Mag-apply','Submitting…':'Isinusumite…',
    'No loans yet.':'Wala pang mga pautang.','Hide':'Itago','Schedule':'Iskedyul',
    'Profile':'Profile','Activity':'Aktibidad','Sign out':'Mag-sign out','Overview':'Pangkalahatang-ideya',
    'Payments':'Mga pagbabayad','Lending':'Mga pautang','Language':'Wika',
    'Before you continue':'Bago magpatuloy','PAYMENT SECURITY':'SEGURIDAD NG BAYAD',
  },
}
function cachedTranslation(language: string, source: string) {
  return Promise.resolve(offlinePhrases[language]?.[source] || '')
}
function translateDocument(root: HTMLElement, language: string) {
  // Always restore the source copy first. This prevents a previous locale's
  // translated text from leaking into the next locale when no new phrase exists.
  for (const node of knownTextNodes) {
    if (!node.isConnected) { knownTextNodes.delete(node); continue }
    const original = originalText.get(node)
    if (original !== undefined) node.nodeValue = original
    translatedText.delete(node)
  }
  for (const element of knownElements) {
    if (!element.isConnected) { knownElements.delete(element); continue }
    const originals = originalAttributes.get(element)
    originals?.forEach((value, attr) => element.setAttribute(attr, value))
    translatedAttributes.get(element)?.clear()
  }
  if (language === 'en') return () => {}
  let stopped = false
  const manual = new Set(Object.values(messages[language] || {}))
  const processText = (node: Text) => {
    const parent = node.parentElement
    if (!parent || excludedTags.has(parent.tagName) || parent.closest('[data-no-translate],input,textarea,code,pre,script,style')) return
    const previous = originalText.get(node)
    const source = previous ?? node.nodeValue ?? ''
    if (!source.trim() || !/[A-Za-z]/.test(source) || manual.has(source.trim())) return
    if (translatedText.get(node) === language) return
    originalText.set(node, source)
    knownTextNodes.add(node)
    const value = offlinePhrases[language]?.[source.trim()]
    if (value && !stopped) { node.nodeValue = source.replace(source.trim(), value); translatedText.set(node, language) }
  }
  const processElement = (element: Element) => {
    if (['SCRIPT','STYLE','NOSCRIPT','CODE','PRE','SVG'].includes(element.tagName) || element.closest('[data-no-translate]')) return
    knownElements.add(element)
    const attrs = ['placeholder','title','aria-label','alt']
    for (const attr of attrs) {
      const value = element.getAttribute(attr)
      if (!value || !/[A-Za-z]/.test(value)) continue
      let originals = originalAttributes.get(element)
      if (!originals) { originals = new Map(); originalAttributes.set(element, originals) }
      let done = translatedAttributes.get(element)
      if (!done) { done = new Map(); translatedAttributes.set(element, done) }
      const source = originals.get(attr) ?? value
      originals.set(attr, source)
      if (done.get(attr) === language || manual.has(source.trim())) continue
      const result = offlinePhrases[language]?.[source.trim()]
      if (result && !stopped) { element.setAttribute(attr, result); done.set(attr, language) }
    }
  }
  const scan = (element: Element) => {
    processElement(element)
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
    let node: Node | null
    while ((node = walker.nextNode())) processText(node as Text)
    element.querySelectorAll('*').forEach(processElement)
  }
  scan(root)
  const observer = new MutationObserver(records => {
    for (const item of records) {
      if (item.type === 'characterData' && item.target instanceof Text) processText(item.target)
      if (item.type === 'attributes' && item.target instanceof Element) processElement(item.target)
      item.addedNodes.forEach(node => {
        if (node instanceof Text) processText(node)
        else if (node instanceof Element) scan(node)
      })
    }
  })
  observer.observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['placeholder','title','aria-label','alt'] })
  return () => { stopped = true; observer.disconnect() }
}


Object.assign(offlinePhrases, {
  fr: {
    'A clear view of your accounts and everyday banking.':'Une vue claire de vos comptes et de vos opérations bancaires quotidiennes.',
    'Private client · Overview':'Client privé · Vue d’ensemble','Relationship overview':'Vue d’ensemble de la relation',
    'Account overview':'Vue d’ensemble du compte','Across':'Sur','account':'compte','accounts':'comptes',
    'Northstar Private · Client portfolio':'Northstar Private · Portefeuille client','USD · Consolidated':'USD · Consolidé',
    'PERSONAL BANKING':'BANQUE PERSONNELLE','At your service.':'À votre service.',
    'Manage payments, cards and account details from one secure place.':'Gérez vos paiements, cartes et coordonnées de compte depuis un espace sécurisé.',
    'Make a payment':'Effectuer un paiement','Manage your cards':'Gérer vos cartes',
    'Account details and available balances':'Détails des comptes et soldes disponibles',
    'New account type':'Type de nouveau compte','Checking':'Courant','Savings':'Épargne',
    'Opening…':'Ouverture…','Open account':'Ouvrir un compte','Loading accounts…':'Chargement des comptes…',
    'Unable to load accounts.':'Impossible de charger les comptes.','Checking account':'Compte courant','Savings account':'Compte d’épargne',
    'Notifications':'Notifications','Mark all read':'Tout marquer comme lu','Loading…':'Chargement…',
    'No notifications yet.':'Aucune notification pour le moment.','Mark read':'Marquer comme lu',
    'Account':'Compte','Role':'Rôle','User ID':'Identifiant utilisateur','First name':'Prénom','Last name':'Nom',
    'Saving…':'Enregistrement…','Save changes':'Enregistrer les modifications','Profile saved.':'Profil enregistré.',
    'Open your account':'Ouvrir votre compte','Create your private banking profile':'Créez votre profil bancaire privé',
    'Email':'Adresse e-mail','Password (min 8 chars)':'Mot de passe (8 caractères min.)',
    'Creating…':'Création…','Create account':'Créer un compte','Already a client?':'Déjà client ?',
    'Sign in':'Se connecter','Welcome back':'Bon retour','Sign in to your private banking account':'Connectez-vous à votre compte bancaire privé',
    'Password':'Mot de passe','Signing in…':'Connexion…','No account yet?':'Pas encore de compte ?',
    'Clarity for your financial life.':'La clarté pour votre vie financière.',
    'Thoughtful banking, with a clear view of what matters and the tools to manage it with confidence.':'Une banque attentive, une vision claire de l’essentiel et les outils pour le gérer en toute confiance.',
    'A MORE CONSIDERED APPROACH':'UNE APPROCHE PLUS RÉFLÉCHIE','PRIVATE CLIENT PORTAL':'PORTAIL CLIENT PRIVÉ',
    'Digital banking':'Banque numérique','YOUR FINANCES':'VOS FINANCES','Secure session':'Session sécurisée',
    'Secure connection':'Connexion sécurisée','Administration':'Administration',
    'ACCOUNT SERVICES':'SERVICES DE COMPTE','Account details':'Détails du compte','Withdraw funds':'Retirer des fonds',
    'Enter the amount and destination account details below.':'Saisissez le montant et les coordonnées du compte destinataire ci-dessous.',
    'TEST CLASSIFICATION':'CLASSIFICATION DU TEST','Test category':'Catégorie du test','Test notes':'Notes du test',
    'DESTINATION ACCOUNT':'COMPTE DESTINATAIRE','Bank name':'Nom de la banque','Account name':'Nom du titulaire',
    'Account number':'Numéro de compte','SUPPORTING DOCUMENTS':'DOCUMENTS JUSTIFICATIFS',
    'Add up to five documents or images. Accepted: JPG, PNG, WebP, PDF, TXT, DOC and DOCX. Maximum 10 MB per file.':'Ajoutez jusqu’à cinq documents ou images. Formats acceptés : JPG, PNG, WebP, PDF, TXT, DOC et DOCX. Taille maximale : 10 Mo par fichier.',
    'Choose image or file':'Choisir une image ou un fichier','Tap to choose an image or file':'Touchez pour choisir une image ou un fichier',
    'Replace selected file':'Remplacer le fichier sélectionné','Remove':'Supprimer','Continue withdrawal':'Continuer le retrait',
    'Recent transactions':'Transactions récentes','No transactions yet.':'Aucune transaction pour le moment.',
  },
  es: {
    'A clear view of your accounts and everyday banking.':'Una visión clara de tus cuentas y operaciones bancarias diarias.',
    'Private client · Overview':'Cliente privado · Resumen','Relationship overview':'Resumen de la relación',
    'Account overview':'Resumen de la cuenta','Across':'En','account':'cuenta','accounts':'cuentas',
    'Northstar Private · Client portfolio':'Northstar Private · Cartera del cliente','USD · Consolidated':'USD · Consolidado',
    'PERSONAL BANKING':'BANCA PERSONAL','At your service.':'A tu servicio.',
    'Manage payments, cards and account details from one secure place.':'Gestiona pagos, tarjetas y datos de cuenta desde un único espacio seguro.',
    'Make a payment':'Realizar un pago','Manage your cards':'Gestionar tus tarjetas',
    'Account details and available balances':'Detalles de la cuenta y saldos disponibles',
    'New account type':'Tipo de cuenta nueva','Checking':'Corriente','Savings':'Ahorros',
    'Opening…':'Abriendo…','Open account':'Abrir cuenta','Loading accounts…':'Cargando cuentas…',
    'Unable to load accounts.':'No se pueden cargar las cuentas.','Checking account':'Cuenta corriente','Savings account':'Cuenta de ahorros',
    'Notifications':'Notificaciones','Mark all read':'Marcar todo como leído','Loading…':'Cargando…',
    'No notifications yet.':'Todavía no hay notificaciones.','Mark read':'Marcar como leído',
    'Account':'Cuenta','Role':'Rol','User ID':'ID de usuario','First name':'Nombre','Last name':'Apellido',
    'Saving…':'Guardando…','Save changes':'Guardar cambios','Profile saved.':'Perfil guardado.',
    'Open your account':'Abre tu cuenta','Create your private banking profile':'Crea tu perfil de banca privada',
    'Email':'Correo electrónico','Password (min 8 chars)':'Contraseña (mín. 8 caracteres)',
    'Creating…':'Creando…','Create account':'Crear cuenta','Already a client?':'¿Ya eres cliente?',
    'Sign in':'Iniciar sesión','Welcome back':'Te damos la bienvenida','Sign in to your private banking account':'Inicia sesión en tu cuenta bancaria privada',
    'Password':'Contraseña','Signing in…':'Iniciando sesión…','No account yet?':'¿Aún no tienes cuenta?',
    'Clarity for your financial life.':'Claridad para tu vida financiera.',
    'Thoughtful banking, with a clear view of what matters and the tools to manage it with confidence.':'Banca cuidadosa, una visión clara de lo importante y herramientas para gestionarlo con confianza.',
    'A MORE CONSIDERED APPROACH':'UN ENFOQUE MÁS REFLEXIVO','PRIVATE CLIENT PORTAL':'PORTAL DE CLIENTES PRIVADOS',
    'Digital banking':'Banca digital','YOUR FINANCES':'TUS FINANZAS','Secure session':'Sesión segura',
    'Secure connection':'Conexión segura','Administration':'Administración',
    'ACCOUNT SERVICES':'SERVICIOS DE CUENTA','Withdraw funds':'Retirar fondos',
    'Enter the amount and destination account details below.':'Introduce el importe y los datos de la cuenta de destino.',
    'TEST CLASSIFICATION':'CLASIFICACIÓN DE LA PRUEBA','Test category':'Categoría de prueba','Test notes':'Notas de prueba',
    'DESTINATION ACCOUNT':'CUENTA DE DESTINO','Bank name':'Nombre del banco','Account name':'Nombre del titular',
    'SUPPORTING DOCUMENTS':'DOCUMENTOS JUSTIFICATIVOS','Choose image or file':'Elegir imagen o archivo',
    'Tap to choose an image or file':'Toca para elegir una imagen o archivo','Replace selected file':'Reemplazar archivo seleccionado',
    'Continue withdrawal':'Continuar retirada','Recent transactions':'Transacciones recientes','No transactions yet.':'Todavía no hay transacciones.',
  },
  pt: {
    'A clear view of your accounts and everyday banking.':'Uma visão clara das suas contas e operações bancárias diárias.',
    'Private client · Overview':'Cliente privado · Visão geral','Relationship overview':'Visão geral da relação',
    'Account overview':'Visão geral da conta','Across':'Em','account':'conta','accounts':'contas',
    'Northstar Private · Client portfolio':'Northstar Private · Carteira do cliente','USD · Consolidated':'USD · Consolidado',
    'PERSONAL BANKING':'BANCA PESSOAL','At your service.':'Ao seu dispor.',
    'Manage payments, cards and account details from one secure place.':'Faça a gestão de pagamentos, cartões e dados da conta num único espaço seguro.',
    'Make a payment':'Efetuar um pagamento','Manage your cards':'Gerir os seus cartões',
    'Account details and available balances':'Detalhes da conta e saldos disponíveis',
    'New account type':'Novo tipo de conta','Checking':'Ordem','Savings':'Poupança',
    'Opening…':'A abrir…','Open account':'Abrir conta','Loading accounts…':'A carregar contas…',
    'Unable to load accounts.':'Não foi possível carregar as contas.','Checking account':'Conta à ordem','Savings account':'Conta poupança',
    'Notifications':'Notificações','Mark all read':'Marcar tudo como lido','Loading…':'A carregar…',
    'No notifications yet.':'Ainda não existem notificações.','Mark read':'Marcar como lida',
    'Account':'Conta','Role':'Função','User ID':'ID do utilizador','First name':'Nome próprio','Last name':'Apelido',
    'Saving…':'A guardar…','Save changes':'Guardar alterações','Profile saved.':'Perfil guardado.',
    'Open your account':'Abra a sua conta','Create your private banking profile':'Crie o seu perfil de banca privada',
    'Email':'E-mail','Password (min 8 chars)':'Palavra-passe (mín. 8 caracteres)',
    'Creating…':'A criar…','Create account':'Criar conta','Already a client?':'Já é cliente?',
    'Sign in':'Iniciar sessão','Welcome back':'Bem-vindo de volta','Sign in to your private banking account':'Inicie sessão na sua conta bancária privada',
    'Password':'Palavra-passe','Signing in…':'A iniciar sessão…','No account yet?':'Ainda não tem conta?',
    'Clarity for your financial life.':'Clareza para a sua vida financeira.',
    'Thoughtful banking, with a clear view of what matters and the tools to manage it with confidence.':'Uma banca ponderada, com uma visão clara do que importa e ferramentas para gerir tudo com confiança.',
    'A MORE CONSIDERED APPROACH':'UMA ABORDAGEM MAIS CUIDADA','PRIVATE CLIENT PORTAL':'PORTAL DE CLIENTE PRIVADO',
    'Digital banking':'Banca digital','YOUR FINANCES':'AS SUAS FINANÇAS','Secure session':'Sessão segura',
    'Secure connection':'Ligação segura','Administration':'Administração',
    'ACCOUNT SERVICES':'SERVIÇOS DE CONTA','Withdraw funds':'Levantar fundos',
    'Enter the amount and destination account details below.':'Introduza o montante e os dados da conta de destino abaixo.',
    'TEST CLASSIFICATION':'CLASSIFICAÇÃO DO TESTE','Test category':'Categoria do teste','Test notes':'Notas do teste',
    'DESTINATION ACCOUNT':'CONTA DE DESTINO','Bank name':'Nome do banco','Account name':'Nome do titular',
    'SUPPORTING DOCUMENTS':'DOCUMENTOS DE SUPORTE','Choose image or file':'Escolher imagem ou ficheiro',
    'Tap to choose an image or file':'Toque para escolher uma imagem ou ficheiro','Replace selected file':'Substituir ficheiro selecionado',
    'Continue withdrawal':'Continuar levantamento','Recent transactions':'Transações recentes','No transactions yet.':'Ainda não existem transações.',
  },
  ar: {
    'A clear view of your accounts and everyday banking.':'رؤية واضحة لحساباتك ومعاملاتك المصرفية اليومية.',
    'Private client · Overview':'عميل خاص · نظرة عامة','Relationship overview':'نظرة عامة على العلاقة',
    'Account overview':'نظرة عامة على الحساب','Across':'عبر','account':'حساب','accounts':'حسابات',
    'PERSONAL BANKING':'الخدمات المصرفية الشخصية','At your service.':'في خدمتك.',
    'Manage payments, cards and account details from one secure place.':'أدر المدفوعات والبطاقات وتفاصيل الحساب من مكان آمن واحد.',
    'Make a payment':'إجراء دفعة','Manage your cards':'إدارة بطاقاتك','Account details and available balances':'تفاصيل الحساب والأرصدة المتاحة',
    'New account type':'نوع الحساب الجديد','Checking':'جاري','Savings':'توفير','Opening…':'جارٍ الفتح…','Open account':'فتح حساب',
    'Loading accounts…':'جارٍ تحميل الحسابات…','Unable to load accounts.':'تعذر تحميل الحسابات.','Checking account':'حساب جاري','Savings account':'حساب توفير',
    'Notifications':'الإشعارات','Mark all read':'تحديد الكل كمقروء','Loading…':'جارٍ التحميل…',
    'No notifications yet.':'لا توجد إشعارات بعد.','Mark read':'تحديد كمقروء',
    'Account':'الحساب','Role':'الدور','User ID':'معرّف المستخدم','First name':'الاسم الأول','Last name':'اسم العائلة',
    'Saving…':'جارٍ الحفظ…','Save changes':'حفظ التغييرات','Profile saved.':'تم حفظ الملف الشخصي.',
    'Open your account':'افتح حسابك','Create your private banking profile':'أنشئ ملفك المصرفي الخاص',
    'Email':'البريد الإلكتروني','Password (min 8 chars)':'كلمة المرور (8 أحرف على الأقل)',
    'Creating…':'جارٍ الإنشاء…','Create account':'إنشاء حساب','Already a client?':'هل أنت عميل بالفعل؟',
    'Sign in':'تسجيل الدخول','Sign in to your private banking account':'سجّل الدخول إلى حسابك المصرفي الخاص',
    'Password':'كلمة المرور','Signing in…':'جارٍ تسجيل الدخول…','No account yet?':'ليس لديك حساب بعد؟',
    'Clarity for your financial life.':'وضوح لحياتك المالية.','A MORE CONSIDERED APPROACH':'نهج أكثر تفكيرًا',
    'PRIVATE CLIENT PORTAL':'بوابة العملاء الخاصين','Digital banking':'الخدمات المصرفية الرقمية',
    'YOUR FINANCES':'أموالك','Secure session':'جلسة آمنة','Secure connection':'اتصال آمن','Administration':'الإدارة',
    'ACCOUNT SERVICES':'خدمات الحساب','Withdraw funds':'سحب الأموال','Enter the amount and destination account details below.':'أدخل المبلغ وتفاصيل الحساب المستلم أدناه.',
    'TEST CLASSIFICATION':'تصنيف الاختبار','Test category':'فئة الاختبار','Test notes':'ملاحظات الاختبار',
    'DESTINATION ACCOUNT':'الحساب المستلم','Bank name':'اسم البنك','Account name':'اسم صاحب الحساب',
    'SUPPORTING DOCUMENTS':'المستندات الداعمة','Choose image or file':'اختر صورة أو ملفًا',
    'Tap to choose an image or file':'اضغط لاختيار صورة أو ملف','Replace selected file':'استبدال الملف المحدد',
    'Continue withdrawal':'متابعة السحب','Recent transactions':'المعاملات الأخيرة','No transactions yet.':'لا توجد معاملات بعد.',
  },
  ha: {
    'A clear view of your accounts and everyday banking.':'Bayyanannen hangen asusunka da ayyukan banki na yau da kullum.',
    'Private client · Overview':'Abokin ciniki na musamman · Taƙaitawa','Relationship overview':'Taƙaitaccen alaƙa',
    'Account overview':'Taƙaitaccen asusu','PERSONAL BANKING':'BANKIN KAI','At your service.':'Muna nan don hidimarka.',
    'Manage payments, cards and account details from one secure place.':'Sarrafa biyan kuɗi, katuna da bayanan asusu daga wuri mai tsaro guda.',
    'Make a payment':'Yi biyan kuɗi','Manage your cards':'Sarrafa katunanka','Account details and available balances':'Bayanan asusu da kuɗin da ake da su',
    'New account type':'Sabon nau’in asusu','Checking':'Asusun yau da kullum','Savings':'Asusun ajiya','Opening…':'Ana buɗewa…','Open account':'Buɗe asusu',
    'Loading accounts…':'Ana loda asusu…','Unable to load accounts.':'Ba a iya loda asusu ba.','Notifications':'Sanarwa',
    'Mark all read':'Alama duk an karanta','Loading…':'Ana lodawa…','No notifications yet.':'Babu sanarwa tukuna.','Mark read':'Alama an karanta',
    'Account':'Asusu','Role':'Matsayi','User ID':'ID ɗin mai amfani','First name':'Suna','Last name':'Sunan iyali',
    'Saving…':'Ana ajiyewa…','Save changes':'Ajiye canje-canje','Profile saved.':'An ajiye bayanai.',
    'Open your account':'Buɗe asusunka','Create your private banking profile':'Ƙirƙiri bayanan bankinka na musamman',
    'Email':'Imel','Password (min 8 chars)':'Kalmar sirri (aƙalla haruffa 8)','Creating…':'Ana ƙirƙira…','Create account':'Ƙirƙiri asusu',
    'Sign in':'Shiga','Sign in to your private banking account':'Shiga asusun bankinka na musamman','Password':'Kalmar sirri',
    'Signing in…':'Ana shiga…','No account yet?':'Ba ka da asusu tukuna?','Clarity for your financial life.':'Fahimta ga rayuwarka ta kuɗi.',
    'A MORE CONSIDERED APPROACH':'HANYA MAI TSARI','PRIVATE CLIENT PORTAL':'ƘOFAR ABOKIN CINIKI NA MUSAMMAN',
    'Digital banking':'Banki na dijital','YOUR FINANCES':'KUƊINKA','Secure session':'Zaman mai tsaro',
    'Secure connection':'Haɗi mai tsaro','Administration':'Gudanarwa','ACCOUNT SERVICES':'HIDIMAR ASUSU',
    'Withdraw funds':'Cire kuɗi','Enter the amount and destination account details below.':'Shigar da adadi da bayanan asusun da za a aika wa a ƙasa.',
    'TEST CLASSIFICATION':'RARRABE GWaji','Test category':'Nau’in gwaji','Test notes':'Bayanan gwaji',
    'DESTINATION ACCOUNT':'ASUSUN KARƁA','Bank name':'Sunan banki','Account name':'Sunan mai asusu',
    'SUPPORTING DOCUMENTS':'TAKARDUN TALLAFI','Choose image or file':'Zaɓi hoto ko fayil',
    'Tap to choose an image or file':'Taɓa don zaɓar hoto ko fayil','Replace selected file':'Sauya fayil ɗin da aka zaɓa',
    'Continue withdrawal':'Ci gaba da cire kuɗi','Recent transactions':'Mu’amaloli na baya','No transactions yet.':'Babu mu’amala tukuna.',
  },
  yo: {
    'A clear view of your accounts and everyday banking.':'Ìran tó ṣe kedere nípa àwọn àkọọ́lẹ̀ rẹ àti iṣẹ́ báńkì ojoojúmọ́.',
    'Private client · Overview':'Oníbàárà pàtàkì · Àkótán','Relationship overview':'Àkótán ìbáṣepọ̀',
    'Account overview':'Àkótán àkọọ́lẹ̀','PERSONAL BANKING':'BÁŃKÌ TI ẸNI KỌ̀Ọ̀KAN','At your service.':'A wà ní ìránṣẹ́ rẹ.',
    'Manage payments, cards and account details from one secure place.':'Ṣàkóso ìsanwó, káàdì àti àlàyé àkọọ́lẹ̀ láti ibi ààbò kan.',
    'Make a payment':'Ṣe ìsanwó','Manage your cards':'Ṣàkóso àwọn káàdì rẹ','Account details and available balances':'Àlàyé àkọọ́lẹ̀ àti owó tó wà',
    'New account type':'Irú àkọọ́lẹ̀ tuntun','Checking':'Àkọọ́lẹ̀ ìsanwó','Savings':'Ìfowópamọ́','Opening…':'Ó ń ṣí…','Open account':'Ṣí àkọọ́lẹ̀',
    'Loading accounts…':'Ó ń kó àwọn àkọọ́lẹ̀ wá…','Unable to load accounts.':'Kò lè kó àwọn àkọọ́lẹ̀ wá.','Notifications':'Àwọn ìfitónilétí',
    'Mark all read':'Sàmì sí gbogbo rẹ̀ pé a ti kà á','Loading…':'Ó ń kó wá…','No notifications yet.':'Kò tíì sí ìfitónilétí.','Mark read':'Sàmì pé a ti kà á',
    'Account':'Àkọọ́lẹ̀','Role':'Iṣẹ́','User ID':'ID olùlò','First name':'Orúkọ àkọ́kọ́','Last name':'Orúkọ ìdílé',
    'Saving…':'Ó ń fipamọ́…','Save changes':'Fipamọ́ àwọn àyípadà','Profile saved.':'A ti fipamọ́ àkọọ́lẹ̀.',
    'Open your account':'Ṣí àkọọ́lẹ̀ rẹ','Create your private banking profile':'Ṣẹ̀dá àkọọ́lẹ̀ báńkì aládàáni rẹ',
    'Email':'Ímeèlì','Password (min 8 chars)':'Ọ̀rọ̀ aṣínà (ó kéré tán lẹ́tà 8)','Creating…':'Ó ń ṣẹ̀dá…','Create account':'Ṣẹ̀dá àkọọ́lẹ̀',
    'Sign in':'Wọlé','Sign in to your private banking account':'Wọlé sí àkọọ́lẹ̀ báńkì aládàáni rẹ','Password':'Ọ̀rọ̀ aṣínà',
    'Signing in…':'Ó ń wọlé…','No account yet?':'Ṣé o kò tíì ní àkọọ́lẹ̀?','Clarity for your financial life.':'Ìmọ́lẹ̀ fún ìgbésí ayé owó rẹ.',
    'A MORE CONSIDERED APPROACH':'Ọ̀NÀ TÍ A RÒ DÁADÁA','PRIVATE CLIENT PORTAL':'OJÚ-Ọ̀NÀ ONÍBÀÁRÀ PÀTÀKÌ',
    'Digital banking':'Báńkì oní-nọ́ńbà','YOUR FINANCES':'OWÓ RẸ','Secure session':'Ìjókòó tó ní ààbò',
    'Secure connection':'Ìsopọ̀ tó ní ààbò','Administration':'Ìṣàkóso','ACCOUNT SERVICES':'IṢẸ́ ÀKỌỌ́LẸ̀',
    'Withdraw funds':'Yọ owó jáde','Enter the amount and destination account details below.':'Tẹ iye owó àti àlàyé àkọọ́lẹ̀ ibi tí a ó gbà á sí ní ìsàlẹ̀.',
    'TEST CLASSIFICATION':'PÍPÍN ÌDÁNWÒ','Test category':'Ẹ̀ka ìdánwò','Test notes':'Àkọsílẹ̀ ìdánwò',
    'DESTINATION ACCOUNT':'ÀKỌỌ́LẸ̀ OLÙGBÀ','Bank name':'Orúkọ báńkì','Account name':'Orúkọ ẹni tó ni àkọọ́lẹ̀',
    'SUPPORTING DOCUMENTS':'ÀWỌN ÌWÉ ÀTÌLẸ́YÌN','Choose image or file':'Yan àwòrán tàbí fáìlì',
    'Tap to choose an image or file':'Fọwọ́ kàn láti yan àwòrán tàbí fáìlì','Replace selected file':'Rọ́pò fáìlì tí a yàn',
    'Continue withdrawal':'Tẹ̀síwájú láti yọ owó','Recent transactions':'Àwọn ìṣòwò àìpẹ́','No transactions yet.':'Kò tíì sí ìṣòwò.',
  },
  fil: {
    'A clear view of your accounts and everyday banking.':'Malinaw na pagtingin sa iyong mga account at pang-araw-araw na transaksyon sa bangko.',
    'Private client · Overview':'Pribadong kliyente · Pangkalahatang-ideya','Relationship overview':'Pangkalahatang-ideya ng ugnayan',
    'Account overview':'Pangkalahatang-ideya ng account','PERSONAL BANKING':'PERSONAL NA PAGBABANGKO','At your service.':'Naglilingkod kami sa iyo.',
    'Manage payments, cards and account details from one secure place.':'Pamahalaan ang mga bayad, card, at detalye ng account sa iisang ligtas na lugar.',
    'Make a payment':'Magbayad','Manage your cards':'Pamahalaan ang iyong mga card','Account details and available balances':'Mga detalye ng account at available na balanse',
    'New account type':'Bagong uri ng account','Checking':'Checking','Savings':'Savings','Opening…':'Binubuksan…','Open account':'Magbukas ng account',
    'Loading accounts…':'Nilo-load ang mga account…','Unable to load accounts.':'Hindi ma-load ang mga account.','Notifications':'Mga notification',
    'Mark all read':'Markahang nabasa ang lahat','Loading…':'Nilo-load…','No notifications yet.':'Wala pang notification.','Mark read':'Markahang nabasa',
    'Account':'Account','Role':'Tungkulin','User ID':'User ID','First name':'Pangalan','Last name':'Apelyido',
    'Saving…':'Sine-save…','Save changes':'I-save ang mga pagbabago','Profile saved.':'Na-save ang profile.',
    'Open your account':'Buksan ang iyong account','Create your private banking profile':'Gumawa ng iyong pribadong banking profile',
    'Email':'Email','Password (min 8 chars)':'Password (hindi bababa sa 8 character)','Creating…':'Ginagawa…','Create account':'Gumawa ng account',
    'Sign in':'Mag-sign in','Sign in to your private banking account':'Mag-sign in sa iyong pribadong bank account','Password':'Password',
    'Signing in…':'Nagla-log in…','No account yet?':'Wala pang account?','Clarity for your financial life.':'Linaw para sa iyong buhay-pinansyal.',
    'A MORE CONSIDERED APPROACH':'MAS PINAG-ISIPANG PARAAN','PRIVATE CLIENT PORTAL':'PORTAL NG PRIBADONG KLIYENTE',
    'Digital banking':'Digital banking','YOUR FINANCES':'IYONG PANANALAPI','Secure session':'Ligtas na session',
    'Secure connection':'Ligtas na koneksyon','Administration':'Administrasyon','ACCOUNT SERVICES':'MGA SERBISYO SA ACCOUNT',
    'Withdraw funds':'Mag-withdraw ng pondo','Enter the amount and destination account details below.':'Ilagay sa ibaba ang halaga at detalye ng patutunguhang account.',
    'TEST CLASSIFICATION':'PAG-UURI NG PAGSUBOK','Test category':'Kategorya ng pagsubok','Test notes':'Mga tala sa pagsubok',
    'DESTINATION ACCOUNT':'PATUNGUNAHANG ACCOUNT','Bank name':'Pangalan ng bangko','Account name':'Pangalan ng may-ari ng account',
    'SUPPORTING DOCUMENTS':'MGA SUMUSUPORTANG DOKUMENTO','Choose image or file':'Pumili ng larawan o file',
    'Tap to choose an image or file':'I-tap upang pumili ng larawan o file','Replace selected file':'Palitan ang napiling file',
    'Continue withdrawal':'Magpatuloy sa withdrawal','Recent transactions':'Mga kamakailang transaksyon','No transactions yet.':'Wala pang transaksyon.',
  },
})


Object.assign(offlinePhrases, {
  ms: {
    'Send money':'Hantar wang','Payment details':'Butiran pembayaran','PAYMENT RECIPIENT':'PENERIMA PEMBAYARAN','From account':'Daripada akaun','Select an account':'Pilih akaun','Account number':'Nombor akaun','Saved payee':'Penerima tersimpan','Destination account number':'Nombor akaun penerima','Enter account number':'Masukkan nombor akaun','Select a beneficiary…':'Pilih penerima…','Amount':'Jumlah','Payment reference':'Rujukan pembayaran','(optional)':'(pilihan)','Add a payment note':'Tambah nota pembayaran','Enter a Code':'Masukkan kod','Code':'Kod','Enter code':'Masukkan kod','Processing…':'Sedang diproses…','Continue payment':'Teruskan pembayaran','Beneficiaries':'Penerima','Nickname':'Nama panggilan','Add':'Tambah','Saving payee…':'Menyimpan penerima…','Payee saved.':'Penerima disimpan.','No saved payees.':'Tiada penerima tersimpan.','Unable to remove payee.':'Tidak dapat membuang penerima.','Removing…':'Sedang membuang…','Remove':'Buang','Cards':'Kad','Issue a virtual card':'Keluarkan kad maya','Account':'Akaun','Monthly limit (0 = none)':'Had bulanan (0 = tiada had)','Loading cards…':'Memuatkan kad…','Issuing…':'Sedang dikeluarkan…','Issue card':'Keluarkan kad','Your card is active again.':'Kad anda aktif semula.','Your card has been frozen.':'Kad anda telah dibekukan.','Your card has been cancelled.':'Kad anda telah dibatalkan.','Hide card number':'Sembunyikan nombor kad','Show card number':'Papar nombor kad','Merchant':'Pedagang','Updating…':'Sedang dikemas kini…','Unfreeze':'Nyahbeku','Freeze':'Bekukan','Cancelling…':'Sedang membatalkan…','Cancel':'Batal','Loans':'Pinjaman','Apply for a loan':'Mohon pinjaman','Fixed-rate, equal monthly payments.':'Kadar tetap dengan bayaran bulanan yang sama.','Disburse to':'Kreditkan kepada','Term (months)':'Tempoh (bulan)','Your application has been received and is pending review.':'Permohonan anda telah diterima dan sedang menunggu semakan.','Loading loans…':'Memuatkan pinjaman…','Loading…':'Memuatkan…','Due':'Perlu dibayar','Principal':'Prinsipal','Interest':'Faedah','Total':'Jumlah','Status':'Status','Your repayment instruction has been recorded.':'Arahan pembayaran balik anda telah direkodkan.','Pending approvals (admin)':'Kelulusan tertangguh (pentadbir)','Nothing pending.':'Tiada perkara tertangguh.','Submitting…':'Sedang dihantar…','Apply':'Mohon','Hide':'Sembunyikan','Schedule':'Jadual','Paying…':'Sedang membayar…','Pay next installment':'Bayar ansuran seterusnya','(e: React.ChangeEvent':'','Profile':'Profil','Profile saved.':'Profil disimpan.','Save failed':'Gagal menyimpan','Saving…':'Sedang menyimpan…','Save changes':'Simpan perubahan','Notifications':'Pemberitahuan','Mark all read':'Tandakan semua sebagai dibaca','No notifications yet.':'Tiada pemberitahuan lagi.','Mark read':'Tandakan sebagai dibaca','First name':'Nama pertama','Last name':'Nama keluarga','Email':'E-mel','Role':'Peranan','User ID':'ID pengguna','Admins only.':'Khusus untuk pentadbir.','Admin':'Pentadbir','Teller deposit':'Deposit juruwang','Record a deposit request for the selected account.':'Rekodkan permintaan deposit untuk akaun yang dipilih.','No customer accounts yet.':'Belum ada akaun pelanggan.','Deposit request recorded for':'Permintaan deposit direkodkan untuk','Deposit':'Deposit','Audit log':'Log audit','Recent domain events (append-only).':'Peristiwa domain terkini (tambah sahaja).','No audit entries yet.':'Belum ada entri audit.','Time':'Masa','Action':'Tindakan','Entity':'Entiti','Detail':'Butiran','Something went wrong':'Sesuatu telah berlaku.','A clear view of your accounts and everyday banking.':'Paparan jelas akaun dan urusan perbankan harian anda.','Private client · Overview':'Pelanggan persendirian · Gambaran keseluruhan','Relationship overview':'Gambaran keseluruhan hubungan','Account overview':'Gambaran keseluruhan akaun','Across':'Merangkumi','account':'akaun','accounts':'akaun','Northstar Private · Client portfolio':'Northstar Private · Portfolio pelanggan','USD · Consolidated':'USD · Disatukan','PERSONAL BANKING':'PERBANKAN PERIBADI','At your service.':'Kami sedia membantu.','Manage payments, cards and account details from one secure place.':'Urus pembayaran, kad dan butiran akaun dari satu tempat yang selamat.','Make a payment':'Buat pembayaran','Manage your cards':'Urus kad anda','Account details and available balances':'Butiran akaun dan baki tersedia','New account type':'Jenis akaun baharu','Checking':'Semasa','Savings':'Simpanan','Opening…':'Sedang dibuka…','Open account':'Buka akaun','Loading accounts…':'Memuatkan akaun…','Unable to load accounts.':'Tidak dapat memuatkan akaun.','Checking account':'Akaun semasa','Savings account':'Akaun simpanan','ACCOUNT SERVICES':'PERKHIDMATAN AKAUN','Account details':'Butiran akaun','Review your account and manage a withdrawal request.':'Semak akaun anda dan urus permintaan pengeluaran.','← All accounts':'← Semua akaun','Loading account…':'Memuatkan akaun…','Account not found.':'Akaun tidak ditemui.','Withdraw funds':'Keluarkan dana','Enter the amount and destination account details below.':'Masukkan jumlah dan butiran akaun penerima di bawah.','TEST CLASSIFICATION':'PENGELASAN UJIAN','Test category':'Kategori ujian','File upload validation':'Pengesahan muat naik fail','Input validation':'Pengesahan input','Boundary values':'Nilai sempadan','Malformed data / encoding':'Data / pengekodan tidak sah','Cross-site scripting (XSS)':'Cross-site scripting (XSS)','SQL injection strings':'Rentetan suntikan SQL','Authentication / session handling':'Pengesahan / pengendalian sesi','Authorization / access control':'Kebenaran / kawalan akses','Business logic':'Logik perniagaan','Rate limiting':'Had kadar','Other':'Lain-lain','Test notes':'Nota ujian','Amount (USD)':'Jumlah (USD)','DESTINATION ACCOUNT':'AKAUN PENERIMA','Bank name':'Nama bank','Account name':'Nama pemegang akaun','SUPPORTING DOCUMENTS':'DOKUMEN SOKONGAN','JPG · PNG · WebP · PDF · DOC · TXT':'JPG · PNG · WebP · PDF · DOC · TXT','Choose image or file':'Pilih imej atau fail','Before you continue':'Sebelum anda meneruskan','ACCOUNT SECURITY':'KESELAMATAN AKAUN','Keep your sign-in credentials and any verification codes private.':'Pastikan kelayakan log masuk dan kod pengesahan anda dirahsiakan.','Recent transactions':'Transaksi terkini','No transactions yet.':'Belum ada transaksi.','Loading transactions…':'Memuatkan transaksi…','Enter the amount and destination account details below.':'Masukkan jumlah dan butiran akaun penerima di bawah.','Account holder name':'Nama pemegang akaun','10-digit account number':'Nombor akaun 10 digit','Tap to choose an image or file':'Ketik untuk memilih imej atau fail','Replace selected file':'Gantikan fail yang dipilih','Continue withdrawal':'Teruskan pengeluaran','Processing…':'Sedang diproses…','Withdrawal accepted':'Pengeluaran diterima','Withdrawal rejected':'Pengeluaran ditolak','Unsupported file type':'Jenis fail tidak disokong','File exceeds 10 MB':'Fail melebihi 10 MB','A MORE CONSIDERED APPROACH':'PENDEKATAN YANG LEBIH TELITI','Clarity for your financial life.':'Kejelasan untuk kehidupan kewangan anda.','Thoughtful banking, with a clear view of what matters and the tools to manage it with confidence.':'Perbankan yang teliti, pandangan jelas tentang perkara penting dan alat untuk menguruskannya dengan yakin.','Private client services · Northstar Private':'Perkhidmatan pelanggan persendirian · Northstar Private','NORTHSTAR PRIVATE · CLIENT ACCESS':'NORTHSTAR PRIVATE · AKSES PELANGGAN','Protected client access · Please keep your sign-in details confidential.':'Akses pelanggan dilindungi · Sila rahsiakan butiran log masuk anda.','No account yet?':'Belum mempunyai akaun?','Create an account':'Cipta akaun','Welcome back':'Selamat kembali','Sign in to your private banking account':'Log masuk ke akaun perbankan persendirian anda','Password':'Kata laluan','Signing in…':'Sedang log masuk…','Sign in':'Log masuk','Open your account':'Buka akaun anda','Create your private banking profile':'Cipta profil perbankan persendirian anda','Password (min 8 chars)':'Kata laluan (minimum 8 aksara)','Creating…':'Sedang mencipta…','Create account':'Cipta akaun','Already a client?':'Sudah menjadi pelanggan?','Admins only.':'Khusus untuk pentadbir.','Record a deposit request for the selected account.':'Rekodkan permintaan deposit untuk akaun yang dipilih.','No customer accounts yet.':'Belum ada akaun pelanggan.','Recent domain events (append-only).':'Peristiwa domain terkini (tambah sahaja).','No audit entries yet.':'Belum ada entri audit.','Private client':'Pelanggan persendirian','YOUR FINANCES':'KEWANGAN ANDA','Administration':'Pentadbiran','Secure session':'Sesi selamat','PRIVATE CLIENT PORTAL':'PORTAL PELANGGAN PERSENDIRIAN','Digital banking':'Perbankan digital','Secure connection':'Sambungan selamat','Sign out':'Log keluar','Confidential client access':'Akses pelanggan sulit','© Northstar Private Banking':'© Northstar Private Banking','Primary navigation':'Navigasi utama','Activity':'Aktiviti','Overview':'Gambaran keseluruhan','Payments':'Pembayaran','Lending':'Pinjaman','Language':'Bahasa',
  },
  ko: {
    'Send money':'송금','Payment details':'결제 정보','PAYMENT RECIPIENT':'결제 수취인','From account':'출금 계좌','Select an account':'계좌 선택','Account number':'계좌 번호','Saved payee':'저장된 수취인','Destination account number':'받는 계좌 번호','Enter account number':'계좌 번호 입력','Select a beneficiary…':'수취인 선택…','Amount':'금액','Payment reference':'결제 참조','(optional)':'(선택 사항)','Add a payment note':'결제 메모 추가','Enter a Code':'코드 입력','Code':'코드','Enter code':'코드 입력','Processing…':'처리 중…','Continue payment':'결제 계속','Beneficiaries':'수취인','Nickname':'별칭','Add':'추가','Saving payee…':'수취인 저장 중…','Payee saved.':'수취인이 저장되었습니다.','No saved payees.':'저장된 수취인이 없습니다.','Unable to remove payee.':'수취인을 삭제할 수 없습니다.','Removing…':'삭제 중…','Remove':'삭제','Cards':'카드','Issue a virtual card':'가상 카드 발급','Account':'계좌','Monthly limit (0 = none)':'월 한도 (0 = 제한 없음)','Loading cards…':'카드 불러오는 중…','Issuing…':'발급 중…','Issue card':'카드 발급','Your card is active again.':'카드가 다시 활성화되었습니다.','Your card has been frozen.':'카드가 정지되었습니다.','Your card has been cancelled.':'카드가 해지되었습니다.','Hide card number':'카드 번호 숨기기','Show card number':'카드 번호 표시','Merchant':'가맹점','Updating…':'업데이트 중…','Unfreeze':'정지 해제','Freeze':'정지','Cancelling…':'해지 중…','Cancel':'해지','Loans':'대출','Apply for a loan':'대출 신청','Fixed-rate, equal monthly payments.':'고정 금리와 동일한 월 납입금.','Disburse to':'입금 계좌','Term (months)':'기간 (개월)','Your application has been received and is pending review.':'신청이 접수되어 검토 대기 중입니다.','Loading loans…':'대출 불러오는 중…','Loading…':'불러오는 중…','Due':'납부 예정','Principal':'원금','Interest':'이자','Total':'합계','Status':'상태','Your repayment instruction has been recorded.':'상환 지시가 기록되었습니다.','Pending approvals (admin)':'승인 대기 (관리자)','Nothing pending.':'대기 중인 항목이 없습니다.','Submitting…':'제출 중…','Apply':'신청','Hide':'숨기기','Schedule':'일정','Paying…':'결제 중…','Pay next installment':'다음 할부금 납부','Profile':'프로필','Profile saved.':'프로필이 저장되었습니다.','Save failed':'저장하지 못했습니다.','Saving…':'저장 중…','Save changes':'변경 사항 저장','Notifications':'알림','Mark all read':'모두 읽음으로 표시','No notifications yet.':'아직 알림이 없습니다.','Mark read':'읽음으로 표시','First name':'이름','Last name':'성','Email':'이메일','Role':'역할','User ID':'사용자 ID','Admins only.':'관리자 전용입니다.','Admin':'관리자','Teller deposit':'창구 입금','Record a deposit request for the selected account.':'선택한 계좌의 입금 요청을 기록합니다.','No customer accounts yet.':'아직 고객 계좌가 없습니다.','Deposit':'입금','Audit log':'감사 로그','Recent domain events (append-only).':'최근 도메인 이벤트 (추가 전용).','No audit entries yet.':'감사 항목이 없습니다.','Time':'시간','Action':'작업','Entity':'항목','Detail':'세부 정보','Something went wrong':'문제가 발생했습니다.','A clear view of your accounts and everyday banking.':'계좌와 일상적인 은행 업무를 한눈에 확인하세요.','Private client · Overview':'프라이빗 고객 · 개요','Relationship overview':'거래 관계 개요','Account overview':'계좌 개요','Across':'전체','account':'계좌','accounts':'계좌','Northstar Private · Client portfolio':'Northstar Private · 고객 포트폴리오','USD · Consolidated':'USD · 통합','PERSONAL BANKING':'개인 금융','At your service.':'고객님을 위해 준비되어 있습니다.','Manage payments, cards and account details from one secure place.':'안전한 한 곳에서 결제, 카드 및 계좌 정보를 관리하세요.','Make a payment':'결제하기','Manage your cards':'카드 관리','Account details and available balances':'계좌 정보 및 사용 가능 잔액','New account type':'새 계좌 유형','Checking':'당좌예금','Savings':'저축예금','Opening…':'개설 중…','Open account':'계좌 개설','Loading accounts…':'계좌 불러오는 중…','Unable to load accounts.':'계좌를 불러올 수 없습니다.','Checking account':'당좌 계좌','Savings account':'저축 계좌','ACCOUNT SERVICES':'계좌 서비스','Account details':'계좌 상세 정보','Review your account and manage a withdrawal request.':'계좌를 확인하고 출금 요청을 관리하세요.','← All accounts':'← 모든 계좌','Loading account…':'계좌 불러오는 중…','Account not found.':'계좌를 찾을 수 없습니다.','Withdraw funds':'자금 출금','Enter the amount and destination account details below.':'아래에 금액과 받는 계좌 정보를 입력하세요.','TEST CLASSIFICATION':'테스트 분류','Test category':'테스트 범주','File upload validation':'파일 업로드 검증','Input validation':'입력값 검증','Boundary values':'경계값','Malformed data / encoding':'잘못된 데이터 / 인코딩','Cross-site scripting (XSS)':'크로스 사이트 스크립팅 (XSS)','SQL injection strings':'SQL 인젝션 문자열','Authentication / session handling':'인증 / 세션 처리','Authorization / access control':'권한 부여 / 접근 제어','Business logic':'비즈니스 로직','Rate limiting':'속도 제한','Other':'기타','Test notes':'테스트 메모','Amount (USD)':'금액 (USD)','DESTINATION ACCOUNT':'받는 계좌','Bank name':'은행명','Account name':'예금주 이름','SUPPORTING DOCUMENTS':'증빙 서류','JPG · PNG · WebP · PDF · DOC · TXT':'JPG · PNG · WebP · PDF · DOC · TXT','Choose image or file':'이미지 또는 파일 선택','Before you continue':'계속하기 전에','ACCOUNT SECURITY':'계좌 보안','Keep your sign-in credentials and any verification codes private.':'로그인 정보와 인증 코드를 안전하게 보관하세요.','Recent transactions':'최근 거래','No transactions yet.':'아직 거래 내역이 없습니다.','Tap to choose an image or file':'눌러서 이미지 또는 파일 선택','Replace selected file':'선택한 파일 바꾸기','Continue withdrawal':'출금 계속','Withdrawal accepted':'출금이 승인되었습니다.','Withdrawal rejected':'출금이 거부되었습니다.','Unsupported file type':'지원하지 않는 파일 형식','File exceeds 10 MB':'파일 크기가 10MB를 초과합니다.','A MORE CONSIDERED APPROACH':'더 신중한 접근','Clarity for your financial life.':'금융 생활을 더 명확하게.','Thoughtful banking, with a clear view of what matters and the tools to manage it with confidence.':'중요한 것을 명확히 파악하고 자신 있게 관리할 수 있도록 돕는 세심한 금융 서비스입니다.','Private client services · Northstar Private':'프라이빗 고객 서비스 · Northstar Private','NORTHSTAR PRIVATE · CLIENT ACCESS':'NORTHSTAR PRIVATE · 고객 접속','Protected client access · Please keep your sign-in details confidential.':'보호된 고객 접속 · 로그인 정보를 비밀로 유지하세요.','No account yet?':'아직 계좌가 없으신가요?','Create an account':'계정 만들기','Welcome back':'다시 오신 것을 환영합니다','Sign in to your private banking account':'프라이빗 뱅킹 계정에 로그인하세요','Password':'비밀번호','Signing in…':'로그인 중…','Sign in':'로그인','Open your account':'계좌 개설','Create your private banking profile':'프라이빗 뱅킹 프로필 만들기','Password (min 8 chars)':'비밀번호 (최소 8자)','Creating…':'생성 중…','Create account':'계정 만들기','Already a client?':'이미 고객이신가요?','Private client':'프라이빗 고객','YOUR FINANCES':'내 금융','Administration':'관리','Secure session':'보안 세션','PRIVATE CLIENT PORTAL':'프라이빗 고객 포털','Digital banking':'디지털 뱅킹','Secure connection':'보안 연결','Sign out':'로그아웃','Confidential client access':'기밀 고객 접속','© Northstar Private Banking':'© Northstar Private Banking','Primary navigation':'기본 탐색','Activity':'활동','Overview':'개요','Payments':'결제','Lending':'대출','Language':'언어',
  },
  'zh-CN': {
    'Send money':'转账','Payment details':'付款详情','PAYMENT RECIPIENT':'收款人','From account':'付款账户','Select an account':'选择账户','Account number':'账号','Saved payee':'已保存的收款人','Destination account number':'收款账号','Enter account number':'输入账号','Select a beneficiary…':'选择收款人…','Amount':'金额','Payment reference':'付款备注','(optional)':'（可选）','Add a payment note':'添加付款说明','Enter a Code':'输入代码','Code':'代码','Enter code':'输入代码','Processing…':'处理中…','Continue payment':'继续付款','Beneficiaries':'收款人','Nickname':'昵称','Add':'添加','Saving payee…':'正在保存收款人…','Payee saved.':'收款人已保存。','No saved payees.':'没有已保存的收款人。','Unable to remove payee.':'无法删除收款人。','Removing…':'正在删除…','Remove':'删除','Cards':'银行卡','Issue a virtual card':'开通虚拟卡','Account':'账户','Monthly limit (0 = none)':'月限额（0 表示不限）','Loading cards…':'正在加载银行卡…','Issuing…':'正在开通…','Issue card':'开通银行卡','Your card is active again.':'您的银行卡已重新启用。','Your card has been frozen.':'您的银行卡已冻结。','Your card has been cancelled.':'您的银行卡已注销。','Hide card number':'隐藏卡号','Show card number':'显示卡号','Merchant':'商户','Updating…':'正在更新…','Unfreeze':'解除冻结','Freeze':'冻结','Cancelling…':'正在注销…','Cancel':'注销','Loans':'贷款','Apply for a loan':'申请贷款','Fixed-rate, equal monthly payments.':'固定利率，每月等额还款。','Disburse to':'放款至','Term (months)':'期限（月）','Your application has been received and is pending review.':'您的申请已收到，正在等待审核。','Loading loans…':'正在加载贷款…','Loading…':'正在加载…','Due':'应还','Principal':'本金','Interest':'利息','Total':'总计','Status':'状态','Your repayment instruction has been recorded.':'您的还款指令已记录。','Pending approvals (admin)':'待审批项目（管理员）','Nothing pending.':'没有待处理项目。','Submitting…':'正在提交…','Apply':'申请','Hide':'隐藏','Schedule':'计划','Paying…':'正在付款…','Pay next installment':'支付下一期','Profile':'个人资料','Profile saved.':'个人资料已保存。','Save failed':'保存失败','Saving…':'正在保存…','Save changes':'保存更改','Notifications':'通知','Mark all read':'全部标记为已读','No notifications yet.':'暂无通知。','Mark read':'标记为已读','First name':'名字','Last name':'姓氏','Email':'电子邮箱','Role':'角色','User ID':'用户 ID','Admins only.':'仅限管理员。','Admin':'管理员','Teller deposit':'柜员存款','Record a deposit request for the selected account.':'记录所选账户的存款请求。','No customer accounts yet.':'暂无客户账户。','Deposit':'存款','Audit log':'审计日志','Recent domain events (append-only).':'最近的业务事件（仅追加）。','No audit entries yet.':'暂无审计记录。','Time':'时间','Action':'操作','Entity':'实体','Detail':'详情','Something went wrong':'发生错误。','A clear view of your accounts and everyday banking.':'清晰查看您的账户和日常银行业务。','Private client · Overview':'私人客户 · 总览','Relationship overview':'客户关系概览','Account overview':'账户概览','Across':'共计','account':'个账户','accounts':'个账户','Northstar Private · Client portfolio':'Northstar Private · 客户组合','USD · Consolidated':'USD · 合并','PERSONAL BANKING':'个人银行服务','At your service.':'竭诚为您服务。','Manage payments, cards and account details from one secure place.':'在一个安全的平台管理付款、银行卡和账户信息。','Make a payment':'进行付款','Manage your cards':'管理银行卡','Account details and available balances':'账户详情和可用余额','New account type':'新账户类型','Checking':'支票账户','Savings':'储蓄账户','Opening…':'正在开立…','Open account':'开立账户','Loading accounts…':'正在加载账户…','Unable to load accounts.':'无法加载账户。','Checking account':'支票账户','Savings account':'储蓄账户','ACCOUNT SERVICES':'账户服务','Account details':'账户详情','Review your account and manage a withdrawal request.':'查看账户并管理提款申请。','← All accounts':'← 所有账户','Loading account…':'正在加载账户…','Account not found.':'未找到账户。','Withdraw funds':'提取资金','Enter the amount and destination account details below.':'请在下方输入金额和收款账户信息。','TEST CLASSIFICATION':'测试分类','Test category':'测试类别','File upload validation':'文件上传验证','Input validation':'输入验证','Boundary values':'边界值','Malformed data / encoding':'格式错误的数据 / 编码','Cross-site scripting (XSS)':'跨站脚本攻击（XSS）','SQL injection strings':'SQL 注入字符串','Authentication / session handling':'身份验证 / 会话处理','Authorization / access control':'授权 / 访问控制','Business logic':'业务逻辑','Rate limiting':'速率限制','Other':'其他','Test notes':'测试备注','Amount (USD)':'金额（美元）','DESTINATION ACCOUNT':'收款账户','Bank name':'银行名称','Account name':'账户持有人姓名','SUPPORTING DOCUMENTS':'证明文件','JPG · PNG · WebP · PDF · DOC · TXT':'JPG · PNG · WebP · PDF · DOC · TXT','Choose image or file':'选择图片或文件','Before you continue':'继续之前','ACCOUNT SECURITY':'账户安全','Keep your sign-in credentials and any verification codes private.':'请妥善保管登录凭据和所有验证码。','Recent transactions':'最近交易','No transactions yet.':'暂无交易记录。','Tap to choose an image or file':'点击选择图片或文件','Replace selected file':'替换所选文件','Continue withdrawal':'继续提款','Withdrawal accepted':'提款已受理','Withdrawal rejected':'提款被拒绝','Unsupported file type':'不支持的文件类型','File exceeds 10 MB':'文件超过 10 MB','A MORE CONSIDERED APPROACH':'更周全的服务方式','Clarity for your financial life.':'让您的财务生活更加清晰。','Thoughtful banking, with a clear view of what matters and the tools to manage it with confidence.':'周到的银行服务，帮助您清楚了解重要事项，并自信地管理财务。','Private client services · Northstar Private':'私人客户服务 · Northstar Private','NORTHSTAR PRIVATE · CLIENT ACCESS':'NORTHSTAR PRIVATE · 客户入口','Protected client access · Please keep your sign-in details confidential.':'受保护的客户入口 · 请对登录信息保密。','No account yet?':'还没有账户？','Create an account':'创建账户','Welcome back':'欢迎回来','Sign in to your private banking account':'登录您的私人银行账户','Password':'密码','Signing in…':'正在登录…','Sign in':'登录','Open your account':'开立账户','Create your private banking profile':'创建您的私人银行资料','Password (min 8 chars)':'密码（至少 8 个字符）','Creating…':'正在创建…','Create account':'创建账户','Already a client?':'已经是客户？','Private client':'私人客户','YOUR FINANCES':'您的财务','Administration':'管理','Secure session':'安全会话','PRIVATE CLIENT PORTAL':'私人客户门户','Digital banking':'数字银行','Secure connection':'安全连接','Sign out':'退出登录','Confidential client access':'机密客户访问','© Northstar Private Banking':'© Northstar Private Banking','Primary navigation':'主导航','Activity':'活动','Overview':'总览','Payments':'付款','Lending':'贷款','Language':'语言',
  },
  'zh-TW': {
    'Send money':'轉帳','Payment details':'付款詳情','PAYMENT RECIPIENT':'收款人','From account':'付款帳戶','Select an account':'選擇帳戶','Account number':'帳號','Saved payee':'已儲存的收款人','Destination account number':'收款帳號','Enter account number':'輸入帳號','Select a beneficiary…':'選擇收款人…','Amount':'金額','Payment reference':'付款備註','(optional)':'（選填）','Add a payment note':'新增付款說明','Enter a Code':'輸入代碼','Code':'代碼','Enter code':'輸入代碼','Processing…':'處理中…','Continue payment':'繼續付款','Beneficiaries':'收款人','Nickname':'暱稱','Add':'新增','Saving payee…':'正在儲存收款人…','Payee saved.':'收款人已儲存。','No saved payees.':'沒有已儲存的收款人。','Unable to remove payee.':'無法刪除收款人。','Removing…':'正在刪除…','Remove':'刪除','Cards':'銀行卡','Issue a virtual card':'開通虛擬卡','Account':'帳戶','Monthly limit (0 = none)':'每月限額（0 表示不限）','Loading cards…':'正在載入銀行卡…','Issuing…':'正在開通…','Issue card':'開通銀行卡','Your card is active again.':'您的銀行卡已重新啟用。','Your card has been frozen.':'您的銀行卡已凍結。','Your card has been cancelled.':'您的銀行卡已取消。','Hide card number':'隱藏卡號','Show card number':'顯示卡號','Merchant':'商家','Updating…':'正在更新…','Unfreeze':'解除凍結','Freeze':'凍結','Cancelling…':'正在取消…','Cancel':'取消','Loans':'貸款','Apply for a loan':'申請貸款','Fixed-rate, equal monthly payments.':'固定利率，每月等額還款。','Disburse to':'撥款至','Term (months)':'期限（月）','Your application has been received and is pending review.':'您的申請已收到，正在等待審核。','Loading loans…':'正在載入貸款…','Loading…':'正在載入…','Due':'應繳','Principal':'本金','Interest':'利息','Total':'總計','Status':'狀態','Your repayment instruction has been recorded.':'您的還款指示已記錄。','Pending approvals (admin)':'待核准項目（管理員）','Nothing pending.':'沒有待處理項目。','Submitting…':'正在提交…','Apply':'申請','Hide':'隱藏','Schedule':'時程','Paying…':'付款中…','Pay next installment':'支付下一期','Profile':'個人資料','Profile saved.':'個人資料已儲存。','Save failed':'儲存失敗','Saving…':'正在儲存…','Save changes':'儲存變更','Notifications':'通知','Mark all read':'全部標示為已讀','No notifications yet.':'目前沒有通知。','Mark read':'標示為已讀','First name':'名字','Last name':'姓氏','Email':'電子郵件','Role':'角色','User ID':'使用者 ID','Admins only.':'僅限管理員。','Admin':'管理員','Teller deposit':'櫃員存款','Record a deposit request for the selected account.':'記錄所選帳戶的存款請求。','No customer accounts yet.':'目前沒有客戶帳戶。','Deposit':'存款','Audit log':'稽核紀錄','Recent domain events (append-only).':'最近的系統事件（僅供新增）。','No audit entries yet.':'目前沒有稽核紀錄。','Time':'時間','Action':'動作','Entity':'實體','Detail':'詳細資料','Something went wrong':'發生錯誤。','A clear view of your accounts and everyday banking.':'清楚掌握您的帳戶與日常銀行業務。','Private client · Overview':'私人客戶 · 總覽','Relationship overview':'客戶關係總覽','Account overview':'帳戶總覽','Across':'共計','account':'個帳戶','accounts':'個帳戶','Northstar Private · Client portfolio':'Northstar Private · 客戶組合','USD · Consolidated':'USD · 合併','PERSONAL BANKING':'個人銀行服務','At your service.':'竭誠為您服務。','Manage payments, cards and account details from one secure place.':'在安全的平台管理付款、銀行卡及帳戶資訊。','Make a payment':'進行付款','Manage your cards':'管理銀行卡','Account details and available balances':'帳戶詳情及可用餘額','New account type':'新帳戶類型','Checking':'支票帳戶','Savings':'儲蓄帳戶','Opening…':'正在開立…','Open account':'開立帳戶','Loading accounts…':'正在載入帳戶…','Unable to load accounts.':'無法載入帳戶。','Checking account':'支票帳戶','Savings account':'儲蓄帳戶','ACCOUNT SERVICES':'帳戶服務','Account details':'帳戶詳情','Review your account and manage a withdrawal request.':'檢視帳戶並管理提款申請。','← All accounts':'← 所有帳戶','Loading account…':'正在載入帳戶…','Account not found.':'找不到帳戶。','Withdraw funds':'提取資金','Enter the amount and destination account details below.':'請在下方輸入金額及收款帳戶資料。','TEST CLASSIFICATION':'測試分類','Test category':'測試類別','File upload validation':'檔案上傳驗證','Input validation':'輸入驗證','Boundary values':'邊界值','Malformed data / encoding':'格式錯誤的資料／編碼','Cross-site scripting (XSS)':'跨網站指令碼攻擊（XSS）','SQL injection strings':'SQL 注入字串','Authentication / session handling':'身分驗證／工作階段處理','Authorization / access control':'授權／存取控制','Business logic':'商業邏輯','Rate limiting':'速率限制','Other':'其他','Test notes':'測試備註','Amount (USD)':'金額（美元）','DESTINATION ACCOUNT':'收款帳戶','Bank name':'銀行名稱','Account name':'帳戶持有人姓名','SUPPORTING DOCUMENTS':'證明文件','JPG · PNG · WebP · PDF · DOC · TXT':'JPG · PNG · WebP · PDF · DOC · TXT','Choose image or file':'選擇圖片或檔案','Before you continue':'繼續之前','ACCOUNT SECURITY':'帳戶安全','Keep your sign-in credentials and any verification codes private.':'請妥善保管登入憑證及所有驗證碼。','Recent transactions':'最近交易','No transactions yet.':'目前沒有交易紀錄。','Tap to choose an image or file':'點選以選擇圖片或檔案','Replace selected file':'取代所選檔案','Continue withdrawal':'繼續提款','Withdrawal accepted':'提款已受理','Withdrawal rejected':'提款遭拒','Unsupported file type':'不支援的檔案類型','File exceeds 10 MB':'檔案超過 10 MB','A MORE CONSIDERED APPROACH':'更周全的服務方式','Clarity for your financial life.':'讓您的財務生活更清晰。','Thoughtful banking, with a clear view of what matters and the tools to manage it with confidence.':'周到的銀行服務，協助您清楚掌握重要事項，並有信心地管理財務。','Private client services · Northstar Private':'私人客戶服務 · Northstar Private','NORTHSTAR PRIVATE · CLIENT ACCESS':'NORTHSTAR PRIVATE · 客戶入口','Protected client access · Please keep your sign-in details confidential.':'受保護的客戶入口 · 請妥善保管登入資訊。','No account yet?':'還沒有帳戶？','Create an account':'建立帳戶','Welcome back':'歡迎回來','Sign in to your private banking account':'登入您的私人銀行帳戶','Password':'密碼','Signing in…':'正在登入…','Sign in':'登入','Open your account':'開立帳戶','Create your private banking profile':'建立您的私人銀行資料','Password (min 8 chars)':'密碼（至少 8 個字元）','Creating…':'正在建立…','Create account':'建立帳戶','Already a client?':'已經是客戶？','Private client':'私人客戶','YOUR FINANCES':'您的財務','Administration':'管理','Secure session':'安全工作階段','PRIVATE CLIENT PORTAL':'私人客戶入口網站','Digital banking':'數位銀行','Secure connection':'安全連線','Sign out':'登出','Confidential client access':'機密客戶存取','© Northstar Private Banking':'© Northstar Private Banking','Primary navigation':'主要導覽','Activity':'活動','Overview':'總覽','Payments':'付款','Lending':'貸款','Language':'語言',
  },
})

export function useLanguage() {
  const language = useSyncExternalStore<Language>(subscribe, snapshot, () => 'en')
  const active = messages[language] || {}
  const fallback = messages.en
  useEffect(() => { document.documentElement.lang = language; document.documentElement.dir = /^(ar|he|fa|ur)(-|$)/i.test(language) ? 'rtl' : 'ltr'; const root = document.body; return root ? translateDocument(root, language) : undefined }, [language])
  return { language, t: (key: string) => active[key] || fallback[key] || key, setLanguage }
}
