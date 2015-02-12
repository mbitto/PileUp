define([
    'src/utils'
], function(utils) {

    "use strict";

    var GameInfo = function GameInfo(information, sound) {
        this.praiseMessages = ['Well done!', 'Great!', 'Good one!', 'Good!', 'Nice one!', 'Wow!'];
        this.information = information;
        this.sound = sound;
        this.startingCirclesQuantity = 3;
        this.maxCirclesPerGame = 20;
        this.maxCirclesPerTower = 7;
    };

    GameInfo.prototype = {
        getStartingCirclesQuantity: function () {
            return this.startingCirclesQuantity;
        },

        isTowerCompleted: function (circlesNumber) {
            return circlesNumber === this.maxCirclesPerTower;
        },

        isCirclesLimitReached: function () {
            return this.information.getCirclesCount() === this.maxCirclesPerGame;
        },

        addedCircle: function(){
            this.information.incrementCirclesCounter();
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

        mergedCircles: function () {
            this.sound.playMerge();
        },

        gameOver: function () {
            this.information.displayGameOverMessage();
        }
    };
    return GameInfo;
});