module.exports = {
  env: {
    mocha: true,
    es2020: true,
  },
  globals: {
    $: 'readonly',
  },
  rules: {
    'no-unused-expressions': 'off',
  },
  overrides: [{
    files: ['setup/**'],
    rules: {
      'import/prefer-default-export': 'off',
    },
  }],
};
