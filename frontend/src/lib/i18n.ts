import { useEffect, useSyncExternalStore } from 'react'

const LANGUAGE_CODES = ['en','fr','es','pt','ar','ha','yo','fil','ms','ko','zh-CN','zh-TW','id']

function displayName(code: string) {
  if (code === 'id') return 'Bahasa Indonesia'
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
  id: { overview:'Ringkasan',payments:'Pembayaran',cards:'Kartu',loans:'Pinjaman',profile:'Profil',activity:'Aktivitas',signOut:'Keluar',welcome:'Selamat datang kembali',position:'POSISI KEUANGAN ANDA',balance:'Total saldo rekening',accounts:'Rekening Anda',language:'Bahasa' },
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
    const current = node.nodeValue ?? ''
    let source = originalText.get(node) ?? current
    const priorTranslation = offlinePhrases[language]?.[source.trim()]
    // React may reconcile a translated node back to its English source after
    // a query/state update. Detect that reset and translate it again. If React
    // changed the node to a different source phrase, refresh its source copy.
    if (originalText.has(node) && current.trim() !== source.trim() && current.trim() !== priorTranslation) {
      source = current
      originalText.set(node, source)
      translatedText.delete(node)
    }
    if (!source.trim() || !/[A-Za-z]/.test(source) || manual.has(source.trim())) return
    if (translatedText.get(node) === language && current.trim() !== source.trim()) return
    originalText.set(node, source)
    knownTextNodes.add(node)
    const value = offlinePhrases[language]?.[source.trim()]
    if (value && !stopped) { if (value !== source.trim()) node.nodeValue = source.replace(source.trim(), value); translatedText.set(node, language) }
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
      let source = originals.get(attr) ?? value
      const previousTranslation = offlinePhrases[language]?.[source.trim()]
      if (originals.has(attr) && value.trim() !== source.trim() && value.trim() !== previousTranslation) {
        source = value
        originals.set(attr, source)
        done.delete(attr)
      } else {
        originals.set(attr, source)
      }
      if (done.get(attr) === language && value.trim() !== source.trim() || manual.has(source.trim())) continue
      const result = offlinePhrases[language]?.[source.trim()]
      if (result && !stopped) {
        if (result !== source.trim()) element.setAttribute(attr, result)
        done.set(attr, language)
      }
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


const originalLocalePagePhrases: Record<string, Record<string, string>> = {
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
}
for (const [locale, entries] of Object.entries(originalLocalePagePhrases)) Object.assign(offlinePhrases[locale] || (offlinePhrases[locale] = {}), entries)


const additionalLocalePagePhrases: Record<string, Record<string, string>> = {
  ms: {
    'Send money':'Hantar wang','Payment details':'Butiran pembayaran','PAYMENT RECIPIENT':'PENERIMA PEMBAYARAN','From account':'Daripada akaun','Select an account':'Pilih akaun','Account number':'Nombor akaun','Saved payee':'Penerima tersimpan','Destination account number':'Nombor akaun penerima','Enter account number':'Masukkan nombor akaun','Select a beneficiary…':'Pilih penerima…','Amount':'Jumlah','Payment reference':'Rujukan pembayaran','(optional)':'(pilihan)','Add a payment note':'Tambah nota pembayaran','Enter a Code':'Masukkan kod','Code':'Kod','Enter code':'Masukkan kod','Processing…':'Sedang diproses…','Continue payment':'Teruskan pembayaran','Beneficiaries':'Penerima','Nickname':'Nama panggilan','Add':'Tambah','Saving payee…':'Menyimpan penerima…','Payee saved.':'Penerima disimpan.','No saved payees.':'Tiada penerima tersimpan.','Unable to remove payee.':'Tidak dapat membuang penerima.','Removing…':'Sedang membuang…','Remove':'Buang','Cards':'Kad','Issue a virtual card':'Keluarkan kad maya','Account':'Akaun','Monthly limit (0 = none)':'Had bulanan (0 = tiada had)','Loading cards…':'Memuatkan kad…','Issuing…':'Sedang dikeluarkan…','Issue card':'Keluarkan kad','Your card is active again.':'Kad anda aktif semula.','Your card has been frozen.':'Kad anda telah dibekukan.','Your card has been cancelled.':'Kad anda telah dibatalkan.','Hide card number':'Sembunyikan nombor kad','Show card number':'Papar nombor kad','Merchant':'Pedagang','Updating…':'Sedang dikemas kini…','Unfreeze':'Nyahbeku','Freeze':'Bekukan','Cancelling…':'Sedang membatalkan…','Cancel':'Batal','Loans':'Pinjaman','Apply for a loan':'Mohon pinjaman','Fixed-rate, equal monthly payments.':'Kadar tetap dengan bayaran bulanan yang sama.','Disburse to':'Kreditkan kepada','Term (months)':'Tempoh (bulan)','Your application has been received and is pending review.':'Permohonan anda telah diterima dan sedang menunggu semakan.','Loading loans…':'Memuatkan pinjaman…','Loading…':'Memuatkan…','Due':'Perlu dibayar','Principal':'Prinsipal','Interest':'Faedah','Total':'Jumlah','Status':'Status','Your repayment instruction has been recorded.':'Arahan pembayaran balik anda telah direkodkan.','Pending approvals (admin)':'Kelulusan tertangguh (pentadbir)','Nothing pending.':'Tiada perkara tertangguh.','Submitting…':'Sedang dihantar…','Apply':'Mohon','Hide':'Sembunyikan','Schedule':'Jadual','Paying…':'Sedang membayar…','Pay next installment':'Bayar ansuran seterusnya','(e: React.ChangeEvent':'','Profile':'Profil','Profile saved.':'Profil disimpan.','Save failed':'Gagal menyimpan','Saving…':'Sedang menyimpan…','Save changes':'Simpan perubahan','Notifications':'Pemberitahuan','Mark all read':'Tandakan semua sebagai dibaca','No notifications yet.':'Tiada pemberitahuan lagi.','Mark read':'Tandakan sebagai dibaca','First name':'Nama pertama','Last name':'Nama keluarga','Email':'E-mel','Role':'Peranan','User ID':'ID pengguna','Admins only.':'Khusus untuk pentadbir.','Admin':'Pentadbir','Teller deposit':'Deposit juruwang','Record a deposit request for the selected account.':'Rekodkan permintaan deposit untuk akaun yang dipilih.','No customer accounts yet.':'Belum ada akaun pelanggan.','Deposit request recorded for':'Permintaan deposit direkodkan untuk','Deposit':'Deposit','Audit log':'Log audit','Recent domain events (append-only).':'Peristiwa domain terkini (tambah sahaja).','No audit entries yet.':'Belum ada entri audit.','Time':'Masa','Action':'Tindakan','Entity':'Entiti','Detail':'Butiran','Something went wrong':'Sesuatu telah berlaku.','A clear view of your accounts and everyday banking.':'Paparan jelas akaun dan urusan perbankan harian anda.','Private client · Overview':'Pelanggan persendirian · Gambaran keseluruhan','Relationship overview':'Gambaran keseluruhan hubungan','Account overview':'Gambaran keseluruhan akaun','Across':'Merangkumi','account':'akaun','accounts':'akaun','Northstar Private · Client portfolio':'Northstar Private · Portfolio pelanggan','USD · Consolidated':'USD · Disatukan','PERSONAL BANKING':'PERBANKAN PERIBADI','At your service.':'Kami sedia membantu.','Manage payments, cards and account details from one secure place.':'Urus pembayaran, kad dan butiran akaun dari satu tempat yang selamat.','Make a payment':'Buat pembayaran','Manage your cards':'Urus kad anda','Account details and available balances':'Butiran akaun dan baki tersedia','New account type':'Jenis akaun baharu','Checking':'Semasa','Savings':'Simpanan','Opening…':'Sedang dibuka…','Open account':'Buka akaun','Loading accounts…':'Memuatkan akaun…','Unable to load accounts.':'Tidak dapat memuatkan akaun.','Checking account':'Akaun semasa','Savings account':'Akaun simpanan','ACCOUNT SERVICES':'PERKHIDMATAN AKAUN','Account details':'Butiran akaun','Review your account and manage a withdrawal request.':'Semak akaun anda dan urus permintaan pengeluaran.','← All accounts':'← Semua akaun','Loading account…':'Memuatkan akaun…','Account not found.':'Akaun tidak ditemui.','Withdraw funds':'Keluarkan dana','Enter the amount and destination account details below.':'Masukkan jumlah dan butiran akaun penerima di bawah.','TEST CLASSIFICATION':'PENGELASAN UJIAN','Test category':'Kategori ujian','File upload validation':'Pengesahan muat naik fail','Input validation':'Pengesahan input','Boundary values':'Nilai sempadan','Malformed data / encoding':'Data / pengekodan tidak sah','Cross-site scripting (XSS)':'Cross-site scripting (XSS)','SQL injection strings':'Rentetan suntikan SQL','Authentication / session handling':'Pengesahan / pengendalian sesi','Authorization / access control':'Kebenaran / kawalan akses','Business logic':'Logik perniagaan','Rate limiting':'Had kadar','Other':'Lain-lain','Test notes':'Nota ujian','Amount (USD)':'Jumlah (USD)','DESTINATION ACCOUNT':'AKAUN PENERIMA','Bank name':'Nama bank','Account name':'Nama pemegang akaun','SUPPORTING DOCUMENTS':'DOKUMEN SOKONGAN','JPG · PNG · WebP · PDF · DOC · TXT':'JPG · PNG · WebP · PDF · DOC · TXT','Choose image or file':'Pilih imej atau fail','Before you continue':'Sebelum anda meneruskan','ACCOUNT SECURITY':'KESELAMATAN AKAUN','Keep your sign-in credentials and any verification codes private.':'Pastikan kelayakan log masuk dan kod pengesahan anda dirahsiakan.','Recent transactions':'Transaksi terkini','No transactions yet.':'Belum ada transaksi.','Loading transactions…':'Memuatkan transaksi…','Account holder name':'Nama pemegang akaun','10-digit account number':'Nombor akaun 10 digit','Tap to choose an image or file':'Ketik untuk memilih imej atau fail','Replace selected file':'Gantikan fail yang dipilih','Continue withdrawal':'Teruskan pengeluaran','Withdrawal accepted':'Pengeluaran diterima','Withdrawal rejected':'Pengeluaran ditolak','Unsupported file type':'Jenis fail tidak disokong','File exceeds 10 MB':'Fail melebihi 10 MB','A MORE CONSIDERED APPROACH':'PENDEKATAN YANG LEBIH TELITI','Clarity for your financial life.':'Kejelasan untuk kehidupan kewangan anda.','Thoughtful banking, with a clear view of what matters and the tools to manage it with confidence.':'Perbankan yang teliti, pandangan jelas tentang perkara penting dan alat untuk menguruskannya dengan yakin.','Private client services · Northstar Private':'Perkhidmatan pelanggan persendirian · Northstar Private','NORTHSTAR PRIVATE · CLIENT ACCESS':'NORTHSTAR PRIVATE · AKSES PELANGGAN','Protected client access · Please keep your sign-in details confidential.':'Akses pelanggan dilindungi · Sila rahsiakan butiran log masuk anda.','No account yet?':'Belum mempunyai akaun?','Create an account':'Cipta akaun','Welcome back':'Selamat kembali','Sign in to your private banking account':'Log masuk ke akaun perbankan persendirian anda','Password':'Kata laluan','Signing in…':'Sedang log masuk…','Sign in':'Log masuk','Open your account':'Buka akaun anda','Create your private banking profile':'Cipta profil perbankan persendirian anda','Password (min 8 chars)':'Kata laluan (minimum 8 aksara)','Creating…':'Sedang mencipta…','Create account':'Cipta akaun','Already a client?':'Sudah menjadi pelanggan?','Private client':'Pelanggan persendirian','YOUR FINANCES':'KEWANGAN ANDA','Administration':'Pentadbiran','Secure session':'Sesi selamat','PRIVATE CLIENT PORTAL':'PORTAL PELANGGAN PERSENDIRIAN','Digital banking':'Perbankan digital','Secure connection':'Sambungan selamat','Sign out':'Log keluar','Confidential client access':'Akses pelanggan sulit','© Northstar Private Banking':'© Northstar Private Banking','Primary navigation':'Navigasi utama','Activity':'Aktiviti','Overview':'Gambaran keseluruhan','Payments':'Pembayaran','Lending':'Pinjaman','Language':'Bahasa',
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
  id: {
    'Send money':'Kirim uang','Payment details':'Detail pembayaran','PAYMENT RECIPIENT':'PENERIMA PEMBAYARAN',
    'From account':'Dari rekening','Select an account':'Pilih rekening','Account number':'Nomor rekening',
    'Saved payee':'Penerima tersimpan','Destination account number':'Nomor rekening tujuan','Enter account number':'Masukkan nomor rekening',
    'Select a beneficiary…':'Pilih penerima…','Amount':'Jumlah','Payment reference':'Referensi pembayaran','(optional)':'(opsional)',
    'Add a payment note':'Tambahkan catatan pembayaran','Enter a Code':'Masukkan kode','Code':'Kode','Enter code':'Masukkan kode',
    'Processing…':'Sedang diproses…','Continue payment':'Lanjutkan pembayaran','Beneficiaries':'Penerima','Nickname':'Nama panggilan',
    'Add':'Tambah','Saving payee…':'Menyimpan penerima…','Payee saved.':'Penerima tersimpan.','No saved payees.':'Tidak ada penerima tersimpan.',
    'Unable to remove payee.':'Tidak dapat menghapus penerima.','Removing…':'Menghapus…','Remove':'Hapus',
    'Cards':'Kartu','Issue a virtual card':'Terbitkan kartu virtual','Account':'Rekening','Monthly limit (0 = none)':'Batas bulanan (0 = tanpa batas)',
    'Loading cards…':'Memuat kartu…','Issuing…':'Menerbitkan…','Issue card':'Terbitkan kartu','Your card is active again.':'Kartu Anda aktif kembali.',
    'Your card has been frozen.':'Kartu Anda telah dibekukan.','Your card has been cancelled.':'Kartu Anda telah dibatalkan.',
    'Hide card number':'Sembunyikan nomor kartu','Show card number':'Tampilkan nomor kartu','Merchant':'Pedagang','Updating…':'Memperbarui…',
    'Unfreeze':'Buka pembekuan','Freeze':'Bekukan','Cancelling…':'Membatalkan…','Cancel':'Batalkan',
    'Loans':'Pinjaman','Apply for a loan':'Ajukan pinjaman','Fixed-rate, equal monthly payments.':'Suku bunga tetap, cicilan bulanan sama.',
    'Disburse to':'Cairkan ke','Term (months)':'Jangka waktu (bulan)','Your application has been received and is pending review.':'Permohonan Anda telah diterima dan sedang menunggu peninjauan.',
    'Loading loans…':'Memuat pinjaman…','Loading…':'Memuat…','Due':'Jatuh tempo','Principal':'Pokok','Interest':'Bunga','Total':'Total',
    'Status':'Status','Your repayment instruction has been recorded.':'Instruksi pembayaran Anda telah dicatat.','Pending approvals (admin)':'Persetujuan tertunda (admin)',
    'Nothing pending.':'Tidak ada yang tertunda.','Submitting…':'Mengirim…','Apply':'Ajukan','Hide':'Sembunyikan','Schedule':'Jadwal',
    'Paying…':'Membayar…','Pay next installment':'Bayar cicilan berikutnya','Profile':'Profil','Profile saved.':'Profil tersimpan.',
    'Save failed':'Gagal menyimpan','Saving…':'Menyimpan…','Save changes':'Simpan perubahan','Notifications':'Notifikasi',
    'Mark all read':'Tandai semua telah dibaca','No notifications yet.':'Belum ada notifikasi.','Mark read':'Tandai telah dibaca',
    'First name':'Nama depan','Last name':'Nama belakang','Email':'Email','Role':'Peran','User ID':'ID pengguna',
    'Admins only.':'Khusus administrator.','Admin':'Administrator','Teller deposit':'Setoran teller',
    'Record a deposit request for the selected account.':'Catat permintaan setoran untuk rekening yang dipilih.',
    'No customer accounts yet.':'Belum ada rekening nasabah.','Deposit':'Setoran','Audit log':'Log audit',
    'Recent domain events (append-only).':'Peristiwa domain terbaru (hanya penambahan).','No audit entries yet.':'Belum ada entri audit.',
    'Time':'Waktu','Action':'Tindakan','Entity':'Entitas','Detail':'Detail','Something went wrong':'Terjadi kesalahan.',
    'A clear view of your accounts and everyday banking.':'Tampilan jelas untuk rekening dan aktivitas perbankan harian Anda.',
    'Private client · Overview':'Nasabah privat · Ringkasan','Relationship overview':'Ringkasan hubungan','Account overview':'Ringkasan rekening',
    'Across':'Di seluruh','account':'rekening','accounts':'rekening','Northstar Private · Client portfolio':'Northstar Private · Portofolio nasabah',
    'USD · Consolidated':'USD · Gabungan','PERSONAL BANKING':'PERBANKAN PRIBADI','At your service.':'Siap melayani Anda.',
    'Manage payments, cards and account details from one secure place.':'Kelola pembayaran, kartu, dan detail rekening dari satu tempat yang aman.',
    'Make a payment':'Lakukan pembayaran','Manage your cards':'Kelola kartu Anda','Account details and available balances':'Detail rekening dan saldo tersedia',
    'New account type':'Jenis rekening baru','Checking':'Giro','Savings':'Tabungan','Opening…':'Membuka…','Open account':'Buka rekening',
    'Loading accounts…':'Memuat rekening…','Unable to load accounts.':'Tidak dapat memuat rekening.','Checking account':'Rekening giro',
    'Savings account':'Rekening tabungan','ACCOUNT SERVICES':'LAYANAN REKENING','Account details':'Detail rekening',
    'Review your account and manage a withdrawal request.':'Tinjau rekening Anda dan kelola permintaan penarikan.',
    '← All accounts':'← Semua rekening','Loading account…':'Memuat rekening…','Account not found.':'Rekening tidak ditemukan.',
    'Withdraw funds':'Tarik dana','Enter the amount and destination account details below.':'Masukkan jumlah dan detail rekening tujuan di bawah ini.',
    'TEST CLASSIFICATION':'KLASIFIKASI PENGUJIAN','Test category':'Kategori pengujian','File upload validation':'Validasi unggahan berkas',
    'Input validation':'Validasi input','Boundary values':'Nilai batas','Malformed data / encoding':'Data / pengodean tidak valid',
    'Cross-site scripting (XSS)':'Cross-site scripting (XSS)','SQL injection strings':'String SQL injection',
    'Authentication / session handling':'Autentikasi / pengelolaan sesi','Authorization / access control':'Otorisasi / kontrol akses',
    'Business logic':'Logika bisnis','Rate limiting':'Pembatasan laju','Other':'Lainnya','Test notes':'Catatan pengujian',
    'Amount (USD)':'Jumlah (USD)','DESTINATION ACCOUNT':'REKENING TUJUAN','Bank name':'Nama bank','Account name':'Nama pemilik rekening',
    'SUPPORTING DOCUMENTS':'DOKUMEN PENDUKUNG','JPG · PNG · WebP · PDF · DOC · TXT':'JPG · PNG · WebP · PDF · DOC · TXT',
    'Choose image or file':'Pilih gambar atau berkas','Before you continue':'Sebelum melanjutkan','ACCOUNT SECURITY':'KEAMANAN REKENING',
    'Keep your sign-in credentials and any verification codes private.':'Jaga kerahasiaan kredensial masuk dan semua kode verifikasi.',
    'Recent transactions':'Transaksi terbaru','No transactions yet.':'Belum ada transaksi.','Tap to choose an image or file':'Ketuk untuk memilih gambar atau berkas',
    'Replace selected file':'Ganti berkas yang dipilih','Continue withdrawal':'Lanjutkan penarikan','Withdrawal accepted':'Penarikan diterima',
    'Withdrawal rejected':'Penarikan ditolak','Unsupported file type':'Jenis berkas tidak didukung','File exceeds 10 MB':'Berkas melebihi 10 MB',
    'A MORE CONSIDERED APPROACH':'PENDEKATAN YANG LEBIH MATANG','Clarity for your financial life.':'Kejelasan untuk kehidupan finansial Anda.',
    'Thoughtful banking, with a clear view of what matters and the tools to manage it with confidence.':'Layanan perbankan yang cermat, dengan pandangan jelas tentang hal penting dan alat untuk mengelolanya dengan percaya diri.',
    'Private client services · Northstar Private':'Layanan nasabah privat · Northstar Private','NORTHSTAR PRIVATE · CLIENT ACCESS':'NORTHSTAR PRIVATE · AKSES NASABAH',
    'Protected client access · Please keep your sign-in details confidential.':'Akses nasabah terlindungi · Jaga kerahasiaan detail masuk Anda.',
    'No account yet?':'Belum memiliki rekening?','Create an account':'Buat rekening','Welcome back':'Selamat datang kembali',
    'Sign in to your private banking account':'Masuk ke rekening perbankan privat Anda','Password':'Kata sandi','Signing in…':'Sedang masuk…',
    'Sign in':'Masuk','Open your account':'Buka rekening Anda','Create your private banking profile':'Buat profil perbankan privat Anda',
    'Password (min 8 chars)':'Kata sandi (min. 8 karakter)','Creating…':'Sedang membuat…','Create account':'Buat rekening',
    'Already a client?':'Sudah menjadi nasabah?','Private client':'Nasabah privat','YOUR FINANCES':'KEUANGAN ANDA',
    'Administration':'Administrasi','Secure session':'Sesi aman','PRIVATE CLIENT PORTAL':'PORTAL NASABAH PRIVAT',
    'Digital banking':'Perbankan digital','Secure connection':'Koneksi aman','Sign out':'Keluar','Confidential client access':'Akses nasabah rahasia',
    '© Northstar Private Banking':'© Northstar Private Banking','Primary navigation':'Navigasi utama','Activity':'Aktivitas',
    'Overview':'Ringkasan','Payments':'Pembayaran','Lending':'Pinjaman','Language':'Bahasa'
  },
}
for (const [locale, entries] of Object.entries(additionalLocalePagePhrases)) Object.assign(offlinePhrases[locale] || (offlinePhrases[locale] = {}), entries)


const routeCoveragePhrases: Record<string, Record<string, string>> = {
  fr: {
    'A clear view of your accounts and everyday banking.':'Une vue claire de vos comptes et de vos opérations bancaires quotidiennes.',
    'Private client · Overview':'Client privé · Vue d’ensemble','Relationship overview':'Vue d’ensemble de la relation','Account overview':'Vue d’ensemble du compte',
    'Across':'Sur','account':'compte','accounts':'comptes','Northstar Private · Client portfolio':'Northstar Private · Portefeuille client','USD · Consolidated':'USD · Consolidé',
    'PERSONAL BANKING':'BANQUE PERSONNELLE','At your service.':'À votre service.','Manage payments, cards and account details from one secure place.':'Gérez paiements, cartes et comptes depuis un espace sécurisé.',
    'Make a payment':'Effectuer un paiement','Manage your cards':'Gérer vos cartes','Account details and available balances':'Détails des comptes et soldes disponibles',
    'New account type':'Type de nouveau compte','Checking':'Compte courant','Savings':'Épargne','Opening…':'Ouverture…','Open account':'Ouvrir un compte',
    'Loading accounts…':'Chargement des comptes…','Unable to load accounts.':'Impossible de charger les comptes.','Checking account':'Compte courant','Savings account':'Compte d’épargne',
    'Issue a virtual card':'Émettre une carte virtuelle','Account':'Compte','Monthly limit (0 = none)':'Plafond mensuel (0 = aucun)','Loading cards…':'Chargement des cartes…','Issuing…':'Émission…','Issue card':'Émettre la carte','No cards yet.':'Aucune carte pour le moment.',
    'Hide card number':'Masquer le numéro de carte','Show card number':'Afficher le numéro de carte','Merchant':'Commerçant','Updating…':'Mise à jour…','Unfreeze':'Débloquer','Freeze':'Bloquer','Cancelling…':'Annulation…','Cancel':'Annuler','Your card is active again.':'Votre carte est de nouveau active.','Your card has been frozen.':'Votre carte a été bloquée.','Your card has been cancelled.':'Votre carte a été annulée.',
    'Apply for a loan':'Demander un prêt','Fixed-rate, equal monthly payments.':'Taux fixe, mensualités égales.','Disburse to':'Verser sur','Term (months)':'Durée (mois)','Submitting…':'Envoi…','No loans yet.':'Aucun prêt pour le moment.','Due':'Échéance','Principal':'Capital','Interest':'Intérêts','Total':'Total','Status':'Statut','Paying…':'Paiement…','Pay next installment':'Payer la prochaine échéance','Pending approvals (admin)':'Approbations en attente (administration)','Nothing pending.':'Aucune demande en attente.',
    'First name':'Prénom','Last name':'Nom','Role':'Rôle','User ID':'Identifiant utilisateur','Save failed':'Échec de l’enregistrement','Saving…':'Enregistrement…','Save changes':'Enregistrer les modifications','Profile saved.':'Profil enregistré.',
    'Mark all read':'Tout marquer comme lu','No notifications yet.':'Aucune notification pour le moment.','Mark read':'Marquer comme lu','Loading…':'Chargement…','Time':'Heure','Action':'Action','Entity':'Entité','Detail':'Détail',
    'Before you continue':'Avant de continuer','Primary navigation':'Navigation principale','Confidential client access':'Accès client confidentiel','Secure session':'Session sécurisée','Secure connection':'Connexion sécurisée','Digital banking':'Banque numérique','Administration':'Administration','Private client':'Client privé','YOUR FINANCES':'VOS FINANCES','PRIVATE CLIENT PORTAL':'PORTAIL CLIENT PRIVÉ','Sign out':'Déconnexion',
    'ACCOUNT SERVICES':'SERVICES DE COMPTE','Account details':'Détails du compte','Withdraw funds':'Retirer des fonds','← All accounts':'← Tous les comptes','Loading account…':'Chargement du compte…','Account not found.':'Compte introuvable.','TEST CLASSIFICATION':'CLASSIFICATION DU TEST','Test category':'Catégorie du test','Test notes':'Notes du test','DESTINATION ACCOUNT':'COMPTE DESTINATAIRE','Bank name':'Nom de la banque','Account name':'Nom du titulaire','SUPPORTING DOCUMENTS':'DOCUMENTS JUSTIFICATIFS','Choose image or file':'Choisir une image ou un fichier','Continue withdrawal':'Continuer le retrait','Recent transactions':'Transactions récentes','No transactions yet.':'Aucune transaction pour le moment.','Tap to choose an image or file':'Touchez pour choisir une image ou un fichier','Replace selected file':'Remplacer le fichier sélectionné','Remove':'Supprimer','Withdrawal rejected':'Retrait refusé',
    'Beneficiaries':'Bénéficiaires','Nickname':'Nom','Add':'Ajouter','Saving payee…':'Enregistrement du bénéficiaire…','Payee saved.':'Bénéficiaire enregistré.','No saved payees.':'Aucun bénéficiaire enregistré.','Unable to remove payee.':'Impossible de supprimer le bénéficiaire.','Removing…':'Suppression…','Send money':'Envoyer de l’argent','Payment details':'Détails du paiement','PAYMENT RECIPIENT':'DESTINATAIRE DU PAIEMENT','From account':'Depuis le compte','Select an account':'Sélectionner un compte','Saved payee':'Bénéficiaire enregistré','Destination account number':'Numéro de compte du destinataire','Enter account number':'Saisir le numéro de compte','Select a beneficiary…':'Sélectionner un bénéficiaire…','Amount':'Montant','Payment reference':'Référence du paiement','(optional)':'(facultatif)','Add a payment note':'Ajouter une note de paiement','Enter a Code':'Saisir un code','Code':'Code','Enter code':'Saisir le code','Processing…':'Traitement…','Continue payment':'Continuer le paiement',
    'Open your account':'Ouvrir votre compte','Create your private banking profile':'Créez votre profil bancaire privé','Email':'Adresse e-mail','Password (min 8 chars)':'Mot de passe (8 caractères min.)','Creating…':'Création…','Create account':'Créer un compte','Already a client?':'Déjà client ?','Sign in':'Se connecter','Welcome back':'Bon retour','Sign in to your private banking account':'Connectez-vous à votre compte bancaire privé','Password':'Mot de passe','Signing in…':'Connexion…','No account yet?':'Pas encore de compte ?'
  },
  es: {
    'A clear view of your accounts and everyday banking.':'Una visión clara de tus cuentas y operaciones bancarias diarias.','Private client · Overview':'Cliente privado · Resumen','Relationship overview':'Resumen de la relación','Account overview':'Resumen de la cuenta','Across':'En','account':'cuenta','accounts':'cuentas','Northstar Private · Client portfolio':'Northstar Private · Cartera de clientes','USD · Consolidated':'USD · Consolidado','PERSONAL BANKING':'BANCA PERSONAL','At your service.':'A tu servicio.','Manage payments, cards and account details from one secure place.':'Gestiona pagos, tarjetas y cuentas desde un único lugar seguro.','Make a payment':'Realizar un pago','Manage your cards':'Gestionar tus tarjetas','Account details and available balances':'Detalles de la cuenta y saldos disponibles','New account type':'Nuevo tipo de cuenta','Checking':'Cuenta corriente','Savings':'Ahorros','Opening…':'Abriendo…','Open account':'Abrir cuenta','Loading accounts…':'Cargando cuentas…','Unable to load accounts.':'No se pueden cargar las cuentas.','Checking account':'Cuenta corriente','Savings account':'Cuenta de ahorros',
    'Issue a virtual card':'Emitir una tarjeta virtual','Account':'Cuenta','Monthly limit (0 = none)':'Límite mensual (0 = ninguno)','Loading cards…':'Cargando tarjetas…','Issuing…':'Emitiendo…','Issue card':'Emitir tarjeta','No cards yet.':'Todavía no hay tarjetas.','Hide card number':'Ocultar número de tarjeta','Show card number':'Mostrar número de tarjeta','Merchant':'Comercio','Updating…':'Actualizando…','Unfreeze':'Desbloquear','Freeze':'Bloquear','Cancelling…':'Cancelando…','Cancel':'Cancelar','Your card is active again.':'Tu tarjeta vuelve a estar activa.','Your card has been frozen.':'Tu tarjeta ha sido bloqueada.','Your card has been cancelled.':'Tu tarjeta ha sido cancelada.',
    'Apply for a loan':'Solicitar un préstamo','Fixed-rate, equal monthly payments.':'Tipo fijo y cuotas mensuales iguales.','Disburse to':'Desembolsar en','Term (months)':'Plazo (meses)','Submitting…':'Enviando…','No loans yet.':'Todavía no hay préstamos.','Due':'Vencimiento','Principal':'Capital','Interest':'Intereses','Total':'Total','Status':'Estado','Paying…':'Pagando…','Pay next installment':'Pagar la siguiente cuota','Pending approvals (admin)':'Aprobaciones pendientes (administración)','Nothing pending.':'No hay nada pendiente.',
    'First name':'Nombre','Last name':'Apellidos','Role':'Rol','User ID':'ID de usuario','Save failed':'Error al guardar','Saving…':'Guardando…','Save changes':'Guardar cambios','Profile saved.':'Perfil guardado.','Mark all read':'Marcar todo como leído','No notifications yet.':'Todavía no hay notificaciones.','Mark read':'Marcar como leído','Loading…':'Cargando…','Time':'Hora','Action':'Acción','Entity':'Entidad','Detail':'Detalle',
    'Before you continue':'Antes de continuar','Primary navigation':'Navegación principal','Confidential client access':'Acceso confidencial del cliente','Secure session':'Sesión segura','Secure connection':'Conexión segura','Digital banking':'Banca digital','Administration':'Administración','Private client':'Cliente privado','YOUR FINANCES':'TUS FINANZAS','PRIVATE CLIENT PORTAL':'PORTAL DE CLIENTE PRIVADO','Sign out':'Cerrar sesión',
    'ACCOUNT SERVICES':'SERVICIOS DE CUENTA','Account details':'Detalles de la cuenta','Withdraw funds':'Retirar fondos','← All accounts':'← Todas las cuentas','Loading account…':'Cargando cuenta…','Account not found.':'No se encontró la cuenta.','TEST CLASSIFICATION':'CLASIFICACIÓN DE LA PRUEBA','Test category':'Categoría de prueba','Test notes':'Notas de prueba','DESTINATION ACCOUNT':'CUENTA DE DESTINO','Bank name':'Nombre del banco','Account name':'Nombre del titular','SUPPORTING DOCUMENTS':'DOCUMENTOS JUSTIFICATIVOS','Choose image or file':'Elegir imagen o archivo','Continue withdrawal':'Continuar retirada','Recent transactions':'Transacciones recientes','No transactions yet.':'Todavía no hay transacciones.','Tap to choose an image or file':'Toca para elegir una imagen o archivo','Replace selected file':'Reemplazar archivo seleccionado','Remove':'Eliminar','Withdrawal rejected':'Retirada rechazada',
    'Beneficiaries':'Beneficiarios','Nickname':'Alias','Add':'Añadir','Saving payee…':'Guardando beneficiario…','Payee saved.':'Beneficiario guardado.','No saved payees.':'No hay beneficiarios guardados.','Unable to remove payee.':'No se puede eliminar el beneficiario.','Removing…':'Eliminando…','Send money':'Enviar dinero','Payment details':'Detalles del pago','PAYMENT RECIPIENT':'DESTINATARIO DEL PAGO','From account':'Desde la cuenta','Select an account':'Selecciona una cuenta','Saved payee':'Beneficiario guardado','Destination account number':'Número de cuenta de destino','Enter account number':'Introduce el número de cuenta','Select a beneficiary…':'Selecciona un beneficiario…','Amount':'Importe','Payment reference':'Referencia del pago','(optional)':'(opcional)','Add a payment note':'Añadir una nota de pago','Enter a Code':'Introducir un código','Code':'Código','Enter code':'Introducir código','Processing…':'Procesando…','Continue payment':'Continuar con el pago',
    'Open your account':'Abre tu cuenta','Create your private banking profile':'Crea tu perfil bancario privado','Email':'Correo electrónico','Password (min 8 chars)':'Contraseña (mín. 8 caracteres)','Creating…':'Creando…','Create account':'Crear cuenta','Already a client?':'¿Ya eres cliente?','Sign in':'Iniciar sesión','Welcome back':'Te damos la bienvenida','Sign in to your private banking account':'Inicia sesión en tu cuenta bancaria privada','Password':'Contraseña','Signing in…':'Iniciando sesión…','No account yet?':'¿Aún no tienes cuenta?'
  },
  pt: {
    'A clear view of your accounts and everyday banking.':'Uma visão clara das suas contas e operações bancárias diárias.','Private client · Overview':'Cliente privado · Visão geral','Relationship overview':'Visão geral do relacionamento','Account overview':'Visão geral da conta','Across':'Em','account':'conta','accounts':'contas','Northstar Private · Client portfolio':'Northstar Private · Carteira de clientes','USD · Consolidated':'USD · Consolidado','PERSONAL BANKING':'BANCA PESSOAL','At your service.':'Ao seu dispor.','Manage payments, cards and account details from one secure place.':'Faça a gestão de pagamentos, cartões e contas num único local seguro.','Make a payment':'Efetuar pagamento','Manage your cards':'Gerir os seus cartões','Account details and available balances':'Detalhes da conta e saldos disponíveis','New account type':'Novo tipo de conta','Checking':'À ordem','Savings':'Poupança','Opening…':'A abrir…','Open account':'Abrir conta','Loading accounts…':'A carregar contas…','Unable to load accounts.':'Não foi possível carregar as contas.','Checking account':'Conta à ordem','Savings account':'Conta poupança',
    'Issue a virtual card':'Emitir cartão virtual','Account':'Conta','Monthly limit (0 = none)':'Limite mensal (0 = sem limite)','Loading cards…':'A carregar cartões…','Issuing…':'A emitir…','Issue card':'Emitir cartão','No cards yet.':'Ainda não existem cartões.','Hide card number':'Ocultar número do cartão','Show card number':'Mostrar número do cartão','Merchant':'Comerciante','Updating…':'A atualizar…','Unfreeze':'Desbloquear','Freeze':'Bloquear','Cancelling…':'A cancelar…','Cancel':'Cancelar','Your card is active again.':'O seu cartão está novamente ativo.','Your card has been frozen.':'O seu cartão foi bloqueado.','Your card has been cancelled.':'O seu cartão foi cancelado.',
    'Apply for a loan':'Solicitar um empréstimo','Fixed-rate, equal monthly payments.':'Taxa fixa e prestações mensais iguais.','Disburse to':'Transferir para','Term (months)':'Prazo (meses)','Submitting…':'A submeter…','No loans yet.':'Ainda não existem empréstimos.','Due':'Vencimento','Principal':'Capital','Interest':'Juros','Total':'Total','Status':'Estado','Paying…':'A pagar…','Pay next installment':'Pagar próxima prestação','Pending approvals (admin)':'Aprovações pendentes (administração)','Nothing pending.':'Nada pendente.',
    'First name':'Nome próprio','Last name':'Apelido','Role':'Função','User ID':'ID do utilizador','Save failed':'Falha ao guardar','Saving…':'A guardar…','Save changes':'Guardar alterações','Profile saved.':'Perfil guardado.','Mark all read':'Marcar tudo como lido','No notifications yet.':'Ainda não existem notificações.','Mark read':'Marcar como lida','Loading…':'A carregar…','Time':'Hora','Action':'Ação','Entity':'Entidade','Detail':'Detalhe',
    'Before you continue':'Antes de continuar','Primary navigation':'Navegação principal','Confidential client access':'Acesso confidencial do cliente','Secure session':'Sessão segura','Secure connection':'Ligação segura','Digital banking':'Banco digital','Administration':'Administração','Private client':'Cliente privado','YOUR FINANCES':'AS SUAS FINANÇAS','PRIVATE CLIENT PORTAL':'PORTAL DO CLIENTE PRIVADO','Sign out':'Terminar sessão',
    'ACCOUNT SERVICES':'SERVIÇOS DE CONTA','Account details':'Detalhes da conta','Withdraw funds':'Levantar fundos','← All accounts':'← Todas as contas','Loading account…':'A carregar conta…','Account not found.':'Conta não encontrada.','TEST CLASSIFICATION':'CLASSIFICAÇÃO DO TESTE','Test category':'Categoria do teste','Test notes':'Notas do teste','DESTINATION ACCOUNT':'CONTA DE DESTINO','Bank name':'Nome do banco','Account name':'Nome do titular','SUPPORTING DOCUMENTS':'DOCUMENTOS DE SUPORTE','Choose image or file':'Escolher imagem ou ficheiro','Continue withdrawal':'Continuar levantamento','Recent transactions':'Transações recentes','No transactions yet.':'Ainda não existem transações.','Tap to choose an image or file':'Toque para escolher imagem ou ficheiro','Replace selected file':'Substituir ficheiro selecionado','Remove':'Remover','Withdrawal rejected':'Levantamento recusado',
    'Beneficiaries':'Beneficiários','Nickname':'Nome','Add':'Adicionar','Saving payee…':'A guardar beneficiário…','Payee saved.':'Beneficiário guardado.','No saved payees.':'Não existem beneficiários guardados.','Unable to remove payee.':'Não foi possível remover o beneficiário.','Removing…':'A remover…','Send money':'Enviar dinheiro','Payment details':'Detalhes do pagamento','PAYMENT RECIPIENT':'DESTINATÁRIO DO PAGAMENTO','From account':'Da conta','Select an account':'Selecionar uma conta','Saved payee':'Beneficiário guardado','Destination account number':'Número da conta de destino','Enter account number':'Introduza o número da conta','Select a beneficiary…':'Selecionar um beneficiário…','Amount':'Montante','Payment reference':'Referência do pagamento','(optional)':'(opcional)','Add a payment note':'Adicionar uma nota de pagamento','Enter a Code':'Introduzir um código','Code':'Código','Enter code':'Introduzir código','Processing…':'A processar…','Continue payment':'Continuar pagamento',
    'Open your account':'Abra a sua conta','Create your private banking profile':'Crie o seu perfil bancário privado','Email':'E-mail','Password (min 8 chars)':'Palavra-passe (mín. 8 caracteres)','Creating…':'A criar…','Create account':'Criar conta','Already a client?':'Já é cliente?','Sign in':'Iniciar sessão','Welcome back':'Bem-vindo de volta','Sign in to your private banking account':'Inicie sessão na sua conta bancária privada','Password':'Palavra-passe','Signing in…':'A iniciar sessão…','No account yet?':'Ainda não tem conta?'
  },
  ar: {
    'A clear view of your accounts and everyday banking.':'عرض واضح لحساباتك ومعاملاتك المصرفية اليومية.','Private client · Overview':'عميل خاص · نظرة عامة','Relationship overview':'نظرة عامة على العلاقة','Account overview':'نظرة عامة على الحساب','Across':'عبر','account':'حساب','accounts':'حسابات','Northstar Private · Client portfolio':'Northstar Private · محفظة العميل','USD · Consolidated':'دولار أمريكي · موحد','PERSONAL BANKING':'الخدمات المصرفية الشخصية','At your service.':'في خدمتك.','Manage payments, cards and account details from one secure place.':'أدر المدفوعات والبطاقات وتفاصيل الحساب من مكان آمن واحد.','Make a payment':'إجراء دفعة','Manage your cards':'إدارة بطاقاتك','Account details and available balances':'تفاصيل الحساب والأرصدة المتاحة','New account type':'نوع الحساب الجديد','Checking':'جاري','Savings':'ادخار','Opening…':'جارٍ الفتح…','Open account':'فتح حساب','Loading accounts…':'جارٍ تحميل الحسابات…','Unable to load accounts.':'تعذر تحميل الحسابات.','Checking account':'حساب جارٍ','Savings account':'حساب ادخار',
    'Issue a virtual card':'إصدار بطاقة افتراضية','Account':'الحساب','Monthly limit (0 = none)':'الحد الشهري (0 = بلا حد)','Loading cards…':'جارٍ تحميل البطاقات…','Issuing…':'جارٍ الإصدار…','Issue card':'إصدار البطاقة','No cards yet.':'لا توجد بطاقات بعد.','Hide card number':'إخفاء رقم البطاقة','Show card number':'إظهار رقم البطاقة','Merchant':'التاجر','Updating…':'جارٍ التحديث…','Unfreeze':'إلغاء التجميد','Freeze':'تجميد','Cancelling…':'جارٍ الإلغاء…','Cancel':'إلغاء','Your card is active again.':'أصبحت بطاقتك نشطة مجددًا.','Your card has been frozen.':'تم تجميد بطاقتك.','Your card has been cancelled.':'تم إلغاء بطاقتك.',
    'Apply for a loan':'طلب قرض','Fixed-rate, equal monthly payments.':'سعر فائدة ثابت وأقساط شهرية متساوية.','Disburse to':'الصرف إلى','Term (months)':'المدة (بالأشهر)','Submitting…':'جارٍ الإرسال…','No loans yet.':'لا توجد قروض بعد.','Due':'تاريخ الاستحقاق','Principal':'أصل المبلغ','Interest':'الفائدة','Total':'الإجمالي','Status':'الحالة','Paying…':'جارٍ الدفع…','Pay next installment':'دفع القسط التالي','Pending approvals (admin)':'الموافقات المعلقة (المسؤول)','Nothing pending.':'لا توجد طلبات معلقة.',
    'First name':'الاسم الأول','Last name':'اسم العائلة','Role':'الدور','User ID':'معرّف المستخدم','Save failed':'فشل الحفظ','Saving…':'جارٍ الحفظ…','Save changes':'حفظ التغييرات','Profile saved.':'تم حفظ الملف الشخصي.','Mark all read':'تحديد الكل كمقروء','No notifications yet.':'لا توجد إشعارات بعد.','Mark read':'تحديد كمقروء','Loading…':'جارٍ التحميل…','Time':'الوقت','Action':'الإجراء','Entity':'الكيان','Detail':'التفاصيل',
    'Before you continue':'قبل المتابعة','Primary navigation':'التنقل الرئيسي','Confidential client access':'دخول العميل السري','Secure session':'جلسة آمنة','Secure connection':'اتصال آمن','Digital banking':'الخدمات المصرفية الرقمية','Administration':'الإدارة','Private client':'عميل خاص','YOUR FINANCES':'أموالك','PRIVATE CLIENT PORTAL':'بوابة العميل الخاص','Sign out':'تسجيل الخروج',
    'ACCOUNT SERVICES':'خدمات الحساب','Account details':'تفاصيل الحساب','Withdraw funds':'سحب الأموال','← All accounts':'← جميع الحسابات','Loading account…':'جارٍ تحميل الحساب…','Account not found.':'لم يتم العثور على الحساب.','TEST CLASSIFICATION':'تصنيف الاختبار','Test category':'فئة الاختبار','Test notes':'ملاحظات الاختبار','DESTINATION ACCOUNT':'حساب الوجهة','Bank name':'اسم البنك','Account name':'اسم صاحب الحساب','SUPPORTING DOCUMENTS':'المستندات الداعمة','Choose image or file':'اختر صورة أو ملفًا','Continue withdrawal':'متابعة السحب','Recent transactions':'المعاملات الأخيرة','No transactions yet.':'لا توجد معاملات بعد.','Tap to choose an image or file':'اضغط لاختيار صورة أو ملف','Replace selected file':'استبدال الملف المحدد','Remove':'إزالة','Withdrawal rejected':'تم رفض السحب',
    'Beneficiaries':'المستفيدون','Nickname':'الاسم المستعار','Add':'إضافة','Saving payee…':'جارٍ حفظ المستفيد…','Payee saved.':'تم حفظ المستفيد.','No saved payees.':'لا يوجد مستفيدون محفوظون.','Unable to remove payee.':'تعذرت إزالة المستفيد.','Removing…':'جارٍ الإزالة…','Send money':'إرسال الأموال','Payment details':'تفاصيل الدفع','PAYMENT RECIPIENT':'مستلم الدفع','From account':'من الحساب','Select an account':'اختر حسابًا','Saved payee':'مستفيد محفوظ','Destination account number':'رقم حساب الوجهة','Enter account number':'أدخل رقم الحساب','Select a beneficiary…':'اختر مستفيدًا…','Amount':'المبلغ','Payment reference':'مرجع الدفع','(optional)':'(اختياري)','Add a payment note':'أضف ملاحظة للدفع','Enter a Code':'أدخل رمزًا','Code':'الرمز','Enter code':'أدخل الرمز','Processing…':'جارٍ المعالجة…','Continue payment':'متابعة الدفع',
    'Open your account':'افتح حسابك','Create your private banking profile':'أنشئ ملفك المصرفي الخاص','Email':'البريد الإلكتروني','Password (min 8 chars)':'كلمة المرور (8 أحرف على الأقل)','Creating…':'جارٍ الإنشاء…','Create account':'إنشاء حساب','Already a client?':'هل أنت عميل بالفعل؟','Sign in':'تسجيل الدخول','Welcome back':'مرحبًا بعودتك','Sign in to your private banking account':'سجّل الدخول إلى حسابك المصرفي الخاص','Password':'كلمة المرور','Signing in…':'جارٍ تسجيل الدخول…','No account yet?':'ليس لديك حساب بعد؟'
  },
  ha: {
    'A clear view of your accounts and everyday banking.':'Duba a bayyane na asusunka da harkokin banki na yau da kullum.','Private client · Overview':'Abokin ciniki na musamman · Taƙaitawa','Relationship overview':'Taƙaitaccen hulɗa','Account overview':'Taƙaitaccen asusu','Across':'A cikin','account':'asusun','accounts':'asusun','Northstar Private · Client portfolio':'Northstar Private · Asusun abokin ciniki','USD · Consolidated':'USD · Haɗaɗɗe','PERSONAL BANKING':'BANKIN KAI','At your service.':'Muna nan don taimaka maka.','Manage payments, cards and account details from one secure place.':'Sarrafa biyan kuɗi, katuna da bayanan asusu daga wuri mai tsaro guda.','Make a payment':'Yi biyan kuɗi','Manage your cards':'Sarrafa katunanka','Account details and available balances':'Bayanan asusu da kuɗin da ake da su','New account type':'Sabon nau’in asusu','Checking':'Asusun yau da kullum','Savings':'Asusun ajiya','Opening…':'Ana buɗewa…','Open account':'Buɗe asusu','Loading accounts…':'Ana loda asusu…','Unable to load accounts.':'An kasa loda asusu.','Checking account':'Asusun yau da kullum','Savings account':'Asusun ajiya',
    'Issue a virtual card':'Ƙirƙiri katin intanet','Account':'Asusu','Monthly limit (0 = none)':'Iyakar wata (0 = babu)','Loading cards…':'Ana loda katuna…','Issuing…':'Ana ƙirƙira…','Issue card':'Ƙirƙiri kati','No cards yet.':'Babu kati tukuna.','Hide card number':'Ɓoye lambar kati','Show card number':'Nuna lambar kati','Merchant':'Mai sayarwa','Updating…':'Ana sabuntawa…','Unfreeze':'Cire daskarewa','Freeze':'Daskare','Cancelling…':'Ana soke…','Cancel':'Soke','Your card is active again.':'Katin ya sake aiki.','Your card has been frozen.':'An daskare katinka.','Your card has been cancelled.':'An soke katinka.',
    'Apply for a loan':'Nemi lamuni','Fixed-rate, equal monthly payments.':'Riba iri ɗaya da biyan kuɗi daidai kowane wata.','Disburse to':'A tura zuwa','Term (months)':'Tsawon lokaci (watanni)','Submitting…':'Ana aikawa…','No loans yet.':'Babu lamuni tukuna.','Due':'Lokacin biya','Principal':'Babban kuɗi','Interest':'Riba','Total':'Jimilla','Status':'Matsayi','Paying…':'Ana biya…','Pay next installment':'Biya kashi na gaba','Pending approvals (admin)':'Amincewa da ke jira (mai gudanarwa)','Nothing pending.':'Babu abin jira.',
    'First name':'Suna na farko','Last name':'Sunan iyali','Role':'Matsayi','User ID':'ID na mai amfani','Save failed':'Ajiya ta gaza','Saving…':'Ana ajiyewa…','Save changes':'Ajiye canje-canje','Profile saved.':'An ajiye bayanin martaba.','Mark all read':'Alama duk an karanta','No notifications yet.':'Babu sanarwa tukuna.','Mark read':'Alama an karanta','Loading…':'Ana lodawa…','Time':'Lokaci','Action':'Aiki','Entity':'Abu','Detail':'Bayani',
    'Before you continue':'Kafin ka ci gaba','Primary navigation':'Babban kewayawa','Confidential client access':'Shigar abokin ciniki na sirri','Secure session':'Zaman tsaro','Secure connection':'Haɗi mai tsaro','Digital banking':'Bankin intanet','Administration':'Gudanarwa','Private client':'Abokin ciniki na musamman','YOUR FINANCES':'KUƊIN KA','PRIVATE CLIENT PORTAL':'SHAFIN ABOKIN CINIKI NA MUSAMMAN','Sign out':'Fita',
    'ACCOUNT SERVICES':'HUKUMOMIN ASUSU','Account details':'Bayanan asusu','Withdraw funds':'Cire kuɗi','← All accounts':'← Duk asusu','Loading account…':'Ana loda asusu…','Account not found.':'Ba a sami asusun ba.','TEST CLASSIFICATION':'RARRABE GWaji','Test category':'Rukunin gwaji','Test notes':'Bayanan gwaji','DESTINATION ACCOUNT':'ASUSUN KARƁA','Bank name':'Sunan banki','Account name':'Sunan mai asusu','SUPPORTING DOCUMENTS':'TAKARDUN TALLAFI','Choose image or file':'Zaɓi hoto ko fayil','Continue withdrawal':'Ci gaba da cire kuɗi','Recent transactions':'Mu’amaloli na baya','No transactions yet.':'Babu mu’amala tukuna.','Tap to choose an image or file':'Taɓa don zaɓar hoto ko fayil','Replace selected file':'Sauya fayil ɗin da aka zaɓa','Remove':'Cire','Withdrawal rejected':'An ƙi cire kuɗi',
    'Beneficiaries':'Masu karɓa','Nickname':'Laƙabi','Add':'Ƙara','Saving payee…':'Ana adana mai karɓa…','Payee saved.':'An adana mai karɓa.','No saved payees.':'Babu wanda aka adana.','Unable to remove payee.':'An kasa cire mai karɓa.','Removing…':'Ana cirewa…','Send money':'Aika kuɗi','Payment details':'Bayanan biyan kuɗi','PAYMENT RECIPIENT':'MAI KARƁAR KUƊI','From account':'Daga asusu','Select an account':'Zaɓi asusu','Saved payee':'Wanda aka ajiye','Destination account number':'Lambar asusun karɓa','Enter account number':'Shigar da lambar asusu','Select a beneficiary…':'Zaɓi wanda zai karɓa…','Amount':'Adadi','Payment reference':'Bayanin biyan kuɗi','(optional)':'(na zaɓi)','Add a payment note':'Ƙara bayanin biyan kuɗi','Enter a Code':'Shigar da lamba','Code':'Lamba','Enter code':'Shigar da lamba','Processing…':'Ana sarrafawa…','Continue payment':'Ci gaba da biya',
    'Open your account':'Buɗe asusunka','Create your private banking profile':'Ƙirƙiri bayanin bankinka na sirri','Email':'Imel','Password (min 8 chars)':'Kalmar sirri (haruffa 8 aƙalla)','Creating…':'Ana ƙirƙira…','Create account':'Ƙirƙiri asusu','Already a client?':'Kana da asusu?','Sign in':'Shiga','Welcome back':'Barka da dawowa','Sign in to your private banking account':'Shiga asusun bankinka na sirri','Password':'Kalmar sirri','Signing in…':'Ana shiga…','No account yet?':'Ba ka da asusu tukuna?'
  },
  yo: {
    'A clear view of your accounts and everyday banking.':'Àwòrán kedere ti àwọn àkọọ́lẹ̀ rẹ àti iṣẹ́ báńkì ojoojúmọ́.','Private client · Overview':'Oníbàárà pàtàkì · Àkótán','Relationship overview':'Àkótán ìbáṣepọ̀','Account overview':'Àkótán àkọọ́lẹ̀','Across':'Lórí','account':'àkọọ́lẹ̀','accounts':'àwọn àkọọ́lẹ̀','Northstar Private · Client portfolio':'Northstar Private · Àkójọpọ̀ oníbàárà','USD · Consolidated':'USD · Àpapọ̀','PERSONAL BANKING':'BÁŃKÌ ẸNI KỌ̀Ọ̀KAN','At your service.':'A wà ní ìránṣẹ́ rẹ.','Manage payments, cards and account details from one secure place.':'Ṣàkóso ìsanwó, káàdì àti àlàyé àkọọ́lẹ̀ ní ibi ààbò kan.','Make a payment':'Ṣe ìsanwó','Manage your cards':'Ṣàkóso àwọn káàdì rẹ','Account details and available balances':'Àlàyé àkọọ́lẹ̀ àti owó tó wà','New account type':'Irú àkọọ́lẹ̀ tuntun','Checking':'Àkọọ́lẹ̀ ìnáwó','Savings':'Ìfowópamọ́','Opening…':'Ó ń ṣí…','Open account':'Ṣí àkọọ́lẹ̀','Loading accounts…':'Ó ń kó àwọn àkọọ́lẹ̀ wá…','Unable to load accounts.':'Kò lè kó àwọn àkọọ́lẹ̀ wá.','Checking account':'Àkọọ́lẹ̀ ìnáwó','Savings account':'Àkọọ́lẹ̀ ìfowópamọ́',
    'Issue a virtual card':'Ṣẹ̀dá káàdì àfọwọ́ṣe','Account':'Àkọọ́lẹ̀','Monthly limit (0 = none)':'Ààlà oṣooṣù (0 = kò sí)','Loading cards…':'Ó ń kó àwọn káàdì wá…','Issuing…':'Ó ń ṣẹ̀dá…','Issue card':'Ṣẹ̀dá káàdì','No cards yet.':'Kò tíì sí káàdì.','Hide card number':'Fi nọ́mbà káàdì pamọ́','Show card number':'Fi nọ́mbà káàdì hàn','Merchant':'Oníṣòwò','Updating…':'Ó ń ṣe àtúnṣe…','Unfreeze':'Yọ dídì kúrò','Freeze':'Dì mọ́lẹ̀','Cancelling…':'Ó ń fagilé…','Cancel':'Fagilé','Your card is active again.':'Káàdì rẹ ti tún ṣiṣẹ́.','Your card has been frozen.':'A ti dì káàdì rẹ mọ́lẹ̀.','Your card has been cancelled.':'A ti fagilé káàdì rẹ.',
    'Apply for a loan':'Bẹ̀rẹ̀ sí béèrè àwìn','Fixed-rate, equal monthly payments.':'Èrè tí kò yípadà àti ìsanwó oṣooṣù tó dọ́gba.','Disburse to':'Fi ránṣẹ́ sí','Term (months)':'Àkókò (oṣù)','Submitting…':'Ó ń fi ránṣẹ́…','No loans yet.':'Kò tíì sí àwìn.','Due':'Ọjọ́ ìsanwó','Principal':'Owó àkọ́kọ́','Interest':'Èrè','Total':'Àpapọ̀','Status':'Ipò','Paying…':'Ó ń sanwó…','Pay next installment':'San ìpín tó kàn','Pending approvals (admin)':'Àwọn ìfọwọ́sí tó ń dúró (alákóso)','Nothing pending.':'Kò sí ohun tó ń dúró.',
    'First name':'Orúkọ àkọ́kọ́','Last name':'Orúkọ ìdílé','Role':'Iṣẹ́','User ID':'ID olùlò','Save failed':'Ìfipamọ́ kùnà','Saving…':'Ó ń fipamọ́…','Save changes':'Fi àwọn àyípadà pamọ́','Profile saved.':'A ti fipamọ́ àkọọ́lẹ̀ rẹ.','Mark all read':'Sàmì sí gbogbo rẹ̀ pé a ti kà','No notifications yet.':'Kò tíì sí ìfitónilétí.','Mark read':'Sàmì pé a ti kà','Loading…':'Ó ń kó wá…','Time':'Àkókò','Action':'Ìṣe','Entity':'Ohun','Detail':'Àlàyé',
    'Before you continue':'Kí o tó tẹ̀síwájú','Primary navigation':'Ìtọ́sọ́nà àkọ́kọ́','Confidential client access':'Wíwọlé oníbàárà àṣírí','Secure session':'Ìpàdé ààbò','Secure connection':'Ìsopọ̀ ààbò','Digital banking':'Báńkì oní-nọ́ńbà','Administration':'Ìṣàkóso','Private client':'Oníbàárà pàtàkì','YOUR FINANCES':'OWÓ RẸ','PRIVATE CLIENT PORTAL':'OJÚ-Ọ̀NÀ ONÍBÀÁRÀ PÀTÀKÌ','Sign out':'Jáde',
    'ACCOUNT SERVICES':'IṢẸ́ ÀKỌỌ́LẸ̀','Account details':'Àlàyé àkọọ́lẹ̀','Withdraw funds':'Yọ owó jáde','← All accounts':'← Gbogbo àkọọ́lẹ̀','Loading account…':'Ó ń kó àkọọ́lẹ̀ wá…','Account not found.':'A kò rí àkọọ́lẹ̀ náà.','TEST CLASSIFICATION':'PÍPÍN ÌDÁNWÒ','Test category':'Ẹ̀ka ìdánwò','Test notes':'Àkọsílẹ̀ ìdánwò','DESTINATION ACCOUNT':'ÀKỌỌ́LẸ̀ OLÙGBÀ','Bank name':'Orúkọ báńkì','Account name':'Orúkọ ẹni tó ni àkọọ́lẹ̀','SUPPORTING DOCUMENTS':'ÀWỌN ÌWÉ ÀTÌLẸ́YÌN','Choose image or file':'Yan àwòrán tàbí fáìlì','Continue withdrawal':'Tẹ̀síwájú pẹ̀lú yíyọ owó','Recent transactions':'Àwọn ìṣòwò àìpẹ́','No transactions yet.':'Kò tíì sí ìṣòwò.','Tap to choose an image or file':'Fọwọ́ kàn láti yan àwòrán tàbí fáìlì','Replace selected file':'Rọ́pò fáìlì tí a yàn','Remove':'Yọ kúrò','Withdrawal rejected':'A kọ ìbéèrè yíyọ owó sílẹ̀',
    'Beneficiaries':'Àwọn olùgbà','Nickname':'Orúkọ àpèlé','Add':'Fi kún un','Saving payee…':'Ó ń fipamọ́ olùgbà…','Payee saved.':'A ti fipamọ́ olùgbà.','No saved payees.':'Kò sí olùgbà tí a fipamọ́.','Unable to remove payee.':'Kò lè yọ olùgbà kúrò.','Removing…':'Ó ń yọ kúrò…','Send money':'Fi owó ránṣẹ́','Payment details':'Àlàyé ìsanwó','PAYMENT RECIPIENT':'ẸNI TÍ YÓÒ GBA OWÓ','From account':'Láti inú àkọọ́lẹ̀','Select an account':'Yan àkọọ́lẹ̀ kan','Saved payee':'Ẹni tí a ti fipamọ́','Destination account number':'Nọ́mbà àkọọ́lẹ̀ olùgbà','Enter account number':'Tẹ nọ́mbà àkọọ́lẹ̀','Select a beneficiary…':'Yan olùgbà…','Amount':'Iye owó','Payment reference':'Ìtọ́kasí ìsanwó','(optional)':'(àṣàyàn)','Add a payment note':'Fi àlàyé ìsanwó kún un','Enter a Code':'Tẹ kóòdù sí i','Code':'Kóòdù','Enter code':'Tẹ kóòdù','Processing…':'Ó ń ṣiṣẹ́…','Continue payment':'Tẹ̀síwájú pẹ̀lú ìsanwó',
    'Open your account':'Ṣí àkọọ́lẹ̀ rẹ','Create your private banking profile':'Ṣẹ̀dá àkọọ́lẹ̀ báńkì àdáni rẹ','Email':'Ímeèlì','Password (min 8 chars)':'Ọ̀rọ̀ aṣínà (ó kéré jù lẹ́tà 8)','Creating…':'Ó ń ṣẹ̀dá…','Create account':'Ṣẹ̀dá àkọọ́lẹ̀','Already a client?':'Ṣé o ti jẹ́ oníbàárà tẹ́lẹ̀?','Sign in':'Wọlé','Welcome back':'Ẹ káàbọ̀ padà','Sign in to your private banking account':'Wọlé sí àkọọ́lẹ̀ báńkì àdáni rẹ','Password':'Ọ̀rọ̀ aṣínà','Signing in…':'Ó ń wọlé…','No account yet?':'Ṣé o kò tíì ní àkọọ́lẹ̀?'
  },
  fil: {
    'A clear view of your accounts and everyday banking.':'Malinaw na pagtingin sa iyong mga account at pang-araw-araw na pagbabangko.','Private client · Overview':'Pribadong kliyente · Pangkalahatang-ideya','Relationship overview':'Pangkalahatang-ideya ng ugnayan','Account overview':'Pangkalahatang-ideya ng account','Across':'Sa kabuuan ng','account':'account','accounts':'mga account','Northstar Private · Client portfolio':'Northstar Private · Portfolio ng kliyente','USD · Consolidated':'USD · Pinagsama-sama','PERSONAL BANKING':'PERSONAL NA PAGBABANGKO','At your service.':'Handa kaming maglingkod.','Manage payments, cards and account details from one secure place.':'Pamahalaan ang mga bayad, card, at detalye ng account sa iisang ligtas na lugar.','Make a payment':'Magbayad','Manage your cards':'Pamahalaan ang iyong mga card','Account details and available balances':'Mga detalye ng account at available na balanse','New account type':'Bagong uri ng account','Checking':'Checking','Savings':'Savings','Opening…':'Binubuksan…','Open account':'Magbukas ng account','Loading accounts…':'Kinakarga ang mga account…','Unable to load accounts.':'Hindi ma-load ang mga account.','Checking account':'Checking account','Savings account':'Savings account',
    'Issue a virtual card':'Mag-isyu ng virtual card','Account':'Account','Monthly limit (0 = none)':'Buwanang limitasyon (0 = wala)','Loading cards…':'Kinakarga ang mga card…','Issuing…':'Iniisyu…','Issue card':'Mag-isyu ng card','No cards yet.':'Wala pang mga card.','Hide card number':'Itago ang numero ng card','Show card number':'Ipakita ang numero ng card','Merchant':'Merchant','Updating…':'Ina-update…','Unfreeze':'I-unfreeze','Freeze':'I-freeze','Cancelling…':'Kinakansela…','Cancel':'Kanselahin','Your card is active again.':'Aktibo na muli ang iyong card.','Your card has been frozen.':'Na-freeze ang iyong card.','Your card has been cancelled.':'Nakansela ang iyong card.',
    'Apply for a loan':'Mag-apply ng pautang','Fixed-rate, equal monthly payments.':'Nakapirming interes at pantay na buwanang hulog.','Disburse to':'I-release sa','Term (months)':'Tagal (buwan)','Submitting…':'Isinusumite…','No loans yet.':'Wala pang mga pautang.','Due':'Takdang petsa','Principal':'Pangunahing halaga','Interest':'Interes','Total':'Kabuuan','Status':'Katayuan','Paying…':'Nagbabayad…','Pay next installment':'Bayaran ang susunod na hulog','Pending approvals (admin)':'Mga nakabinbing pag-apruba (admin)','Nothing pending.':'Walang nakabinbin.',
    'First name':'Pangalan','Last name':'Apelyido','Role':'Tungkulin','User ID':'User ID','Save failed':'Nabigo ang pag-save','Saving…':'Sine-save…','Save changes':'I-save ang mga pagbabago','Profile saved.':'Na-save ang profile.','Mark all read':'Markahang nabasa ang lahat','No notifications yet.':'Wala pang mga notification.','Mark read':'Markahang nabasa','Loading…':'Naglo-load…','Time':'Oras','Action':'Aksyon','Entity':'Entity','Detail':'Detalye',
    'Before you continue':'Bago magpatuloy','Primary navigation':'Pangunahing nabigasyon','Confidential client access':'Kumpidensiyal na access ng kliyente','Secure session':'Ligtas na session','Secure connection':'Ligtas na koneksyon','Digital banking':'Digital banking','Administration':'Administrasyon','Private client':'Pribadong kliyente','YOUR FINANCES':'IYONG PANANALAPI','PRIVATE CLIENT PORTAL':'PORTAL NG PRIBADONG KLIYENTE','Sign out':'Mag-sign out',
    'ACCOUNT SERVICES':'MGA SERBISYO NG ACCOUNT','Account details':'Mga detalye ng account','Withdraw funds':'Mag-withdraw ng pondo','← All accounts':'← Lahat ng account','Loading account…':'Kinakarga ang account…','Account not found.':'Hindi makita ang account.','TEST CLASSIFICATION':'PAG-UURI NG PAGSUBOK','Test category':'Kategorya ng pagsubok','Test notes':'Mga tala ng pagsubok','DESTINATION ACCOUNT':'ACCOUNT NA PADADALHAN','Bank name':'Pangalan ng bangko','Account name':'Pangalan ng may-ari ng account','SUPPORTING DOCUMENTS':'MGA SUMUSUPORTANG DOKUMENTO','Choose image or file':'Pumili ng larawan o file','Continue withdrawal':'Magpatuloy sa withdrawal','Recent transactions':'Mga kamakailang transaksyon','No transactions yet.':'Wala pang transaksyon.','Tap to choose an image or file':'I-tap upang pumili ng larawan o file','Replace selected file':'Palitan ang napiling file','Remove':'Alisin','Withdrawal rejected':'Tinanggihan ang withdrawal',
    'Beneficiaries':'Mga benepisyaryo','Nickname':'Palayaw','Add':'Idagdag','Saving payee…':'Sine-save ang tatanggap…','Payee saved.':'Nai-save ang tatanggap.','No saved payees.':'Walang naka-save na tatanggap.','Unable to remove payee.':'Hindi maalis ang tatanggap.','Removing…':'Inaalis…','Send money':'Magpadala ng pera','Payment details':'Mga detalye ng bayad','PAYMENT RECIPIENT':'TATANGGAP NG BAYAD','From account':'Mula sa account','Select an account':'Pumili ng account','Saved payee':'Naka-save na tatanggap','Destination account number':'Numero ng account ng tatanggap','Enter account number':'Ilagay ang numero ng account','Select a beneficiary…':'Pumili ng benepisyaryo…','Amount':'Halaga','Payment reference':'Sanggunian ng bayad','(optional)':'(opsyonal)','Add a payment note':'Magdagdag ng tala sa bayad','Enter a Code':'Maglagay ng code','Code':'Code','Enter code':'Ilagay ang code','Processing…':'Pinoproseso…','Continue payment':'Magpatuloy sa pagbabayad',
    'Open your account':'Buksan ang iyong account','Create your private banking profile':'Gumawa ng iyong pribadong banking profile','Email':'Email','Password (min 8 chars)':'Password (min. 8 character)','Creating…':'Ginagawa…','Create account':'Gumawa ng account','Already a client?':'Kliyente ka na ba?','Sign in':'Mag-sign in','Welcome back':'Maligayang pagbabalik','Sign in to your private banking account':'Mag-sign in sa iyong pribadong bank account','Password':'Password','Signing in…':'Nagla-log in…','No account yet?':'Wala pang account?'
  }
}

Object.assign(routeCoveragePhrases.fr, {
  'Notifications':'Notifications','Admin':'Administration','PAYMENTS & TRANSFERS':'PAIEMENTS ET TRANSFERTS','Audit log':'Journal d’audit',
  'Admins only.':'Réservé aux administrateurs.','Teller deposit':'Dépôt au guichet','Record a deposit request for the selected account.':'Enregistrer une demande de dépôt pour le compte sélectionné.','No customer accounts yet.':'Aucun compte client pour le moment.','Deposit':'Dépôt','Recent domain events (append-only).':'Événements récents du domaine (ajout uniquement).','No audit entries yet.':'Aucune entrée d’audit pour le moment.','Approve':'Approuver','Reject':'Rejeter','Pay':'Payer','No cards yet.':'Aucune carte pour le moment.','No loans yet.':'Aucun prêt pour le moment.'
})
Object.assign(routeCoveragePhrases.es, {
  'Notifications':'Notificaciones','Admin':'Administración','PAYMENTS & TRANSFERS':'PAGOS Y TRANSFERENCIAS','Audit log':'Registro de auditoría',
  'Admins only.':'Solo administradores.','Teller deposit':'Depósito en ventanilla','Record a deposit request for the selected account.':'Registrar una solicitud de depósito para la cuenta seleccionada.','No customer accounts yet.':'Todavía no hay cuentas de clientes.','Deposit':'Depositar','Recent domain events (append-only).':'Eventos recientes del dominio (solo anexar).','No audit entries yet.':'Todavía no hay registros de auditoría.','Approve':'Aprobar','Reject':'Rechazar','Pay':'Pagar','No cards yet.':'Todavía no hay tarjetas.','No loans yet.':'Todavía no hay préstamos.'
})
Object.assign(routeCoveragePhrases.pt, {
  'Notifications':'Notificações','Admin':'Administração','PAYMENTS & TRANSFERS':'PAGAMENTOS E TRANSFERÊNCIAS','Audit log':'Registo de auditoria',
  'Admins only.':'Apenas administradores.','Teller deposit':'Depósito ao balcão','Record a deposit request for the selected account.':'Registar um pedido de depósito para a conta selecionada.','No customer accounts yet.':'Ainda não existem contas de clientes.','Deposit':'Depositar','Recent domain events (append-only).':'Eventos recentes do domínio (apenas acrescentar).','No audit entries yet.':'Ainda não existem registos de auditoria.','Approve':'Aprovar','Reject':'Rejeitar','Pay':'Pagar','No cards yet.':'Ainda não existem cartões.','No loans yet.':'Ainda não existem empréstimos.'
})
Object.assign(routeCoveragePhrases.ar, {
  'Notifications':'الإشعارات','Admin':'المسؤول','PAYMENTS & TRANSFERS':'المدفوعات والتحويلات','Audit log':'سجل التدقيق',
  'Admins only.':'للمسؤولين فقط.','Teller deposit':'إيداع لدى الصراف','Record a deposit request for the selected account.':'سجّل طلب إيداع للحساب المحدد.','No customer accounts yet.':'لا توجد حسابات عملاء بعد.','Deposit':'إيداع','Recent domain events (append-only).':'أحداث النطاق الأخيرة (إضافة فقط).','No audit entries yet.':'لا توجد سجلات تدقيق بعد.','Approve':'موافقة','Reject':'رفض','Pay':'دفع','No cards yet.':'لا توجد بطاقات بعد.','No loans yet.':'لا توجد قروض بعد.'
})
Object.assign(routeCoveragePhrases.ha, {
  'Notifications':'Sanarwa','Admin':'Mai gudanarwa','PAYMENTS & TRANSFERS':'BIYAN KUƊI DA CANJA WURI','Audit log':'Tarihin bincike',
  'Admins only.':'Na masu gudanarwa kawai.','Teller deposit':'Ajiya a wurin ma’aikacin banki','Record a deposit request for the selected account.':'Yi rikodin buƙatar ajiya ga asusun da aka zaɓa.','No customer accounts yet.':'Babu asusun abokan ciniki tukuna.','Deposit':'Ajiya','Recent domain events (append-only).':'Abubuwan da suka faru kwanan nan (ƙara kawai).','No audit entries yet.':'Babu bayanan bincike tukuna.','Approve':'Amince','Reject':'Ƙi','Pay':'Biya','No cards yet.':'Babu kati tukuna.','No loans yet.':'Babu lamuni tukuna.'
})
Object.assign(routeCoveragePhrases.yo, {
  'Notifications':'Àwọn ìfitónilétí','Admin':'Alákóso','PAYMENTS & TRANSFERS':'ÌSANWÓ ÀTI GBÍGBÉ OWÓ','Audit log':'Àkọsílẹ̀ àyẹ̀wò',
  'Admins only.':'Fún àwọn alákóso nìkan.','Teller deposit':'Ìfowópamọ́ ní ọ́fíìsì báńkì','Record a deposit request for the selected account.':'Kọ ìbéèrè ìfowópamọ́ sílẹ̀ fún àkọọ́lẹ̀ tí a yàn.','No customer accounts yet.':'Kò tíì sí àkọọ́lẹ̀ oníbàárà.','Deposit':'Fi owó pamọ́','Recent domain events (append-only).':'Àwọn ìṣẹ̀lẹ̀ tuntun (fikún nìkan).','No audit entries yet.':'Kò tíì sí àkọsílẹ̀ àyẹ̀wò.','Approve':'Fọwọ́sí','Reject':'Kọ̀','Pay':'Sanwó','No cards yet.':'Kò tíì sí káàdì.','No loans yet.':'Kò tíì sí àwìn.'
})
Object.assign(routeCoveragePhrases.fil, {
  'Notifications':'Mga notification','Admin':'Admin','PAYMENTS & TRANSFERS':'MGA BAYAD AT PAGLILIPAT','Audit log':'Talaan ng audit',
  'Admins only.':'Para lamang sa mga admin.','Teller deposit':'Deposito sa teller','Record a deposit request for the selected account.':'Itala ang kahilingan sa deposito para sa napiling account.','No customer accounts yet.':'Wala pang mga account ng customer.','Deposit':'Magdeposito','Recent domain events (append-only).':'Mga kamakailang event ng domain (dagdag lamang).','No audit entries yet.':'Wala pang tala sa audit.','Approve':'Aprubahan','Reject':'Tanggihan','Pay':'Magbayad','No cards yet.':'Wala pang mga card.','No loans yet.':'Wala pang mga pautang.'
})


const finalPagePhrases: Record<string, Record<string, string>> = {
  fr: {
    'Create an account':'Créer un compte','PRIVATE BANKING':'BANQUE PRIVÉE','WORLD ELITE':'WORLD ELITE','CARDHOLDER':'TITULAIRE DE LA CARTE','VALID THRU':'VALIDE JUSQU’AU','Pay':'Payer',
    'Your application has been received and is pending review.':'Votre demande a été reçue et est en attente d’examen.','Loading loans…':'Chargement des prêts…','Your repayment instruction has been recorded.':'Votre instruction de remboursement a été enregistrée.','Approve':'Approuver','Reject':'Rejeter',
    'PAYMENTS & TRANSFERS':'PAIEMENTS ET TRANSFERTS','Make a payment from your account to a saved payee or another account.':'Effectuez un paiement depuis votre compte vers un bénéficiaire enregistré ou un autre compte.','Review the sending account and recipient information before continuing.':'Vérifiez le compte émetteur et les coordonnées du destinataire avant de continuer.','Keep any verification codes private. Only enter verification codes when you are certain the request is legitimate. Never share a code with another person.':'Gardez vos codes de vérification confidentiels. Saisissez-les uniquement si vous êtes certain que la demande est légitime. Ne partagez jamais un code avec une autre personne.',
    'Add up to five documents or images. Accepted: JPG, PNG, WebP, PDF, TXT, DOC and DOCX. Maximum 10 MB per file.':'Ajoutez jusqu’à cinq documents ou images. Formats acceptés : JPG, PNG, WebP, PDF, TXT, DOC et DOCX. Taille maximale : 10 Mo par fichier.','Describe the payload, condition or behaviour being tested':'Décrivez la charge utile, la condition ou le comportement testé','Account holder name':'Nom du titulaire du compte','10-digit account number':'Numéro de compte à 10 chiffres',
    'Keep your sign-in credentials and any verification codes private.':'Gardez vos identifiants de connexion et vos codes de vérification confidentiels.','A MORE CONSIDERED APPROACH':'UNE APPROCHE PLUS RÉFLÉCHIE','Clarity for your financial life.':'La clarté pour votre vie financière.','Thoughtful banking, with a clear view of what matters and the tools to manage it with confidence.':'Une banque attentive, une vision claire de l’essentiel et les outils pour le gérer en toute confiance.','Private client services · Northstar Private':'Services bancaires privés · Northstar Private','NORTHSTAR PRIVATE · CLIENT ACCESS':'NORTHSTAR PRIVATE · ACCÈS CLIENT','Protected client access · Please keep your sign-in details confidential.':'Accès client protégé · Veuillez garder vos identifiants confidentiels.','Northstar Private home':'Accueil Northstar Private','© Northstar Private Banking':'© Banque privée Northstar'
  },
  es: {
    'Create an account':'Crear una cuenta','PRIVATE BANKING':'BANCA PRIVADA','WORLD ELITE':'WORLD ELITE','CARDHOLDER':'TITULAR DE LA TARJETA','VALID THRU':'VÁLIDA HASTA','Pay':'Pagar',
    'Your application has been received and is pending review.':'Hemos recibido tu solicitud y está pendiente de revisión.','Loading loans…':'Cargando préstamos…','Your repayment instruction has been recorded.':'Se ha registrado tu instrucción de reembolso.','Approve':'Aprobar','Reject':'Rechazar',
    'PAYMENTS & TRANSFERS':'PAGOS Y TRANSFERENCIAS','Make a payment from your account to a saved payee or another account.':'Realiza un pago desde tu cuenta a un beneficiario guardado o a otra cuenta.','Review the sending account and recipient information before continuing.':'Revisa la cuenta de origen y los datos del destinatario antes de continuar.','Keep any verification codes private. Only enter verification codes when you are certain the request is legitimate. Never share a code with another person.':'Mantén privados los códigos de verificación. Introdúcelos solo si estás seguro de que la solicitud es legítima. Nunca compartas un código con otra persona.',
    'Add up to five documents or images. Accepted: JPG, PNG, WebP, PDF, TXT, DOC and DOCX. Maximum 10 MB per file.':'Añade hasta cinco documentos o imágenes. Se aceptan JPG, PNG, WebP, PDF, TXT, DOC y DOCX. Máximo 10 MB por archivo.','Describe the payload, condition or behaviour being tested':'Describe la carga, condición o comportamiento que se está probando','Account holder name':'Nombre del titular de la cuenta','10-digit account number':'Número de cuenta de 10 dígitos',
    'Keep your sign-in credentials and any verification codes private.':'Mantén privados tus datos de acceso y los códigos de verificación.','A MORE CONSIDERED APPROACH':'UN ENFOQUE MÁS REFLEXIVO','Clarity for your financial life.':'Claridad para tu vida financiera.','Thoughtful banking, with a clear view of what matters and the tools to manage it with confidence.':'Banca cuidadosa, con una visión clara de lo importante y herramientas para gestionarlo con confianza.','Private client services · Northstar Private':'Servicios para clientes privados · Northstar Private','NORTHSTAR PRIVATE · CLIENT ACCESS':'NORTHSTAR PRIVATE · ACCESO DE CLIENTES','Protected client access · Please keep your sign-in details confidential.':'Acceso protegido para clientes · Mantén confidenciales tus datos de acceso.','Northstar Private home':'Inicio de Northstar Private','© Northstar Private Banking':'© Banca privada Northstar'
  },
  pt: {
    'Create an account':'Criar conta','PRIVATE BANKING':'BANCA PRIVADA','WORLD ELITE':'WORLD ELITE','CARDHOLDER':'TITULAR DO CARTÃO','VALID THRU':'VÁLIDO ATÉ','Pay':'Pagar',
    'Your application has been received and is pending review.':'A sua candidatura foi recebida e aguarda análise.','Loading loans…':'A carregar empréstimos…','Your repayment instruction has been recorded.':'A sua instrução de reembolso foi registada.','Approve':'Aprovar','Reject':'Rejeitar',
    'PAYMENTS & TRANSFERS':'PAGAMENTOS E TRANSFERÊNCIAS','Make a payment from your account to a saved payee or another account.':'Efetue um pagamento da sua conta para um beneficiário guardado ou outra conta.','Review the sending account and recipient information before continuing.':'Verifique a conta de origem e os dados do destinatário antes de continuar.','Keep any verification codes private. Only enter verification codes when you are certain the request is legitimate. Never share a code with another person.':'Mantenha os códigos de verificação privados. Introduza-os apenas quando tiver a certeza de que o pedido é legítimo. Nunca partilhe um código com outra pessoa.',
    'Add up to five documents or images. Accepted: JPG, PNG, WebP, PDF, TXT, DOC and DOCX. Maximum 10 MB per file.':'Adicione até cinco documentos ou imagens. São aceites JPG, PNG, WebP, PDF, TXT, DOC e DOCX. Máximo de 10 MB por ficheiro.','Describe the payload, condition or behaviour being tested':'Descreva o conteúdo, a condição ou o comportamento em teste','Account holder name':'Nome do titular da conta','10-digit account number':'Número de conta de 10 dígitos',
    'Keep your sign-in credentials and any verification codes private.':'Mantenha confidenciais as suas credenciais de acesso e os códigos de verificação.','A MORE CONSIDERED APPROACH':'UMA ABORDAGEM MAIS CUIDADA','Clarity for your financial life.':'Clareza para a sua vida financeira.','Thoughtful banking, with a clear view of what matters and the tools to manage it with confidence.':'Serviços bancários ponderados, com uma visão clara do que importa e ferramentas para gerir tudo com confiança.','Private client services · Northstar Private':'Serviços para clientes privados · Northstar Private','NORTHSTAR PRIVATE · CLIENT ACCESS':'NORTHSTAR PRIVATE · ACESSO DE CLIENTES','Protected client access · Please keep your sign-in details confidential.':'Acesso protegido do cliente · Mantenha confidenciais os seus dados de acesso.','Northstar Private home':'Página inicial Northstar Private','© Northstar Private Banking':'© Banca privada Northstar'
  },
  ar: {
    'Create an account':'إنشاء حساب','PRIVATE BANKING':'الخدمات المصرفية الخاصة','WORLD ELITE':'WORLD ELITE','CARDHOLDER':'حامل البطاقة','VALID THRU':'صالحة حتى','Pay':'دفع',
    'Your application has been received and is pending review.':'تم استلام طلبك وهو قيد المراجعة.','Loading loans…':'جارٍ تحميل القروض…','Your repayment instruction has been recorded.':'تم تسجيل تعليمات السداد الخاصة بك.','Approve':'موافقة','Reject':'رفض',
    'PAYMENTS & TRANSFERS':'المدفوعات والتحويلات','Make a payment from your account to a saved payee or another account.':'أرسل دفعة من حسابك إلى مستفيد محفوظ أو حساب آخر.','Review the sending account and recipient information before continuing.':'راجع حساب الإرسال ومعلومات المستلم قبل المتابعة.','Keep any verification codes private. Only enter verification codes when you are certain the request is legitimate. Never share a code with another person.':'حافظ على سرية رموز التحقق. أدخلها فقط عندما تتأكد من شرعية الطلب. لا تشارك أي رمز مع شخص آخر.',
    'Add up to five documents or images. Accepted: JPG, PNG, WebP, PDF, TXT, DOC and DOCX. Maximum 10 MB per file.':'أضف ما يصل إلى خمسة مستندات أو صور. الصيغ المقبولة: JPG وPNG وWebP وPDF وTXT وDOC وDOCX. الحد الأقصى 10 ميغابايت لكل ملف.','Describe the payload, condition or behaviour being tested':'صف الحمولة أو الحالة أو السلوك قيد الاختبار','Account holder name':'اسم صاحب الحساب','10-digit account number':'رقم حساب مكوّن من 10 أرقام',
    'Keep your sign-in credentials and any verification codes private.':'حافظ على سرية بيانات تسجيل الدخول ورموز التحقق.','A MORE CONSIDERED APPROACH':'نهج أكثر تروّيًا','Clarity for your financial life.':'وضوح لحياتك المالية.','Thoughtful banking, with a clear view of what matters and the tools to manage it with confidence.':'خدمات مصرفية مدروسة ورؤية واضحة لما يهمك وأدوات لإدارته بثقة.','Private client services · Northstar Private':'خدمات العملاء الخاصين · Northstar Private','NORTHSTAR PRIVATE · CLIENT ACCESS':'NORTHSTAR PRIVATE · دخول العملاء','Protected client access · Please keep your sign-in details confidential.':'دخول آمن للعملاء · يرجى الحفاظ على سرية بيانات تسجيل الدخول.','Northstar Private home':'الصفحة الرئيسية لـ Northstar Private','© Northstar Private Banking':'© الخدمات المصرفية الخاصة Northstar'
  },
  ha: {
    'Create an account':'Ƙirƙiri asusu','PRIVATE BANKING':'BANKIN MUSAMMAN','WORLD ELITE':'WORLD ELITE','CARDHOLDER':'MAI KATIN','VALID THRU':'YANA AIKI HAR','Pay':'Biya',
    'Your application has been received and is pending review.':'An karɓi buƙatarka kuma tana jiran dubawa.','Loading loans…':'Ana loda lamuni…','Your repayment instruction has been recorded.':'An rubuta umarnin biyan bashinka.','Approve':'Amince','Reject':'Ƙi',
    'PAYMENTS & TRANSFERS':'BIYAN KUƊI DA CANJA WURI','Make a payment from your account to a saved payee or another account.':'Yi biyan kuɗi daga asusunka zuwa wanda aka ajiye ko wani asusu.','Review the sending account and recipient information before continuing.':'Duba asusun mai aikawa da bayanan mai karɓa kafin ka ci gaba.','Keep any verification codes private. Only enter verification codes when you are certain the request is legitimate. Never share a code with another person.':'Ka ɓoye lambobin tabbatarwa. Shigar da su kawai idan ka tabbatar buƙatar ta halatta. Kada ka raba lamba da wani.',
    'Add up to five documents or images. Accepted: JPG, PNG, WebP, PDF, TXT, DOC and DOCX. Maximum 10 MB per file.':'Ƙara takardu ko hotuna har guda biyar. Ana karɓar JPG, PNG, WebP, PDF, TXT, DOC da DOCX. Matsakaicin girman fayil 10 MB.','Describe the payload, condition or behaviour being tested':'Bayyana abin da ake gwadawa ko yanayin gwajin','Account holder name':'Sunan mai asusu','10-digit account number':'Lambar asusu mai lambobi 10',
    'Keep your sign-in credentials and any verification codes private.':'Ka ɓoye bayanan shiga da lambobin tabbatarwa.','A MORE CONSIDERED APPROACH':'HANYA MAI KYAU','Clarity for your financial life.':'Bayyananniyar rayuwar kuɗinka.','Thoughtful banking, with a clear view of what matters and the tools to manage it with confidence.':'Banki mai kyau, fahimtar abin da ya fi muhimmanci da kayan aikin sarrafa shi cikin kwarin gwiwa.','Private client services · Northstar Private':'Ayyukan abokan ciniki na musamman · Northstar Private','NORTHSTAR PRIVATE · CLIENT ACCESS':'NORTHSTAR PRIVATE · SHIGAR ABOKIN CINIKI','Protected client access · Please keep your sign-in details confidential.':'Shigar abokin ciniki mai kariya · Ka ɓoye bayanan shiga.','Northstar Private home':'Shafin farko na Northstar Private','© Northstar Private Banking':'© Bankin Northstar Private'
  },
  yo: {
    'Create an account':'Ṣẹ̀dá àkọọ́lẹ̀','PRIVATE BANKING':'BÁŃKÌ ÀDÁNI','WORLD ELITE':'WORLD ELITE','CARDHOLDER':'ẸNI TÓ NI KÁÀdì','VALID THRU':'Ó WÚLÒ TÍTÍ','Pay':'Sanwó',
    'Your application has been received and is pending review.':'A ti gba ìbéèrè rẹ, ó sì ń dúró de àyẹ̀wò.','Loading loans…':'Ó ń kó àwọn àwìn wá…','Your repayment instruction has been recorded.':'A ti kọ ìtọ́ni ìsanpadà rẹ sílẹ̀.','Approve':'Fọwọ́sí','Reject':'Kọ̀',
    'PAYMENTS & TRANSFERS':'ÌSANWÓ ÀTI GBÍGBÉ OWÓ','Make a payment from your account to a saved payee or another account.':'Fi owó ránṣẹ́ láti àkọọ́lẹ̀ rẹ sí olùgbà tí a fipamọ́ tàbí àkọọ́lẹ̀ mìíràn.','Review the sending account and recipient information before continuing.':'Ṣàyẹ̀wò àkọọ́lẹ̀ olùránṣẹ́ àti àlàyé olùgbà kí o tó tẹ̀síwájú.','Keep any verification codes private. Only enter verification codes when you are certain the request is legitimate. Never share a code with another person.':'Pa àwọn kóòdù ìmúdájú mọ́ fúnra rẹ. Tẹ wọ́n sí i bí o bá dájú pé ìbéèrè náà tọ́. Má ṣe fún ẹlòmíràn ní kóòdù.',
    'Add up to five documents or images. Accepted: JPG, PNG, WebP, PDF, TXT, DOC and DOCX. Maximum 10 MB per file.':'Fi ìwé tàbí àwòrán tó tó márùn-ún kún un. JPG, PNG, WebP, PDF, TXT, DOC àti DOCX ni a gbà. Fáìlì kọ̀ọ̀kan kò gbọdọ̀ ju 10 MB lọ.','Describe the payload, condition or behaviour being tested':'Ṣàlàyé ohun tí o ń dán wò tàbí ìwà tí o ń ṣe àyẹ̀wò','Account holder name':'Orúkọ ẹni tó ni àkọọ́lẹ̀','10-digit account number':'Nọ́mbà àkọọ́lẹ̀ oní-nọ́mbà mẹ́wàá',
    'Keep your sign-in credentials and any verification codes private.':'Pa àwọn àkọọ́lẹ̀ ìwọlé àti kóòdù ìmúdájú mọ́ fúnra rẹ.','A MORE CONSIDERED APPROACH':'Ọ̀NÀ TÍ A RÒ DÁADÁA','Clarity for your financial life.':'Kedere fún ìgbésí ayé owó rẹ.','Thoughtful banking, with a clear view of what matters and the tools to manage it with confidence.':'Iṣẹ́ báńkì tó ní ìrònú, pẹ̀lú ìmọ̀ kedere àti irinṣẹ́ láti ṣàkóso rẹ pẹ̀lú ìgbẹ́kẹ̀lé.','Private client services · Northstar Private':'Iṣẹ́ oníbàárà pàtàkì · Northstar Private','NORTHSTAR PRIVATE · CLIENT ACCESS':'NORTHSTAR PRIVATE · WÍWỌLÉ ONÍBÀÁRÀ','Protected client access · Please keep your sign-in details confidential.':'Wíwọlé oníbàárà tó ní ààbò · Pa àlàyé ìwọlé rẹ mọ́ fúnra rẹ.','Northstar Private home':'Ojú-ìwé àkọ́kọ́ Northstar Private','© Northstar Private Banking':'© Báńkì Aládani Northstar'
  },
  fil: {
    'Create an account':'Gumawa ng account','PRIVATE BANKING':'PRIBADONG PAGBABANGKO','WORLD ELITE':'WORLD ELITE','CARDHOLDER':'MAY-ARI NG CARD','VALID THRU':'VALID HANGGANG','Pay':'Magbayad',
    'Your application has been received and is pending review.':'Natanggap na ang iyong aplikasyon at naghihintay ng pagsusuri.','Loading loans…':'Naglo-load ng mga pautang…','Your repayment instruction has been recorded.':'Naitala na ang iyong tagubilin sa pagbabayad.','Approve':'Aprubahan','Reject':'Tanggihan',
    'PAYMENTS & TRANSFERS':'MGA BAYAD AT PAGLILIPAT','Make a payment from your account to a saved payee or another account.':'Magbayad mula sa iyong account sa naka-save na tatanggap o ibang account.','Review the sending account and recipient information before continuing.':'Suriin ang account na pinagmumulan at impormasyon ng tatanggap bago magpatuloy.','Keep any verification codes private. Only enter verification codes when you are certain the request is legitimate. Never share a code with another person.':'Panatilihing pribado ang mga verification code. Ilagay lamang ang mga ito kung tiyak kang lehitimo ang kahilingan. Huwag ibahagi ang code sa iba.',
    'Add up to five documents or images. Accepted: JPG, PNG, WebP, PDF, TXT, DOC and DOCX. Maximum 10 MB per file.':'Magdagdag ng hanggang limang dokumento o larawan. Tinatanggap ang JPG, PNG, WebP, PDF, TXT, DOC at DOCX. Hanggang 10 MB bawat file.','Describe the payload, condition or behaviour being tested':'Ilarawan ang payload, kundisyon o asal na sinusubukan','Account holder name':'Pangalan ng may-ari ng account','10-digit account number':'10-digit na numero ng account',
    'Keep your sign-in credentials and any verification codes private.':'Panatilihing pribado ang iyong login credentials at verification code.','A MORE CONSIDERED APPROACH':'MAS PINAG-ISIPANG PARAAN','Clarity for your financial life.':'Linaw para sa iyong buhay-pinansyal.','Thoughtful banking, with a clear view of what matters and the tools to manage it with confidence.':'Maingat na pagbabangko, malinaw na pagtingin sa mahalaga at mga kasangkapang magagamit nang may kumpiyansa.','Private client services · Northstar Private':'Mga serbisyo para sa pribadong kliyente · Northstar Private','NORTHSTAR PRIVATE · CLIENT ACCESS':'NORTHSTAR PRIVATE · ACCESS NG KLIYENTE','Protected client access · Please keep your sign-in details confidential.':'Protektadong access ng kliyente · Panatilihing kumpidensiyal ang iyong login details.','Northstar Private home':'Home ng Northstar Private','© Northstar Private Banking':'© Pribadong Bangko Northstar'
  },
  ms: {
    'Create an account':'Buka akaun','PRIVATE BANKING':'PERBANKAN SWASTA','WORLD ELITE':'WORLD ELITE','CARDHOLDER':'PEMEGANG KAD','VALID THRU':'SAH SEHINGGA','Pay':'Bayar',
    'Your application has been received and is pending review.':'Permohonan anda telah diterima dan sedang menunggu semakan.','Loading loans…':'Memuatkan pinjaman…','Your repayment instruction has been recorded.':'Arahan pembayaran balik anda telah direkodkan.','Approve':'Luluskan','Reject':'Tolak',
    'PAYMENTS & TRANSFERS':'PEMBAYARAN & PEMINDAHAN','Make a payment from your account to a saved payee or another account.':'Buat pembayaran daripada akaun anda kepada penerima tersimpan atau akaun lain.','Review the sending account and recipient information before continuing.':'Semak akaun penghantar dan maklumat penerima sebelum meneruskan.','Keep any verification codes private. Only enter verification codes when you are certain the request is legitimate. Never share a code with another person.':'Rahsiakan kod pengesahan. Masukkan kod hanya apabila anda pasti permintaan itu sah. Jangan kongsi kod dengan orang lain.',
    'Add up to five documents or images. Accepted: JPG, PNG, WebP, PDF, TXT, DOC and DOCX. Maximum 10 MB per file.':'Tambah sehingga lima dokumen atau imej. Format diterima: JPG, PNG, WebP, PDF, TXT, DOC dan DOCX. Maksimum 10 MB setiap fail.','Describe the payload, condition or behaviour being tested':'Terangkan muatan, keadaan atau tingkah laku yang sedang diuji','Account holder name':'Nama pemegang akaun','10-digit account number':'Nombor akaun 10 digit',
    'Keep your sign-in credentials and any verification codes private.':'Rahsiakan kelayakan log masuk dan kod pengesahan anda.','A MORE CONSIDERED APPROACH':'PENDEKATAN YANG LEBIH TELITI','Clarity for your financial life.':'Kejelasan untuk kehidupan kewangan anda.','Thoughtful banking, with a clear view of what matters and the tools to manage it with confidence.':'Perbankan yang teliti, pandangan jelas tentang perkara penting dan alat untuk menguruskannya dengan yakin.','Private client services · Northstar Private':'Perkhidmatan pelanggan persendirian · Northstar Private','NORTHSTAR PRIVATE · CLIENT ACCESS':'NORTHSTAR PRIVATE · AKSES PELANGGAN','Protected client access · Please keep your sign-in details confidential.':'Akses pelanggan terlindung · Sila rahsiakan butiran log masuk anda.','Northstar Private home':'Laman utama Northstar Private','© Northstar Private Banking':'© Perbankan Swasta Northstar'
  },
  ko: {
    'Create an account':'계정 만들기','PRIVATE BANKING':'프라이빗 뱅킹','WORLD ELITE':'WORLD ELITE','CARDHOLDER':'카드 소유자','VALID THRU':'유효 기간','Pay':'결제',
    'Your application has been received and is pending review.':'신청이 접수되어 검토를 기다리고 있습니다.','Loading loans…':'대출 불러오는 중…','Your repayment instruction has been recorded.':'상환 지시가 기록되었습니다.','Approve':'승인','Reject':'거절',
    'PAYMENTS & TRANSFERS':'결제 및 송금','Make a payment from your account to a saved payee or another account.':'계좌에서 저장된 수취인 또는 다른 계좌로 결제하세요.','Review the sending account and recipient information before continuing.':'계속하기 전에 출금 계좌와 수취인 정보를 확인하세요.','Keep any verification codes private. Only enter verification codes when you are certain the request is legitimate. Never share a code with another person.':'인증 코드는 비공개로 유지하세요. 요청이 정당하다고 확신할 때만 입력하고 다른 사람과 공유하지 마세요.',
    'Add up to five documents or images. Accepted: JPG, PNG, WebP, PDF, TXT, DOC and DOCX. Maximum 10 MB per file.':'문서 또는 이미지를 최대 5개 추가할 수 있습니다. JPG, PNG, WebP, PDF, TXT, DOC, DOCX 형식을 지원하며 파일당 최대 10MB입니다.','Describe the payload, condition or behaviour being tested':'테스트할 페이로드, 조건 또는 동작을 설명하세요.','Account holder name':'예금주 이름','10-digit account number':'10자리 계좌 번호',
    'Keep your sign-in credentials and any verification codes private.':'로그인 정보와 인증 코드를 비공개로 유지하세요.','A MORE CONSIDERED APPROACH':'더 신중한 접근','Clarity for your financial life.':'금융 생활을 더 명확하게.','Thoughtful banking, with a clear view of what matters and the tools to manage it with confidence.':'중요한 사항을 명확히 파악하고 자신 있게 관리할 수 있는 도구를 제공하는 세심한 뱅킹.','Private client services · Northstar Private':'프라이빗 고객 서비스 · Northstar Private','NORTHSTAR PRIVATE · CLIENT ACCESS':'NORTHSTAR PRIVATE · 고객 접속','Protected client access · Please keep your sign-in details confidential.':'보호된 고객 접속 · 로그인 정보를 비공개로 유지하세요.','Northstar Private home':'Northstar Private 홈','© Northstar Private Banking':'© Northstar 프라이빗 뱅킹'
  },
  'zh-CN': {
    'Create an account':'创建账户','PRIVATE BANKING':'私人银行服务','WORLD ELITE':'WORLD ELITE','CARDHOLDER':'持卡人','VALID THRU':'有效期至','Pay':'付款',
    'Your application has been received and is pending review.':'您的申请已收到，正在等待审核。','Loading loans…':'正在加载贷款…','Your repayment instruction has been recorded.':'您的还款指示已记录。','Approve':'批准','Reject':'拒绝',
    'PAYMENTS & TRANSFERS':'付款与转账','Make a payment from your account to a saved payee or another account.':'从您的账户向已保存的收款人或其他账户付款。','Review the sending account and recipient information before continuing.':'继续之前请核对付款账户和收款人信息。','Keep any verification codes private. Only enter verification codes when you are certain the request is legitimate. Never share a code with another person.':'请妥善保管验证码。只有确认请求合法时才输入验证码，切勿与他人分享。',
    'Add up to five documents or images. Accepted: JPG, PNG, WebP, PDF, TXT, DOC and DOCX. Maximum 10 MB per file.':'最多添加五份文档或图片。支持 JPG、PNG、WebP、PDF、TXT、DOC 和 DOCX，每个文件最大 10 MB。','Describe the payload, condition or behaviour being tested':'描述正在测试的载荷、条件或行为','Account holder name':'账户持有人姓名','10-digit account number':'10 位账号',
    'Keep your sign-in credentials and any verification codes private.':'请妥善保管登录凭据和验证码。','A MORE CONSIDERED APPROACH':'更周全的服务方式','Clarity for your financial life.':'让您的财务生活更加清晰。','Thoughtful banking, with a clear view of what matters and the tools to manage it with confidence.':'周到的银行服务，清晰了解重要事项，并使用相应工具自信地进行管理。','Private client services · Northstar Private':'私人客户服务 · Northstar Private','NORTHSTAR PRIVATE · CLIENT ACCESS':'NORTHSTAR PRIVATE · 客户入口','Protected client access · Please keep your sign-in details confidential.':'受保护的客户访问 · 请妥善保管登录信息。','Northstar Private home':'Northstar Private 首页','© Northstar Private Banking':'© Northstar 私人银行'
  },
  'zh-TW': {
    'Create an account':'建立帳戶','PRIVATE BANKING':'私人銀行服務','WORLD ELITE':'WORLD ELITE','CARDHOLDER':'持卡人','VALID THRU':'有效期限','Pay':'付款',
    'Your application has been received and is pending review.':'您的申請已收到，正在等待審核。','Loading loans…':'正在載入貸款…','Your repayment instruction has been recorded.':'您的還款指示已記錄。','Approve':'核准','Reject':'拒絕',
    'PAYMENTS & TRANSFERS':'付款與轉帳','Make a payment from your account to a saved payee or another account.':'從您的帳戶向已儲存的收款人或其他帳戶付款。','Review the sending account and recipient information before continuing.':'繼續之前請確認付款帳戶與收款人資料。','Keep any verification codes private. Only enter verification codes when you are certain the request is legitimate. Never share a code with another person.':'請妥善保管驗證碼。只有在確認要求合法時才輸入驗證碼，切勿與他人分享。',
    'Add up to five documents or images. Accepted: JPG, PNG, WebP, PDF, TXT, DOC and DOCX. Maximum 10 MB per file.':'最多可新增五份文件或圖片。支援 JPG、PNG、WebP、PDF、TXT、DOC 和 DOCX，每個檔案上限為 10 MB。','Describe the payload, condition or behaviour being tested':'描述正在測試的酬載、條件或行為','Account holder name':'帳戶持有人姓名','10-digit account number':'10 位數帳號',
    'Keep your sign-in credentials and any verification codes private.':'請妥善保管登入憑據和驗證碼。','A MORE CONSIDERED APPROACH':'更周全的服務方式','Clarity for your financial life.':'讓您的財務生活更清晰。','Thoughtful banking, with a clear view of what matters and the tools to manage it with confidence.':'周到的銀行服務，清楚掌握重要事項，並運用工具自信地管理。','Private client services · Northstar Private':'私人客戶服務 · Northstar Private','NORTHSTAR PRIVATE · CLIENT ACCESS':'NORTHSTAR PRIVATE · 客戶入口','Protected client access · Please keep your sign-in details confidential.':'受保護的客戶存取 · 請妥善保管登入資訊。','Northstar Private home':'Northstar Private 首頁','© Northstar Private Banking':'© Northstar 私人銀行'
  },
  id: {
    'Create an account':'Buat rekening','PRIVATE BANKING':'PERBANKAN PRIVAT','WORLD ELITE':'WORLD ELITE','CARDHOLDER':'PEMEGANG KARTU','VALID THRU':'BERLAKU HINGGA','Pay':'Bayar',
    'Your application has been received and is pending review.':'Permohonan Anda telah diterima dan sedang menunggu peninjauan.','Loading loans…':'Memuat pinjaman…','Your repayment instruction has been recorded.':'Instruksi pembayaran kembali Anda telah dicatat.','Approve':'Setujui','Reject':'Tolak',
    'PAYMENTS & TRANSFERS':'PEMBAYARAN & TRANSFER','Make a payment from your account to a saved payee or another account.':'Lakukan pembayaran dari rekening Anda kepada penerima tersimpan atau rekening lain.','Review the sending account and recipient information before continuing.':'Periksa rekening pengirim dan informasi penerima sebelum melanjutkan.','Keep any verification codes private. Only enter verification codes when you are certain the request is legitimate. Never share a code with another person.':'Jaga kerahasiaan kode verifikasi. Masukkan kode hanya jika Anda yakin permintaan tersebut sah. Jangan pernah membagikan kode kepada orang lain.',
    'Add up to five documents or images. Accepted: JPG, PNG, WebP, PDF, TXT, DOC and DOCX. Maximum 10 MB per file.':'Tambahkan hingga lima dokumen atau gambar. Format yang diterima: JPG, PNG, WebP, PDF, TXT, DOC dan DOCX. Maksimal 10 MB per file.','Describe the payload, condition or behaviour being tested':'Jelaskan payload, kondisi, atau perilaku yang sedang diuji','Account holder name':'Nama pemilik rekening','10-digit account number':'Nomor rekening 10 digit',
    'Keep your sign-in credentials and any verification codes private.':'Jaga kerahasiaan kredensial masuk dan kode verifikasi Anda.','A MORE CONSIDERED APPROACH':'PENDEKATAN YANG LEBIH MATANG','Clarity for your financial life.':'Kejelasan untuk kehidupan finansial Anda.','Thoughtful banking, with a clear view of what matters and the tools to manage it with confidence.':'Layanan perbankan yang cermat, dengan pandangan jelas tentang hal penting dan alat untuk mengelolanya dengan percaya diri.','Private client services · Northstar Private':'Layanan nasabah privat · Northstar Private','NORTHSTAR PRIVATE · CLIENT ACCESS':'NORTHSTAR PRIVATE · AKSES NASABAH','Protected client access · Please keep your sign-in details confidential.':'Akses nasabah terlindungi · Jaga kerahasiaan detail masuk Anda.','Northstar Private home':'Beranda Northstar Private','© Northstar Private Banking':'© Perbankan Privat Northstar'
  }
}

const withdrawalAndValidationPhrases: Record<string, Record<string, string>> = {
  fr: {
    'Review your account and manage a withdrawal request.':'Consultez votre compte et gérez une demande de retrait.','File upload validation':'Validation du téléversement de fichiers','Input validation':'Validation des entrées','Boundary values':'Valeurs limites','Malformed data / encoding':'Données mal formées / encodage','Cross-site scripting (XSS)':'Cross-site scripting (XSS)','SQL injection strings':'Chaînes d’injection SQL','Authentication / session handling':'Authentification / gestion de session','Authorization / access control':'Autorisation / contrôle d’accès','Business logic':'Logique métier','Rate limiting':'Limitation du débit','Other':'Autre','Amount (USD)':'Montant (USD)','ACCOUNT SECURITY':'SÉCURITÉ DU COMPTE','Identity document':'Pièce d’identité','Proof of address':'Justificatif de domicile','Bank statement':'Relevé bancaire','Supporting document':'Document justificatif','Additional attachment':'Pièce jointe supplémentaire','Login failed':'Échec de la connexion','Registration failed':'Échec de l’inscription','Unsupported file type':'Type de fichier non pris en charge','File exceeds 10 MB':'Le fichier dépasse 10 Mo','Withdrawal accepted':'Retrait accepté'
  },
  es: {
    'Review your account and manage a withdrawal request.':'Revisa tu cuenta y gestiona una solicitud de retirada.','File upload validation':'Validación de carga de archivos','Input validation':'Validación de entrada','Boundary values':'Valores límite','Malformed data / encoding':'Datos mal formados / codificación','Cross-site scripting (XSS)':'Cross-site scripting (XSS)','SQL injection strings':'Cadenas de inyección SQL','Authentication / session handling':'Autenticación / gestión de sesiones','Authorization / access control':'Autorización / control de acceso','Business logic':'Lógica de negocio','Rate limiting':'Limitación de velocidad','Other':'Otro','Amount (USD)':'Importe (USD)','ACCOUNT SECURITY':'SEGURIDAD DE LA CUENTA','Identity document':'Documento de identidad','Proof of address':'Comprobante de domicilio','Bank statement':'Extracto bancario','Supporting document':'Documento de respaldo','Additional attachment':'Archivo adjunto adicional','Login failed':'Error al iniciar sesión','Registration failed':'Error de registro','Unsupported file type':'Tipo de archivo no compatible','File exceeds 10 MB':'El archivo supera los 10 MB','Withdrawal accepted':'Retirada aceptada'
  },
  pt: {
    'Review your account and manage a withdrawal request.':'Consulte a sua conta e gira um pedido de levantamento.','File upload validation':'Validação do carregamento de ficheiros','Input validation':'Validação de entrada','Boundary values':'Valores limite','Malformed data / encoding':'Dados malformados / codificação','Cross-site scripting (XSS)':'Cross-site scripting (XSS)','SQL injection strings':'Strings de injeção SQL','Authentication / session handling':'Autenticação / gestão de sessão','Authorization / access control':'Autorização / controlo de acesso','Business logic':'Lógica de negócio','Rate limiting':'Limitação de pedidos','Other':'Outro','Amount (USD)':'Montante (USD)','ACCOUNT SECURITY':'SEGURANÇA DA CONTA','Identity document':'Documento de identificação','Proof of address':'Comprovativo de morada','Bank statement':'Extrato bancário','Supporting document':'Documento de suporte','Additional attachment':'Anexo adicional','Login failed':'Falha no início de sessão','Registration failed':'Falha no registo','Unsupported file type':'Tipo de ficheiro não suportado','File exceeds 10 MB':'O ficheiro excede 10 MB','Withdrawal accepted':'Levantamento aceite'
  },
  ar: {
    'Review your account and manage a withdrawal request.':'راجع حسابك وأدر طلب السحب.','File upload validation':'التحقق من تحميل الملفات','Input validation':'التحقق من المدخلات','Boundary values':'القيم الحدية','Malformed data / encoding':'بيانات غير سليمة / ترميز','Cross-site scripting (XSS)':'البرمجة النصية عبر المواقع (XSS)','SQL injection strings':'سلاسل حقن SQL','Authentication / session handling':'المصادقة / إدارة الجلسة','Authorization / access control':'التفويض / التحكم في الوصول','Business logic':'منطق الأعمال','Rate limiting':'تحديد معدل الطلبات','Other':'أخرى','Amount (USD)':'المبلغ (دولار أمريكي)','ACCOUNT SECURITY':'أمان الحساب','Identity document':'وثيقة الهوية','Proof of address':'إثبات العنوان','Bank statement':'كشف حساب بنكي','Supporting document':'مستند داعم','Additional attachment':'مرفق إضافي','Login failed':'فشل تسجيل الدخول','Registration failed':'فشل التسجيل','Unsupported file type':'نوع الملف غير مدعوم','File exceeds 10 MB':'حجم الملف يتجاوز 10 ميغابايت','Withdrawal accepted':'تم قبول السحب'
  },
  ha: {
    'Review your account and manage a withdrawal request.':'Duba asusunka kuma sarrafa buƙatar cire kuɗi.','File upload validation':'Tabbatar da loda fayil','Input validation':'Tabbatar da shigarwa','Boundary values':'Ƙimar iyaka','Malformed data / encoding':'Bayanan da ba su da kyau / encoding','Cross-site scripting (XSS)':'Cross-site scripting (XSS)','SQL injection strings':'Jerin kalmomin SQL injection','Authentication / session handling':'Tabbatarwa / sarrafa zama','Authorization / access control':'Izini / kula da shiga','Business logic':'Dabarun kasuwanci','Rate limiting':'Iyakance yawan buƙata','Other':'Wani','Amount (USD)':'Adadi (USD)','ACCOUNT SECURITY':'TSARON ASUSU','Identity document':'Takardar shaida','Proof of address':'Shaidar adireshi','Bank statement':'Bayanin asusun banki','Supporting document':'Takardar tallafi','Additional attachment':'Ƙarin abin haɗawa','Login failed':'Shiga ya gaza','Registration failed':'Rajista ta gaza','Unsupported file type':'Ba a tallafa wa irin wannan fayil ba','File exceeds 10 MB':'Fayil ya wuce 10 MB','Withdrawal accepted':'An amince da cire kuɗi'
  },
  yo: {
    'Review your account and manage a withdrawal request.':'Ṣàyẹ̀wò àkọọ́lẹ̀ rẹ kí o sì ṣàkóso ìbéèrè yíyọ owó.','File upload validation':'Ìmúdájú fífi fáìlì síta','Input validation':'Ìmúdájú ohun tí a tẹ̀ sí i','Boundary values':'Àwọn iye ààlà','Malformed data / encoding':'Dátà tí kò tọ́ / ìkọ̀wé àmì','Cross-site scripting (XSS)':'Cross-site scripting (XSS)','SQL injection strings':'Àwọn ọ̀rọ̀ SQL injection','Authentication / session handling':'Ìjẹ́rìí / ìṣàkóso ìpàdé','Authorization / access control':'Àṣẹ / ìṣàkóso ìwọlé','Business logic':'Ọgbọ́n iṣẹ́','Rate limiting':'Dídí iye ìbéèrè mọ́','Other':'Mìíràn','Amount (USD)':'Iye owó (USD)','ACCOUNT SECURITY':'ÀÀBÒ ÀKỌỌ́LẸ̀','Identity document':'Ìwé ìdánimọ̀','Proof of address':'Ẹ̀rí àdírẹ́sì','Bank statement':'Gbólóhùn báńkì','Supporting document':'Ìwé àtìlẹ́yìn','Additional attachment':'Àfikún fáìlì','Login failed':'Wíwọlé kùnà','Registration failed':'Ìforúkọsílẹ̀ kùnà','Unsupported file type':'A kò ṣe àtìlẹ́yìn fún irú fáìlì yìí','File exceeds 10 MB':'Fáìlì ju 10 MB lọ','Withdrawal accepted':'A gba ìbéèrè yíyọ owó'
  },
  fil: {
    'Review your account and manage a withdrawal request.':'Suriin ang iyong account at pamahalaan ang kahilingan sa withdrawal.','File upload validation':'Pagpapatunay ng pag-upload ng file','Input validation':'Pagpapatunay ng input','Boundary values':'Mga value sa hangganan','Malformed data / encoding':'Maling data / encoding','Cross-site scripting (XSS)':'Cross-site scripting (XSS)','SQL injection strings':'Mga string ng SQL injection','Authentication / session handling':'Authentication / pamamahala ng session','Authorization / access control':'Authorization / kontrol sa access','Business logic':'Lohika ng negosyo','Rate limiting':'Paglilimita ng request','Other':'Iba pa','Amount (USD)':'Halaga (USD)','ACCOUNT SECURITY':'SEGURIDAD NG ACCOUNT','Identity document':'Dokumento ng pagkakakilanlan','Proof of address':'Katibayan ng address','Bank statement':'Bank statement','Supporting document':'Suportang dokumento','Additional attachment':'Karagdagang attachment','Login failed':'Nabigo ang pag-login','Registration failed':'Nabigo ang pagpaparehistro','Unsupported file type':'Hindi suportadong uri ng file','File exceeds 10 MB':'Lampas sa 10 MB ang file','Withdrawal accepted':'Tinanggap ang withdrawal'
  },
  ms: {
    'Review your account and manage a withdrawal request.':'Semak akaun anda dan urus permintaan pengeluaran.','File upload validation':'Pengesahan muat naik fail','Input validation':'Pengesahan input','Boundary values':'Nilai sempadan','Malformed data / encoding':'Data / pengekodan tidak sah','Cross-site scripting (XSS)':'Cross-site scripting (XSS)','SQL injection strings':'Rentetan SQL injection','Authentication / session handling':'Pengesahan / pengendalian sesi','Authorization / access control':'Kebenaran / kawalan akses','Business logic':'Logik perniagaan','Rate limiting':'Had kadar','Other':'Lain-lain','Amount (USD)':'Jumlah (USD)','ACCOUNT SECURITY':'KESELAMATAN AKAUN','Identity document':'Dokumen pengenalan diri','Proof of address':'Bukti alamat','Bank statement':'Penyata bank','Supporting document':'Dokumen sokongan','Additional attachment':'Lampiran tambahan','Login failed':'Log masuk gagal','Registration failed':'Pendaftaran gagal','Unsupported file type':'Jenis fail tidak disokong','File exceeds 10 MB':'Fail melebihi 10 MB','Withdrawal accepted':'Pengeluaran diterima'
  },
  ko: {
    'Review your account and manage a withdrawal request.':'계좌를 확인하고 출금 요청을 관리하세요.','File upload validation':'파일 업로드 검증','Input validation':'입력값 검증','Boundary values':'경계값','Malformed data / encoding':'잘못된 데이터 / 인코딩','Cross-site scripting (XSS)':'크로스 사이트 스크립팅 (XSS)','SQL injection strings':'SQL 인젝션 문자열','Authentication / session handling':'인증 / 세션 처리','Authorization / access control':'권한 부여 / 접근 제어','Business logic':'비즈니스 로직','Rate limiting':'속도 제한','Other':'기타','Amount (USD)':'금액 (USD)','ACCOUNT SECURITY':'계좌 보안','Identity document':'신분증','Proof of address':'주소 증명서','Bank statement':'은행 거래 명세서','Supporting document':'증빙 서류','Additional attachment':'추가 첨부 파일','Login failed':'로그인 실패','Registration failed':'가입 실패','Unsupported file type':'지원하지 않는 파일 형식','File exceeds 10 MB':'파일 크기가 10MB를 초과합니다.','Withdrawal accepted':'출금이 승인되었습니다.'
  },
  'zh-CN': {
    'Review your account and manage a withdrawal request.':'查看账户并管理提款申请。','File upload validation':'文件上传验证','Input validation':'输入验证','Boundary values':'边界值','Malformed data / encoding':'格式错误的数据 / 编码','Cross-site scripting (XSS)':'跨站脚本攻击（XSS）','SQL injection strings':'SQL 注入字符串','Authentication / session handling':'身份验证 / 会话处理','Authorization / access control':'授权 / 访问控制','Business logic':'业务逻辑','Rate limiting':'速率限制','Other':'其他','Amount (USD)':'金额（美元）','ACCOUNT SECURITY':'账户安全','Identity document':'身份证明文件','Proof of address':'地址证明','Bank statement':'银行对账单','Supporting document':'证明文件','Additional attachment':'其他附件','Login failed':'登录失败','Registration failed':'注册失败','Unsupported file type':'不支持的文件类型','File exceeds 10 MB':'文件超过 10 MB','Withdrawal accepted':'提款已受理'
  },
  'zh-TW': {
    'Review your account and manage a withdrawal request.':'檢視帳戶並管理提款申請。','File upload validation':'檔案上傳驗證','Input validation':'輸入驗證','Boundary values':'邊界值','Malformed data / encoding':'格式錯誤的資料／編碼','Cross-site scripting (XSS)':'跨網站指令碼攻擊（XSS）','SQL injection strings':'SQL 注入字串','Authentication / session handling':'身分驗證／工作階段處理','Authorization / access control':'授權／存取控制','Business logic':'商業邏輯','Rate limiting':'速率限制','Other':'其他','Amount (USD)':'金額（美元）','ACCOUNT SECURITY':'帳戶安全','Identity document':'身分證明文件','Proof of address':'地址證明','Bank statement':'銀行對帳單','Supporting document':'證明文件','Additional attachment':'其他附件','Login failed':'登入失敗','Registration failed':'註冊失敗','Unsupported file type':'不支援的檔案類型','File exceeds 10 MB':'檔案超過 10 MB','Withdrawal accepted':'提款已受理'
  },
  id: {
    'Review your account and manage a withdrawal request.':'Tinjau rekening Anda dan kelola permintaan penarikan.','File upload validation':'Validasi unggahan berkas','Input validation':'Validasi input','Boundary values':'Nilai batas','Malformed data / encoding':'Data / pengodean tidak valid','Cross-site scripting (XSS)':'Cross-site scripting (XSS)','SQL injection strings':'String SQL injection','Authentication / session handling':'Autentikasi / pengelolaan sesi','Authorization / access control':'Otorisasi / kontrol akses','Business logic':'Logika bisnis','Rate limiting':'Pembatasan laju','Other':'Lainnya','Amount (USD)':'Jumlah (USD)','ACCOUNT SECURITY':'KEAMANAN REKENING','Identity document':'Dokumen identitas','Proof of address':'Bukti alamat','Bank statement':'Rekening koran','Supporting document':'Dokumen pendukung','Additional attachment':'Lampiran tambahan','Login failed':'Gagal masuk','Registration failed':'Pendaftaran gagal','Unsupported file type':'Jenis berkas tidak didukung','File exceeds 10 MB':'Berkas melebihi 10 MB','Withdrawal accepted':'Penarikan diterima'
  }
}

const remainingSecurityCopy: Record<string, Record<string, string>> = {
  fr: {
    'Confirm the recipient details and payment amount before submitting. Payments should only be sent to recipients you trust.':'Vérifiez les coordonnées du destinataire et le montant avant de confirmer. Envoyez uniquement des paiements à des destinataires de confiance.',
    'Review the destination details carefully before submitting a withdrawal request. This is a security testing workspace. Use synthetic data and files you are authorized to inspect.':'Vérifiez soigneusement les coordonnées du destinataire avant de soumettre une demande de retrait. Cet espace sert aux tests de sécurité. Utilisez des données synthétiques et des fichiers que vous êtes autorisé à examiner.'
  },
  es: {
    'Confirm the recipient details and payment amount before submitting. Payments should only be sent to recipients you trust.':'Confirma los datos del destinatario y el importe antes de enviar. Envía pagos únicamente a destinatarios de confianza.',
    'Review the destination details carefully before submitting a withdrawal request. This is a security testing workspace. Use synthetic data and files you are authorized to inspect.':'Revisa cuidadosamente los datos de destino antes de enviar una solicitud de retirada. Este es un espacio de pruebas de seguridad. Utiliza datos sintéticos y archivos que tengas autorización para inspeccionar.'
  },
  pt: {
    'Confirm the recipient details and payment amount before submitting. Payments should only be sent to recipients you trust.':'Confirme os dados do destinatário e o montante antes de submeter. Os pagamentos devem ser enviados apenas a destinatários de confiança.',
    'Review the destination details carefully before submitting a withdrawal request. This is a security testing workspace. Use synthetic data and files you are authorized to inspect.':'Verifique cuidadosamente os dados do destinatário antes de submeter um pedido de levantamento. Este é um espaço de testes de segurança. Utilize dados sintéticos e ficheiros que esteja autorizado a analisar.'
  },
  ar: {
    'Confirm the recipient details and payment amount before submitting. Payments should only be sent to recipients you trust.':'تأكد من تفاصيل المستلم ومبلغ الدفع قبل الإرسال. يجب إرسال المدفوعات إلى المستلمين الذين تثق بهم فقط.',
    'Review the destination details carefully before submitting a withdrawal request. This is a security testing workspace. Use synthetic data and files you are authorized to inspect.':'راجع تفاصيل الوجهة بعناية قبل إرسال طلب السحب. هذه مساحة لاختبار الأمان. استخدم بيانات اصطناعية وملفات لديك تصريح بفحصها.'
  },
  ha: {
    'Confirm the recipient details and payment amount before submitting. Payments should only be sent to recipients you trust.':'Tabbatar da bayanan mai karɓa da adadin kuɗi kafin aikawa. A aika kuɗi ga waɗanda ka amince da su kawai.',
    'Review the destination details carefully before submitting a withdrawal request. This is a security testing workspace. Use synthetic data and files you are authorized to inspect.':'Duba bayanan inda za a aika kuɗi sosai kafin neman cire kuɗi. Wannan wurin gwajin tsaro ne. Yi amfani da bayanan ƙirƙira da fayilolin da aka ba ka izinin dubawa.'
  },
  yo: {
    'Confirm the recipient details and payment amount before submitting. Payments should only be sent to recipients you trust.':'Jẹ́rìí sí àlàyé olùgbà àti iye owó kí o tó fi ránṣẹ́. Fi owó ránṣẹ́ sí àwọn ẹni tí o gbẹ́kẹ̀lé nìkan.',
    'Review the destination details carefully before submitting a withdrawal request. This is a security testing workspace. Use synthetic data and files you are authorized to inspect.':'Ṣàyẹ̀wò àlàyé ibi tí owó ń lọ dáadáa kí o tó fi ìbéèrè yíyọ owó ránṣẹ́. Ibi iṣẹ́ yìí jẹ́ fún ìdánwò ààbò. Lo dátà àdánwò àti àwọn fáìlì tí o ní àṣẹ láti ṣàyẹ̀wò.'
  },
  fil: {
    'Confirm the recipient details and payment amount before submitting. Payments should only be sent to recipients you trust.':'Kumpirmahin ang detalye ng tatanggap at halaga bago isumite. Magpadala lamang sa mga tatanggap na pinagkakatiwalaan mo.',
    'Review the destination details carefully before submitting a withdrawal request. This is a security testing workspace. Use synthetic data and files you are authorized to inspect.':'Maingat na suriin ang detalye ng tatanggap bago magsumite ng withdrawal request. Lugar ito para sa security testing. Gumamit ng synthetic data at mga file na may pahintulot kang suriin.'
  },
  ms: {
    'Confirm the recipient details and payment amount before submitting. Payments should only be sent to recipients you trust.':'Sahkan butiran penerima dan jumlah pembayaran sebelum menghantar. Pembayaran hanya patut dihantar kepada penerima yang anda percayai.',
    'Review the destination details carefully before submitting a withdrawal request. This is a security testing workspace. Use synthetic data and files you are authorized to inspect.':'Semak butiran penerima dengan teliti sebelum menghantar permintaan pengeluaran. Ini ialah ruang ujian keselamatan. Gunakan data sintetik dan fail yang anda dibenarkan untuk periksa.'
  },
  ko: {
    'Confirm the recipient details and payment amount before submitting. Payments should only be sent to recipients you trust.':'제출하기 전에 수취인 정보와 결제 금액을 확인하세요. 신뢰하는 수취인에게만 결제해야 합니다.',
    'Review the destination details carefully before submitting a withdrawal request. This is a security testing workspace. Use synthetic data and files you are authorized to inspect.':'출금 요청을 제출하기 전에 받는 사람 정보를 주의 깊게 확인하세요. 이 공간은 보안 테스트용입니다. 검사 권한이 있는 합성 데이터와 파일만 사용하세요.'
  },
  'zh-CN': {
    'Confirm the recipient details and payment amount before submitting. Payments should only be sent to recipients you trust.':'提交前请确认收款人信息和付款金额。只应向您信任的收款人付款。',
    'Review the destination details carefully before submitting a withdrawal request. This is a security testing workspace. Use synthetic data and files you are authorized to inspect.':'提交提款申请前，请仔细核对收款信息。这是安全测试工作区。请使用合成数据和您获准检查的文件。'
  },
  'zh-TW': {
    'Confirm the recipient details and payment amount before submitting. Payments should only be sent to recipients you trust.':'提交前請確認收款人資料及付款金額。僅應向您信任的收款人付款。',
    'Review the destination details carefully before submitting a withdrawal request. This is a security testing workspace. Use synthetic data and files you are authorized to inspect.':'提交提款申請前，請仔細核對收款資料。這是安全測試工作區。請使用合成資料及您獲准檢查的檔案。'
  },
  id: {
    'Confirm the recipient details and payment amount before submitting. Payments should only be sent to recipients you trust.':'Periksa detail penerima dan jumlah pembayaran sebelum mengirim. Pembayaran hanya boleh dikirim kepada penerima yang Anda percaya.',
    'Review the destination details carefully before submitting a withdrawal request. This is a security testing workspace. Use synthetic data and files you are authorized to inspect.':'Periksa detail rekening tujuan dengan saksama sebelum mengirim permintaan penarikan. Ini adalah ruang pengujian keamanan. Gunakan data sintetis dan berkas yang boleh Anda periksa.'
  }
}
for (const [locale, entries] of Object.entries(remainingSecurityCopy)) Object.assign(offlinePhrases[locale], entries)

for (const [locale, entries] of Object.entries(withdrawalAndValidationPhrases)) Object.assign(offlinePhrases[locale], entries)

for (const [locale, entries] of Object.entries(finalPagePhrases)) Object.assign(offlinePhrases[locale], entries)

for (const [locale, entries] of Object.entries(routeCoveragePhrases)) Object.assign(offlinePhrases[locale], entries)


const extendedLocalePhrases: Record<string, Record<string, string>> = {
  ms: {
    'No cards yet.':'Belum ada kad.','NORTHSTAR PRIVATE':'NORTHSTAR PRIVATE','WORLD ELITE':'WORLD ELITE','CARDHOLDER':'PEMEGANG KAD','VALID THRU':'SAH SEHINGGA','Pay':'Bayar','No loans yet.':'Belum ada pinjaman.','Approve':'Luluskan','Reject':'Tolak',
    'PAYMENTS & TRANSFERS':'PEMBAYARAN & PEMINDAHAN','Make a payment from your account to a saved payee or another account.':'Buat pembayaran daripada akaun anda kepada penerima tersimpan atau akaun lain.','Review the sending account and recipient information before continuing.':'Semak akaun pengirim dan maklumat penerima sebelum meneruskan.','PAYMENT SECURITY':'KESELAMATAN PEMBAYARAN','Keep any verification codes private. Only enter verification codes when you are certain the request is legitimate. Never share a code with another person.':'Rahsiakan semua kod pengesahan. Masukkan kod hanya apabila anda pasti permintaan itu sah. Jangan kongsi kod dengan orang lain.',
    'Add up to five documents or images. Accepted: JPG, PNG, WebP, PDF, TXT, DOC and DOCX. Maximum 10 MB per file.':'Tambah sehingga lima dokumen atau imej. Format diterima: JPG, PNG, WebP, PDF, TXT, DOC dan DOCX. Maksimum 10 MB setiap fail.','Describe the payload, condition or behaviour being tested':'Terangkan muatan, keadaan atau tingkah laku yang sedang diuji','Account holder name':'Nama pemegang akaun','10-digit account number':'Nombor akaun 10 digit',
    'Admins only.':'Khusus untuk pentadbir.','Admin':'Pentadbir','Teller deposit':'Deposit juruwang','Record a deposit request for the selected account.':'Rekod permintaan deposit untuk akaun yang dipilih.','No customer accounts yet.':'Belum ada akaun pelanggan.','Deposit':'Deposit','Audit log':'Log audit','Recent domain events (append-only).':'Peristiwa domain terkini (tambah sahaja).','No audit entries yet.':'Belum ada entri audit.','Time':'Masa','Action':'Tindakan','Entity':'Entiti','Detail':'Butiran','Administration':'Pentadbiran','NORTHSTAR PRIVATE · CLIENT ACCESS':'NORTHSTAR PRIVATE · AKSES PELANGGAN','Protected client access · Please keep your sign-in details confidential.':'Akses pelanggan terlindung · Sila rahsiakan butiran log masuk anda.','© Northstar Private Banking':'© Northstar Private Banking','Northstar Private home':'Laman utama Northstar Private'
  },
  ko: {
    'No cards yet.':'아직 카드가 없습니다.','NORTHSTAR PRIVATE':'NORTHSTAR PRIVATE','WORLD ELITE':'WORLD ELITE','CARDHOLDER':'카드 소유자','VALID THRU':'유효 기간','Pay':'결제','No loans yet.':'아직 대출이 없습니다.','Approve':'승인','Reject':'거절',
    'PAYMENTS & TRANSFERS':'결제 및 송금','Make a payment from your account to a saved payee or another account.':'계좌에서 저장된 수취인 또는 다른 계좌로 송금하세요.','Review the sending account and recipient information before continuing.':'계속하기 전에 출금 계좌와 수취인 정보를 확인하세요.','PAYMENT SECURITY':'결제 보안','Keep any verification codes private. Only enter verification codes when you are certain the request is legitimate. Never share a code with another person.':'인증 코드는 비공개로 유지하세요. 요청이 정당하다고 확신할 때만 인증 코드를 입력하고 다른 사람과 공유하지 마세요.',
    'Add up to five documents or images. Accepted: JPG, PNG, WebP, PDF, TXT, DOC and DOCX. Maximum 10 MB per file.':'문서 또는 이미지를 최대 5개 추가할 수 있습니다. JPG, PNG, WebP, PDF, TXT, DOC, DOCX 형식을 지원하며 파일당 최대 10MB입니다.','Describe the payload, condition or behaviour being tested':'테스트할 페이로드, 조건 또는 동작을 설명하세요.','Account holder name':'예금주 이름','10-digit account number':'10자리 계좌 번호',
    'Admins only.':'관리자 전용입니다.','Admin':'관리자','Teller deposit':'창구 입금','Record a deposit request for the selected account.':'선택한 계좌의 입금 요청을 기록합니다.','No customer accounts yet.':'아직 고객 계좌가 없습니다.','Deposit':'입금','Audit log':'감사 로그','Recent domain events (append-only).':'최근 도메인 이벤트(추가 전용).','No audit entries yet.':'감사 기록이 없습니다.','Time':'시간','Action':'작업','Entity':'항목','Detail':'세부 정보','Administration':'관리','NORTHSTAR PRIVATE · CLIENT ACCESS':'NORTHSTAR PRIVATE · 고객 접속','Protected client access · Please keep your sign-in details confidential.':'보호된 고객 접속 · 로그인 정보를 비공개로 유지하세요.','© Northstar Private Banking':'© Northstar Private Banking','Northstar Private home':'Northstar Private 홈'
  },
  'zh-CN': {
    'No cards yet.':'暂无银行卡。','NORTHSTAR PRIVATE':'NORTHSTAR PRIVATE','WORLD ELITE':'WORLD ELITE','CARDHOLDER':'持卡人','VALID THRU':'有效期至','Pay':'付款','No loans yet.':'暂无贷款。','Approve':'批准','Reject':'拒绝',
    'PAYMENTS & TRANSFERS':'付款与转账','Make a payment from your account to a saved payee or another account.':'从您的账户向已保存的收款人或其他账户付款。','Review the sending account and recipient information before continuing.':'继续之前请核对付款账户和收款人信息。','PAYMENT SECURITY':'付款安全','Keep any verification codes private. Only enter verification codes when you are certain the request is legitimate. Never share a code with another person.':'请妥善保管验证码。只有确认请求合法时才输入验证码，切勿与他人分享。',
    'Add up to five documents or images. Accepted: JPG, PNG, WebP, PDF, TXT, DOC and DOCX. Maximum 10 MB per file.':'最多添加五份文档或图片。支持 JPG、PNG、WebP、PDF、TXT、DOC 和 DOCX，每个文件最大 10 MB。','Describe the payload, condition or behaviour being tested':'描述正在测试的载荷、条件或行为','Account holder name':'账户持有人姓名','10-digit account number':'10 位账号',
    'Admins only.':'仅限管理员。','Admin':'管理员','Teller deposit':'柜台存款','Record a deposit request for the selected account.':'记录所选账户的存款请求。','No customer accounts yet.':'暂无客户账户。','Deposit':'存款','Audit log':'审计日志','Recent domain events (append-only).':'最近的领域事件（仅追加）。','No audit entries yet.':'暂无审计记录。','Time':'时间','Action':'操作','Entity':'实体','Detail':'详情','Administration':'管理','NORTHSTAR PRIVATE · CLIENT ACCESS':'NORTHSTAR PRIVATE · 客户入口','Protected client access · Please keep your sign-in details confidential.':'受保护的客户访问 · 请妥善保管登录信息。','© Northstar Private Banking':'© Northstar Private Banking','Northstar Private home':'Northstar Private 首页'
  },
  'zh-TW': {
    'No cards yet.':'目前沒有銀行卡。','NORTHSTAR PRIVATE':'NORTHSTAR PRIVATE','WORLD ELITE':'WORLD ELITE','CARDHOLDER':'持卡人','VALID THRU':'有效期限','Pay':'付款','No loans yet.':'目前沒有貸款。','Approve':'核准','Reject':'拒絕',
    'PAYMENTS & TRANSFERS':'付款與轉帳','Make a payment from your account to a saved payee or another account.':'從您的帳戶向已儲存的收款人或其他帳戶付款。','Review the sending account and recipient information before continuing.':'繼續之前請確認付款帳戶與收款人資料。','PAYMENT SECURITY':'付款安全','Keep any verification codes private. Only enter verification codes when you are certain the request is legitimate. Never share a code with another person.':'請妥善保管驗證碼。只有在確認要求合法時才輸入驗證碼，切勿與他人分享。',
    'Add up to five documents or images. Accepted: JPG, PNG, WebP, PDF, TXT, DOC and DOCX. Maximum 10 MB per file.':'最多可新增五份文件或圖片。支援 JPG、PNG、WebP、PDF、TXT、DOC 和 DOCX，每個檔案上限為 10 MB。','Describe the payload, condition or behaviour being tested':'描述正在測試的酬載、條件或行為','Account holder name':'帳戶持有人姓名','10-digit account number':'10 位數帳號',
    'Admins only.':'僅限管理員。','Admin':'管理員','Teller deposit':'櫃檯存款','Record a deposit request for the selected account.':'記錄所選帳戶的存款要求。','No customer accounts yet.':'目前沒有客戶帳戶。','Deposit':'存款','Audit log':'稽核紀錄','Recent domain events (append-only).':'最近的領域事件（僅附加）。','No audit entries yet.':'目前沒有稽核紀錄。','Time':'時間','Action':'動作','Entity':'實體','Detail':'詳細資料','Administration':'管理','NORTHSTAR PRIVATE · CLIENT ACCESS':'NORTHSTAR PRIVATE · 客戶入口','Protected client access · Please keep your sign-in details confidential.':'受保護的客戶存取 · 請妥善保管登入資訊。','© Northstar Private Banking':'© Northstar Private Banking','Northstar Private home':'Northstar Private 首頁'
  },
  id: {
    'No cards yet.':'Belum ada kartu.','NORTHSTAR PRIVATE':'NORTHSTAR PRIVATE','WORLD ELITE':'WORLD ELITE','CARDHOLDER':'PEMEGANG KARTU','VALID THRU':'BERLAKU HINGGA','Pay':'Bayar','No loans yet.':'Belum ada pinjaman.','Approve':'Setujui','Reject':'Tolak',
    'PAYMENTS & TRANSFERS':'PEMBAYARAN & TRANSFER','Make a payment from your account to a saved payee or another account.':'Lakukan pembayaran dari rekening Anda kepada penerima tersimpan atau rekening lain.','Review the sending account and recipient information before continuing.':'Periksa rekening pengirim dan informasi penerima sebelum melanjutkan.','PAYMENT SECURITY':'KEAMANAN PEMBAYARAN','Keep any verification codes private. Only enter verification codes when you are certain the request is legitimate. Never share a code with another person.':'Jaga kerahasiaan kode verifikasi. Masukkan kode hanya jika Anda yakin permintaan tersebut sah. Jangan pernah membagikan kode kepada orang lain.',
    'Add up to five documents or images. Accepted: JPG, PNG, WebP, PDF, TXT, DOC and DOCX. Maximum 10 MB per file.':'Tambahkan hingga lima dokumen atau gambar. Format yang diterima: JPG, PNG, WebP, PDF, TXT, DOC dan DOCX. Maksimal 10 MB per file.','Describe the payload, condition or behaviour being tested':'Jelaskan payload, kondisi, atau perilaku yang sedang diuji','Account holder name':'Nama pemilik rekening','10-digit account number':'Nomor rekening 10 digit',
    'Admins only.':'Khusus administrator.','Admin':'Administrator','Teller deposit':'Setoran teller','Record a deposit request for the selected account.':'Catat permintaan setoran untuk rekening yang dipilih.','No customer accounts yet.':'Belum ada rekening nasabah.','Deposit':'Setoran','Audit log':'Log audit','Recent domain events (append-only).':'Peristiwa domain terbaru (hanya penambahan).','No audit entries yet.':'Belum ada entri audit.','Time':'Waktu','Action':'Tindakan','Entity':'Entitas','Detail':'Detail','Administration':'Administrasi','NORTHSTAR PRIVATE · CLIENT ACCESS':'NORTHSTAR PRIVATE · AKSES NASABAH','Protected client access · Please keep your sign-in details confidential.':'Akses nasabah terlindungi · Jaga kerahasiaan detail masuk Anda.','© Northstar Private Banking':'© Northstar Private Banking','Northstar Private home':'Beranda Northstar Private'
  }
}
for (const [locale, entries] of Object.entries(extendedLocalePhrases)) Object.assign(offlinePhrases[locale], entries)

export function useLanguage() {
  const language = useSyncExternalStore<Language>(subscribe, snapshot, () => 'en')
  const active = messages[language] || {}
  const fallback = messages.en
  useEffect(() => { document.documentElement.lang = language; document.documentElement.dir = /^(ar|he|fa|ur)(-|$)/i.test(language) ? 'rtl' : 'ltr'; const root = document.body; return root ? translateDocument(root, language) : undefined }, [language])
  return { language, t: (key: string) => active[key] || fallback[key] || key, setLanguage }
}
