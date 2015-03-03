var gulp = require('gulp'),
    execsyncs = require('gulp-execsyncs'),
    sequence = require('run-sequence'),
    del = require('del'),
    clean = require('gulp-clean'),
    inject = require('gulp-inject-string'),
    karma = require('karma').server;

gulp.task('requirejs-build', function(){
    return execsyncs({
        cmd : 'node r.js -o build.js',
        callback  : function(res){
            console.log(res);
        }
    });
});

gulp.task('copy', function(){
    return gulp.src([
        'assets/*',
        'img/*',
        'index.html',
        'style.css',
        'bower_components/alertify.js/themes/alertify.default.css',
        'bower_components/alertify.js/themes/alertify.core.css',
        'bower_components/requirejs/require.js'
    ], { base: './' })
        .pipe(gulp.dest('dist/pileup/www'));
});

gulp.task('copy-build', function(){
    //return gulp.src(['build/main.js', 'build/main.js.map'])
    return gulp.src(['build/main.js'])
        .pipe(gulp.dest('dist/pileup/www'));
});

gulp.task('delete-build', function () {
    return gulp.src('build', {read: false})
        .pipe(clean());
});

gulp.task('test', function (done) {
    return karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('inject-mobile-scripts', function(){
    return gulp.src('./dist/pileup/www/index.html')
        .pipe(inject.after('<!-- inject-mobile-scirpts -->',
            '\n<script type="text/javascript" src="cordova.js"></script>' +
            '\n<script type="text/javascript" src="js/index.js"></script>' +
            '\n<script type="text/javascript">app.initialize();</script>'
        ))
        .pipe(gulp.dest('./dist/pileup/www/'));
});

gulp.task('phonegap-build', function () {
    return execsyncs({
        cmd : 'cd dist/pileup; phonegap run android --verbose',
        callback  : function(res){
            console.log(res);
        }
    });
});

gulp.task('clean', function (cb) {
    del([
        'dist/pileup/www/main.js',
        'dist/pileup/www/main.js.map',
        'dist/pileup/www/assets',
        'dist/pileup/www/bower_components',
        'dist/pileup/www/style.css',
        'dist/pileup/www/index.html',
    ], cb);
});

gulp.task('default', function () {
    sequence('test', ['requirejs-build', 'copy'], 'copy-build', 'delete-build',
        'inject-mobile-scripts', 'phonegap-build', 'clean');
});