module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    `eslint:recommended`,
    `plugin:react/recommended`,
    `plugin:jest-react/recommended`,
    `plugin:@typescript-eslint/recommended`,
    `prettier`,
  ],
  parser: `@typescript-eslint/parser`,
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: `latest`,
    sourceType: `module`,
  },
  plugins: [`react`, `@typescript-eslint`],
  rules: {
    semi: [`warn`, `never`],
    quotes: [`error`, `backtick`],
    "no-console": 0,
    "react/prop-types": `off`,
  },
}
