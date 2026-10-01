module.exports = {
  recursive: true,
  file: ['test/setup/hooks.js'],
  ignore: ['test/setup/**'],
  'node-option': ['import=./test/setup/dom.js'],
};
