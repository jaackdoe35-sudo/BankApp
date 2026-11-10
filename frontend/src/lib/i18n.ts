import { useSyncExternalStore } from 'react'

export const languages = [
  { code: 'en', label: 'English' }, { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' }, { code: 'pt', label: 'Português' },
  { code: 'ar', label: 'العربية' }, { code: 'ha', label: 'Hausa' }, { code: 'yo', label: 'Yorùbá' },
] as const
export type Language = typeof languages[number]['code']
const KEY = 'northstar.language.v1'
const messages: Record<Language, Record<string,string>> = {
  en: { overview:'Overview',payments:'Payments',cards:'Cards',loans:'Lending',profile:'Profile',activity:'Activity',signOut:'Sign out',welcome:'Welcome back',position:'YOUR FINANCIAL POSITION',balance:'Total account balance',accounts:'Your accounts',accountDetails:'Account details',withdraw:'Withdraw funds',language:'Language' },
  fr: { overview:'Vue d’ensemble',payments:'Paiements',cards:'Cartes',loans:'Crédit',profile:'Profil',activity:'Activité',signOut:'Déconnexion',welcome:'Bon retour',position:'VOTRE SITUATION FINANCIÈRE',balance:'Solde total des comptes',accounts:'Vos comptes',accountDetails:'Détails du compte',withdraw:'Retirer des fonds',language:'Langue' },
  es: { overview:'Resumen',payments:'Pagos',cards:'Tarjetas',loans:'Préstamos',profile:'Perfil',activity:'Actividad',signOut:'Cerrar sesión',welcome:'Te damos la bienvenida',position:'TU SITUACIÓN FINANCIERA',balance:'Saldo total de las cuentas',accounts:'Tus cuentas',accountDetails:'Detalles de la cuenta',withdraw:'Retirar fondos',language:'Idioma' },
  pt: { overview:'Visão geral',payments:'Pagamentos',cards:'Cartões',loans:'Empréstimos',profile:'Perfil',activity:'Atividade',signOut:'Terminar sessão',welcome:'Bem-vindo de volta',position:'A SUA POSIÇÃO FINANCEIRA',balance:'Saldo total das contas',accounts:'As suas contas',accountDetails:'Detalhes da conta',withdraw:'Levantar fundos',language:'Idioma' },
  ar: { overview:'نظرة عامة',payments:'المدفوعات',cards:'البطاقات',loans:'القروض',profile:'الملف الشخصي',activity:'النشاط',signOut:'تسجيل الخروج',welcome:'مرحبًا بعودتك',position:'وضعك المالي',balance:'إجمالي رصيد الحسابات',accounts:'حساباتك',accountDetails:'تفاصيل الحساب',withdraw:'سحب الأموال',language:'اللغة' },
  ha: { overview:'Taƙaitawa',payments:'Biyan kuɗi',cards:'Katuna',loans:'Lamuni',profile:'Bayani',activity:'Ayyuka',signOut:'Fita',welcome:'Barka da dawowa',position:'MATSAYIN KUƊIN KA',balance:'Jimillar kuɗin asusu',accounts:'Asusunka',accountDetails:'Bayanan asusu',withdraw:'Cire kuɗi',language:'Harshe' },
  yo: { overview:'Àkótán',payments:'Ìsanwó',cards:'Káàdì',loans:'Àwìn',profile:'Àkọ́ọ́lẹ̀',activity:'Ìṣe',signOut:'Jáde',welcome:'Ẹ káàbọ̀ padà',position:'IPÒ OWÓ RẸ',balance:'Àpapọ̀ owó inú àkọọ́lẹ̀',accounts:'Àwọn àkọọ́lẹ̀ rẹ',accountDetails:'Àlàyé àkọọ́lẹ̀',withdraw:'Yọ owó jáde',language:'Èdè' },
}
let current: Language = (typeof localStorage !== 'undefined' && languages.some(x => x.code === localStorage.getItem(KEY))) ? localStorage.getItem(KEY) as Language : 'en'
const listeners = new Set<() => void>()
function subscribe(fn: () => void) { listeners.add(fn); return () => listeners.delete(fn) }
function snapshot() { return current }
export function setLanguage(language: Language) {
  current = language
  localStorage.setItem(KEY, language)
  document.documentElement.lang = language
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  listeners.forEach(fn => fn())
}
export function useLanguage() {
  const language = useSyncExternalStore(subscribe, snapshot, () => 'en')
  return { language, t: (key: string) => messages[language][key] || messages.en[key] || key, setLanguage }
}
