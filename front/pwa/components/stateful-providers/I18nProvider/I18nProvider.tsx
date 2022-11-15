import { useEffect, useMemo } from 'react'
import { TFunction, useTranslation } from 'next-i18next'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Callback } from 'i18next'

import { i18nContext } from '~/contexts'
import { setLanguage, useAppDispatch } from '~/store'

const languages: Record<string, () => Promise<{ default: ILocale }>> = {
  fr: () => import('dayjs/locale/fr'),
  en: () => import('dayjs/locale/en'),
}

interface IProps {
  children: JSX.Element
}

function I18nProvider(props: IProps): JSX.Element {
  const { children } = props
  const translation = useTranslation()
  const dispatch = useAppDispatch()
  const { i18n } = translation

  useEffect(() => {
    if (i18n.language) {
      dispatch(setLanguage(i18n.language))
    }
  }, [dispatch, i18n.language])

  const context = useMemo(
    () => ({
      changeLanguage: async (
        language?: string,
        callback?: Callback
      ): Promise<TFunction> => {
        await languages[language]()
        return translation.i18n.changeLanguage(language, callback)
      },
    }),
    [translation]
  )

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={i18n.language}
    >
      <i18nContext.Provider value={context}>{children}</i18nContext.Provider>
    </LocalizationProvider>
  )
}

export default I18nProvider
