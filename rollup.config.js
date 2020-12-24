const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const cleanup = require('rollup-plugin-cleanup');

module.exports = {
  input: 'src/bundle/bundle.js',
  output: {
    file: 'dist/undercards.dependencies.js',
    format: 'cjs',
  },
  context: 'this',
  plugins: [
    nodeResolve({ browser: true }),
    commonjs(),
    json(),
    cleanup(),
  ],
};
