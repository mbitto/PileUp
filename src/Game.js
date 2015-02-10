define([
    'src/utils'
], function(utils) {

    "use strict";

    var Game = function Game(information, sound) {
        this.praiseMessages = ['Well done!', 'Great!', 'Good one!', 'Good!', 'Nice one!', 'Wow!'];
        this.information = information;
        this.sound = sound;
        this.startingCirclesQuantity = 3;
        this.maxCirclesPerGame = 20;
        this.maxCirclesPerTower = 7;
    };

    Game.prototype = {
        getStartingCirclesQuantity: function () {
            return this.startingCirclesQuantity;
        },

        isTowerCompleted: function (circlesNumber) {
            return circlesNumber === this.maxCirclesPerTower;
        },

        isCirclesLimitReached: function (circlesNumber) {
            return circlesNumber === this.maxCirclesPerGame;
        },

        addedCircle: function(){
            this.information.incrementCirclesCounter();
            var randomPraiseMessage = this.praiseMessages[utils.getRandomInt(0, this.praiseMessages.length - 1)];
        },

        doneTower: function (towerposition) {
            this.information.incrementTowersCounter();
            this.information.decrementCirclesCounter(this.maxCirclesPerTower);

            var randomPraiseMessage = this.praiseMessages[utils.getRandomInt(0, this.praiseMessages.length - 1)];
            this.information.displayPraiseMessage(randomPraiseMessage, '#fff', towerposition.x, towerposition.y);
            this.sound.playWin();
        },

        splittedTower: function () {
            this.sound.playSplit();
        },

        mergedTower: function () {
            this.sound.playMerge();
        },

        gameOver: function () {
            this.information.displayGameOverMessage();
        }
    };
    return Game;
});