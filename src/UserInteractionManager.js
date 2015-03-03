/**
 * Handle user interaction with circles
 *
 * @module src/UserInteractionManager
 *
 * @requires src/Line
 * @requires src/LineManager
 * @requires config
 *
 */
define([
    'src/Line',
    'src/LineManager',
    'src/config'
], function(Line, LineManager, config) {

    "use strict";

    /**
     * @constructor
     *
     * @param {Game} game
     * @param {Stage} stage
     *
     * @alias src/UserInteractionManager
     */
    var UserInteractionManager = function UserInteractionManager(game, stage) {
        this.game = game;
        this.stage = stage;
        this.line = new Line(5);
        this.lineManager = new LineManager(stage, this.line);
        // Fix bug related to multiple tap recognized by mobile app
        this.minimumTimeBetweenTaps = 1000;
        this.lastTapTimestamp = 0;
    };

    UserInteractionManager.prototype = {
        /**
         * Press action
         *
         * @param {Circle} circle
         * @param {createjs.Event} e
         */
        press: function (circle, e) {
            var self = this;
            circle.showOutlineCircle(circle.getBaseCircle().getColor());

            circle.forEachCircleInPile(function(circleToMoveUp){
                self.stage.moveZIndexUp(circleToMoveUp, self.stage.getChildrenNumber() - 1);
            });

            this.stage.moveZIndexUp(this.line, this.stage.getChildrenNumber() - 2);

            var circleCoordinates = circle.getCoordinates();
            this.lineManager.setLineStartingPoint(circleCoordinates.x, circleCoordinates.y);
        },

        /**
         * Move action
         *
         * @param {Circle} circle
         * @param {createjs.Event} e
         */
        move: function(circle, e){
            circle.forEachCircleInPile(function (circleToMove) {
                circleToMove.move({x: e.stageX, y: e.stageY});
            });
            this.lineManager.extendLineTo(e.stageX, e.stageY, circle.getBaseCircle().getColor());
        },

        /**
         * Tap action
         *
         * @param {Circle} circle
         * @param {createjs.Event} e
         */
        tap: function(circle, e) {

            var self = this,
                upTimestamp = Date.now();

            this.lineManager.removeLine();
            circle.hideOutlineCircle();

            if(circle.getHeight() > 1 && upTimestamp - this.lastTapTimestamp > this.minimumTimeBetweenTaps){
                this.lastTapTimestamp = upTimestamp;
                this.game.splitPile(circle, function(){
                    self.game.generateCircle("down");
                });
            }
        },

        /**
         * Release action
         *
         * @param {Circle} circle
         * @param {createjs.Event} e
         */
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
                    circle.forEachCircleInPile(function (circleToMove) {
                        var startingPoint = self.lineManager.getLineStartingPoint();
                        circleToMove.moveSmooth(startingPoint, config.POP_CIRCLE_ANIMATION_SPEED);
                    });
                }
            }
        }
    };
    return UserInteractionManager;
});