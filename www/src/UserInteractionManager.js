define(function() {

    "use strict";

    var UserInteractionManager = function UserInteractionManager(game, stage) {
        this.game = game;
        this.stage = stage;
    };

    UserInteractionManager.prototype = {
        press: function (circle, e) {
            circle.forEachCircleInTower(function(circleToBlur){
                circleToBlur.setBlur();
            });
        },

        move: function(circle, e){
            circle.forEachCircleInTower(function (circleToMove) {
                circleToMove.move({x: e.stageX, y: e.stageY});
            });
        },

        tap: function(circle, e){

            // Remove blur from all circles
            circle.forEachCircleInTower(function(circleToUnblur) {
                circleToUnblur.removeBlur();
            });

            if(circle.getHeight() > 1){
                this.game.splitTower(circle);
                this.game.generateCircle();
            }
        },

        release: function(circle, e){
            circle.forEachCircleInTower(function(circleToUnblur) {
                circleToUnblur.removeBlur();
            });

            var collidingCircles = this.stage.detectCollision(circle);

            if (collidingCircles.length > 0) {

                var collidingCirclesBase = collidingCircles[0],
                    movingCirclesBase = collidingCircles[1];

                if (collidingCirclesBase.canBeMergedWith(movingCirclesBase)) {
                    this.game.mergeCircles(collidingCirclesBase, movingCirclesBase);
                    this.game.generateCircle();
                }
                else {
                    this.stage.moveCircleCloseTo(movingCirclesBase, collidingCirclesBase);
                }
            }
        }
    };
    return UserInteractionManager;
});