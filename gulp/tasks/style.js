module.exports = function () {

    $.gulp.task('style:build', () => {
        return $.gulp.src('./src/less/style.less')
            .pipe($.gp.plumber())
            .pipe($.gp.less()).on('error', $.gp.lessReporter)
            .pipe($.gp.autoprefixer({
                browsers: ['last 5 version']
            }))
            .pipe($.gp.combineMq({
                beautify: false
            }))
            .pipe($.gulp.dest('./build/css/'))
            .pipe($.gp.rename({suffix: '.min'}))
            .pipe($.gp.csso())
            .pipe($.gp.size({
                title: 'CSS:build'
            }))
            .pipe($.gulp.dest('./build/css/'))
    });

    $.gulp.task('style:dev', () => {
        return $.gulp.src('./src/less/style.less')
            .pipe($.gp.plumber())
            .pipe($.gp.sourcemaps.init())
            .pipe($.gp.less()).on('error', $.gp.lessReporter)
            .pipe($.gp.sourcemaps.write())
            .pipe($.gp.autoprefixer({
                browsers: ['last 5 version']
            }))
            .pipe($.gp.size({
                title: 'CSS:dev'
            }))
            .pipe($.gulp.dest('./build/css/'))
            .pipe($.browserSync.reload({
                stream:true
            }));
    });

};
