const {series, parallel, src, dest, watch} = require('gulp');
const del = require("del");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const browserSync = require('browser-sync').create();

//Pathes
var path = {
  css: 'app/src/css',
  scss: 'app/src/scss',
  js: 'app/src/js',
  fonts: 'app/src/fonts',
  images: 'app/src/img',
  tmp: 'app/src/tmp',
  production: 'app/build'
};

function onError(err) {
  console.log(err);
  this.emit
}

function cleanDev(cb) {
  del(path.css + '/main.css');
  del(path.production + '/css/*');
  cb();
}

function cleanFull(cb) {
  del(path.css + '/main.css');
  del(path.production + '/*');
  del(path.tmp + "/*");
  cb();
}

function scss() {
  return src(path.scss + '/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest(path.css));
}

function buildCSS(cb) {
  return src(path.css + '/*.css')
    .pipe(postcss())
    .pipe(dest(path.production + '/css'))
    .pipe(browserSync.stream())
}

function reload() {
  browserSync.reload();
}

function serve(done) {
  browserSync.init({
    server: {
      baseDir: './app'
    }
  });
  done();
}

function watchFiles(done) {
  watch(path.scss + '/*.scss', series(cleanDev, scss, buildCSS));
  //watch([path.js + '/**/*.js'], series(buildJS, reload));

  watch("app/*.html").on('change', reload);
  done();
}

exports.default = series(cleanDev, scss, buildCSS);
exports.dev = series(cleanDev, scss, buildCSS, watchFiles, serve);
