var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var inject = require('gulp-inject');
var removeHtmlComments = require('gulp-remove-html-comments');
var webserver = require('gulp-webserver');
var clean = require('gulp-clean');

/** ======
Parameters
======= */
var SRC = "src", DEST = "app"

gulp.task('default', function() {
	console.log(`
	==========
	ui project
	==========
	`);
});

gulp.task('build-media', function() {
	return gulp.src([
		SRC + "/media/*.png",
		SRC + "/media/*.jpg",
	])
	.pipe(imagemin())
	.pipe(gulp.dest(DEST + '/media'));
});

var LIBRARIES = [
	'./node_modules/moment/min/moment.min.js',
	'./node_modules/font-awesome/css/font-awesome.min.css',
	'./node_modules/font-awesome/fonts/*.eot',
	'./node_modules/font-awesome/fonts/*.svg',
	'./node_modules/font-awesome/fonts/*.ttf',
	'./node_modules/font-awesome/fonts/*.woff',
	'./node_modules/font-awesome/fonts/*.woff2',
	'./node_modules/font-awesome/fonts/*.otf',
	'./node_modules/roboto-fontface/css/roboto/roboto-fontface.css',
	'./node_modules/roboto-fontface/fonts/Roboto/*.eot',
	'./node_modules/roboto-fontface/fonts/Roboto/*.svg',
	'./node_modules/roboto-fontface/fonts/Roboto/*.ttf',
	'./node_modules/roboto-fontface/fonts/Roboto/*.woff',
	'./node_modules/roboto-fontface/fonts/Roboto/*.woff2',
	'./node_modules/roboto-fontface/fonts/Roboto/*.otf',
	'./node_modules/angular/angular.min.js',
	'./node_modules/angular-route/angular-route.min.js',
	'./node_modules/angular-aria/angular-aria.min.js',
	'./node_modules/angular-animate/angular-animate.min.js',
	'./node_modules/angular-material/angular-material.min.css',
	'./node_modules/angular-material/angular-material.min.js'
];

gulp.task('build-lib', function() {
	return gulp.src(LIBRARIES, {
		base: './node_modules'
	})
	.pipe(gulp.dest(DEST + '/lib'));
});

gulp.task('build-css', function() {
	return gulp.src(SRC + '/scss/style.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(gulp.dest(DEST + '/css'));
});

var JAVASCRIPTS = [
	SRC + '/js/functions.js',
	SRC + '/js/app.js',
	SRC + '/js/auth.js',
	SRC + '/js/ctrl/splash.js',
	SRC + '/js/filters.js',
	SRC + '/js/services.js',
	SRC + '/js/dao.js',
	SRC + '/js/languages.js'
];

gulp.task('build-js', function() {
	return gulp.src(JAVASCRIPTS)
	.pipe(concat('main.js'))
	.pipe(gulp.dest(DEST + '/js'));
});

var INJECTRES = [
	DEST + '/lib/roboto-fontface/css/roboto/roboto-fontface.css',
	DEST + '/lib/font-awesome/css/font-awesome.min.css',
	DEST + '/lib/moment/min/moment.min.js',
	DEST + '/lib/angular/angular.min.js',
	DEST + '/lib/angular-route/angular-route.min.js',
	DEST + '/lib/angular-aria/angular-aria.min.js',
	DEST + '/lib/angular-animate/angular-animate.min.js',
	DEST + '/lib/angular-material/angular-material.min.css',
	DEST + '/lib/angular-material/angular-material.min.js',
	DEST + '/css/style.css',
	DEST + '/js/main.js'
];

gulp.task('build-html', ['build-media', 'build-lib', 'build-css', 'build-js'], function() {
	return gulp.src(SRC + '/**/*.html', {
		base: SRC
	})
	.pipe(inject(gulp.src(INJECTRES, {
		read: false
	})))
	.pipe(removeHtmlComments())
	.pipe(gulp.dest(DEST));
});

gulp.task('build-html-lite', function() {
	return gulp.src(SRC + '/**/*.html', {
		base: SRC
	})
	.pipe(inject(gulp.src(INJECTRES, {
		read: false
	})))
	.pipe(removeHtmlComments())
	.pipe(gulp.dest(DEST));
});

gulp.task('build', ['build-html'], function() {
	// NOTHING
});

gulp.task('live-load', function() {
	gulp.watch(SRC + '/scss/style.scss', ['build-css']); 
	gulp.watch(SRC + '/**/*.html', ['build-html-lite']);
	gulp.watch(JAVASCRIPTS, ['build-js']);
});

gulp.task('serve', ['build', 'live-load'], function() {
	return gulp.src('')
	.pipe(webserver({
		livereload: true,
		directoryListing: true,
		open: true,
		host: 'localhost',
		port: 8089,
		open: DEST + '/auth.html',
		fallback: 'auth.html'
	}));
});

gulp.task('clean', function() {
	return gulp.src(DEST, {read: false})
	.pipe(clean());
});