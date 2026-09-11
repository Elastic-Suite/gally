// `extends: ['react-app']` came from eslint-config-react-app, which shipped with
// react-scripts and disappeared with it. The obvious replacement,
// 'next/core-web-vitals', needs eslint >= 9 and flat config, while this monorepo
// is still on eslint 8.23.1 — so it is deliberately NOT used here.
//
// Nothing currently runs eslint in this workspace anyway (the root
// front/package.json aggregates an `eslint` script that was never defined here),
// and next.config.js sets eslint.ignoreDuringBuilds. This file exists so editor
// integrations have a valid config to resolve instead of a missing one.
module.exports = {
  rules: {
    'react/no-unescaped-entities': 'off',
    'react/no-array-index-key': 'off',
  },
}
