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
    'tweenjs',
    'src/Stage',
    'src/Game',
    'src/Canvas',
    'src/GameInfo',
    'src/Information',
    'src/Sound'
],

function(createjs, tweenjs, Stage, Game, Canvas, GameInfo, Information, Sound){

    "use strict";

    var htmlCanvasElement = document.getElementById('canvas'),
        canvas = new Canvas(htmlCanvasElement),
        createJSStage = new createjs.Stage(htmlCanvasElement),
        gameInfo = new GameInfo(new Information('circlesQuantity', 'towersCompleted'), new Sound()),
        stage = new Stage(createJSStage, canvas.getWidth(), canvas.getHeight()),
        game = new Game(stage, gameInfo);

    createjs.Touch.enable(createJSStage);
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", createJSStage);

    game.start();
});
