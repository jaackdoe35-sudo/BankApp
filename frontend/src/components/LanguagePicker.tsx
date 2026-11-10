import { useEffect, useId, useState, type KeyboardEvent } from 'react'
import { languages, useLanguage } from '../lib/i18n'

const LANGUAGE_CODE = /^[a-zA-Z]{2,3}(-[a-zA-Z0-9]{2,8})*$/

function languageName(code: string) {
  try {
    const base = code.split('-')[0]
    return new Intl.DisplayNames([code], { type: 'language' }).of(base) || code
  } catch {
    return code
  }
}

export default function LanguagePicker({ className = '' }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage()
  const [draft, setDraft] = useState(language)
  const listId = useId()

  useEffect(() => setDraft(language), [language])

  function applyLanguage() {
    const next = draft.trim()
    if (!LANGUAGE_CODE.test(next)) {
      setDraft(language)
      return
    }
    setLanguage(next)
    setDraft(next)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      applyLanguage()
      event.currentTarget.blur()
    }
    if (event.key === 'Escape') {
      setDraft(language)
      event.currentTarget.blur()
    }
  }

  return (
    <label className={className}>
      <span>{t('language')}</span>
      <input
        aria-label={t('language')}
        aria-describedby={listId + '-hint'}
        list={listId}
        value={draft}
        onChange={event => setDraft(event.target.value)}
        onBlur={applyLanguage}
        onKeyDown={handleKeyDown}
        placeholder="Search or enter a code"
        title={languageName(language)}
        autoComplete="off"
      />
      <datalist id={listId}>
        {languages.map(item => <option key={item.code} value={item.code}>{item.label}</option>)}
      </datalist>
      <small id={listId + '-hint'}>Enter a language code and press Enter (for example: ja, sw or zh-CN). Current: {languageName(language)}</small>
    </label>
  )
}
