/* eslint-disable @typescript-eslint/no-var-requires */
const HttpBackend = require('i18next-http-backend/cjs')
const ChainedBackend = require('i18next-chained-backend').default
const LocalStorageBackend = require('i18next-localstorage-backend').default

// See https://github.com/i18next/i18next-http-backend/tree/master/example/next
module.exports = {
  backend: {
    backendOptions: [{ expirationTime: 60 * 60 * 1000 }],
    backends:
      typeof window !== 'undefined' ? [LocalStorageBackend, HttpBackend] : [],
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
  },
  serializeConfig: false,
  use: typeof window !== 'undefined' ? [ChainedBackend] : [],
}
