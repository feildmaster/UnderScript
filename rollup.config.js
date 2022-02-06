const { readFileSync } = require('fs');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const cleanup = require('rollup-plugin-cleanup');
const multi = require('@rollup/plugin-multi-entry');
const path = require('path');
const { version } = require('./package.json');

const SimpleToast = path.resolve(__dirname, 'src/bundle/SimpleToast.js');

const debug = process.argv.includes('--configDebug');
const exclude = ['**/*.ignore*/*', '**/*.ignore*'];

if (!debug) {
  exclude.push(
    '**/**.local*',
    '**/**.test*',
  );
}

const meta = readFileSync('./src/meta.js').toString().replace(/{{ version }}/g, version);

module.exports = [{
  input: 'src/bundle/bundle.js',
  treeshake: false,
  watch: false,
  output: {
    file: 'dist/dependencies.js',
    format: 'cjs',
  },
  context: 'this',
  plugins: [
    nodeResolve({ browser: true }),
    commonjs(),
    json(),
    cleanup(),
  ],
}, {
  input: {
    include: [
      'src/utils/0.publicist.js',
      'src/base/index.js',
      'src/base/**/**.js',
      'src/hooks/**.js',
    ],
    exclude,
  },
  context: 'this',
  output: {
    name: 'ucs',
    file: 'dist/undercards.user.js',
    banner: meta,
    format: 'iife', // module, iife
    esModule: false,
    // exports: 'none',
    preferConst: true,
    globals: {
      luxon: 'luxon',
      showdown: 'showdown',
      axios: 'axios',
      'tippy.js': 'tippy',
      [SimpleToast]: 'SimpleToast',
    },
  },
  external: ['luxon', 'showdown', 'axios', 'tippy.js', SimpleToast],
  plugins: [
    multi({
      // exports: false,
    }),
    cleanup(),
    {
      name: 'Meta saver',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'undercards.meta.js',
          source: meta,
        });
      },
    },
  ],
}];
