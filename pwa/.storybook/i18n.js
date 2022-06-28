import i18n from 'i18next'
import HttpBackend from 'i18next-http-backend'
import ChainedBackend from 'i18next-chained-backend'
import LocalStorageBackend from 'i18next-localstorage-backend'
import { initReactI18next } from 'react-i18next'

i18n
  .use(ChainedBackend)
  .use(initReactI18next)
  .init({
    backend: {
      backendOptions: [{ expirationTime: 60 * 60 * 1000 }],
      backends: [LocalStorageBackend, HttpBackend],
    },
    debug: true,
    defaultNS: 'common',
    fallbackLng: 'en',
    ns: 'common',
  })

export default i18n
