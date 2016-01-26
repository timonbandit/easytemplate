var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var optipng = require('imagemin-optipng');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync').create();

var del = require('del');


// error function for plumber
var onError = function (err) { 
  console.log(err);
  this.emit('end');
};


var path = {css: 'app/src/css', 
			less: 'app/src/less', 
			js: 'app/src/js', 
			fonts: 'app/src/fonts', 
			images: 'app/src/img', 
			production: 'app/build'};

//clean everything

 gulp.task('clean', function(cb) {
	del(path.css + '/main.css');
	del(path.production + '/css/*');
	cb();

 });

  gulp.task('cleanFull', function(cb) {
	del(path.css + '/main.css');
	del(path.production + '/*');
	cb();

 });

// compile less
gulp.task('less', ['clean'], function() {

	return gulp.src(path.less + '/main.less')
	 	.pipe(plumber({ errorHandler: onError }))
		.pipe(less())		
		.pipe(gulp.dest(path.css));
});
// concat and compress css
gulp.task('compressCss', ['less'], function() {

	return gulp.src(path.css + '/*.css')
		.pipe(concat('style.css'))
		.pipe(csso())
		.pipe(gulp.dest(path.production + '/css'))
		.pipe(browserSync.reload({stream: true}));
});

//copy fonts
gulp.task('copyFonts', function () {
	return gulp.src(path.fonts + '/*')
		.pipe(gulp.dest(path.production + "/fonts"));
});

//concat and uglify js
gulp.task('compressJs', function () {
	return gulp.src([path.js + '/vendor/*.js', path.js + '/*.js'])
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest(path.production + '/js'))
		.pipe(browserSync.stream());
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['compressJs'], browserSync.reload);




//compress images
gulp.task('compressImg', function () {
	return gulp.src(path.images + '/*')
		.pipe(imagemin({
			progressive: true,
			optimizationLevel: 7,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest(path.production + '/img'));
});

// Static Server + watching less/html files
gulp.task('serve', ['compressCss','compressJs'], function() {

    browserSync.init({
        server: "./app"
    });

    gulp.watch(path.less + '/*.less', ['compressCss']);    
    gulp.watch(path.js + '/*.js', ['js-watch']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
});



//Full build task - run 'grunt full'
gulp.task('full', ['cleanFull', 'compressCss', 'copyFonts', 'compressJs', 'compressImg']);

//default
gulp.task('default',['compressCss', 'compressJs']);