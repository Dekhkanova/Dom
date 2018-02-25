module.exports = function () {
    $.gulp.task('watch', function() {
        $.gulp.watch('./src/**/*.html', $.gulp.series('html:dev'));
        $.gulp.watch('./src/less/**/*.less', $.gulp.series('style:dev'));
        $.gulp.watch('./src/js/**/*.js', $.gulp.series('js:dev'));
        $.gulp.watch('./src/img/images/**/*.{png,jpg,gif}', $.gulp.series('img:dev'));
        $.gulp.watch('./src/img/icons/svg/*.svg', $.gulp.series('svg'));
        $.gulp.watch('./src/img/icons/png/**/*.png', $.gulp.series('s-png:dev'));
    });
};
