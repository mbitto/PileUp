/**
 * Create circles instances with random features
 *
 * @module src/CircleFactory
 * @requires src/CircleShapeGenerator
 * @requires src/Circle
 *
 */
define([
    'src/CircleShapeGenerator',
    'src/Circle'
],function(CircleShapeGenerator, Circle) {

    "use strict";

    /**
     * @constructor
     *
     * @alias src/CircleFactory
     */
    var CircleFactory = function CircleFactory() {
        this.circleShapeGenerator = new CircleShapeGenerator();
    };

    CircleFactory.prototype = {

        /**
         * Create a new circle and attach custom event listeners
         *
         * @param userInteractionManager
         * @returns {Circle}
         */
        createCircle: function(userInteractionManager){
            var shape = this.circleShapeGenerator.getCircleRandomFeatures(),
                circle = new Circle(shape.color, shape.radius, shape.place);

            circle.onPress(function(e){
                userInteractionManager.press(circle, e);
            });

            circle.onMove(function (e) {
                userInteractionManager.move(circle, e);
            });

            circle.onTap(function (e) {
                userInteractionManager.tap(circle, e);
            });

            circle.onRelease(function (e) {
                userInteractionManager.release(circle, e);
            });

            return circle;
        }
    };
    return CircleFactory;
});