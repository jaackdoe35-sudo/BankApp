import { useEffect, useSyncExternalStore } from 'react'

export const languages = [
  { code: 'en', label: 'English' }, { code: 'fr', label: 'Français' }, { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' }, { code: 'ar', label: 'العربية' }, { code: 'ha', label: 'Hausa' }, { code: 'yo', label: 'Yorùbá' },
] as const
export type Language = string
const KEY = 'northstar.language.v1'
const messages: Record<string, Record<string,string>> = {
en:{overview:'Overview',payments:'Payments',cards:'Cards',loans:'Lending',profile:'Profile',activity:'Activity',signOut:'Sign out',welcome:'Welcome back',position:'YOUR FINANCIAL POSITION',balance:'Total account balance',accounts:'Your accounts',language:'Language'},
fr:{overview:'Vue d’ensemble',payments:'Paiements',cards:'Cartes',loans:'Crédit',profile:'Profil',activity:'Activité',signOut:'Déconnexion',welcome:'Bon retour',position:'VOTRE SITUATION FINANCIÈRE',balance:'Solde total des comptes',accounts:'Vos comptes',language:'Langue'},
es:{overview:'Resumen',payments:'Pagos',cards:'Tarjetas',loans:'Préstamos',profile:'Perfil',activity:'Actividad',signOut:'Cerrar sesión',welcome:'Te damos la bienvenida',position:'TU SITUACIÓN FINANCIERA',balance:'Saldo total de las cuentas',accounts:'Tus cuentas',language:'Idioma'},
pt:{overview:'Visão geral',payments:'Pagamentos',cards:'Cartões',loans:'Empréstimos',profile:'Perfil',activity:'Atividade',signOut:'Terminar sessão',welcome:'Bem-vindo de volta',position:'A SUA POSIÇÃO FINANCEIRA',balance:'Saldo total das contas',accounts:'As suas contas',language:'Idioma'},
ar:{overview:'نظرة عامة',payments:'المدفوعات',cards:'البطاقات',loans:'القروض',profile:'الملف الشخصي',activity:'النشاط',signOut:'تسجيل الخروج',welcome:'مرحبًا بعودتك',position:'وضعك المالي',balance:'إجمالي رصيد الحسابات',accounts:'حساباتك',language:'اللغة'},
ha:{overview:'Taƙaitawa',payments:'Biyan kuɗi',cards:'Katuna',loans:'Lamuni',profile:'Bayani',activity:'Ayyuka',signOut:'Fita',welcome:'Barka da dawowa',position:'MATSAYIN KUƊIN KA',balance:'Jimillar kuɗin asusu',accounts:'Asusunka',language:'Harshe'},
yo:{overview:'Àkótán',payments:'Ìsanwó',cards:'Káàdì',loans:'Àwìn',profile:'Àkọ́ọ́lẹ̀',activity:'Ìṣe',signOut:'Jáde',welcome:'Ẹ káàbọ̀ padà',position:'IPÒ OWÓ RẸ',balance:'Àpapọ̀ owó inú àkọọ́lẹ̀',accounts:'Àwọn àkọọ́lẹ̀ rẹ',language:'Èdè'}
}
const stored = typeof localStorage === 'undefined' ? null : localStorage.getItem(KEY)
let current: Language = stored || 'en'
const listeners = new Set<() => void>()
function subscribe(fn: () => void) { listeners.add(fn); return () => listeners.delete(fn) }
function snapshot() { return current }
export function setLanguage(language: Language) {
  const normalized = language.trim()
  if (!/^[a-zA-Z]{2,3}(-[a-zA-Z0-9]{2,8})*$/.test(normalized)) return
  current = normalized
  localStorage.setItem(KEY, normalized)
  document.documentElement.lang = normalized
  document.documentElement.dir = /^(ar|he|fa|ur)(-|$)/i.test(normalized) ? 'rtl' : 'ltr'
  listeners.forEach(fn => fn())
}

const originalText = new WeakMap<Text, string>()
const translatedText = new WeakMap<Text, string>()
const originalAttributes = new WeakMap<Element, Map<string, string>>()
const translatedAttributes = new WeakMap<Element, Map<string, string>>()
const translatedCache = new Map<string, string>()
const knownTextNodes = new Set<Text>()
const knownElements = new Set<Element>()
const excludedTags = new Set(['SCRIPT','STYLE','NOSCRIPT','TEXTAREA','INPUT','CODE','PRE','SVG'])
function cachedTranslation(language: string, source: string) {
  const key = language + ':' + source
  const memory = translatedCache.get(key)
  if (memory) return Promise.resolve(memory)
  try { const saved = localStorage.getItem('northstar.mt.' + btoa(unescape(encodeURIComponent(key))).slice(0, 180)); if (saved) { translatedCache.set(key, saved); return Promise.resolve(saved) } } catch {}
  return fetchTranslation(language, source).then(value => {
    if (value) {
      translatedCache.set(key, value)
      try { localStorage.setItem('northstar.mt.' + btoa(unescape(encodeURIComponent(key))).slice(0, 180), value) } catch {}
    }
    return value
  })
}
async function fetchTranslation(language: string, source: string): Promise<string> {
  if (!source.trim() || new TextEncoder().encode(source).length > 500) return ''
  try {
    const params = new URLSearchParams({ q: source, langpair: 'en|' + language })
    const response = await fetch('https://api.mymemory.translated.net/get?' + params.toString())
    if (!response.ok) return ''
    const body = await response.json()
    if (Number(body.responseStatus) !== 200) return ''
    const translated = String(body.responseData?.translatedText || '')
    return translated && translated !== source ? translated : ''
  } catch { return '' }
}
function translateDocument(root: HTMLElement, language: string) {
  if (language === 'en') {
    for (const node of knownTextNodes) {
      if (!node.isConnected) { knownTextNodes.delete(node); continue }
      const original = originalText.get(node)
      if (original !== undefined) node.nodeValue = original\n      translatedText.delete(node)
    }
    for (const element of knownElements) {
      if (!element.isConnected) { knownElements.delete(element); continue }
      const originals = originalAttributes.get(element)
      originals?.forEach((value, attr) => element.setAttribute(attr, value))\n      translatedAttributes.get(element)?.clear()
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
  useEffect(() => { document.documentElement.lang = language; document.documentElement.dir = /^(ar|he|fa|ur)(-|$)/i.test(language) ? 'rtl' : 'ltr'; const root = document.querySelector<HTMLElement>('.bank-shell, .auth-shell'); return root ? translateDocument(root, language) : undefined }, [language])
  return { language, t: (key: string) => active[key] || fallback[key] || key, setLanguage }
}
