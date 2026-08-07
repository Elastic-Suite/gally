/** @type {import('next').NextConfig} */
const nextConfig = {
  // The CRA entry wrapped everything in <React.StrictMode>; keep that behaviour.
  reactStrictMode: true,

  // Replaces CRA's `homepage: "/example"` + BrowserRouter basename="/example".
  // Next prefixes both routes and /_next/* assets with this, which the router's
  // `location ~ ^/(example|ws)` block already proxies — no nginx change needed.
  basePath: '/example',

  // The app is reached through the proxy at https://gally.localhost/example, not
  // directly at localhost:3001, so dev-server requests arrive cross-origin.
  allowedDevOrigins: ['gally.localhost'],

};

module.exports = nextConfig;
