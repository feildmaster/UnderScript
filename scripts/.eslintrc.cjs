module.exports = {
  env: {
    node: true,
  },
  rules: {
    'import/extensions': ['error', {
      js: 'never',
      json: 'always',
    }],
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: true,
      optionalDependencies: false,
      peerDependencies: false,
      bundledDependencies: false,
    }],
    'no-console': 'off',
  },
};
