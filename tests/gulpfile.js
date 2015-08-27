var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer');

/* lint js files */
gulp.task('lint', function() {
	return gulp.src(['../client/**/*.js', '../server/**/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

/* compile .scss files to CSS */
gulp.task('sass', function() {
	return gulp.src('../client/css/main.scss')
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(gulp.dest('build/css/unprefixed'));
});

/* post-process CSS with autoprefixer */
gulp.task('autoprefix', ['sass'], function() {
	return gulp.src('build/css/unprefixed/main.css')
		.pipe(autoprefixer({
			browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'],
			cascade: false
		}))
		.pipe(gulp.dest('../dist'));
});

/* watch files for changes and execute tasks */
gulp.task('watch', function() {
	gulp.watch('../**/*.scss', ['sass']);
	gulp.watch('**/*.css', ['autoprefix']);	
	gulp.watch(['../client/**/*.js', '../server/**/*.js'], ['lint']);
});

/* compile CSS */
gulp.task('build', ['sass', 'autoprefix']);

/* default gulp task */
gulp.task('default', ['watch']);
