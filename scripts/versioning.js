/* eslint-env node */
// eslint-disable-next-line import/no-extraneous-dependencies
const replace = require('replace');
const pkg = require('../package.json');

replace({
  regex: '// @version      .*',
  replacement: `// @version      ${pkg.version}`,
  paths: ['./src/meta.js'],
  silent: true,
});
