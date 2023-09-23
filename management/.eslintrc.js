// @ts-ignore
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: {
    node: false,
    browser: true,
  },
  parserOptions: {
    project: 'tsconfig.test.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'prettier', 'jsx-a11y', 'react'],
  extends: [
    'google',
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    'prettier/prettier': 'error',
    'import/order': [
      'warn',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    '@typescript-eslint/explicit-member-accessibility': 'warn',
    '@typescript-eslint/member-ordering': 'warn',
    'no-console': 'error',
    'valid-jsdoc': 'off',
    'require-jsdoc': 'off',
    'no-param-reassign': 'error',
    'no-return-await': 'warn',
    '@typescript-eslint/no-confusing-void-expression': 'warn',
    '@typescript-eslint/prefer-includes': 'warn',
    '@typescript-eslint/prefer-literal-enum-member': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'warn',
    '@typescript-eslint/prefer-optional-chain': 'warn',
    '@typescript-eslint/prefer-string-starts-ends-with': 'warn',
    '@typescript-eslint/switch-exhaustiveness-check': 'warn',
    '@typescript-eslint/array-type': ['warn', {default: 'generic'}],
    '@typescript-eslint/promise-function-async': ['warn'],
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: [`${__dirname}/tsconfig.test.json`],
      },
    },
    react: {
      version: 'detect',
    },
  },
};
