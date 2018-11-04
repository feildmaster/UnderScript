const { dest, parallel, src, watch } = require('gulp');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const replace = require('gulp-replace');

const deploy = process.argv.includes('--deploy');
const metafile = 'src/meta.js';
const underscript = [metafile, 'src/utils/*.js', 'src/base/*.js', 'src/desktop/*.js', 'src/hooks/*.js', '!src/**/*.ignore.js'];

function buildMeta() {
  return src(metafile)
    .pipe(replace(/\/\/ @history[^@]*\r?\n/ig, ''))
    .pipe(rename('undercards.meta.js'))
    .pipe(to());
}

function build() {
  return src(underscript)
    .pipe(concat('undercards.user.js'))
    .pipe(to());
}

function to() {
  return dest('dist');
}

if (!deploy) {
  watch(underscript, build);
}

exports.default = parallel(buildMeta, build);
