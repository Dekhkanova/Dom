module.exports = function() {

$.gulp.task('jshint', function() {
    return $.gulp.src('./src/js/**/**.js')
        .pipe($.gp.jshint())
        .pipe($.gp.jshint.reporter($.stylish));
    });


    $.gulp.task('js:dev', () => {
        return $.gulp.src(['./src/js/*.js'])
             .pipe($.gp.plumber())
             .pipe($.gp.sourcemaps.init())
             .pipe($.gp.rigger())
             // .pipe($.gp.concat())
             .pipe($.gp.sourcemaps.write())
             .pipe($.gulp.dest('./build/js/'))
            .pipe($.gulp.dest('./build/js/js/'))
            .pipe($.browserSync.reload({
                stream: true
            }));
    });

    $.gulp.task('js:build', function () {
        return $.gulp.src('./src/js/*.js')
            .pipe($.gp.plumber())
            .pipe($.gp.sourcemaps.init())
            .pipe($.gp.rigger())
            // .pipe($.gp.concat())
            .pipe($.gulp.dest('./build/js/'))
            .pipe($.gp.rename({suffix: '.min'}))
            .pipe($.gp.uglify()) //Сожмем наш js
            .pipe($.gp.sourcemaps.write(''))
            .pipe($.gp.size({
                title: 'JS'
            }))
            .pipe($.gulp.dest('./build/js/'))
            .pipe($.browserSync.reload({
                stream:true
            }));
    });
};
