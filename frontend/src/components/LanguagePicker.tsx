import { languages, useLanguage } from '../lib/i18n'

export default function LanguagePicker({ className = '' }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage()
  const options = languages.some(item => item.code === language)
    ? languages
    : [...languages, { code: language, label: language }]
  return (
    <label className={className}>
      <span>{t('language')}</span>
      <select
        aria-label={t('language')}
        value={language}
        onChange={event => setLanguage(event.target.value)}
      >
        {options.map(item => (
          <option key={item.code} value={item.code}>{item.label}</option>
        ))}
      </select>
    </label>
  )
}
