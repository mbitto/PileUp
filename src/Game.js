define(function() {

    "use strict";

    var Game = function Game(information, sound) {
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
        },

        doneTower: function () {
            this.information.incrementTowersCounter();
            this.information.decrementCirclesCounter(this.maxCirclesPerTower);
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