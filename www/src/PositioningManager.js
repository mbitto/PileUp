/**
 * Position manager module. Detect collision between circles and manage the movement of circles.
 * @module src/PositioningManager
 * @requires src/utils
 */
define([
    'src/utils',
    'src/config'
], function(utils, config){

    "use strict";

    /**
     * @constructor
     */
    var PositioningManager = function PositioningManager(canvasWidth, canvasHeight){
        this.putCircleLoops = 0;
        this.gameCanvasWidth = canvasWidth - config.OUTLINE_CIRCLE_RADIUS;
        this.gameCanvasHeight = canvasHeight - config.OUTLINE_CIRCLE_RADIUS;
        this.topLeftStartingPoint = {x: -100, y: -100};
        this.bottomStartingPoint = {x: -100, y: canvasHeight + 100};
        this.rightStartingPoint = {x: canvasWidth + 100, y: canvasHeight / 2};
        this.topStartingPoint = {x: canvasWidth / 2, y: -100};
    };

    PositioningManager .prototype = {

        inCanvas: function (circle) {
            var coordinates = circle.getCoordinates();
            return coordinates.x < this.gameCanvasWidth &&
                   coordinates.y < this.gameCanvasHeight &&
                   coordinates.x > config.OUTLINE_CIRCLE_RADIUS &&
                   coordinates.y > config.OUTLINE_CIRCLE_RADIUS;
        },

        getTopStartingPosition: function () {
            return this.topLeftStartingPoint;
        },

        getRightStartingPosition: function () {
            return this.rightStartingPoint;
        },

        getBottomStartingPosition: function () {
            return this.bottomStartingPoint;
        },

        /**
         * Detect a collision between an array of circles and a single circle
         * @param {Circle[]} allCircles
         * @param {Circle} movingCircle
         * @returns {Circle[]} 2 colliding circles or empty array if there are no collisions
         */
        detectCollision: function(allCircles, movingCircle){
            var collidingCircles = [];
            allCircles.some(function(collidingCircle){
                if(movingCircle.getBaseCircle().getId() !== collidingCircle.getBaseCircle().getId()){

                    var dx = collidingCircle.getCoordinates().x - movingCircle.getCoordinates().x;
                    var dy = collidingCircle.getCoordinates().y - movingCircle.getCoordinates().y;
                    var distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < collidingCircle.getRadius() + movingCircle.getRadius()) {
                        collidingCircles = [collidingCircle.getBaseCircle(), movingCircle.getBaseCircle()];
                        return true;
                    }
                }
            });
            return collidingCircles;
        },

        /**
         * Move a circle near another circle. The distance is relative to the base circle radius. The final
         * position is determinated by other circles eventually placed near the base circle. In this case
         * overlapping is avoided using detectCollision method.
         * @param {Circle[]} allCircles
         * @param {Circle} circleToMove
         * @param {Circle} baseCircleReference
         */
        getFreePositionNear: function (allCircles, circleToMove, baseCircleReference) {
            var availableMovements = [1, 0.5, 0, -0.5, -1, -0.5, 0, 0.5],
                stop = false,
                baseCircleReferenceShape = baseCircleReference.getShape(),
                minimumDistance = baseCircleReference.getRadius() * 2,
                maximumTrials = 100,
                initialPosition = circleToMove.getCoordinates(),
                i = 1, j, newXPosition, newYPosition, xMovement, yMovement;

            while(i < maximumTrials){
                for (j = 0; j < availableMovements.length; j++) {

                    xMovement = minimumDistance * (availableMovements[j] * i);
                    yMovement = minimumDistance * (availableMovements[availableMovements.length - 1 - j] * i);
                    newXPosition = baseCircleReferenceShape.x + xMovement;
                    newYPosition = baseCircleReferenceShape.y + yMovement;

                    circleToMove.move({
                        x: newXPosition,
                        y: newYPosition
                    });

                    if(this.detectCollision(allCircles, circleToMove).length == 0 && this.inCanvas(circleToMove)){
                        stop = true;
                        break;
                    }
                    // If new position is out of canvas put it randomly
                    if(!this.inCanvas(circleToMove)){
                        this.getFreeRandomPosition(allCircles, circleToMove);
                    }
                }
                if(stop){
                    circleToMove.move(initialPosition);
                    break;
                }
                i++;
            }
            return { x: newXPosition, y: newYPosition };
        },

        // FIXME: Buggy (too much loops) when there are many circles
        // Get coordinates avoiding circle collisions
        getFreeRandomPosition: function (circles, circle, putCircleLoops, _initialPosition) {

            this.putCircleLoops = putCircleLoops || 0;

            var xMaxDistance = this.gameCanvasWidth - (circle.getRadius() * 2),
                yMaxDistance = this.gameCanvasHeight - (circle.getRadius() * 2),
                coordinates = utils.getRandomCoordinates(50, xMaxDistance, yMaxDistance),
                initialPosition = _initialPosition || circle.getCoordinates(),
                i, collidingCircles;

            circle.move(coordinates);

            for (i = 0; i < circles.length; i++) {
                collidingCircles = this.detectCollision(circles, circle);

                if (collidingCircles.length > 0) {
                    return this.getFreeRandomPosition(circles, circle, ++this.putCircleLoops, initialPosition);
                }
            }
            console.log('getFreeRandomPosition loops: ' + this.putCircleLoops);
            circle.move(initialPosition);
            return coordinates;
        }
    };

    return PositioningManager ;
});