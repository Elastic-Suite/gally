/* eslint-disable @typescript-eslint/no-var-requires */
const { i18n } = require('./next-i18next.config')

module.exports = {
  i18n,
  serverRuntimeConfig: {
    NEXT_PUBLIC_ENTRYPOINT:
      process.env.NEXT_PUBLIC_ENTRYPOINT || 'https://localhost',
  },
  swcMinify: true,
}
