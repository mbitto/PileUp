/**
 * Represent the game's stage with all the basic functionalities involved
 *
 * @module src/Stage
 *
 * @requires createjs
 * @requires src/PositioningManager
 * @requires src/config
 *
 */
define([
    'createjs',
    'src/PositioningManager',
    'src/config'
],function(createjs, PositioningManager, config){

    "use strict";

    /**
     * @constructor
     *
     * @param {createjs.Stage} createJSStage
     * @param {number} width
     * @param {number} height
     *
     * @alias src/Stage
     *
     */
    var Stage = function Stage(createJSStage, width, height) {
        this.createJSStage = createJSStage;
        this.positioningManager = new PositioningManager(width, height);
        this.circles = [];
    };

    Stage.prototype = {

        /**
         * Add circle to stage
         *
         * @param {string} initialPosition
         * @param {Circle} circle
         * @param {function} callback - Called when circles has finished its movement
         */
        addCircle: function(initialPosition, circle, callback){
            var startingPosition;
            switch(initialPosition){
                case "up": startingPosition = this.positioningManager.getTopSideEnteringPosition(); break;
                case "down": startingPosition = this.positioningManager.getBottomSideEnteringPosition(); break;
                case "right": startingPosition = this.positioningManager.getRightSideEnteringPosition(); break;
            }

            circle.move(startingPosition);
            this.circles[circle.getId()] = circle;
            var coordinates = this.positioningManager.getFreeRandomPosition(this.circles, circle);
            this.createJSStage.addChild(circle.getShape());
            this.sortCircles();
            circle.moveSmooth(coordinates, config.NEW_CIRCLE_ANIMATION_SPEED, callback);
        },

        /**
         * Remove circle from stage
         *
         * @param {Circle} circle
         */
        removeCircle: function(circle){
            this.createJSStage.removeChild(circle.getShape());
            delete this.circles[circle.getId()];
        },

        /**
         * Remove all circles from stage
         */
        removeAllCircles: function () {
            var self = this;
            this.circles.forEach(function (circle) {
                self.removeCircle(circle);
            });
        },

        /**
         * Sort circles in order to have the smaller over the larger
         *
         */
        sortCircles: function () {
            // Sort circles in order to allow correct overlapping
            this.createJSStage.sortChildren(function (s1, s2) {
                if (s1.radius < s2.radius) { return 1; }
                if (s1.radius > s2.radius) { return -1; }
                return 0;
            });
        },

        /**
         * Move the shape's z-index up
         *
         * @param {createjs.Shape} shape
         * @param {number} index
         */
        moveZIndexUp: function (shape, index) {
            this.createJSStage.setChildIndex(shape.getShape(), index);
        },

        /**
         * Move a circle close to another
         *
         * @param {Circle} circleToMove
         * @param {Circle} circleReference
         * @param {function} callback
         */
        moveCircleCloseTo: function (circleToMove, circleReference, callback) {
            var coordinates = this.positioningManager.getFreePositionNear(this.circles, circleToMove, circleReference);
            circleToMove.moveSmooth(coordinates, config.POP_CIRCLE_ANIMATION_SPEED, callback);
        },

        /**
         * Detect collision between circles
         *
         * @param movingCircle
         * @returns {Circle[]}
         */
        detectCollision: function(movingCircle){
            return this.positioningManager.detectCollision(this.circles, movingCircle);
        },

        /**
         * Add a child to stage
         *
         * @param {createjs.Stage|createjs.Container} child
         */
        addChild: function(child){
            this.createJSStage.addChild(child);
        },

        /**
         * Update the createjs instance of stage
         */
        update: function(){
            this.createJSStage.update();
        },

        /**
         * Get stage's children quantity
         *
         * @returns {number}
         */
        getChildrenNumber: function () {
            return this.createJSStage.numChildren;
        }
    };

    return Stage;
});
