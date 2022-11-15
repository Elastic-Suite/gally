import { createContext } from 'react'
import { TFunction } from 'next-i18next'
import { Callback } from 'i18next'

interface II18nContext {
  changeLanguage: (language?: string, callback?: Callback) => Promise<TFunction>
}

export const i18nContext = createContext<II18nContext>(null)
