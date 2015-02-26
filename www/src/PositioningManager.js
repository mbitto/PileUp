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
     * @param {number} canvasWidth
     * @param {number} canvasHeight
     *
     * @alias src/PositionManager
     */
    var PositioningManager = function PositioningManager(canvasWidth, canvasHeight){
        this.circlePlacementLoops = 0;
        this.gameCanvasWidth = canvasWidth - config.OUTLINE_CIRCLE_RADIUS;
        this.gameCanvasHeight = canvasHeight - config.OUTLINE_CIRCLE_RADIUS;
        this.bottomSideEnteringPosition = {x: canvasWidth / 2, y: canvasHeight + 100};
        this.rightSideEnteringPosition = {x: canvasWidth + 100, y: canvasHeight / 2};
        this.topSideEnteringPosition = {x: canvasWidth / 2, y: -100};
    };

    PositioningManager .prototype = {

        /**
         * Check if circle's position is inside canvas
         *
         * @param {Circle} circle
         * @returns {boolean}
         */
        inCanvas: function (circle) {
            var coordinates = circle.getCoordinates();
            return coordinates.x < this.gameCanvasWidth &&
                   coordinates.y < this.gameCanvasHeight &&
                   coordinates.x > config.OUTLINE_CIRCLE_RADIUS &&
                   coordinates.y > config.OUTLINE_CIRCLE_RADIUS;
        },

        /**
         * Get position to launch a new circle from the top side
         *
         * @returns {{x: number, y: number}|*}
         */
        getTopSideEnteringPosition: function () {
            return this.topSideEnteringPosition;
        },

        /**
         * Get position to launch a new circle from the right side
         *
         * @returns {{x: number, y: number}|*}
         */
        getRightSideEnteringPosition: function () {
            return this.rightSideEnteringPosition;
        },

        /**
         * Get position to launch a new circle from the bottom side
         *
         * @returns {{x: number, y: number}|*}
         */
        getBottomSideEnteringPosition: function () {
            return this.bottomSideEnteringPosition;
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
         * Get coordinates to move a circle near another circle. The distance is relative to the base circle radius.
         * The final position is determinated by other circles eventually placed near the base circle. In this case
         * overlapping is avoided using detectCollision method.
         *
         * @param {Circle[]} allCircles
         * @param {Circle} circleToMove
         * @param {Circle} baseCircleReference
         * @returns {{x: number, y: number}} coordinates
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


        /**
         * Get a free random position for a circle
         *
         * @param {Circle[]} circles
         * @param {Circle} circle
         * @param {number} circlePlacementLoops - keep track how many looops are required to place a circle
         *                 (used for debug purposes)
         * @param {{x: number, y: number}} _initialPosition
         * @returns {{x: number, y: number}} coordinates
         */
        getFreeRandomPosition: function (circles, circle, circlePlacementLoops, _initialPosition) {

            this.circlePlacementLoops = circlePlacementLoops || 0;

            var xMaxDistance = this.gameCanvasWidth - (circle.getRadius() * 2),
                yMaxDistance = this.gameCanvasHeight - (circle.getRadius() * 2),
                coordinates = utils.getRandomCoordinates(50, xMaxDistance, yMaxDistance),
                initialPosition = _initialPosition || circle.getCoordinates(),
                i, collidingCircles;

            circle.move(coordinates);

            for (i = 0; i < circles.length; i++) {
                collidingCircles = this.detectCollision(circles, circle);

                if (collidingCircles.length > 0) {
                    return this.getFreeRandomPosition(circles, circle, ++this.circlePlacementLoops, initialPosition);
                }
            }
            console.log('getFreeRandomPosition loops: ' + this.circlePlacementLoops);
            circle.move(initialPosition);
            return coordinates;
        }
    };

    return PositioningManager ;
});