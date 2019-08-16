module.exports = {
    parser: '@typescript-eslint/parser',
    env: {
      browser: true,
      es6: true,
      jest: true
    },
    plugins: ['@typescript-eslint', 'jest'],
    extends: [
      'plugin:@typescript-eslint/recommended',
      'prettier/@typescript-eslint',
      'standard'
    ],
    globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly'
    },
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module'
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-use-before-define': 'off'
    }
  }