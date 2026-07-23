import { createContext } from 'react'
import type { Country, Locale } from '../data/types'

export const COUNTRIES: { code: Country; label: string }[] = [
  { code: 'US', label: 'United States' },
  { code: 'DE', label: 'Deutschland' },
  { code: 'FR', label: 'France' },
  { code: 'GB', label: 'United Kingdom' },
]

export const LANGUAGES: { code: Locale; label: string }[] = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
]

export interface LocaleContextValue {
  country: Country
  language: Locale
  setCountry: (country: Country) => void
  setLanguage: (language: Locale) => void
}

export const LocaleContext = createContext<LocaleContextValue | undefined>(
  undefined,
)
