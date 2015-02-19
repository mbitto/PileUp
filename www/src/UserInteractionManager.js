define([
    'src/Line',
    'src/LineManager',
    'src/config'
], function(Line, LineManager, config) {

    "use strict";

    var UserInteractionManager = function UserInteractionManager(game, stage) {
        this.game = game;
        this.stage = stage;
        this.line = new Line(5);
        this.lineManager = new LineManager(stage, this.line);
    };

    UserInteractionManager.prototype = {
        press: function (circle, e) {
            circle.showOutlineCircle();

            this.stage.moveZIndexUp(circle, this.stage.getChildrenNumber() - 1);
            this.stage.moveZIndexUp(this.line, this.stage.getChildrenNumber() - 2);

            var circleCoordinates = circle.getCoordinates();
            this.lineManager.setLineStartingPoint(circleCoordinates.x, circleCoordinates.y);
        },

        move: function(circle, e){
            circle.forEachCircleInTower(function (circleToMove) {
                circleToMove.move({x: e.stageX, y: e.stageY});
            });
            this.lineManager.extendLineTo(e.stageX, e.stageY);
        },

        tap: function(circle, e){
            this.lineManager.removeLine();
            circle.hideOutlineCircle();
            if(circle.getHeight() > 1){
                this.game.splitTower(circle);
                this.game.generateCircle("down");
            }
        },

        release: function(circle, e){
            this.lineManager.removeLine();
            circle.hideOutlineCircle();
            var collidingCircles = this.stage.detectCollision(circle);

            if (collidingCircles.length > 0) {

                var collidingCirclesBase = collidingCircles[0],
                    movingCirclesBase = collidingCircles[1];

                if (collidingCirclesBase.canBeMergedWith(movingCirclesBase)) {
                    this.game.mergeCircles(collidingCirclesBase, movingCirclesBase);
                    this.game.generateCircle("up");
                }
                else {
                    circle.moveSmooth(this.lineManager.getLineStartingPoint(), config.POP_CIRCLE_ANIMATION_SPEED);
                }
            }
        }
    };
    return UserInteractionManager;
});