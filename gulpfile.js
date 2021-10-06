const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const image = require('gulp-image');
const rename = require("gulp-rename");
const del = require('del');
const browserSync = require('browser-sync').create();

const paths = {
    html: {
        src: 'src/*.html',
        dest: 'build'
    },
    styles: {
        src: 'src/style/**/*.scss',
        dest: 'build/css'
    },
    scripts: {
        src: 'src/js/**/*.js',
        dest: 'build/scripts'
    },
    images: {
        src: 'src/images/*.*',
        dest: 'build/images'
    }
}


function html() { //to folder src .html
    return gulp.src(paths.html.src)
        .pipe(gulp.dest(paths.html.dest)) 
}

function styles() {
    return gulp.src(paths.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min'}))
    .pipe(gulp.dest(paths.styles.dest))
};

function scripts() { 
    return gulp.src(paths.scripts.src)
        .pipe(concat('main.min.js')) 
        .pipe(uglify()) 
        .pipe(gulp.dest(paths.scripts.dest)) 

    }
function images() { 
    return gulp.src(paths.images.src)
        .pipe(image()) 
        .pipe(gulp.dest(paths.images.dest)) 
}

function browser(){
    browserSync.init({
        server: {
            baseDir: './build'
        },
        port: 3000
    })
    browserSync.watch('build',  browserSync.reload)
}

function deleteBuild(cb) {
    return del('build/**/*.*').then(() => { cb() })
}


function watch() {  //провіряє чи щось змінилось
    gulp.watch(paths.html.src, html)
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.scripts.src, scripts)
    gulp.watch(paths.images.src, images)
    
}


const build = gulp.series(deleteBuild, gulp.parallel(html, styles, scripts, images)) // запускає паралельно всі ф-ї


gulp.task('build', build);

gulp.task('default', gulp.parallel(watch, build, browser));

