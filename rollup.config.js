import { config } from 'dotenv';
import { readFileSync } from 'fs';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import cleanup from 'rollup-plugin-cleanup';
import multi from '@rollup/plugin-multi-entry';
import externals from 'rollup-plugin-external-globals';
import css from 'rollup-plugin-import-css';
import replace from '@rollup/plugin-replace';

import { version } from './package.json';

config();

const debug = process.argv.includes('--configDebug');
const exclude = ['**/*.ignore/*', '**/*.ignore*'];

if (!debug) {
  exclude.push(
    '**/*.local/*',
    '**/*.local*',
  );
}

const meta = readFileSync('./src/meta.js').toString().replace(/{{ version }}/g, version);

export default [{
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
    replace({
      preventAssignment: true,
      values: {
        SENTRY_DSN: `'${process.env.SENTRY_DSN ?? ''}'`,
        VERSION: `'${version}'`,
        '{{ version }}': version,
      },
    }),
    nodeResolve({ browser: true }),
    css(),
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
