/**
 * Handle creation of new levels and keep track of actual level
 *
 * @requires src/Level
 *
 * @module src/LevelManager
 */
define([
    'src/Level'
], function (Level) {

    "use strict";

    /**
     * @constructor
     *
     * @alias src/LevelManager
     */
    var LevelManager = function LevelManager() {
        this.currentLevel = 0;
        // Levels features
        this.levels = [
            {time: 60, cpt: 3, pilesGoal: 3, maxCircles: 10},
            {time: 60, cpt: 3, pilesGoal: 4, maxCircles: 10},
            {time: 55, cpt: 4, pilesGoal: 3, maxCircles: 10},
            {time: 55, cpt: 4, pilesGoal: 4, maxCircles: 15},
            {time: 50, cpt: 5, pilesGoal: 3, maxCircles: 15},
            {time: 50, cpt: 5, pilesGoal: 4, maxCircles: 20},
            {time: 50, cpt: 6, pilesGoal: 3, maxCircles: 20},
            {time: 45, cpt: 6, pilesGoal: 4, maxCircles: 20},
            {time: 45, cpt: 7, pilesGoal: 3, maxCircles: 20},
            {time: 45, cpt: 7, pilesGoal: 4, maxCircles: 20}
        ];
    };

    LevelManager.prototype = {

        /**
         * Get the current level number
         *
         * @returns {number}
         */
        getCurrentLevelNumber: function () {
            return this.currentLevel;
        },

        /**
         * Get next level
         *
         * @returns {Level}
         */
        getNextLevel: function () {
            this.currentLevel++;
            var levelData = this.levels[this.currentLevel - 1];
            return new Level(levelData.time, levelData.cpt, levelData.pilesGoal, levelData.maxCircles);
        },

        /**
         * Set level number
         *
         * @param number
         */
        setLevelNumber: function (number) {
            this.currentLevel = number - 1;
        },

        isFinalLevel: function () {
            return this.currentLevel == this.levels.length;
        }
    };

    return LevelManager;
});