/* eslint-disable @typescript-eslint/no-var-requires */
const { i18n } = require('./next-i18next.config')

module.exports = {
  headers() {
    if (process.env.NEXT_PUBLIC_LOCAL) {
      return [
        {
          source: '/mocks/:mock*',
          headers: [
            {
              key: 'link',
              value:
                '<http://localhost:3000/mocks/docs.jsonld>; rel="http://www.w3.org/ns/hydra/core#apiDocumentation"',
            },
            {
              key: 'Content-Type',
              value: 'application/ld+json',
            },
          ],
        },
      ]
    }
    return []
  },
  i18n,
  redirects() {
    return [
      {
        source: '/mocks',
        destination: '/mocks/index.json',
        permanent: true,
      },
      {
        source: '/admin/settings',
        destination: '/admin/settings/scope/catalogs',
        permanent: true,
      },
      {
        source: '/admin/settings/scope',
        destination: '/admin/settings/scope/catalogs',
        permanent: true,
      },
    ]
  },
  serverRuntimeConfig: {
    NEXT_PUBLIC_ENTRYPOINT:
      process.env.NEXT_PUBLIC_ENTRYPOINT || 'https://localhost',
  },
  swcMinify: true,
}
