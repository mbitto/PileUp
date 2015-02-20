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
        this.minimumTimeBetweenTaps = 1000;
        this.lastTapTimestamp = 0;
    };

    UserInteractionManager.prototype = {
        press: function (circle, e) {
            var self = this;
            circle.showOutlineCircle();

            circle.forEachCircleInTower(function(circleToMoveUp){
                self.stage.moveZIndexUp(circleToMoveUp, self.stage.getChildrenNumber() - 1);
            });

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

        tap: function(circle, e) {

            var self = this,
                upTimestamp = Date.now();

            this.lineManager.removeLine();
            circle.hideOutlineCircle();

            if(circle.getHeight() > 1 && upTimestamp - this.lastTapTimestamp > this.minimumTimeBetweenTaps){
                this.lastTapTimestamp = upTimestamp;
                this.game.splitTower(circle, function(){
                    self.game.generateCircle("down");
                });
            }
        },

        release: function(circle, e){
            var self = this,
                collidingCircles = this.stage.detectCollision(circle);

            this.lineManager.removeLine();
            circle.hideOutlineCircle();

            if (collidingCircles.length > 0) {

                var collidingCirclesBase = collidingCircles[0],
                    movingCirclesBase = collidingCircles[1];

                if (collidingCirclesBase.canBeMergedWith(movingCirclesBase)) {
                    this.game.mergeCircles(collidingCirclesBase, movingCirclesBase);
                    this.game.generateCircle("up");
                }
                else {
                    circle.forEachCircleInTower(function (circleToMove) {
                        var startingPoint = self.lineManager.getLineStartingPoint();
                        circleToMove.moveSmooth(startingPoint, config.POP_CIRCLE_ANIMATION_SPEED);
                    });
                }
            }
        }
    };
    return UserInteractionManager;
});