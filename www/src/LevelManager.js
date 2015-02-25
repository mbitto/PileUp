define([
    'src/Level'
], function (Level) {

    "use strict";

    var LevelManager = function LevelManager() {
        this.currentLevel = 0;
        this.levels = [
            {time: 60, cpt: 3, towersGoal: 3, maxCircles: 10},
            {time: 45, cpt: 3, towersGoal: 3, maxCircles: 10},
            {time: 45, cpt: 4, towersGoal: 3, maxCircles: 10}
        ];
    };

    LevelManager.prototype = {

        getCurrentLevelNumber: function () {
            return this.currentLevel;
        },

        getNextLevel: function () {
            this.currentLevel++;
            var levelData = this.levels[this.currentLevel - 1];
            return new Level(levelData.time, levelData.cpt, levelData.towersGoal, levelData.maxCircles);
        },

        setLevelNumber: function (number) {
            this.currentLevel = number - 1;
        }
    };

    return LevelManager;
});