// The app has its own ESLint 9 and flat config because eslint-config-next 16
// needs ESLint 9, while the rest of front/ (pwa) stays on ESLint 8 and the
// legacy front/.eslintrc.js. Flat config does not cascade, so that file is not
// read here.
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      // Product, CMS and banner images come from Gally media and are sized by CSS.
      // next/image would need explicit sizes and the media host configured.
      '@next/next/no-img-element': 'off',
      // Written for the pages/ router. Here the font <link> sits in the root
      // app/layout.tsx, so it loads on every page.
      '@next/next/no-page-custom-font': 'off',
    },
  },
  {
    // Root config files such as .prettierrc.js are CommonJS: Prettier 2 loads
    // them with require().
    files: ['*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'dist/**',
    'coverage/**',
    'storybook-static/**',
    'next-env.d.ts',
  ]),
])
