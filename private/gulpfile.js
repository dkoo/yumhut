/* gulpfile.js for yumhut */

var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	sass = require('gulp-sass');

/* lint js files */
gulp.task('lint', function() {
	return gulp.src('../app/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

/* compile .scss files to CSS */
gulp.task('sass', function() {
	return gulp.src('../app/stylesheets/styles.scss')
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(gulp.dest('../dist/'));
});

/* watch files for changes and execute tasks */
gulp.task('watch', function() {
	gulp.watch('../**/*.scss', ['sass']);
	gulp.watch('../app/**/*.js', ['lint']);
});

/* default gulp task */
gulp.task('default', ['watch']);
