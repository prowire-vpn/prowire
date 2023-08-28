module.exports = {
  root: true,
  parserOptions: {
    project: [`${__dirname}/tsconfig.json`],
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    '@react-native',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/electron',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  rules: {
    'import/order': [
      'warn',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
  settings: {
    'import/ignore': ['react-native'],
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: [`${__dirname}/tsconfig.json`],
      },
    },
  },
};
