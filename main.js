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
    'src/GameStatus',
    'src/LevelManager',
    'src/GameInfo',
    'src/Sound',
    'src/config'
],

function(createjs, tweenjs, Stage, Game, Canvas, GameStatus, LevelManager, GameInfo, Sound, config){

    "use strict";

    var htmlCanvasElement = document.querySelector('#canvas'),
        canvas = new Canvas(htmlCanvasElement),
        createJSStage = new createjs.Stage(htmlCanvasElement),
        levelManager = new LevelManager(),
        sound = new Sound(),
        gameInfo = new GameInfo(sound),
        stage = new Stage(createJSStage, canvas.getWidth(), canvas.getHeight()),
        game = new Game(stage, levelManager, gameInfo);

    createjs.Touch.enable(createJSStage);
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener('tick', createJSStage);

    setTimeout(function(){
        document.querySelector('.splash').style.display = 'none';
        setTimeout(function () {
            game.start();
        }, 1000);
    }, config.SPLASH_SCREEN_DURATION);
});
