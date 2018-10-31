const { dest, parallel, series, src, watch } = require('gulp');
const concat = require('gulp-concat');
const rename = require('gulp-rename');

function utilities() {
  return src('./src/utilities.js')
    .pipe(rename({ dirname: '.' }))
    .pipe(docs());
}

function build(cb) {
  return src(['./src/underscript.js'])
    .pipe(rename('undercards.user.js'))
    .pipe(docs());
}

function docs() {
  return dest('./docs');
}

watch(['./src/utilities.js'], utilities);
watch(['./src/underscript.js'], build);

exports.build = build;
exports.default = parallel(utilities, build);
