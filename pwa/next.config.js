module.exports = {
  serverRuntimeConfig: {
    NEXT_PUBLIC_ENTRYPOINT:
      process.env.NEXT_PUBLIC_ENTRYPOINT || 'https://localhost',
  },
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/admin#/',
        permanent: true,
      },
    ]
  },
}
