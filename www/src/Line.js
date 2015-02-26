/**
 * Create the line connected to the moving circle
 *
 * @requires createjs
 *
 * @module src/Line
 */

define([
    'createjs'
], function (createjs) {

    "use strict";

    /**
     * @constructor
     *
     * @param dashLength - length of line's dashes
     *
     * @alias src/Line
     */
    var Line = function Line(dashLength) {
        this.startingPointX = 0;
        this.startingPointY = 0;
        this.dashLength = dashLength || 0;
        this.lineShape = new createjs.Shape();
    };

    Line.prototype = {
        /**
         * Set the line starting point
         *
         * @param {number} x
         * @param {number} y
         */
        setStartingPoint: function (x, y) {
            this.startingPointX = x;
            this.startingPointY = y;
        },

        /**
         * Get the line starting point
         *
         * @returns {{x: number, y: number}}
         */
        getStartingPoint: function () {
            return { x: this.startingPointX, y: this.startingPointY };
        },

        /**
         * Extend line to the specific point
         *
         * @param {number} x
         * @param {number} y
         */
        extendTo: function (x, y) {
            this.lineShape.graphics.clear();
            this.lineShape.graphics.setStrokeStyle(1).beginStroke("lime");
            this.lineShape.graphics.moveTo(this.startingPointX, this.startingPointY);

            var q = 0;
            if(this.dashLength > 0){
                var dX = x - this.startingPointX,
                    dY = y - this.startingPointY,
                    dashes = Math.floor(Math.sqrt( dX * dX + dY * dY ) / this.dashLength),
                    dashX = dX / dashes,
                    dashY = dY / dashes,
                    startingPointX = this.startingPointX,
                    startingPointY = this.startingPointY;

                while( q++ < dashes ){
                    startingPointX += dashX;
                    startingPointY += dashY;
                    this.lineShape.graphics[q % 2 == 0 ? 'moveTo' : 'lineTo'](startingPointX, startingPointY);
                }
            }
            this.lineShape.graphics[q % 2 == 0 ? 'moveTo' : 'lineTo'](x, y);
            this.lineShape.graphics.endStroke();
        },

        /**
         * Remove line
         */
        remove: function(){
            this.lineShape.graphics.clear();
        },

        /**
         * Get line's shape
         *
         * @returns {createjs.Shape}
         */
        getShape: function () {
            return this.lineShape;
        }
    };

    return Line;
});