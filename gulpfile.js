const gulp         = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps   = require('gulp-sourcemaps');
const stylus       = require('gulp-stylus');
const webpack      = require('webpack-stream');

gulp.task('build:js', function() {
	return gulp.src(['js/init.js', 'js/settings.js'])
	.pipe(webpack(require('./webpack.config')))
	.on('error', function () {
		this.emit('end');
	})
	.pipe(gulp.dest('js'));
});

gulp.task('build:css', function () {
	return gulp.src(['css/application.styl'])
	.pipe(sourcemaps.init())
	.pipe(stylus())
	.pipe(autoprefixer({browsers: ['last 2 versions']}))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('css'));
});

gulp.task('build', ['build:js', 'build:css']);
gulp.task('test', ['build']);