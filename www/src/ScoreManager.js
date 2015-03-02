/**
 * Handle user score defining the points given to each merge and pile completion
 *
 * @module src/ScoreManager
 */
define(function(){

    /**
     *
     * @constructor
     * @alias src/ScoreManager
     *
     */
    var ScoreManager = function ScoreManager() {
        this.userScore = 0;
        // User scores based on distance between circle.place of merged circles
        this.scores = {
            1: 100,
            2: 50,
            3: 30,
            4: 20,
            5: 10,
            6: 5
        };
        // Key used by localStorage to store high score
        this.localStorageKey = 'circles_game_high_score';
    };

    ScoreManager.prototype = {
        /**
         * Increase user score after a merge
         *
         * @param {number} position1
         * @param {number} position2
         * @returns {number} increased score
         */
        increaseScore: function (position1, position2) {
            var score = this.scores[position1 - position2] || 0;
            this.userScore += score;
            return score;
        },

        /**
         * Increase user score after a pile completion
         *
         * @param {number} pileHeight
         * @returns {number} increased score
         */
        increaseScoreForPileCompletion: function (pileHeight) {
            var score = 100 * pileHeight;
            this.userScore += score;
            return score;
        },

        /**
         * Decrease user score after a split
         *
         * @param {number} position1
         * @param {number} position2
         * @returns {number} decreased score
         */
        decreaseScore: function (position1, position2) {
            var score = -((this.scores[position1 - position2]) * 2);
            this.userScore += score;
            this.userScore = this.userScore >= 0 ? this.userScore : 0;
            return score;
        },

        /**
         * Get user's total score
         *
         * @returns {number}
         */
        getScore: function () {
            return this.userScore;
        },

        /**
         * Clear user's score
         *
         */
        clearScore: function () {
            this.userScore = 0;
        },

        /**
         * Store a new high score
         *
         * @param score
         */
        storeNewHighScore: function (score) {
            window.localStorage.setItem(this.localStorageKey, score);
        },

        /**
         * Get user's high score
         *
         * @returns {number}
         */
        getStoredHighScore: function () {
            return window.localStorage.getItem(this.localStorageKey) || 0;
        }
    };

    return ScoreManager;
});
