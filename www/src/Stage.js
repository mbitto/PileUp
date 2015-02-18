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
            if(initialPosition === "up"){
                startingPosition = this.positioningManager.getTopStartingPosition();
            }
            else{
                startingPosition = this.positioningManager.getBottomStartingPosition();
            }
            circle.move(startingPosition);
            this.circles[circle.getId()] = circle;
            var coordinates = this.positioningManager.getFreeRandomPosition(this.circles, circle);
            this.createJSStage.addChild(circle.getShape());

            // Sort circles in order to allow correct overlapping
            this.createJSStage.sortChildren(function (s1, s2) {
                if (s1.radius < s2.radius) { return 1; }
                if (s1.radius > s2.radius) { return -1; }
                return 0;
            });

            circle.moveSmooth(coordinates, config.NEW_CIRCLE_ANIMATION_SPEED, callback);
        },

        removeCircle: function(circle){
            this.createJSStage.removeChild(circle.getShape());
            delete this.circles[circle.getId()];
        },

        moveCircleCloseTo: function (circleToMove, circleReference) {
            var coordinates = this.positioningManager.getFreePositionNear(this.circles, circleToMove, circleReference);
            circleToMove.moveSmooth(coordinates, config.POP_CIRCLE_ANIMATION_SPEED);
        },

        detectCollision: function(movingCircle){
            return this.positioningManager.detectCollision(this.circles, movingCircle);
        },

        addChild: function(child){
            this.createJSStage.addChild(child);
        },

        update: function(){
            this.createJSStage.update();
        }
    };

    return Stage;
});
