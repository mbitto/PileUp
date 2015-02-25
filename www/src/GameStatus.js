define([
    'src/utils',
    'src/config'
], function(utils, config) {

    "use strict";

    var gameStatus = function gameStatus(level) {
        this.startingCirclesQuantity = config.STARTING_CIRCLES_QUANTITY;

        this.circlesCounter = 0;
        this.towersCompletedCounter = 0;

        this.level = level;

        this.maxCirclesPerGame = this.level.getMaxCircles();
        this.maxCirclesPerTower = this.level.getCPT();
        this.timeTickInterval = null;
    };

    gameStatus.prototype = {
        start: function (timeTickCallback, gameOverCallback) {

            var timeLeft = this.level.getTime(),
                self = this;

            this.timeTickInterval = setInterval(function () {
                if(timeLeft === 0){
                    gameOverCallback();
                    clearInterval(self.timeTickInterval);
                }
                else{
                    timeTickCallback(--timeLeft);
                }
            }, 1000);
        },

        getStartingCirclesQuantity: function () {
            return this.startingCirclesQuantity;
        },

        isTowerCompleted: function (circlesNumber) {
            return circlesNumber === this.maxCirclesPerTower;
        },

        isCirclesLimitReached: function () {
            console.log("Circles count: " + this.circlesCounter  + "/" + this.maxCirclesPerGame);
            return this.circlesCounter === this.maxCirclesPerGame;
        },

        towerCompleted: function () {
            this.towersCompletedCounter++;
            this.circlesCounter = this.circlesCounter - this.maxCirclesPerTower;
        },

        circleAdded: function(){
            this.circlesCounter++;
        },

        isLevelCompleted: function () {
            return this.towersCompletedCounter === this.level.getTowersGoal();
        },

        getCirclesQuantity: function () {
            return this.circlesCounter;
        },

        getTowersGoal: function () {
            return this.level.getTowersGoal();
        },

        getCompletedTowersQuantity: function () {
            return this.towersCompletedCounter;
        },

        clearCurrentGame: function () {
            clearInterval(this.timeTickInterval);
        }
    };
    return gameStatus;
});