/**
 * Circle module. Represent a circle properties and its connections with other circles
 * @module src/Circle
 * @requires createjs
 * @requires src/CircleDragAndDropManager
 * @requires src/CirclesIterator
 */
define([
    'createjs',
    'src/CircleDragAndDropManager',
    'src/CirclesIterator',
    'src/config'
], function (createjs, CircleDragAndDropManager, CirclesIterator, config) {

    "use strict";

    /**
     * @constructor
     * @param {string} color
     * @param {number} radius
     */
    var Circle = function Circle(color, radius, place) {

        this.color = color;
        this.radius = radius;
        this.place = place;

        this.container = new createjs.Container();

        this.circleShape = new createjs.Shape();
        this.circleShape.graphics.beginStroke(color);
        this.circleShape.graphics.beginFill(color).drawCircle(0, 0, radius);

        this.outerCircleShape = new createjs.Shape();

        this.container.addChild(this.circleShape, this.outerCircleShape);

        this.container.set({radius: radius});

        this.id = this.container.id;
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

        showOutlineCircle: function () {
            this.outerCircleShape.graphics.
                setStrokeStyle(config.OUTLINE_CIRCLE_STROKE).
                beginStroke(config.OUTLINE_CIRCLE_COLOR);

            this.outerCircleShape.graphics.drawCircle(0, 0, config.OUTLINE_CIRCLE_RADIUS);
        },

        hideOutlineCircle: function () {
            this.outerCircleShape.graphics.clear();
        },

        /**
         * Move to coordinates
         *
         * @param coordinates
         */
        move: function (coordinates) {
            this.container.x = coordinates.x;
            this.container.y = coordinates.y;
        },

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
         * Check if this circle is can be merged with with another circle
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
         * Merge this circle with another circle (param is the new circle that goes up)
         *
         * @param circle
         */
        mergeWith: function (circle) {
            var self = this,
                currentCircleIterator = new CirclesIterator(this),
                currentCircleTop = currentCircleIterator.getTop(),
                circleToMergeIterator = new CirclesIterator(circle);

            circleToMergeIterator.forEachCircleInTower(function (circle) {
                circle.setBaseCircle(self.getBaseCircle());
                circle.move(self.getCoordinates());
            });

            currentCircleTop.setUpperCircle(circle);
        },

        //TODO: test pop() in a collection with only one element
        /**
         * Remove the last circle considering the collection this circle belongs to
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

        forEachCircleInTower: function(callback) {
            this.circlesIterator.forEachCircleInTower(callback);
        },

        getHeight: function () {
            return this.circlesIterator.getHeight();
        },

        getTop: function () {
            return this.circlesIterator.getTop();
        }
    };
    return Circle;
});