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
  },
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      globalReturn: true,
    },
  },
  ignorePatterns: ['**/*.ignore.js', '**.ignore/*'],
};
