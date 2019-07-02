const { src, dest, series, watch } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

function index() {
  return src('src/index.js')
    .pipe(rename({basename: 'magnet-mouse'}))
    .pipe(dest('lib/'))
}

function minify() {
  return src('src/index.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(rename({basename: 'magnet-mouse', extname: '.min.js' }))
    .pipe(dest('lib/'))
}

function es5() {
  return src('src/index.js')
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(rename({basename: 'magnet-mouse', extname: '.es5.js' }))
    .pipe(dest('lib/'))
}

exports.default = series(index, minify, es5);
exports.index = index;
exports.minify = minify;
exports.es5 = es5;

watch(['src/*.js'], function() {
  index();
  minify();
  es5();
});