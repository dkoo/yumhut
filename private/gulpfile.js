/* gulpfile.js for yumhut */

var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	sass = require('gulp-sass');

/* lint js files */
gulp.task('jshint', function() {
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
	gulp.watch('../**/*.scss', ['lint', 'sass']);
});

/* default gulp task */
gulp.task('default', ['lint', 'sass', 'watch']);
