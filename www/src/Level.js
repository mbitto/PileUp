define(function () {

    "use strict";

    var Level = function Level(time, cpt, towersGoal, maxCircles) {
        this.time = time;
        this.circlesPerTower = cpt;
        this.towersGoal = towersGoal;
        this.maxCircles = maxCircles;
    };

    Level.prototype = {
        getTime: function () {
            return this.time;
        },

        getCPT: function () {
            return this.circlesPerTower;
        },

        getTowersGoal: function () {
            return this.towersGoal;
        },

        getMaxCircles: function () {
            return this.maxCircles;
        }
    };

    return Level;
});