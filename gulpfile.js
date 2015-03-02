var gulp = require('gulp'),
    execsyncs = require('gulp-execsyncs'),
    sequence = require('run-sequence'),
    del = require('del'),
    clean = require('gulp-clean');

gulp.task('requirejs-build', function(){
    return execsyncs({
        cmd : 'node r.js -o build.js'
    });
});

gulp.task('copy', function(){
    return gulp.src(['assets/*', 'img/*', 'index.html'], { base: './' })
        .pipe(gulp.dest('mobile-app/www'));
});

gulp.task('copy-build', function(){
    //return gulp.src(['build/main.js', 'build/main.js.map'])
    return gulp.src(['build/main.js'])
        .pipe(gulp.dest('mobile-app/www'));
});

gulp.task('delete-build', function () {
    return gulp.src('build', {read: false})
        .pipe(clean());
});

gulp.task('default', function () {
    sequence(['requirejs-build', 'copy'], 'copy-build', 'delete-build');
});

gulp.task('clean', function (cb) {
    del([
        'mobile-app/www/main.js',
        'mobile-app/www/main.js.map',
        'mobile-app/www/assets',
        'mobile-app/www/index.html'
    ], cb);
});