/**
 * Game module. Handle the most high level functionalities of the game
 *
 * @module src/Game
 *
 * @requires src/CircleFactory
 * @requires src/UserInteractionManager
 * @requires src/GameStatus
 * @requires src/ScoreManager
 *
 */
define([
    'src/CircleFactory',
    'src/UserInteractionManager',
    'src/GameStatus',
    'src/ScoreManager',
    'src/UserActivityMonitor'
],function(CircleFactory, UserInteractionManager, GameStatus, ScoreManager, UserActivityMonitor){

    "use strict";

    /**
     * @constructor
     *
     * @param {Stage} stage
     * @param {LevelManager} levelManager
     * @param {GameInfo} gameInfo
     *
     * @alias src/Game
     */
    var Game = function Game(stage, levelManager, gameInfo) {
        this.circleFactory = new CircleFactory();
        this.userInteractionManager = new UserInteractionManager(this, stage);
        this.stage = stage;
        this.gameInfo = gameInfo;
        this.levelManager = levelManager;
        this.scoreManager = new ScoreManager();
        this.gameStatus = null;
        this.userActivityMonitor = new UserActivityMonitor();
    };

    Game.prototype = {

        /**
         * Remove circles in pile and update game information
         *
         * @private
         * @param {Circle} baseCircle
         *
         */
        _setPileCompleted: function (baseCircle) {
            var self = this;
            baseCircle.forEachCircleInPile(function(circle){
                self.stage.removeCircle(circle);
            });
            this.gameStatus.pileCompleted();

            var completedPilesQuantity = this.gameStatus.getCompletedPilesQuantity(),
                pilesQuantityGoal = this.gameStatus.getPilesGoal(),
                pileHeight = baseCircle.getHeight();

            this.gameInfo.setPilesCompletedCounter(completedPilesQuantity, pilesQuantityGoal);
            var pileCompletionScore = this.scoreManager.increaseScoreForPileCompletion(pileHeight);
            this.gameInfo.setUserScore(this.scoreManager.getScore());
            this.gameInfo.pileCompleted(pileCompletionScore, baseCircle.getCoordinates());
        },

        /**
         * Go to the next level and display the related message
         * @private
         *
         */
        _goToNextLevel: function () {
            var self = this;
            var nextLevelNumber = this.levelManager.getCurrentLevelNumber() + 1;
            this.pause();
            this.userActivityMonitor.stop();
            this.gameInfo.displayNextLevelMessage(nextLevelNumber, function () {
                self.gameStatus.clearCurrentGame();
                self.stage.removeAllCircles();
                self.start();
            });
        },

        /**
         * Start the game, generate starting circles, and initialize a new game status and game information
         *
         */
        start: function () {

            var self = this,
                level = this.levelManager.getNextLevel(),
                time = level.getTime(),
                cpt = level.getCPT(),
                pilesGoal = level.getPilesGoal(),
                maxCircles = level.getMaxCircles(),
                index = 1;

            this.gameStatus = new GameStatus(level);

            var startingCirclesQuantity = self.gameStatus.getStartingCirclesQuantity();

            this.gameInfo.displayInstructionMessage(time, cpt, pilesGoal, maxCircles, function () {

                self.generateCircle("up", function r(){
                    if(index < startingCirclesQuantity) {
                        self.generateCircle("up", r);
                    }
                    index++;
                });

                self.gameInfo.setUserScore(self.scoreManager.getScore());
                self.gameInfo.setPilesCompletedCounter(0, self.gameStatus.getPilesGoal());

                self.gameStatus.init(
                    // timeTickCallback
                    function (timeLeft) {
                        self.gameInfo.setTimeLeft(timeLeft);
                    },
                    // gameOverCallback
                    function () {
                        self.gameOver();
                    }
                );

                self.userActivityMonitor.init(function () {
                    self.generateCircle('right');
                });
            });
        },

        /**
         * Restart the game from level 1 cleaning up previous information
         */
        restart: function () {
            this.levelManager.setLevelNumber(1);
            this.stage.removeAllCircles();
            this.scoreManager.clearScore();
            this.start();
        },

        /**
         * Generate new circle
         *
         * @param {string} enteringSide
         * @param {function|undefined} callback - called when circle's transition has finished
         */
        generateCircle: function (enteringSide, callback) {
            var circle = this.circleFactory.createCircle(this.userInteractionManager),
                self = this;
            this.stage.addCircle(enteringSide, circle, function () {
                if (callback) {
                    callback();
                }
                self.gameStatus.circleAdded();
            });
            if (this.gameStatus.isCirclesLimitReached()) {
                this.gameOver();
            }
        },

        /**
         * Split a circles pile popping out the top circle near the pile
         *
         * @param {Circle} circle
         * @param {function} callback - called when popped out circle's transition has finished
         */
        splitPile: function (circle, callback) {

            // Find top circle id
            var baseCircle = circle.getBaseCircle(),
            // Pop out top circle
                poppedCircle = circle.pop(),
                newTopCircle = baseCircle.getTop();

            this.userActivityMonitor.activityNoticed();

            // Place circle near pile base circle
            this.stage.moveCircleCloseTo(poppedCircle, baseCircle, callback);
            var score = this.scoreManager.decreaseScore(poppedCircle.getPlaceNumber(), newTopCircle.getPlaceNumber());
            this.gameInfo.setUserScore(this.scoreManager.getScore());
            this.gameInfo.pileSplitted(score, baseCircle.getCoordinates());
        },

        /**
         * Merge single circles or circle piles
         *
         * @param {Circle} baseCircle - the steady circle (or circles pile) where the moving circle is being merged into
         * @param {Circle} movingCircle - the moving circle to merge
         */
        mergeCircles: function (baseCircle, movingCircle) {
            var baseCircleTop = baseCircle.getTop(),
                movingCircleBase = movingCircle.getBaseCircle();

            this.userActivityMonitor.activityNoticed();

            var score = this.scoreManager.increaseScore(movingCircleBase.getPlaceNumber(), baseCircleTop.getPlaceNumber());

            this.gameInfo.setUserScore(this.scoreManager.getScore());

            baseCircle.mergeWith(movingCircle);

            this.gameInfo.circlesMerged(score, baseCircle.getCoordinates());

            if(this.gameStatus.isPileCompleted(baseCircle.getHeight())){
                this._setPileCompleted(baseCircle);
                if(this.gameStatus.isLevelCompleted()){
                    this._goToNextLevel();
                }
            }
        },

        /**
         * Set game over. Save new high score if necessary and restart the game
         */
        gameOver: function () {
            var self = this,
                score = this.scoreManager.getScore(),
                highScore = this.scoreManager.getStoredHighScore(),
                newHighScore = score > highScore;

            this.gameStatus.clearCurrentGame();
            this.userActivityMonitor.stop();

            if(newHighScore){
                this.scoreManager.storeNewHighScore(score);
            }

            this.gameInfo.displayGameOverMessage(score, highScore, newHighScore, function () {
                self.restart();
            });
        },

        /**
         * Pause the game
         */
        pause: function () {
            this.gameStatus.clearCurrentGame();
        },

        /**
         * Resume the game
         */
        resume: function () {
            this.gameStatus.startTimer(this.gameStatus.getTimeLeft());
        }

    };

    return Game;
});
