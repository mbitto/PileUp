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
    'src/ScoreManager'
],function(CircleFactory, UserInteractionManager, GameStatus, ScoreManager){

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
    };

    Game.prototype = {

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
                maxCircles = level.getMaxCircles();

            this.gameStatus = new GameStatus(level);
            this.gameInfo.displayInstructionMessage(time, cpt, pilesGoal, maxCircles, function () {

                console.log("Starting level: " + self.levelManager.getCurrentLevelNumber());

                var startingCirclesQuantity = self.gameStatus.getStartingCirclesQuantity(),
                    index = 1;

                self.generateCircle("up", function r(){
                    if(index < startingCirclesQuantity) {
                        self.generateCircle("up", r);
                    }
                    index++;
                });

                self.gameInfo.setUserScore(self.scoreManager.getScore());
                self.gameInfo.setPilesCompletedCounter(0, self.gameStatus.getPilesGoal());

                self.gameStatus.start(
                    function (timeLeft) {
                        self.gameInfo.setTimeLeft(timeLeft);
                    },
                    function () {
                        self.gameOver();
                    }
                );
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
         * @param {function} callback - called when circle's transition has finished
         */
        generateCircle: function (enteringSide, callback) {
            var circle = this.circleFactory.createCircle(this.userInteractionManager),
                self = this;
            this.stage.addCircle(enteringSide, circle, function () {
                if(callback){
                    callback();
                }
                self.gameStatus.circleAdded();
            });
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
            var self = this,
                baseCircleTop = baseCircle.getTop(),
                movingCircleBase = movingCircle.getBaseCircle();

            var score = this.scoreManager.increaseScore(movingCircleBase.getPlaceNumber(), baseCircleTop.getPlaceNumber());

            this.gameInfo.setUserScore(this.scoreManager.getScore());

            baseCircle.mergeWith(movingCircle);
            this.gameInfo.circlesMerged(score, baseCircle.getCoordinates());

            if(this.gameStatus.isCirclesLimitReached()){
                this.gameOver();
            }
            else if(this.gameStatus.isPileCompleted(baseCircle.getHeight())){
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

                if(this.gameStatus.isLevelCompleted()){
                    var nextLevelNumber = this.levelManager.getCurrentLevelNumber() + 1;
                    this.gameInfo.displayNextLevelMessage(nextLevelNumber, function () {
                        self.gameStatus.clearCurrentGame();
                        self.stage.removeAllCircles();
                        self.start();
                    });
                }
                else if(self.stage.getChildrenNumber() <= 1){
                    // Launch circle from right after 3 secs
                    setTimeout(function () {
                        self.generateCircle("right");
                    }, 3000);
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

            if(newHighScore){
                this.scoreManager.storeNewHighScore(score);
            }

            this.gameInfo.displayGameOverMessage(score, highScore, newHighScore, function () {
                self.restart();
            });
        }

    };

    return Game;
});
