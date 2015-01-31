requirejs.config({
    baseUrl: 'bower_components',

    paths: {
        src: '../src',
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
        'soundjs': {
            deps: ['createjs'],
            exports: 'createjs.Sound'
        }
    }
});

// Start the main app logic.
requirejs([
    'src/Stage',
    'src/Canvas'
],

function(Stage, Canvas){

    "use strict";

    var canvas = new Canvas(document.getElementById('canvas')),
        stage = new Stage(canvas);

    stage.start();
});
