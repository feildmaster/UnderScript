const argv = require('minimist')(process.argv.slice(2), { boolean: true, });
const { dest, parallel, src, watch } = require('gulp');
const concat = require('gulp-concat');
const rename = require('gulp-rename');

const metafile = './src/meta.js';
const underscript = [metafile, './src/base/*.js', './src/desktop/*.js', './src/hooks/*.js'];

function buildUtils() {
  return src('./src/utilities.js')
    .pipe(to());
}

function buildMeta() {
  return src(metafile)
    .pipe(rename('undercards.meta.js'))
    .pipe(to());
}

function build() {
  return src(underscript)
    .pipe(concat('undercards.user.js'))
    .pipe(to());
}

function to() {
  return dest('./dist');
}

if (!argv.deploy) {
  watch(metafile, buildMeta)
  watch(underscript, build);
}

exports.default = parallel(buildUtils, buildMeta, build);
