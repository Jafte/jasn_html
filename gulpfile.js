// Include Gulp
var gulp = require('gulp');

// Include plugins
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files', 'browser-sync', 'imagemin-pngquant', 'rimraf'],
    replaceString: /\bgulp[\-.]/
});

var path = {
    build: {
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/main.js',
        style: 'src/css/main.scss',
        img: 'src/img/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/css/**/*.scss',
        img: 'src/img/**/*.*'
    },
    clean: './dist'
};

var config = {
    server: {
        baseDir: "./dist"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};

gulp.task('html', function () {
    gulp.src(path.src.html)
        .pipe(plugins.rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(plugins.browserSync.reload({stream: true}));
});

gulp.task('js', function () {
    gulp.src(path.src.js)
        .pipe(plugins.rigger())
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.uglify())
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(plugins.browserSync.reload({stream: true}));
});

gulp.task('css', function () {
    gulp.src(path.src.style)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass())
        .pipe(plugins.minifyCss())
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(plugins.browserSync.reload({stream: true}));
});

gulp.task('image', function () {
    gulp.src(path.src.img)
        .pipe(plugins.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [plugins.imageminPngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(plugins.browserSync.reload({stream: true}));
});

gulp.task('build', [
    'html',
    'js',
    'css',
    'image'
]);

gulp.task('watch', function(){
    plugins.watch([path.watch.html], function(event, cb) {
        gulp.start('html');
    });
    plugins.watch([path.watch.style], function(event, cb) {
        gulp.start('css');
    });
    plugins.watch([path.watch.js], function(event, cb) {
        gulp.start('js');
    });
    plugins.watch([path.watch.img], function(event, cb) {
        gulp.start('image');
    });
});

gulp.task('webserver', function () {
    plugins.browserSync(config);
});

gulp.task('clean', function (cb) {
    plugins.rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);