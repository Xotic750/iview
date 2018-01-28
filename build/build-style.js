const gulp = require('gulp');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const cssnext = require('postcss-cssnext');
const cssimport = require('postcss-import');
const less = require('gulp-less');
const rename = require('gulp-rename');
const resolve = require('./resolve');

// 编译less
gulp.task('css', () => {
    gulp.src(resolve('/src/styles/index.less'))
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(postcss([
            autoprefixer(),
            cssnano(),
            cssnext(),
            cssimport(),
        ]))
        .pipe(rename('iview.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(resolve('dist/styles')));
});

// 拷贝字体文件
gulp.task('fonts', () => {
    gulp.src(resolve('src/styles/common/iconfont/fonts/*.*'))
        .pipe(gulp.dest(resolve('dist/styles/fonts')));
});

gulp.task('default', ['css', 'fonts']);
