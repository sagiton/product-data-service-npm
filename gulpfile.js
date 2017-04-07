var gulp = require('gulp');
var nop = require('gulp-nop');
var concat = require('gulp-concat');
var concatUtil = require('gulp-concat-util');
var browserSync = require('browser-sync');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var pkg = require('./package.json');
var bowerLibs = require('gulp-main-bower-files');
var ngConfig = require('gulp-ng-config');
var argv = require('yargs').argv;
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');

var paths = {
    build: './',
    scripts: ['./src/js/**/*.js'],
    dist: './dist/js'
};

var pathsCss = {
    css: ['_res/css/**/*.css'],
    dist: '_res/dist/css'
};

var handleError = function (e) {
    console.log(e);
    this.emit('end')
};

gulp.task('clean', function() {
    return del(['./dist']);
});

gulp.task('css', function() {
    return gulp.src(pathsCss.css)
        .pipe(cleanCss({compatibility: 'ie8'}))
        .pipe(autoprefixer())
        .pipe(csso())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(pathsCss.dist));
});

gulp.task('scripts', ['clean', 'ng-config'], function() {
    var isPrd = !argv.env || (argv.env == 'prd');
    return gulp
        .src(paths.scripts)
        .pipe(isPrd ? nop() : sourcemaps.init())
        .pipe(isPrd ? (uglify().on('error', handleError)) : nop())
        .pipe(concat('pds.min.js'))
        .pipe(concatUtil.header('/*! ' + pkg.name + ' - v' + pkg.version + ' - <%=new Date().toISOString()%> */ \n\n'))
        .pipe(isPrd ? nop() : sourcemaps.write())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('vendor', ['clean'], function () {
    return gulp
        .src('./bower.json')
        .pipe(bowerLibs({
            overrides: {
                "angular-datatables": {
                    main: ['dist/angular-datatables.min.js']
                },
                "slick-carousel": {
                    main: ['slick/slick.js']
                },
                "bootstrap": {
                    main: ['dist/js/bootstrap.js']
                },
                "angular-img-fallback": {
                    main: ['angular.dcb-img-fallback.min.js']
                },
                "angular-jsonld": {
                    main: ['src/angular-jsonld.module.js', 'src/directives/angular-jsonld.directive.js']
                }
            }
        }))
        .pipe(uglify().on('error', handleError))
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest(paths.dist))
});

gulp.task('ng-config', function () {
    gulp
        .src('config.json')
        .pipe(ngConfig('pds.environment', {
            environment: argv.env || 'prd',
            createModule: false,
            wrap: true,
            pretty: true
        }))
        .pipe(gulp.dest('./src/js'));
});

gulp.task('watch', function() {
    gulp.watch(['config.json'], ['scripts']);
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(pathsCss.css, ['css']);
});

gulp.task('browser-sync', function() {
    return browserSync({
        server: {
            baseDir: paths.build,
            directory: true
        },
        port: 4000,
        notify: false,
        open: false,
        files: [
            paths.build + '**/*'
        ]
    });
});

gulp.task('build', ['ng-config', 'vendor', 'scripts', 'css']);
gulp.task('default', ['watch', 'build']);
gulp.task('serve', ['default', 'browser-sync']);
