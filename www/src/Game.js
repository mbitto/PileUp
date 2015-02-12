define([
    'src/CircleFactory',
    'src/UserInteractionManager'
],function(CircleFactory, UserInteractionManager){

    "use strict";

    var Game = function Game(stage, gameInfo) {
        this.circleFactory = new CircleFactory();
        this.userInteractionManager = new UserInteractionManager(this, stage);
        this.stage = stage;
        this.gameInfo = gameInfo;
    };

    Game.prototype = {
        start: function () {

            var startingCirclesQuantity = this.gameInfo.getStartingCirclesQuantity(),
                index = 1,
                self = this;

            this.generateCircle(function r(){
                if(index < startingCirclesQuantity) {
                    self.generateCircle(r);
                }
                index++;
            });

        },

        generateCircle: function (callback) {
            this.stage.addCircle(this.circleFactory.createCircle(this.userInteractionManager), callback);
            this.gameInfo.addedCircle();
        },

        splitTower: function (circle) {

            // Find top circle id
            var baseCircle = circle.getBaseCircle(),
            // Pop out top circle
                poppedCircle = circle.pop();

            // Place circle near tower base circle
            this.stage.moveCircleCloseTo(poppedCircle, baseCircle);

            this.gameInfo.splittedTower();
        },
        
        mergeCircles: function (baseCircle, movingCircle) {
            var self = this;

            baseCircle.mergeWith(movingCircle);
            this.gameInfo.mergedCircles();

            if(this.gameInfo.isCirclesLimitReached()){
                baseCircle.forEachCircleInTower(function(circle){
                    self.stage.removeCircle(circle);
                });
                this.gameInfo.gameOver();
            }

            else if(this.gameInfo.isTowerCompleted(baseCircle.getHeight())){
                baseCircle.forEachCircleInTower(function(circle){
                    self.stage.removeCircle(circle);
                });
                this.gameInfo.doneTower(baseCircle.getCoordinates());
            }
        }

    };

    return Game;
});
