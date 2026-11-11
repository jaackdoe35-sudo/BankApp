import { useEffect, useSyncExternalStore } from 'react'

const LANGUAGE_CODES = ['en','fr','es','pt','ar','ha','yo','fil']

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
  if (language === 'en') {
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
    return () => {}
  }
  let stopped = false
  let queue = Promise.resolve()
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
    queue = queue.then(async () => {
      if (stopped) return
      const value = await cachedTranslation(language, source.trim())
      if (!stopped && value) { node.nodeValue = source.replace(source.trim(), value); translatedText.set(node, language) }
    })
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
      queue = queue.then(async () => {
        if (stopped) return
        const result = await cachedTranslation(language, source.trim())
        if (!stopped && result) { element.setAttribute(attr, result); done!.set(attr, language) }
      })
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

export function useLanguage() {
  const language = useSyncExternalStore<Language>(subscribe, snapshot, () => 'en')
  const active = messages[language] || {}
  const fallback = messages.en
  useEffect(() => { document.documentElement.lang = language; document.documentElement.dir = /^(ar|he|fa|ur)(-|$)/i.test(language) ? 'rtl' : 'ltr'; const root = document.body; return root ? translateDocument(root, language) : undefined }, [language])
  return { language, t: (key: string) => active[key] || fallback[key] || key, setLanguage }
}
