/* gulpfile.js for yumhut */

var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	sass = require('gulp-sass');

/* lint js files */
gulp.task('lint', function() {
	return gulp.src(['../client/**/*.js', '../server/**/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

/* compile .scss files to CSS */
gulp.task('sass', function() {
	return gulp.src('../client/stylesheets/styles.scss')
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(gulp.dest('../client/stylesheets/'));
});

/* watch files for changes and execute tasks */
gulp.task('watch', function() {
	gulp.watch('../**/*.scss', ['sass']);
	gulp.watch(['../client/**/*.js', '../server/**/*.js'], ['lint']);
});

/* default gulp task */
gulp.task('default', ['watch']);
