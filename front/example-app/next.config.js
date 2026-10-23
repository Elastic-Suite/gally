/** @type {import('next').NextConfig} */
const nextConfig = {
  // The CRA entry wrapped everything in <React.StrictMode>; keep that behaviour.
  // Off in the dev server: strict mode mounts every component twice in development, which doubled
  // every unseeded request and made the network panel and the tracking hard to read. Its check -
  // effects that survive a remount - runs in the tests instead, on the parts that need it
  // (src/test/remount*.test.tsx). See specs/chore-strict-mode-in-tests.md.
  reactStrictMode: false,

  // The single source of the /example prefix. It took over from CRA's `homepage` field and
  // BrowserRouter's `basename`, both since removed — do not reintroduce either.
  // Next prefixes both routes and /_next/* assets with this, which the router's
  // `location ~ ^/(example|ws)` block already proxies — no nginx change needed.
  basePath: '/example',

  // The app is reached through the proxy at https://gally.localhost/example, not
  // directly at localhost:3001, so dev-server requests arrive cross-origin.
  allowedDevOrigins: [process.env.SERVER_NAME || 'gally.localhost'],
}

module.exports = nextConfig
