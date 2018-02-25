module.exports = function () {
    $.gulp.task('img:dev', () => {
        return $.gulp.src('./src/img/images/**/*.{png,jpg,gif}')
            .pipe($.gp.plumber())
            .pipe($.gp.size({
                title: 'IMG:dev'
            }))
            .pipe($.gulp.dest('./build/img/images/'));
    });

    $.gulp.task('img:build', () => {
        return $.gulp.src('./src/img/images/**/*.{png,jpg,gif}')
            .pipe($.gp.plumber())
            .pipe($.gp.size({
                title: 'IMG:dev'
            }))
            .pipe($.gp.imagemin([
                $.gp.imagemin.gifsicle({interlaced: true}),
                $.gp.imagemin.optipng({optimizationLevel: 3}),
                $.imageminJpegRecompress({
                    loops:6,
                    min: 40,
                    max: 85,
                    quality:'low'
                }),
                $.imageminPngQuant(),
                $.gp.imagemin.svgo({
                    plugins: [
                        {removeViewBox: false}
                    ]
                })
            ]))
            .pipe($.gp.size({
                title: 'IMG:build'
            }))
            .pipe($.gulp.dest('./build/img/images/'))
    });
};

