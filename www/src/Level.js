/**
 * Represent a game level
 *
 * @module src/Level
 */
define(function () {

    "use strict";

    /**
     * @constructor
     *
     * @param {number} time
     * @param {number} cpt
     * @param {number} pilesGoal
     * @param {number} maxCircles
     *
     * @alias src/Level
     */
    var Level = function Level(time, cpt, pilesGoal, maxCircles) {
        this.time = time;
        this.circlesPerPile = cpt;
        this.pilesGoal = pilesGoal;
        this.maxCircles = maxCircles;
    };

    Level.prototype = {
        /**
         * Maximum time to complete this level
         *
         * @returns {number}
         */
        getTime: function () {
            return this.time;
        },

        /**
         * Number of circles to complete a pile
         *
         * @returns {number}
         */
        getCPT: function () {
            return this.circlesPerPile;
        },

        /**
         * Number of piles needed to complete this level
         *
         * @returns {number}
         */
        getPilesGoal: function () {
            return this.pilesGoal;
        },

        /**
         * Maximum number of circles allowed on stage
         *
         * @returns {number}
         */
        getMaxCircles: function () {
            return this.maxCircles;
        }
    };

    return Level;
});