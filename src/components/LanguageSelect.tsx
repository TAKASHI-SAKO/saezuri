import type { DictLocale } from '../domain/locale.ts'
import type { DisplayLanguage } from '../hooks/useLanguagePreference.ts'

interface Props {
  locales: readonly DictLocale[]
  value: DisplayLanguage | null
  onChange: (locale: DisplayLanguage) => void
}

function endonym(code: DictLocale): string {
  try {
    const name = new Intl.DisplayNames([code], { type: 'language' }).of(code)
    if (name) return name.charAt(0).toUpperCase() + name.slice(1)
  } catch {}
  return code
}

export function LanguageSelect({ locales, value, onChange }: Props) {
  return (
    <select
      className="lang-select mono"
      aria-label="Display language"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value as DisplayLanguage)}
    >
      <option value="station">Station language</option>
      {locales.map((code) => (
        <option key={code} value={code}>
          {endonym(code)}
        </option>
      ))}
    </select>
  )
}
