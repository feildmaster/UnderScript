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
    SENTRY_DSN: 'readonly',
    VERSION: 'readonly',
    Sentry: 'readonly',
  },
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      globalReturn: true,
    },
  },
};
