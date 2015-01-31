/**
 * Position manager module. Detect collision between circles and manage the movement of circles.
 * @module src/PositioningManager
 * @requires src/utils
 */
define([
    'src/utils'
], function(utils){

    "use strict";

    /**
     * @constructor
     */
    var PositioningManager = function PositioningManager(canvasWidth, canvasHeight){
        this.putCircleLoops = 0;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    };

    PositioningManager .prototype = {

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
        moveNear: function (allCircles, circleToMove, baseCircleReference) {

            // To create (1;0), (0;-1), (-1;0), (0;1) couples
            var availableMovements = [1, 0.5, 0, -0.5, -1, -0.5, 0, 0.5],
                stop = false,
                baseCircleReferenceShape = baseCircleReference.getShape(),
                minimumDistance = baseCircleReference.getRadius() * 2,
                maximumTrials = 100,
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

                    if(this.detectCollision(allCircles, circleToMove).length == 0){
                        stop = true;
                        break;
                    }
                    // If new position is out of canvas put it randomly
                    if(newXPosition > this.canvasWidth || newYPosition > this.canvasHeight){
                        this.putCircle(allCircles, circleToMove);
                    }
                }
                if(stop){
                    break;
                }
                i++;
            }
        },

        // FIXME: Buggy (too much loops) when there are many circles
        // Get coordinates avoiding circle collisions
        putCircle: function (circles, circle, putCircleLoops) {
            this.putCircleLoops = putCircleLoops || 0;

            var xMaxDistance = this.canvasWidth - (circle.getRadius() * 2),
                yMaxDistance = this.canvasHeight - (circle.getRadius() * 2);

            var coordinates = utils.getRandomCoordinates(50, xMaxDistance, yMaxDistance),
                i, collidingCircles;

            circle.move(coordinates);

            for (i = 0; i < circles.length; i++) {
                collidingCircles = this.detectCollision(circles, circle);

                if (collidingCircles.length > 0) {
                    return this.putCircle(circles, circle, ++this.putCircleLoops);
                }
            }
            console.log('putCircle loops: ' + this.putCircleLoops);
            return circle;
        }
    };

    return PositioningManager ;
});