/**
 * Handle Game Status like quantities and progresses
 *
 * @requires src/utils
 * @requires src/config
 *
 * @module src/GameStatus
 */
define([
    'src/utils',
    'src/config'
], function(utils, config) {

    "use strict";

    /**
     * @constructor
     * @param {Level} level - current level
     *
     * @alias src/GameStatus
     */
    var GameStatus = function GameStatus(level) {
        this.startingCirclesQuantity = config.STARTING_CIRCLES_QUANTITY;

        this.circlesCounter = 0;
        this.pilesCompletedCounter = 0;

        this.level = level;

        this.maxCirclesPerGame = this.level.getMaxCircles();
        this.maxCirclesPerPile = this.level.getCPT();

        this.timeTickInterval = null;
        this.timeLeft = 0;

        this.timeTickCallback;
        this.gameOverCallback;
    };


    GameStatus.prototype = {

        /**
         *
         * Initialize game status
         *
         * @param {function} timeTickCallback - callback called each game second
         * @param {function} gameOverCallback - callback called on game over
         */
        init: function (timeTickCallback, gameOverCallback) {

            this.timeTickCallback = timeTickCallback;
            this.gameOverCallback = gameOverCallback;

            this.startTimer(this.level.getTime());
        },

        /**
         * Start timer at given time
         *
         * @param timeLeft
         */
        startTimer: function (timeLeft) {
            var self = this;

            this.timeLeft = timeLeft;

            this.timeTickInterval = setInterval(function () {
                if(self.timeLeft === 0){
                    self.gameOverCallback();
                    clearInterval(self.timeTickInterval);
                }
                else{
                    self.timeTickCallback(--self.timeLeft);
                }
            }, 1000);
        },

        /**
         * Get the number of initial circles created on stage
         *
         * @returns {number}
         */
        getStartingCirclesQuantity: function () {
            return this.startingCirclesQuantity;
        },

        /**
         * Check if pile is completed
         *
         * @param {number} circlesNumber
         * @returns {boolean}
         */
        isPileCompleted: function (circlesNumber) {
            return circlesNumber === this.maxCirclesPerPile;
        },

        /**
         * Check if the maximum number of circles on stage has been reached
         *
         * @returns {boolean}
         */
        isCirclesLimitReached: function () {
            return this.circlesCounter >= this.maxCirclesPerGame;
        },

        /**
         * Update counter when a pile has been completed
         */
        pileCompleted: function () {
            this.pilesCompletedCounter++;
            this.circlesCounter = this.circlesCounter - this.maxCirclesPerPile;
        },

        /**
         * Update counter when a circle has been added
         */
        circleAdded: function(){
            this.circlesCounter++;
        },

        /**
         * Check if current level has been completed
         * @returns {boolean}
         */
        isLevelCompleted: function () {
            return this.pilesCompletedCounter === this.level.getPilesGoal();
        },

        /**
         * Get the number of piles to complete current level
         *
         * @returns {number}
         */
        getPilesGoal: function () {
            return this.level.getPilesGoal();
        },

        /**
         * Get the number of completed piles
         *
         * @returns {number}
         */
        getCompletedPilesQuantity: function () {
            return this.pilesCompletedCounter;
        },

        /**
         * Clear current level interval
         */
        clearCurrentGame: function () {
            clearInterval(this.timeTickInterval);
        },

        /**
         * Get time left
         * @returns {number}
         */
        getTimeLeft: function () {
            return this.timeLeft;
        }
    };
    return GameStatus;
});