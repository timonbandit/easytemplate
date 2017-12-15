var gulp = require('gulp');
var concat = require('gulp-concat');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var optipng = require('imagemin-optipng');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync').create();
var scp = require('gulp-scp2');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var gh_pages = require('gh-pages');


var del = require('del');


// error function for plumber
var onError = function (err) {
  console.log(err);
  this.emit('end');
};

//Pathes
var path = {
  css: 'app/src/css',
  sass: 'app/src/sass',
  js: 'app/src/js',
  fonts: 'app/src/fonts',
  images: 'app/src/img',
  tmp: 'app/src/tmp',
  production: 'app/build'
};

//Clean for development purposes
gulp.task('clean', function (cb) {
  del(path.css + '/main.css');
  del(path.production + '/css/*');
  cb();

});

//Clean all production folder
gulp.task('cleanFull', function (cb) {
  del(path.css + '/main.css');
  del(path.production + '/*');
  del(path.tmp + "/*");
  cb();

});

//compile sass
gulp.task('sass', ['clean'], function () {

  return gulp.src(path.sass + '/main.scss')
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(sass())
    .pipe(gulp.dest(path.css));
});

//Concat and compress css
gulp.task('compresCss', ['sass'], function () {

  return gulp.src(path.css + '/*.css')
    .pipe(concat('style.css'))
    .pipe(autoprefixer({
      browsers: ['>1%', 'ie 9'],
      cascade: false
    }))
    .pipe(csso())
    .pipe(gulp.dest(path.production + '/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

//Copy fonts
gulp.task('copyFonts', function () {
  return gulp.src(path.fonts + '/*')
    .pipe(gulp.dest(path.production + "/fonts"));
});

//Concat and uglify js
gulp.task('compressJs', function () {

  return gulp.src([path.js + '/vendor/*.js', path.tmp + '/*.js', path.js + '/*.js'])
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(concat('main.js'))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(gulp.dest(path.production + '/js'))
    .pipe(browserSync.stream());
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['compressJs'], browserSync.reload);

//Compress images
gulp.task('compressImg', function () {
  return gulp.src(path.images + '/**/*')
    .pipe(imagemin({
      progressive: true,
      optimizationLevel: 7,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(path.production + '/img'));
});

// Static Server + watching less/html files
gulp.task('serve', ['compresCss', 'compressJs'], function () {

  browserSync.init({
    server: "./app"
  });

  gulp.watch(path.sass + '/*.scss', ['compresCss']);
  gulp.watch([path.js + '/**/*.js', path.js + '/**/*.es6'], ['js-watch']);
  //gulp.watch(path.js + '/*.es6', ['js-watch']);
  gulp.watch("app/*.html").on('change', browserSync.reload);
});

//GitHub pages publish
gulp.task('publish', ['full'], function () {
  gh_pages.publish('app', {
    src: ['index.html', 'build/**'],
    message: 'GH Page updated'
  }, function (err) {
    console.log(err);
  });
});


//SSH deployment
gulp.task('deploy', function () {
  return gulp.src('app/**/*')
    .pipe(scp({
      host: 'hostname.example',
      port: '22',
      username: 'user',
      password: 'pass',
      dest: '/var/www/website'

    })).on('error', function (err) {
      console.log(err);
    });
});


//Full build task - run 'grunt full'
gulp.task('full', ['cleanFull', 'compresCss', 'copyFonts', 'compressJs', 'compressImg']);

//default
gulp.task('default', ['compresCss', 'compressJs']);
