define(function() {

    "use strict";

    var LevelManager = function LevelManager() {
        this.startingCirclesQuantity = 3;
        this.maxCirclesPerGame = 100;
        this.maxCirclesPerTower = 3;
    };

    LevelManager.prototype = {
        getStartingCirclesQuantity: function () {
            return this.startingCirclesQuantity;
        },

        getMaxCirclesPerTower: function () {
            return this.maxCirclesPerTower;
        },

        getMaxCirclesPerGame: function () {
            return this.maxCirclesPerGame;
        }
    };
    return LevelManager;
});