/* gulpfile.js for yumhut */

var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	sass = require('gulp-sass');

/* default gulp task */
gulp.task('default', ['watch']);

/* lint js files */
gulp.task('jshint', function() {
	return gulp.src('../app/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

/* compile .scss files to CSS */

gulp.task('sass', function() {
	return gulp.src('../app/stylesheets/styles.scss')
		.pipe(sass())
		.pipe(gulp.dest('../'));
});

/* watch files for changes and execute tasks */

gulp.task('watch', function() {
	gulp.watch('../**/*.scss', ['sass']);
});