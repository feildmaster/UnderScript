const argv = require('minimist')(process.argv.slice(2), { boolean: true, });
const { dest, parallel, src, watch } = require('gulp');
const concat = require('gulp-concat');
const rename = require('gulp-rename');

const metafile = './src/meta.js';
const underscript = [metafile, './src/base/*.js', './src/desktop/*.js', './src/hooks/*.js'];

function buildMeta() {
  return src(metafile)
    .pipe(rename('undercards.meta.js'))
    .pipe(docs());
}

function build() {
  return src(underscript)
    .pipe(concat('undercards.user.js'))
    .pipe(docs());
}

function docs() {
  return dest('./docs');
}

if (!argv.deploy) {
  watch(metafile, buildMeta)
  watch(underscript, build);
}

exports.default = parallel(buildMeta, build);
