const { dest, parallel, series, src, watch } = require('gulp');
const concat = require('gulp-concat');
const rename = require('gulp-rename');

function build(cb) {
  return src(['./src/meta.js', './src/base/*.js', './src/desktop/*.js', './src/hooks/*.js'])
    .pipe(concat('undercards.user.js'))
    .pipe(docs());
}

function docs() {
  return dest('./docs');
}

watch(['./src/underscript.js'], build);

exports.build = build;
exports.default = parallel(build);
