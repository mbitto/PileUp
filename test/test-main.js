var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/test\.js$/.test(file)) {
            tests.push(file);
        }
    }
}

requirejs.config({

    baseUrl: '/base/bower_components',

    paths: {
        src: '../src',
        Squire: 'squire/src/Squire',
        sinon: 'sinonjs/sinon',
        zepto: 'zepto/zepto',
        createjs: 'easeljs/lib/easeljs-0.8.0.combined',
        soundjs: 'SoundJS/lib/soundjs-0.6.0.combined'
    },

    shim: {
        'zepto': {
            exports: '$'
        },
        'createjs': {
            exports: 'createjs'
        },
        'sinon': {
            exports: 'sinon'
        },
        'soundjs': {
            deps: ['createjs'],
            exports: 'createjs.Sound'
        }
    },

    // ask Require.js to load these files (all our tests)
    deps: tests

    // I use the bottom following require function to start test run, it will wait also for squire.js
    // callback: window.__karma__.start
});

// FIXME: timeout should be removed. The problem is that without it squire requires are not called
require(tests, function () {
    // start test run, once Require.js is done
    window.__karma__.start();
});

