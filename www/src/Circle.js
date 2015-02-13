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
    'src/CirclesIterator'
], function (createjs, CircleDragAndDropManager, CirclesIterator) {

    "use strict";

    /**
     * @constructor
     * @param {string} color
     * @param {number} radius
     * @param {{x:*, y:*}} coordinates
     */
    var Circle = function Circle(color, radius, coordinates) {

        this.color = color;
        this.radius = radius;
        this.shape = new createjs.Shape();
        this.shape.graphics.beginStroke(color);
        this.shape.graphics.beginFill(color).drawCircle(0, 0, radius);
        this.shape.set({radius: radius});

        this.id = this.shape.id;
        this.baseCircle = this;
        this.upperCircle = this;

        this.dragAndDropManager = new CircleDragAndDropManager(this.shape);

        if(coordinates){
            this.shape.x = coordinates.x;
            this.shape.y = coordinates.y;
        }

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
                x: this.shape.x,
                y: this.shape.y
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

        /**
         * Get createjs' shape
         *
         * @returns {createjs.Shape}
         */
        getShape: function(){
            return this.shape;
        },

        /**
         * Move to coordinates
         *
         * @param coordinates
         */
        move: function (coordinates) {
            this.shape.x = coordinates.x;
            this.shape.y = coordinates.y;
        },

        moveSmooth: function (coordinates, speed, callback) {
            var coords = {x: coordinates.x, y: coordinates.y},
                callback = callback || function(){},
                ease = createjs.Ease.cubicIn();

            createjs.Tween.get(this.shape).to(coords, speed, ease).call(callback);
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
        }
    };
    return Circle;
});