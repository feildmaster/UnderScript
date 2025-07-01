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
import alias from '@rollup/plugin-alias';
import path from 'path';
import typescript from '@rollup/plugin-typescript';

import { version } from './package.json';
import importString from './scripts/import-string.js';
import bundle from './scripts/lang.js';

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
const {
  SENTRY_DSN = '',
} = process.env;

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
    format: 'iife', // module, iife
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
    {
      name: 'bundle',
      buildStart() {
        if (!debug) return;
        this.addWatchFile('lang/en');
        bundle('lang/underscript.ignore.json');
      },
    },
    alias({
      entries: [{
        find: 'src',
        replacement: path.resolve('./src'),
      }],
    }),
    replace({
      preventAssignment: true,
      values: {
        VERSION: `'${version}'`,
        __SENTRY__: SENTRY_DSN,
        __VERSION__: version,
        __ENVIRONMENT__: process.env.GITHUB_ACTIONS ? 'production' : 'development',
      },
    }),
    nodeResolve({ browser: true }),
    typescript({
      outDir: './dist',
      target: 'ES2023',
      tsconfig: './src/tsconfig.json',
    }),
    css(),
    importString({
      include: ['**/*.html'],
    }),
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
