const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const { nodeResolve } = require('@rollup/plugin-node-resolve');

module.exports = {
  input: 'src/bundle/bundle.js',
  output: {
    file: 'dist/undercards.dependencies.js',
    format: 'cjs',
  },
  plugins: [nodeResolve({ browser: true }), commonjs(), json()],
};
