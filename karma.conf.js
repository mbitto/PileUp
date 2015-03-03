// Karma configuration
// Generated on Thu Jan 22 2015 19:22:31 GMT+0100 (CET)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['requirejs', 'mocha', 'chai'],


        // list of files / patterns to load in the browser
        files: [
            'test/test-main.js',
            {pattern: 'bower_components/**/*.js', included: false},
            {pattern: 'src/**/*.js', included: false},
            {pattern: 'test/**/*.js', included: false}
        ],

        // list of files to exclude
        exclude: [
            'main.js'
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/**/*.js': ['coverage']
        },

        reporters: ['mocha'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        customLaunchers: {
            Chrome_small: {
                base: 'Chrome',
                flags: ['--window-size=100,100', '--window-position=0,0']
            }
        },

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome_small'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
