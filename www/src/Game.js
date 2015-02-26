define([
    'src/CircleFactory',
    'src/UserInteractionManager',
    'src/GameStatus',
    'src/ScoreManager'
],function(CircleFactory, UserInteractionManager, GameStatus, ScoreManager){

    "use strict";

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
        start: function () {

            var self = this,
                level = this.levelManager.getNextLevel(),
                time = level.getTime(),
                cpt = level.getCPT(),
                towersGoal = level.getTowersGoal(),
                maxCircles = level.getMaxCircles();

            this.gameStatus = new GameStatus(level);
            this.gameInfo.displayInstructionMessage(time, cpt, towersGoal, maxCircles, function () {

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
                self.gameInfo.setTowersCompletedCounter(0, self.gameStatus.getTowersGoal());

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

        restart: function () {
            this.levelManager.setLevelNumber(1);
            this.stage.removeAllCircles();
            this.scoreManager.clearScore();
            this.start();
        },

        generateCircle: function (initialPosition, callback) {
            var circle = this.circleFactory.createCircle(this.userInteractionManager),
                self = this;
            this.stage.addCircle(initialPosition, circle, function () {
                if(callback){
                    callback();
                }
                self.gameStatus.circleAdded();
            });
        },

        splitTower: function (circle, callback) {

            // Find top circle id
            var baseCircle = circle.getBaseCircle(),
            // Pop out top circle
                poppedCircle = circle.pop(),
                newTopCircle = baseCircle.getTop();

            // Place circle near tower base circle
            this.stage.moveCircleCloseTo(poppedCircle, baseCircle, callback);
            var score = this.scoreManager.decreaseScore(poppedCircle.getPlaceNumber(), newTopCircle.getPlaceNumber());
            this.gameInfo.setUserScore(this.scoreManager.getScore());
            this.gameInfo.towerSplitted(score, baseCircle.getCoordinates());
        },
        
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
            else if(this.gameStatus.isTowerCompleted(baseCircle.getHeight())){
                baseCircle.forEachCircleInTower(function(circle){
                    self.stage.removeCircle(circle);
                });
                this.gameStatus.towerCompleted();

                var completedTowersQuantity = this.gameStatus.getCompletedTowersQuantity(),
                    towersQuantityGoal = this.gameStatus.getTowersGoal(),
                    towerHeight = baseCircle.getHeight();

                this.gameInfo.setTowersCompletedCounter(completedTowersQuantity, towersQuantityGoal);
                var towerCompletionScore = this.scoreManager.increaseScoreForTowerCompletion(towerHeight);
                this.gameInfo.setUserScore(this.scoreManager.getScore());
                this.gameInfo.towerCompleted(towerCompletionScore, baseCircle.getCoordinates());


                if(this.gameStatus.isLevelCompleted()){
                    var nextLevelNumber = this.levelManager.getCurrentLevelNumber() + 1;
                    this.gameInfo.displayNextLevelMessage(nextLevelNumber, function () {
                        self.gameStatus.clearCurrentGame();
                        self.stage.removeAllCircles();
                        self.start();
                    });
                }
            }
        },

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
