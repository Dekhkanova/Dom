global.$ = {
		path: {
		    task: require('./gulp/config/tasks.js')
	},
	gulp: require('gulp'),
    fs: require('fs'),
	browserSync: require('browser-sync').create(),
    imageminJpegRecompress: require('imagemin-jpeg-recompress'),
    imageminPngQuant : require('imagemin-pngquant'),
    del: require('del'),
    gp: require('gulp-load-plugins')(),
    stylish: require('jshint-stylish'),
    spritesmith: require('gulp.spritesmith'),
    buffer: require('vinyl-buffer'),
    merge: require('merge-stream'),
	runS: require('run-sequence')

};

$.path.task.forEach(function (taskPath) {
	require(taskPath)();
});


$.gulp.task('dev',$.gulp.series(
    'clean',
	$.gulp.parallel('style:dev', 'html:dev', 'jshint', 'js:dev', 's-png:dev', 'svg', 'img:dev', 'fonts')));


$.gulp.task('build',$.gulp.series(
	'clean',
	$.gulp.parallel('style:build', 'html:build', 'js:build', 'img:build', 'fonts', 's-png:build', 'svg')));


$.gulp.task('default',$.gulp.series(
	'dev',
	$.gulp.parallel(
	    'watch',
        'serve'
    )
	));

	

