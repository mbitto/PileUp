requirejs.config({
    baseUrl: 'bower_components',

    paths: {
        src: '../src',
        zepto: 'zepto/zepto',
        createjs: 'easeljs/lib/easeljs-0.8.0.combined',
        tweenjs: 'TweenJS/lib/tweenjs-0.6.0.combined',
        soundjs: 'SoundJS/lib/soundjs-0.6.0.combined',
        alertify: 'alertify.js/lib/alertify'
    },

    shim: {
        'zepto': {
            exports: '$'
        },
        'createjs': {
            exports: 'createjs'
        },
        'tweenjs': {
            deps: ['createjs'],
            exports: 'createjs.Tween'
        },
        'soundjs': {
            deps: ['createjs'],
            exports: 'createjs.Sound'
        }

    }
});

// Start the main app logic
requirejs([
    'createjs',
    'src/Stage',
    'src/Canvas',
    'src/Game',
    'src/Information',
    'src/Sound'
],

function(createjs, Stage, Canvas, Game, Information, Sound){

    "use strict";

    var enableTicker = true,
        htmlCanvasElement = document.getElementById('canvas'),
        canvas = new Canvas(htmlCanvasElement),
        createJSStage = new createjs.Stage(htmlCanvasElement),
        game = new Game(new Information('circlesQuantity', 'towersCompleted'), new Sound()),
        stage = new Stage(game, createJSStage, canvas.getWidth(), canvas.getHeight(), enableTicker);

    stage.start();
});
