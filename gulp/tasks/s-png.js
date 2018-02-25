module.exports = function () {
        $.gulp.task('s-png:dev', () => {
            var spriteData = $.gulp.src('./src/img/icons/png/**/*.png')
                .pipe($.spritesmith({
                    imgName: 'spritePNG.png',
                    cssName: '_spritePNG.less',
                    imgPath: '../img/icons/spritePNG.png',
                    // retinaSrcFilter: path.src.rtnSprite,
                    // retinaImgName: 'rtnSprite.png',
                    // retinaImgPath: '../img/icons/rtnSprite.png',
                    padding: 0,
                    cssFormat: 'less',
                    algorithm: 'binary-tree',
                    cssTemplate: './src/less/partial/template.mustache',
                    cssVarMap: function(sprite) {
                        sprite.name = 's-' + sprite.name;
                    }
                }));
            var imgStream = spriteData.img   // Pipe image stream through image optimizer and onto disk
                .pipe($.buffer())
                .pipe($.gulp.dest('./build/img/icons/'));

            var cssStream = spriteData.css // Pipe CSS stream through CSS optimizer and onto disk
                .pipe($.gp.size({
                    title: '_spritePNG:dev'
                }))
                .pipe($.gulp.dest('./src/less/partial/'));

            return $.merge(imgStream, cssStream)
                .on('end',$.browserSync.reload);
        });



    $.gulp.task('s-png:build', () => {
        var spriteData = $.gulp.src('./src/img/icons/png/**/*.png')
            .pipe($.spritesmith({
                imgName: 'spritePNG.png',
                cssName: '_spritePNG.less',
                imgPath: '../img/icons/spritePNG.png',
                // retinaSrcFilter: path.src.rtnSprite,
                // retinaImgName: 'rtnSprite.png',
                // retinaImgPath: '../img/icons/rtnSprite.png',
                padding: 0,
                cssFormat: 'less',
                algorithm: 'binary-tree',
                cssTemplate: './src/less/partial/template.mustache',
                cssVarMap: function(sprite) {
                    sprite.name = 's-' + sprite.name;
                }
            }));
    var imgStream = spriteData.img   // Pipe image stream through image optimizer and onto disk
        .pipe($.buffer())
        .pipe($.gp.imagemin([
            $.gp.imagemin.optipng({optimizationLevel: 3}),
            $.imageminPngQuant()
        ]))
        .pipe($.gulp.dest('./build/img/icons/'));

    var cssStream = spriteData.css // Pipe CSS stream through CSS optimizer and onto disk
        .pipe($.gp.csso())
        .pipe($.gp.size({
            title: '_spritePNG'
        }))
        .pipe($.gulp.dest('./src/less/partial/'));

    return $.merge(imgStream, cssStream)
        .on('end',$.browserSync.reload);
});
    };