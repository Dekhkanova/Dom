module.exports = function () {
    $.gulp.task('html:dev', ()=> {
        return $.gulp.src('./src/*.html')
            .pipe($.gp.rigger())
            .pipe($.gp.size({
                title: 'HTML:dev'
            }))
            .on("error", $.gp.notify.onError(function(error) {
                return {
                    title: "HTML ERROR",
                    message: "Error: <%= error.message %>"
                };
            }))
            .pipe($.gulp.dest('./build/'))
            .on('end',$.browserSync.reload);
    });

    $.gulp.task('html:build', function () {
        return $.gulp.src('src/*.html')
            .pipe($.gp.rigger())
            .pipe($.gp.size({
                title: 'HTML:dev'
            }))
            .pipe($.gulp.dest('./build/'))
            .pipe($.gp.htmlmin({collapseWhitespace: true}))
            .pipe($.gp.rename({suffix: '.min'}))
            .pipe($.gp.size({
                title: 'HTML:build'
            }))
            .on("error", $.gp.notify.onError(function(error) {
                return {
                    title: "HTML ERROR",
                    message: "Error: <%= error.message %>"
                };
            }))
            .pipe($.gulp.dest('./build/min_html/'))
            .on('end',$.browserSync.reload);
    });

};



