define(function(){

    var ScoreManager = function ScoreManager() {
        this.userScore = 0;
        this.scores = {
            1: 100,
            2: 50,
            3: 30,
            4: 20,
            5: 10,
            6: 5
        };
        this.localStorageKey = 'circles_game_high_score';
    };

    ScoreManager.prototype = {
        increaseScore: function (position1, position2) {
            var score = this.scores[position1 - position2];
            this.userScore += score;
            return score;
        },

        increaseScoreForTowerCompletion: function (towerHeight) {
            var score = 100 * towerHeight;
            this.userScore += score;
            return score;
        },

        decreaseScore: function (position1, position2) {
            var score = -((this.scores[position1 - position2]) * 2);
            this.userScore += score;
            this.userScore = this.userScore >= 0 ? this.userScore : 0;
            return score;
        },

        getScore: function () {
            return this.userScore;
        },

        getStoredHighScore: function () {
            return window.localStorage.getItem(this.localStorageKey);
        },

        storeNewHighScore: function (score) {
            window.localStorage.setItem(this.localStorageKey, score);
        }
    };

    return ScoreManager;
});
