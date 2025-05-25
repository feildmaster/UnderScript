module.exports = {
  env: {
    node: true,
  },
  rules: {
    'import/extensions': ['error', {
      js: 'never',
      json: 'always',
    }],
    'no-console': 'off',
  },
};
