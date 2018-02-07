'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var plumber = require('gulp-plumber'); //работа с ошибками (запирает, показывает и скрипт при этом не останавливает)
var postcaa = require('gulp-postcss'); //делает автопрефиксы
var autoprefixer = require('gulp-autoprefixer'); // Подключаем библиотеку для автоматического добавлени
var browserSync = require('browser-sync').create(); //синхронизация
var mqpacker = require('css-mqpacker'); //объединить медиавыражения в css (планиг postcss)
var minify = require('gulp-csso'); //минификация css
var rename = require('gulp-rename'); // переименование
var imagemin = require('gulp-imagemin'); //минификация изображений
var svgstore = require('gulp-svgstore'); //спрайт svg
var pritesmith = require('gulp.spritesmith'); //спрайт png
var svgmin = require('gulp-svgmin'); // минификация svg
var run = require('run-sequence'); // последовательность запуска задач
var del = require('del'); // Подключаем библиотеку для удаления файлов и папок// Подключаем библиотеку для работы с изображениями // Подключаем библиотеку для переименования файлов
var htmlmin = require('gulp-htmlmin');
var concat = require('gulp-concat'); // конкатенация/склеивание файлов
var uglify = require('gulp-uglify'); // минификация js
var jshint = require("gulp-jshint"); //отслеживание ошибкок в js
var pngquant = require('imagemin-pngquant'); // Подключаем библиотеку для работы с png
var sourcemaps = require('gulp-sourcemaps'); //sourcemaps
var watch = require('gulp-watch');
var rigger = require('gulp-rigger'); //работа с инклюдами в html и js

// билдим css (глушим ошибочки, выводим их в консоль, препроцессим, автопрефиксуем, собираем медиавыражения, минифицируем, переименовываем, выгружаем)
gulp.task('style:build', function(){ // Создаем таск "style"
    return gulp.src('src/less/**/*/.less') // Берем источник
    	.pipe(plumber())
        .pipe(less().on( 'error', notify.onError(
        {
            message: "<%= error.message %>",
            title  : "gulp-less Error!"
        })) // Преобразуем Less в CSS посредством gulp-less
        .pipe(concat('style.css'))
        .pipe(postcss([
					autoprefixer({browsers: [
						'last 2 version',
						'last 2 Chrome versions',
						'last 2 Firefox versions',
						'last 2 Opera versions',
						'last 2 Edge versions'
					]}),
					mqpacker({
						sort: true
				})
			]))
        .pipe(gulp.dest('src/css')) // Выгружаем результата в папку src/css
        .pipe(minify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('build/css')) // Выгружаем результата в папку app/css
        .pipe(browserSync.reload({stream: true}))) // Обновляем CSS на странице при изменении
});

// билдим html
gulp.task('html:build', function() {
   return gulp.src('src/*.html') //Выберем файлы по нужному пути
    .pipe(rigger()) //Прогоним через rigger
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build/')) //выгрузим их в папку build
    .pipe(browserSync.reload({stream: true})); // Обновляем CSS на странице при изменении
});

// проверка js на ошибки и вывод их в консоль
gulp.task('jshint:build', function() {
    return gulp.src('src/js/*.js') //выберем файлы по нужному пути
        .pipe(jshint()) //прогоним через jshint
        .pipe(jshint.reporter('jshint-stylish')); //стилизуем вывод ошибок в консоль
});

    // билдим JS
gulp.task('js:build', function () {
   return gulp.src('src/js/*.js') //Найдем наш main файл
   .pipe(plumber({ errorHandler: onError }))
   .pipe(rigger()) //Прогоним через rigger
   .pipe(concat('script.js'))
   .pipe(sourcemaps.init()) //Инициализируем sourcemap
   .pipe(uglify()) //Сожмем наш js
   .pipe(sourcemaps.write()) //Пропишем карты
   .pipe(rename({suffix: '.min'})) //добавим суффикс .min к выходному файлу
   .pipe(gulp.dest('build/js')) //выгрузим готовый файл в build
   .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

// билдим шрифты
gulp.task('fonts:build', function() {
  return gulp.src('src/fonts/**/*.*')
  .pipe(gulp.dest('build/fonts'))
  .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

// минифицируем img
gulp.task('img:build', function(err, files) {
    return gulp.src('src/img/**/*.{png,jpg,gif}') // Берем все изображения из app
        .pipe(plumber())
        .pipe(imagemin({ //Сожмем их
            optimizationLevel: 3, //степень сжатия от 0 до 7
            progressive: true, //сжатие .jpg
            interlaced: true, //сжатие .gif
            svgoPlugins: [{removeViewBox: false}], //сжатие .svg
            use: [
             imageminPngquant()
          ]
        }))
        .pipe(gulp.dest('build/img')) // Выгружаем на продакшен
        .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});


//  sprite png
gulp.task('pngSprite', function() {
    var spriteData =
        gulp.src('src/img/icons/png/*.*') // путь, откуда берем картинки для спрайта
            .pipe(spritesmith({
                imgName: 'pngSprite.png',
                cssName: '_pngSprite.less',
                cssFormat: 'less', // в каком формате выводить css
                algorithm: 'binary-tree', // алгоритм сортировки иконок в спрайте
                imgPath: 'img/icons/pngSprite.png', // путь до спрайта
                padding: 2,
                retinaSrcFilter: '*-2x.png',
                retinaImgName: 'pngSprite-2x.png',
                //cssTemplate: 'stylus.template.mustache',
                cssVarMap: function(sprite) {
                    sprite.name = 's-' + sprite.name
                }
            }))
            .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении

    spriteData.img.pipe(gulp.dest('src/img/icons/')); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('src/less/')); // путь, куда сохраняем стили
});

// add sprite retina
gulp.task('retinaSprite', function () {
  var spriteData = gulp.src('src/img/icons/png/*.png')
  .pipe(spritesmith({
    retinaSrcFilter: 'src/img/icons/png/retina/*@2x.png', // шаблон по которому ищем ретина иконки
    imgName: 'Retinaprite.png',
    retinaImgName: 'retinaSprite.png',
    cssName: '_retinaSprite.less'
  }))
  .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении

    spriteData.img.pipe(gulp.dest('src/img/icons/')); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('src/less/')); // путь, куда сохраняем стили
});

//  sprite svg

gulp.task('svgSprite', function() {
    return gulp.src('src/img/icons/svg/*.svg')
        .pipe(svgmin())
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename('svgSprite.svg'))
        .pipe(gulp.dest('src/img/icons/svg/'))
        .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

// browserSync

gulp.task('html-watch', ['html:build'], function (done) {
  browserSync.reload();
  done();
});

gulp.task('js-watch', ['js:build'], function (done) {
  browserSync.reload();
  done();
});

gulp.task('style-watch', ['style:build'], function (done) {
  browserSync.reload();
  done();
});

gulp.task('serve', ['style:build', 'html:build'], function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browserSync
        server: { // Определяем параметры сервера
            baseDir: 'src' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });

    gulp.watch('less/**/*.less', ['style-watch']);
    gulp.watch('js/*.js', ['js-watch']);
    gulp.watch('**/*.html', ['html-watch']);
});

gulp.task('build', function(fn) {
    run('copy', 'clean', 'html:build', 'jshint:build', 'js:build', 'img:build', 'style:build', 'fonts:build', 'pngSprite', 'svgSprite', 'retinaSprite', fn);
    console.log('Progect completed!');
});

// Build watcher
gulp.task('watcher',function(){
    gulp.watch('src/less/**/*.less', ['style:build']);
    gulp.watch('src/js/*.js', ['js:build']);
    gulp.watch('src/*.html', ['html:build']);
});

// clean, copy

gulp.task('clean', function() {
    return del('build'); // Удаляем папку build перед сборкой
});

gulp.task('copy', function() {
    return gulp.src([
'fonts/**/*.{woff,woff2}',
'img/**',
'js/**',
'*.html'
], {
    base: '.'
})
    .pipe(gulp.dest('build'));
});




// watchers
// gulp.task('watch', ['browser-sync', 'css-libs', 'scripts' ], function() {
//     gulp.watch('app/less/**/*.less', ['less']); // Наблюдение за sass файлами в папке sass
//     gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
//     gulp.watch('app/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
// });

// gulp.task('default', ['watch']);
// gulp.task('clear', function () {
//     return cache.clearAll();
// });


// ========================= БИБЛИОТЕКИ ===================
// gulp.task('scripts', function() {
//     return gulp.src([ // Берем все необходимые библиотеки
//         'app/libs/jquery/dist/jquery.min.js', // Берем jQuery
//         'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js' // Берем Magnific Popup
//         ])
//         .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
//         .pipe(uglify()) // Сжимаем JS файл
//         .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
// });

// gulp.task('css-libs', ['less'], function() {
//     return gulp.src('app/css/libs.css') // Выбираем файл для минификации
//         .pipe(cssnano()) // Сжимаем
//         .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
//         .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
// });
// ========================= /БИБЛИОТЕКИ ===================
