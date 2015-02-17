define(function() {

    "use strict";

    var UserInteractionManager = function UserInteractionManager(game, stage) {
        this.game = game;
        this.stage = stage;
    };

    UserInteractionManager.prototype = {
        press: function (circle, e) {},

        move: function(circle, e){
            circle.forEachCircleInTower(function (circleToMove) {
                circleToMove.move({x: e.stageX, y: e.stageY});
            });
        },

        tap: function(circle, e){

            if(circle.getHeight() > 1){
                this.game.splitTower(circle);
                this.game.generateCircle("down");
            }
        },

        release: function(circle, e){
            var collidingCircles = this.stage.detectCollision(circle);

            if (collidingCircles.length > 0) {

                var collidingCirclesBase = collidingCircles[0],
                    movingCirclesBase = collidingCircles[1];

                if (collidingCirclesBase.canBeMergedWith(movingCirclesBase)) {
                    this.game.mergeCircles(collidingCirclesBase, movingCirclesBase);
                    this.game.generateCircle("up");
                }
                else {
                    this.stage.moveCircleCloseTo(movingCirclesBase, collidingCirclesBase);
                }
            }
        }
    };
    return UserInteractionManager;
});