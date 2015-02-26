/**
 * Iterate over circles
 * @module src/CircleShapeGenerator
 * @requires src/utils
 */
define(function () {

    "use strict";

    /**
     * @constructor
     * @param {Circle} circle instance associated to iterator
     * @alias src/CircleIterator
     */
    var CirclesIterator = function CirclesIterator(circle) {
        this.circle = circle;
    };

    CirclesIterator.prototype = {

        /**
         * Check if circle as another circle over itself
         *
         * @access private
         * @param circle
         * @returns {boolean}
         */
        _hasUpper: function(circle){
            return circle.getUpperCircle().getId() !== circle.getId();
        },

        /**
         * Get a circle at specific pile's height
         *
         * @param height
         * @returns {Circle|null}
         */
        getCircleAtHeight: function(height){
            var circle = this.circle.getBaseCircle(),
                index = 1;

            if(height > this.getHeight()){
                return null;
            }

            while(index !== height){
                circle = circle.getUpperCircle();
                index++;
            }
            return circle;
        },

        /**
         * Get pile's top circle
         *
         * @returns {Circle}
         */
        getTop: function(){
            var index = this.circle;
            while(this._hasUpper(index)){
                index = index.getUpperCircle();
            }
            return index;
        },

        /**
         * Get pile's height
         *
         * @returns {number}
         */
        getHeight: function(){
            var counter = 1;
            var index = this.circle.getBaseCircle();
            while(this._hasUpper(index)){
                index = index.getUpperCircle();
                counter++;
            }
            return counter;
        },

        /**
         * Iterate over pile
         *
         * @param callback
         */
        forEachCircleInPile: function(callback) {
            var circle = this.circle.getBaseCircle();
            callback(circle);
            while(this._hasUpper(circle)){
                circle = circle.getUpperCircle();
                callback(circle);
            }
        }
    };

    return CirclesIterator;
});