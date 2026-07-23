import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { getCookie, setCookie } from '../lib/cookies'
import {
  COUNTRIES,
  LANGUAGES,
  LocaleContext,
  type LocaleContextValue,
} from './locale-context'
import type { Country, Locale } from '../data/types'

const COUNTRY_COOKIE = 'gally_country'
const LANGUAGE_COOKIE = 'gally_language'

function isCountry(value: string | undefined): value is Country {
  return COUNTRIES.some((c) => c.code === value)
}

function isLocale(value: string | undefined): value is Locale {
  return LANGUAGES.some((l) => l.code === value)
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [country, setCountryState] = useState<Country>(() => {
    const cookieValue = getCookie(COUNTRY_COOKIE)
    return isCountry(cookieValue) ? cookieValue : 'FR'
  })
  const [language, setLanguageState] = useState<Locale>(() => {
    const cookieValue = getCookie(LANGUAGE_COOKIE)
    return isLocale(cookieValue) ? cookieValue : 'fr'
  })

  useEffect(() => setCookie(COUNTRY_COOKIE, country, 365), [country])
  useEffect(() => setCookie(LANGUAGE_COOKIE, language, 365), [language])

  const value = useMemo<LocaleContextValue>(
    () => ({
      country,
      language,
      setCountry: setCountryState,
      setLanguage: setLanguageState,
    }),
    [country, language],
  )

  return <LocaleContext value={value}>{children}</LocaleContext>
}
