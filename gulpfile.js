var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var optipng = require('imagemin-optipng');
var del = require('del');

var path = {css: 'src/css', 
			less: 'src/less', 
			js: 'src/js', 
			fonts: 'src/fonts', 
			images: 'src/img', 
			production: 'build'};

//clean everything

 gulp.task('clean', function(cb) {
	del(path.css + '/main.css');
	del(path.production + '/css/*');
	cb();

 });

// compile less
gulp.task('less', ['clean'], function() {

	return gulp.src(path.less + '/main.less')
		.pipe(less())		
		.pipe(gulp.dest(path.css));
});
// concat and compress css
gulp.task('compressCss', ['less'], function() {

	return gulp.src(path.css + '/*.css')
		.pipe(concat('style.css'))
		.pipe(csso())
		.pipe(gulp.dest(path.production + '/css'));
});


/*
//copy fonts
gulp.task('copyFonts', function () {
	return gulp.src(path.fonts + '/*')
		.pipe(gulp.dest(path.production + "/fonts"));
});
*/
//concat and uglify js
gulp.task('compressJs', function () {
	return gulp.src([path.js + '/vendor/*.js', path.js + '/*.js'])
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest(path.production + '/js'));
});
/*
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
//default
gulp.task('default', ['clean', 'less', 'compressCss', 'copyFonts', 'compressJs', 'compressImg']);
*/

gulp.task('default',['compressCss', 'compressJs']);