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
    'src/DeviceEventManager',
    'src/LevelManager',
    'src/GameInfo',
    'src/Sound',
    'src/config',
    'src/utils'
],

function(createjs, tweenjs, Stage, Game, Canvas, GameStatus, DeviceEventManager, LevelManager, GameInfo, Sound,
         config, utils){

    "use strict";

    var htmlCanvasElement = document.querySelector('#canvas'),
        canvas = new Canvas(htmlCanvasElement),
        createJSStage = new createjs.Stage(htmlCanvasElement),
        deviceEventManager = new DeviceEventManager(),
        levelManager = new LevelManager(),
        sound = new Sound(),
        gameInfo = new GameInfo(sound),
        stage = new Stage(createJSStage, canvas.getWidth(), canvas.getHeight()),
        game = new Game(stage, levelManager, gameInfo),
        fps = utils.isCordovaApp() ? 30 : utils.isMobileDevice() ? 45 : 60;

    createjs.Touch.enable(createJSStage);
    createjs.Ticker.setFPS(fps);
    createjs.Ticker.addEventListener('tick', createJSStage);

    console.log("FPS: " + fps);

    deviceEventManager.onMenu(function () {
        if(!game.isPaused()){
            game.pause();
            gameInfo.displayResetMessage(
                function () {
                    game.restart();
                },
                function () {
                    game.resume();
                }
            );
        }
    });

    setTimeout(function () {
        game.start();
    }, 500);

});
