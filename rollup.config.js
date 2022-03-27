const { readFileSync } = require('fs');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const cleanup = require('rollup-plugin-cleanup');
const multi = require('@rollup/plugin-multi-entry');
const externals = require('rollup-plugin-external-globals');
const { version } = require('./package.json');

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
      'src/base/**/*.js',
      'src/hooks/**/*.js',
    ],
    exclude,
  },
  context: 'this',
  output: [{
    name: 'ucs',
    file: 'dist/undercards.user.js',
    banner: meta,
    format: 'module', // module, iife
    esModule: false,
    exports: 'none',
    preferConst: true,
  }, {
    name: 'ucs',
    file: 'dist/underscript.js',
    format: 'iife', // module, iife
    esModule: false,
    exports: 'none',
    preferConst: true,
  }],
  external: ['luxon', 'showdown', 'axios', 'tippy.js'],
  plugins: [
    nodeResolve({ browser: true }),
    multi({
      exports: false,
    }),
    cleanup(),
    externals({
      luxon: 'luxon',
      showdown: 'showdown',
      axios: 'axios',
      'tippy.js': 'tippy',
    }),
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
    {
      name: 'Watch src',
      buildStart() {
        // Look for new files in base/hooks
        this.addWatchFile('src/base');
        this.addWatchFile('src/hooks');
      },
    },
  ],
}];
