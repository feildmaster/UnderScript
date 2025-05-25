/* eslint-env node */
module.exports = {
  env: {
    es6: true,
    browser: true,
    jquery: true,
    greasemonkey: true,
    node: false,
  },
  globals: {
    BootstrapDialog: 'readonly',
    SimpleToast: 'readonly',
    VERSION: 'readonly',
    Sentry: 'readonly',
    globalThis: 'readonly',
    window: 'off',
  },
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      globalReturn: true,
    },
  },
};
