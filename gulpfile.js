const {series, parallel, src, dest, watch} = require('gulp');
const del = require("del");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const browserify = require("browserify");
const browserSync = require('browser-sync').create();
const source = require('vinyl-source-stream');
const plumber = require('gulp-plumber');
const notifier = require('node-notifier');
const {build} = require('esbuild')


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
  console.log(err.stderr);
  notifier.notify({
    title: 'Compilation Error',
    message: err.stderr,
    sound: true,
  });
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

function buildJS(cb) {
  const options = {
    entryPoints: [path.js + "/index.js"],
    outfile: [path.production + "/js/index.js"],
    bundle: true
  }

  return build(options)
    .then(() => {
      notifier.notify({
        title: 'Success',
        message: "JS Compilation complete"
      });

      browserSync.reload(path.production + "/js/index.js")
    }).catch(err => {
      onError(err);
    });

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
  watch([path.js + '/**/*.js'], series(buildJS));

  watch("app/*.html").on('change', reload);
  done();
}

function notify(done) {
  notifier.notify({
    title: 'Success',
    message: "Compilation complete"
  });
  done()
}

exports.default = series(cleanDev, scss, buildCSS);
exports.dev = series(cleanDev, scss, buildCSS, buildJS, watchFiles, notify, serve);
