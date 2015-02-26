define([
    'createjs',
    'src/PositioningManager',
    'src/config'
],function(createjs, PositioningManager, config){

    "use strict";

    var Stage = function Stage(createJSStage, width, height) {
        this.createJSStage = createJSStage;
        this.positioningManager = new PositioningManager(width, height);
        this.circles = [];
    };

    Stage.prototype = {

        addCircle: function(initialPosition, circle, callback){
            var startingPosition;
            switch(initialPosition){
                case "up": startingPosition = this.positioningManager.getTopStartingPosition(); break;
                case "down": startingPosition = this.positioningManager.getBottomStartingPosition(); break;
                case "right": startingPosition = this.positioningManager.getRightStartingPosition(); break;
            }

            circle.move(startingPosition);
            this.circles[circle.getId()] = circle;
            var coordinates = this.positioningManager.getFreeRandomPosition(this.circles, circle);
            this.createJSStage.addChild(circle.getShape());
            this.sortCircles();
            circle.moveSmooth(coordinates, config.NEW_CIRCLE_ANIMATION_SPEED, callback);
        },

        removeCircle: function(circle){
            this.createJSStage.removeChild(circle.getShape());
            delete this.circles[circle.getId()];
        },

        removeAllCircles: function () {
            var self = this;
            this.circles.forEach(function (circle) {
                self.removeCircle(circle);
            });
        },

        sortCircles: function () {
            // Sort circles in order to allow correct overlapping
            this.createJSStage.sortChildren(function (s1, s2) {
                if (s1.radius < s2.radius) { return 1; }
                if (s1.radius > s2.radius) { return -1; }
                return 0;
            });
        },

        moveZIndexUp: function (shape, index) {
            this.createJSStage.setChildIndex(shape.getShape(), index);
        },

        moveCircleCloseTo: function (circleToMove, circleReference, callback) {
            var coordinates = this.positioningManager.getFreePositionNear(this.circles, circleToMove, circleReference);
            circleToMove.moveSmooth(coordinates, config.POP_CIRCLE_ANIMATION_SPEED, callback);
        },

        detectCollision: function(movingCircle){
            return this.positioningManager.detectCollision(this.circles, movingCircle);
        },

        addChild: function(child){
            this.createJSStage.addChild(child);
        },

        update: function(){
            this.createJSStage.update();
        },

        getChildrenNumber: function () {
            return this.createJSStage.numChildren;
        }
    };

    return Stage;
});
