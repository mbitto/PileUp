/**
 * Simple wrapper of Line, used to simplify the interaction with Stage
 *
 * @module src/LineManager
 */

define(function () {

    "use strict";

    /**
     * @constructor
     *
     * @param {Stage} stage
     * @param {Line} line
     *
     * @alias src/LineManager
     */
    var LineManager = function LineManager(stage, line) {
        // Add line's shape to stage
        stage.addChild(line.getShape());
        this.line = line;
    };

    LineManager.prototype = {

        /**
         * Set the line starting point
         *
         * @param {number} x
         * @param {number} y
         */
        setLineStartingPoint: function (x, y) {
            this.line.setStartingPoint(x, y);
        },

        /**
         * Get the line starting point
         *
         * @returns {{x: number, y: number}}
         */
        getLineStartingPoint: function () {
            return this.line.getStartingPoint();
        },

        /**
         * Extend line to the specific point
         *
         * @param {number} x
         * @param {number} y
         * @param {string} color
         */
        extendLineTo: function (x, y, color) {
            this.line.extendTo(x, y, color);
        },

        /**
         * Remove line
         */
        removeLine: function () {
            this.line.remove();
        }
    };

    return LineManager;
});