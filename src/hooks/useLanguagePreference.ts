import { useCallback, useEffect, useState } from 'react'
import { browserLanguages, type DictLocale, pickDictionaryLocale } from '../domain/locale.ts'

const STORAGE_KEY = 'saezuri:lang'

export type DisplayLanguage = DictLocale | 'station'

function storedLang(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function resolveInitialLang(
  locales: readonly DictLocale[],
  defaultLocale: DictLocale | null,
): DisplayLanguage | null {
  const stored = storedLang()

  // Station names are always available, even without published dictionaries.
  if (stored === 'station') return 'station'

  if (locales.length === 0) return null

  if (stored && locales.includes(stored as DictLocale)) {
    return stored as DictLocale
  }

  const browser = pickDictionaryLocale(browserLanguages(), locales)
  if (browser) return browser

  if (defaultLocale && locales.includes(defaultLocale)) return defaultLocale
  if (locales.includes('en')) return 'en'
  return locales[0]
}

export function useLanguagePreference(
  locales: readonly DictLocale[],
  defaultLocale: DictLocale | null,
): {
  lang: DisplayLanguage | null
  setLang: (locale: DisplayLanguage) => void
} {
  const [lang, setLangState] = useState<DisplayLanguage | null>(null)

  useEffect(() => {
    setLangState((cur) => {
      if (cur === 'station') return cur
      if (cur && locales.includes(cur)) return cur
      return resolveInitialLang(locales, defaultLocale)
    })
  }, [locales, defaultLocale])

  const setLang = useCallback((locale: DisplayLanguage) => {
    setLangState(locale)
    try {
      localStorage.setItem(STORAGE_KEY, locale)
    } catch {}
  }, [])

  return { lang, setLang }
}
