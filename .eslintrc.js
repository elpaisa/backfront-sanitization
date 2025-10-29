/* eslint-disable */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:import/typescript',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  overrides: [],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    semi: 0,
    'jsx-a11y/tabindex-no-positive': 'off',
    '@typescript-eslint/semi': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/indent': ['error', 2, { SwitchCase: 1 }],
    'prettier/prettier': ['error', { endOfLine: 'auto' }]
  }
}
