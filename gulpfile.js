var gulp = require('gulp');
var json = require('gulp-json-editor');
var nop = require('gulp-nop');
var bump = require('gulp-bump');
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
var runSequence = require('run-sequence');
var merge = require('merge-stream');

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

gulp.task('scripts-concat-only', function () {
    return createDist(false, 'pds.js');
});

gulp.task('scripts', ['ng-config'], function() {
    return createDist(!argv.env || (argv.env == 'prd'), 'pds.min.js');
});

function createDist(minify, filename) {
    return gulp
        .src(paths.scripts)
        .pipe(minify ? nop() : sourcemaps.init())
        .pipe(minify ? (uglify().on('error', handleError)) : nop())
        .pipe(concat(filename))
        .pipe(concatUtil.header('/*! ' + pkg.name + ' - v' + pkg.version + ' - <%=new Date().toISOString()%> */ \n\n'))
        .pipe(minify ? nop() : sourcemaps.write())
        .pipe(gulp.dest(paths.dist));
}

gulp.task('vendor', function () {
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
    var env = gulp
        .src('env.json')
        .pipe(ngConfig('pds.environment', {
            environment: argv.env || 'prd',
            createModule: false,
            wrap: true,
            pretty: true
        }))
        .pipe(gulp.dest('./src/js'));
    var project = argv.project;
    var conf = gulp
        .src('config.json')
        .pipe(json(function (file) {
            file.config.pdsPathPrefix = project ? '/src/test/project/' + project : file.config.pdsPathPrefix;
            return file;
        }))
        .pipe(ngConfig('pds.environment', {
            createModule: false,
            wrap: true,
            pretty: true
        }))
        .pipe(gulp.dest('./src/js'));

    return merge(env, conf);
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

gulp.task('build', function (callback) {
    runSequence('clean', ['vendor', 'scripts-concat-only', 'scripts', 'css'])
});

gulp.task('bump', function () {
    var type = argv.type || 'prerelease';
    gulp
        .src(['./bower.json', './package.json'])
        .pipe(bump({type: type}))
        .pipe(gulp.dest('./'));
});

gulp.task('default', ['watch', 'build']);
gulp.task('serve', ['default', 'browser-sync']);
