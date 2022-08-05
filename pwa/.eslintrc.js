module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    // tsconfigRootDir: __dirname,
    // project: ['./tsconfig.json'],
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  plugins: ['react', 'react-hooks', 'jsx-a11y', '@typescript-eslint'],
  extends: [
    'react-app',
    'react-app/jest',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@next/next/recommended',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:storybook/recommended',
    'prettier',
  ],
  rules: {
    'accessor-pairs': 'error',
    'array-callback-return': 'error',
    'default-case-last': 'error',
    'dot-notation': 'error',
    eqeqeq: 'error',
    'func-name-matching': 'error',
    'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
    'grouped-accessor-pairs': 'error',
    'max-classes-per-file': 'error',
    'new-cap': 'error',
    'no-alert': 'error',
    'no-array-constructor': 'error',
    'no-await-in-loop': 'error',
    'no-bitwise': 'error',
    'no-caller': 'error',
    'no-console': 'warn',
    'no-constant-binary-expression': 'error',
    'no-constructor-return': 'error',
    'no-duplicate-imports': 'error',
    'no-else-return': 'error',
    'no-empty-function': 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-label': 'error',
    'no-implicit-coercion': 'error',
    'no-implicit-globals': 'error',
    'no-implied-eval': 'error',
    'no-iterator': 'error',
    'no-label-var': 'error',
    'no-labels': 'error',
    'no-lonely-if': 'error',
    'no-multi-assign': 'error',
    'no-new': 'error',
    'no-new-func': 'error',
    'no-new-object': 'error',
    'no-new-wrappers': 'error',
    'no-octal-escape': 'error',
    'no-promise-executor-return': 'error',
    'no-proto': 'error',
    'no-return-assign': 'error',
    'no-return-await': 'error',
    'no-script-url': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-throw-literal': 'error',
    'no-underscore-dangle': ['error', { allow: ['__schema'] }],
    'no-unneeded-ternary': 'error',
    'no-unreachable-loop': 'error',
    'no-unused-private-class-members': 'error',
    'no-useless-call': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-concat': 'error',
    'no-useless-rename': 'error',
    'no-useless-return': 'error',
    'no-var': 'error',
    'no-warning-comments': 'warn',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    'prefer-destructuring': 'error',
    'prefer-exponentiation-operator': 'error',
    'prefer-object-has-own': 'error',
    'prefer-object-spread': 'error',
    'prefer-promise-reject-errors': 'error',
    'prefer-regex-literals': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    radix: 'error',
    'require-await': 'error',
    'require-atomic-updates': 'error',
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true,
        memberSyntaxSortOrder: ['all', 'single', 'multiple', 'none'],
        allowSeparatedGroups: true,
      },
    ],
    'symbol-description': 'error',
    'react/button-has-type': 'error',
    'react/destructuring-assignment': ['error', 'always'],
    'react/function-component-definition': [
      'error',
      { namedComponents: 'function-declaration' },
    ],
    'react/hook-use-state': 'error',
    'react/iframe-missing-sandbox': 'error',
    'react/jsx-boolean-value': 'error',
    'react/jsx-curly-brace-presence': [
      'error',
      { children: 'never', props: 'never', propElementValues: 'always' },
    ],
    'react/jsx-equals-spacing': ['error', 'never'],
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.tsx'] }],
    'react/jsx-fragments': ['error', 'syntax'],
    'react/jsx-handler-names': 'error',
    'react/jsx-key': ['error', { warnOnDuplicates: true }],
    'react/jsx-no-constructed-context-values': 'error',
    'react/jsx-no-leaked-render': 'error',
    'react/jsx-no-script-url': 'error',
    'react/jsx-pascal-case': 'error',
    'react/jsx-sort-default-props': 'error',
    'react/no-access-state-in-setstate': 'error',
    'react/no-array-index-key': 'error',
    'react/no-danger': 'error',
    'react/no-namespace': 'error',
    'react/no-this-in-sfc': 'error',
    'react/no-typos': 'error',
    'react/no-unstable-nested-components': 'error',
    'react/no-unused-prop-types': 'error',
    'react/prefer-stateless-function': 'error',
    'react/prop-types': ['error', { ignore: ['children'] }],
    'react/self-closing-comp': 'error',
    'react/style-prop-object': 'error',
    'react/void-dom-elements-no-children': 'error',
    'jsx-a11y/anchor-is-valid': 'off',
  },
  overrides: [
    {
      files: ['**/*.stories.*'],
      rules: {
        'react/function-component-definition': 'off',
        'react/prop-types': 'off',
      },
    },
    {
      files: ['**/*.{ts,tsx}'],
      rules: {
        '@typescript-eslint/consistent-generic-constructors': 'error',
        '@typescript-eslint/consistent-indexed-object-style': 'error',
        '@typescript-eslint/consistent-type-assertions': 'error',
        '@typescript-eslint/consistent-type-definitions': [
          'error',
          'interface',
        ],
        // '@typescript-eslint/consistent-type-exports': 'error',
        // '@typescript-eslint/consistent-type-imports': 'error',
        'default-param-last': 'off',
        '@typescript-eslint/default-param-last': 'error',
        // 'dot-notation': 'off',
        // '@typescript-eslint/dot-notation': 'error',
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/explicit-module-boundary-types': 'error',
        '@typescript-eslint/method-signature-style': 'error',
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'interface',
            format: ['PascalCase'],
            custom: {
              regex: '^I[A-Z]',
              match: true,
            },
          },
        ],
        // '@typescript-eslint/no-base-to-string': 'error',
        '@typescript-eslint/no-confusing-non-null-assertion': 'error',
        '@typescript-eslint/no-duplicate-enum-values': 'error',
        '@typescript-eslint/no-extraneous-class': 'error',
        // '@typescript-eslint/no-for-in-array': 'error',
        'no-invalid-this': 'off',
        '@typescript-eslint/no-invalid-this': 'error',
        'no-loop-func': 'off',
        '@typescript-eslint/no-loop-func': 'error',
        // '@typescript-eslint/no-meaningless-void-operator': 'error',
        '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
        'no-redeclare': 'off',
        '@typescript-eslint/no-redeclare': 'error',
        // '@typescript-eslint/no-redundant-type-constituents': 'error',
        '@typescript-eslint/no-require-imports': 'error',
        // '@typescript-eslint/no-throw-literal': 'error',
        // '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
        // '@typescript-eslint/no-unnecessary-condition': 'error',
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': 'error',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': 'error',
        'no-useless-constructor': 'off',
        '@typescript-eslint/no-useless-constructor': 'error',
        '@typescript-eslint/no-useless-empty-export': 'error',
        // '@typescript-eslint/prefer-includes': 'error',
        '@typescript-eslint/prefer-literal-enum-member': 'error',
        // '@typescript-eslint/prefer-nullish-coalescing': 'error',
        '@typescript-eslint/prefer-optional-chain': 'error',
        // '@typescript-eslint/prefer-string-starts-ends-with': 'error',
        '@typescript-eslint/prefer-ts-expect-error': 'error',
        '@typescript-eslint/unified-signatures': 'error',
      },
    },
  ],
}
