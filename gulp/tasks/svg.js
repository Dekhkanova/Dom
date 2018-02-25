module.exports = function() {
    $.gulp.task('svg', () => {
        return $.gulp.src('./src/img/icons/svg/*.svg')
            .pipe($.gp.svgmin({
                js2svg: {
                    pretty: true
                }
            }))
            .pipe($.gp.cheerio({
                run: function($) {
                    $('[fill]').removeAttr('fill');
                    $('[stroke]').removeAttr('stroke');
                    $('[style]').removeAttr('style');
                },
                parserOptions: { xmlMode: true }
            }))
            .pipe($.gp.replace('&gt;', '>'))
            .pipe($.gp.svgstore({
                inlineSvg: true
            }))
            .pipe($.gp.rename('spriteSVG.svg'))
            .pipe($.gp.size({
                title: 'spriteSVG'
            }))
            .pipe($.gulp.dest('./build/img/icons/'));
    });

};
