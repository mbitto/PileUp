/**
 * Circle module. Represent a circle properties and its connections with other circles
 *
 * @module src/Circle
 *
 * @requires createjs
 * @requires tweenjs
 * @requires src/CircleDragAndDropManager
 * @requires src/CirclesIterator
 * @requires src/config
 */
define([
    'createjs',
    'tweenjs',
    'src/CircleDragAndDropManager',
    'src/CirclesIterator',
    'src/config'
], function (createjs, tweenjs, CircleDragAndDropManager, CirclesIterator, config) {

    "use strict";

    /**
     * @constructor
     * @param {string} color
     * @param {number} radius
     * @param {number} place
     *
     * @alias src/Circle
     */
    var Circle = function Circle(color, radius, place) {

        this.color = color;
        this.radius = radius;
        this.place = place;

        // Container contain circleShape and outerCircleShape
        this.container = new createjs.Container();

        this.circleShape = new createjs.Shape();
        this.circleShape.graphics.beginStroke(color);
        this.circleShape.graphics.beginFill(color).drawCircle(0, 0, radius);

        // Help user to see what he is pressing
        this.outerCircleShape = new createjs.Shape();

        this.container.addChild(this.circleShape, this.outerCircleShape);

        this.container.set({radius: radius});

        this.id = this.container.id;

        // BaseCircle and upperCircle initially refer to the circle itself
        this.baseCircle = this;
        this.upperCircle = this;

        this.dragAndDropManager = new CircleDragAndDropManager(this.circleShape);
        this.circlesIterator = new CirclesIterator(this);
    };

    Circle.prototype = {
        /**
         * Get id, id is the same id of createjs' shape
         *
         * @returns {number}
         */
        getId: function () {
            return this.id;
        },

        /**
         * Get coordinates as x and y
         *
         * @returns {{x: *, y: *}}
         */
        getCoordinates: function () {
            return {
                x: this.container.x,
                y: this.container.y
            };
        },

        /**
         * Get color
         *
         * @returns {string}
         */
        getColor: function () {
            return this.color;
        },

        /**
         * Get radius
         *
         * @returns {number}
         */
        getRadius: function(){
            return this.radius;
        },

        /**
         * Get the predefined position that circle has considering a full pile of 7 circles
         *
         * @returns {number}
         */
        getPlaceNumber: function () {
            return this.place;
        },

        /**
         * Get createjs' shape
         *
         * @returns {createjs.Shape}
         */
        getShape: function(){
            return this.container;
        },

        /**
         * Show the outline circle
         *
         */
        showOutlineCircle: function () {
            this.outerCircleShape.graphics.
                setStrokeStyle(config.OUTLINE_CIRCLE_STROKE).
                beginStroke(config.OUTLINE_CIRCLE_COLOR);

            this.outerCircleShape.graphics.drawCircle(0, 0, config.OUTLINE_CIRCLE_RADIUS);
        },

        /**
         * Hide the outline circle
         *
         */
        hideOutlineCircle: function () {
            this.outerCircleShape.graphics.clear();
        },

        /**
         * Move immediately to coordinates
         *
         * @param coordinates
         */
        move: function (coordinates) {
            this.container.x = coordinates.x;
            this.container.y = coordinates.y;
        },

        /**
         * Move smoothly to coordinates. Callback is called at the end of transition
         *
         * @param {{x: number, y: number}} coordinates
         * @param {number} speed
         * @param {function|undefined} callback
         *
         */
        moveSmooth: function (coordinates, speed, callback) {
            var coords = {x: coordinates.x, y: coordinates.y},
                callback = callback || function(){},
                ease = createjs.Ease.cubicIn();

            createjs.Tween.get(this.container).to(coords, speed, ease).call(callback);
        },

        /**
         * On press callback
         *
         * @param callback
         */
        onPress: function (callback) {
            this.dragAndDropManager.onPress(callback);
        },

        /**
         * On move callback
         *
         * @param callback
         */
        onMove: function (callback) {
            this.dragAndDropManager.onMove(callback);
        },

        /**
         * On release callback
         *
         * @param callback
         */
        onRelease: function (callback) {
            this.dragAndDropManager.onRelease(callback);
        },

        /**
         * On tap callback
         *
         * @param callback
         */
        onTap: function (callback) {
            this.dragAndDropManager.onTap(callback);
        },

        /**
         * Get the base circle of the collection this circle belongs to (itself if it is the only circle
         * in the collection)
         *
         * @returns {Circle}
         */
        getBaseCircle: function () {
            return this.baseCircle;
        },

        /**
         * Get this circle's upper circle considering the collection this circle belongs to
         * (itself if it is the only circle in the collection)
         * @returns {Circle}
         */
        getUpperCircle: function(){
            return this.upperCircle;
        },

        /**
         * Set the base circle of the collection this circle belongs to
         *
         * @param baseCircle
         */
        setBaseCircle: function (baseCircle) {
            this.baseCircle = baseCircle;
        },

        /**
         * Set this circle's upper circle considering the collection this circle belongs to
         * @param upperCircle
         */
        setUpperCircle: function(upperCircle){
            this.upperCircle = upperCircle;
        },

        /**
         * Check if this circle can be merged with with another circle
         *
         * @param circle
         * @returns {boolean}
         */
        canBeMergedWith: function (circle) {
            var currentCirclesIterator = new CirclesIterator(this),
                currentCircleTop = currentCirclesIterator.getTop();

            return circle.getRadius() < currentCircleTop.getRadius();
        },

        /**
         * Merge this circle with another circle (param is the circle that goes over)
         *
         * @param circle
         */
        mergeWith: function (circle) {
            var self = this,
                currentCircleIterator = new CirclesIterator(this),
                currentCircleTop = currentCircleIterator.getTop(),
                circleToMergeIterator = new CirclesIterator(circle);

            circleToMergeIterator.forEachCircleInPile(function (circle) {
                circle.setBaseCircle(self.getBaseCircle());
                circle.move(self.getCoordinates());
            });

            currentCircleTop.setUpperCircle(circle);
        },

        /**
         * Remove the last circle considering the collection this circle belongs to
         *
         * @returns {src/Circle|null} null if there is no circle to pop
         */
        pop: function(){

            var currentCircleIterator = new CirclesIterator(this),
                circleToPop = currentCircleIterator.getTop(),
                newTopCircle;

            if(currentCircleIterator.getHeight() > 1){
                newTopCircle = currentCircleIterator.getCircleAtHeight(currentCircleIterator.getHeight() - 1);
                // Set base and upper circles as itself
                circleToPop.setBaseCircle(circleToPop);
                circleToPop.setUpperCircle(circleToPop);

                newTopCircle.setUpperCircle(newTopCircle);
                return circleToPop;
            }
            return null;
        },

        /**
         * Iterate all circles of the pile
         *
         * @param callback
         */
        forEachCircleInPile: function(callback) {
            this.circlesIterator.forEachCircleInPile(callback);
        },

        /**
         * Get pile's height
         *
         * @returns {number}
         */
        getHeight: function () {
            return this.circlesIterator.getHeight();
        },

        /**
         * Get pile's top circle
         *
         * @returns {src/Circle}
         */
        getTop: function () {
            return this.circlesIterator.getTop();
        }
    };
    return Circle;
});