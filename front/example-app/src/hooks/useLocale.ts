import { use } from 'react'
import { LocaleContext } from '../context/locale-context'

export function useLocale() {
  const context = use(LocaleContext)
  if (!context)
    throw new Error('useLocale must be used within a LocaleProvider')
  return context
}
