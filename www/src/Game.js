define([
    'src/CircleFactory',
    'src/UserInteractionManager',
    'src/GameStatus'
],function(CircleFactory, UserInteractionManager, GameStatus){

    "use strict";

    var Game = function Game(stage, levelManager, gameInfo) {
        this.circleFactory = new CircleFactory();
        this.userInteractionManager = new UserInteractionManager(this, stage);
        this.stage = stage;
        this.gameInfo = gameInfo;
        this.levelManager = levelManager;
        this.gameStatus = null;
    };

    Game.prototype = {
        start: function () {

            this.gameStatus = new GameStatus(this.levelManager.getNextLevel());

            console.log("Starting level: " + this.levelManager.getCurrentLevelNumber());

            var startingCirclesQuantity = this.gameStatus.getStartingCirclesQuantity(),
                index = 1,
                self = this;

            this.generateCircle("up", function r(){
                if(index < startingCirclesQuantity) {
                    self.generateCircle("up", r);
                }
                index++;
            });

            this.gameInfo.setCirclesCounter(0);
            this.gameInfo.setTowersCompletedCounter(0, this.gameStatus.getTowersGoal());

            this.gameStatus.start(
                function (timeLeft) {
                    self.gameInfo.setTimeLeft(timeLeft);
                },
                function () {
                    self.gameInfo.displayGameOverMessage(function () {
                        self.restart();
                    });
                }
            );
        },

        restart: function () {
            console.log("Restarting game");
            this.levelManager.setLevelNumber(1);
            this.stage.removeAllCircles();
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
                self.gameInfo.setCirclesCounter(self.gameStatus.getCirclesQuantity());
            });
        },

        splitTower: function (circle, callback) {

            // Find top circle id
            var baseCircle = circle.getBaseCircle(),
            // Pop out top circle
                poppedCircle = circle.pop();

            // Place circle near tower base circle
            this.stage.moveCircleCloseTo(poppedCircle, baseCircle, callback);
            this.gameInfo.towerSplitted();
        },
        
        mergeCircles: function (baseCircle, movingCircle) {
            var self = this;

            baseCircle.mergeWith(movingCircle);
            this.gameInfo.circlesMerged();

            if(this.gameStatus.isCirclesLimitReached()){
                baseCircle.forEachCircleInTower(function(circle){
                    self.stage.removeCircle(circle);
                });
                this.gameInfo.displayGameOverMessage(function () {
                    self.restart();
                });
            }

            else if(this.gameStatus.isTowerCompleted(baseCircle.getHeight())){
                baseCircle.forEachCircleInTower(function(circle){
                    self.stage.removeCircle(circle);
                });
                this.gameStatus.towerCompleted();

                var towerCoordinates = baseCircle.getCoordinates(),
                    completedTowersQuantity = this.gameStatus.getCompletedTowersQuantity(),
                    towersQuantityGoal = this.gameStatus.getTowersGoal();

                this.gameInfo.setTowersCompletedCounter(completedTowersQuantity, towersQuantityGoal);
                this.gameInfo.setCirclesCounter(self.gameStatus.getCirclesQuantity());
                this.gameInfo.towerCompleted(towerCoordinates.x, towerCoordinates.y);


                if(this.gameStatus.isLevelCompleted()){
                    var nextLevelNumber = this.levelManager.getCurrentLevelNumber() + 1;
                    this.gameInfo.displayNextLevelMessage(nextLevelNumber, function () {
                        self.gameStatus.clearCurrentGame();
                        self.stage.removeAllCircles();
                        self.start();
                    });
                }
            }
        }

    };

    return Game;
});
