// including plugins
var gulp = require('gulp'), 
uglify = require("gulp-uglify"), 
gutil = require('gulp-util'), 
concat = require('gulp-concat'), 
minifyCss = require("gulp-minify-css"),
fs = require('fs'),
header = require("gulp-header");

var scripts = ['./src/vue-editable.js'];

var styles = ['./src/vue-editable.css'];

var getCopyright = function () {
    return fs.readFileSync('./LICENSE_HEADER.txt');
};

gulp.task('build', function () {
    gulp.src(scripts) 
    .pipe(uglify())
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(concat('vue-editable.min.js'))
    .pipe(header(getCopyright()))
    .pipe(gulp.dest('dist'));
    gulp.src(styles) 
    .pipe(minifyCss())
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(concat('vue-editable.min.css'))
    .pipe(header(getCopyright()))
    .pipe(gulp.dest('dist'));   
});
