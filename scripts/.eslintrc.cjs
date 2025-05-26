module.exports = {
  env: {
    node: true,
  },
  rules: {
    'import/extensions': ['error', {
      js: 'always',
      json: 'always',
    }],
    'no-console': 'off',
  },
};
