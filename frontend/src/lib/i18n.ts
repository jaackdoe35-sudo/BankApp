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
    'ACCOUNT SERVICES':'SERVICES DE COMPTE','Withdraw funds':'Retirer des fonds',
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

export function useLanguage() {
  const language = useSyncExternalStore<Language>(subscribe, snapshot, () => 'en')
  const active = messages[language] || {}
  const fallback = messages.en
  useEffect(() => { document.documentElement.lang = language; document.documentElement.dir = /^(ar|he|fa|ur)(-|$)/i.test(language) ? 'rtl' : 'ltr'; const root = document.body; return root ? translateDocument(root, language) : undefined }, [language])
  return { language, t: (key: string) => active[key] || fallback[key] || key, setLanguage }
}
