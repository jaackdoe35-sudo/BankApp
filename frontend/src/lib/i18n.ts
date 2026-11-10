import { useSyncExternalStore } from 'react'

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
const translated: Record<string, Record<string,string>> = {}
const listeners = new Set<() => void>()
function subscribe(fn: () => void) { listeners.add(fn); return () => listeners.delete(fn) }
function snapshot() { return current }
async function loadTranslations(language: string) {
  if (messages[language] || translated[language]) return
  const cacheKey = 'northstar.translations.' + language
  try {
    const cached = localStorage.getItem(cacheKey)
    if (cached) { translated[language] = JSON.parse(cached); listeners.forEach(fn => fn()); return }
  } catch {}
  const result: Record<string,string> = {}
  for (const [key, source] of Object.entries(messages.en)) {
    try {
      const params = new URLSearchParams({ q: source, langpair: 'en|' + language })
      const response = await fetch('https://api.mymemory.translated.net/get?' + params.toString())
      if (!response.ok) continue
      const body = await response.json()
      if (Number(body.responseStatus) === 200 && body.responseData?.translatedText) result[key] = body.responseData.translatedText
    } catch {}
  }
  if (Object.keys(result).length) {
    translated[language] = result
    try { localStorage.setItem(cacheKey, JSON.stringify(result)) } catch {}
  }
  listeners.forEach(fn => fn())
}
export function setLanguage(language: Language) {
  const normalized = language.trim()
  if (!/^[a-zA-Z]{2,3}(-[a-zA-Z0-9]{2,8})*$/.test(normalized)) return
  current = normalized
  localStorage.setItem(KEY, normalized)
  document.documentElement.lang = normalized
  document.documentElement.dir = /^(ar|he|fa|ur)(-|$)/i.test(normalized) ? 'rtl' : 'ltr'
  listeners.forEach(fn => fn())
  void loadTranslations(normalized)
}
export function useLanguage() {
  const language = useSyncExternalStore<Language>(subscribe, snapshot, () => 'en')
  const active = messages[language] || translated[language] || {}
  const fallback = messages.en
  return { language, t: (key: string) => active[key] || fallback[key] || key, setLanguage }
}
