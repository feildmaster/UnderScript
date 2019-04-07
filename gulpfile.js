const { dest, series, src, watch } = require('gulp');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const package = require('./package.json');

const deploy = process.argv.includes('--deploy');
const metafile = 'src/meta.js';
const underscript = [metafile, 'src/utils/**/*.js', 'src/base/**/*.js', 'src/hooks/**/*.js', '!src/**/*.ignore.js'];

function buildMeta() {
  return src(metafile)
    .pipe(replace('{{ version }}', package.version))
    .pipe(rename('undercards.meta.js'))
    .pipe(to());
}

function build() {
  return src(underscript)
    .pipe(replace('{{ version }}', package.version))
    //.pipe(replace(/((?: +|\t+|^)\/\/.[^@=].*$|(?: +|\t+|^)\/\*(?:.|\n\r?)+\*\/)/gm, ''))
    .pipe(concat('undercards.user.js'))
    .pipe(to());
}

function to() {
  return dest('dist');
}

if (deploy) {
  underscript.push(
    '!src/**/*.local.js',
    '!src/**/*.test.js',
  );
} else {
  watch(underscript, build);
}

exports.default = series(buildMeta, build);
