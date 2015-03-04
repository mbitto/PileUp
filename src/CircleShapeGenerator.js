/**
 * Generates circles shape features like color and radius
 * @module src/CircleShapeGenerator
 * @requires src/utils
 */
define([
    'src/utils'
], function(utils){

    "use strict";

    /**
     * @constructor
     * @param {Number} repeatLimit maximum repetitions of the same shape before other shapes
     * @default 2
     * @alias src/CircleShapeGenerator
     */
    var CircleShapeGenerator = function CircleShapeGenerator(repeatLimit) {

        var RED = "#E02130", STROKE_RED = "#c74550",
            ORANGE = "#F85931", STROKE_ORANGE = "#df7358",
            YELLOW = "#FAB243", STROKE_YELLOW = "#e0b069",
            GREEN = "#429867", STROKE_GREEN = "#517f65",
            BLUE = "#2B5166", STROKE_BLUE = "#4f6f80",
            INDIGO = "#009989", STROKE_INDIGO = "#1a8076",
            VIOLET = "#482344", STROKE_VIOLET = "#62435f";

        /**
         * @access private
         * @type {Array}
         */
        this.circlesIndex = [];

        /**
         * @access private
         * @type {number}
         *
         * How many time a circle can repeat itself before the others
         */
        this.repeatLimit = repeatLimit || 2;

        /**
         * @access private
         * @type {Object}
         */
        this.circlesCollection = [
            {radius: 46, color: RED, strokeColor: STROKE_RED, place: 1},
            {radius: 42.5, color: ORANGE, strokeColor: STROKE_ORANGE, place: 2},
            {radius: 39, color: YELLOW, strokeColor: STROKE_YELLOW, place: 3},
            {radius: 35.5, color: GREEN, strokeColor: STROKE_GREEN, place: 4},
            {radius: 32, color: BLUE, strokeColor: STROKE_BLUE, place: 5},
            {radius: 28.5, color: INDIGO, strokeColor: STROKE_INDIGO, place: 6},
            {radius: 25, color: VIOLET, strokeColor: STROKE_VIOLET, place: 7}
        ];

        this._resetIndex();
    };

    CircleShapeGenerator.prototype = {

        /**
         * @access private
         *
         * @returns {undefined}
         */
        _resetIndex: function () {
            var i;

            for (i = 0; i < 7; i++) {
                this.circlesIndex[i] = 0;
            }
        },

        /**
         * Update the index relative to a single feature repetition
         * 
         * @access private
         * @param randomIndex
         *
         * @returns {undefined}
         */
        _updateRepetitionsIndex: function(randomIndex){
            var self = this;
            this.circlesIndex[randomIndex]++;
            var allEquals = this.circlesIndex.every(function (element) {
                return element === self.repeatLimit;
            });

            if (allEquals) {
                this._resetIndex();
            }
        },

        /**
         * Get random features for a circle shape
         * @returns {{radius: number, color: string, strokeColor: string, place: number}}
         */
        getCircleRandomFeatures: function(){

            var randomIndex = utils.getRandomInt(0, this.circlesCollection.length - 1);

            if (this.circlesIndex[randomIndex] == this.repeatLimit) {

                // Repeat limit reached, retry
                return this.getCircleRandomFeatures();
            }

            this._updateRepetitionsIndex(randomIndex);
            return {
                radius: this.circlesCollection[randomIndex].radius,
                color: this.circlesCollection[randomIndex].color,
                strokeColor: this.circlesCollection[randomIndex].strokeColor,
                place: this.circlesCollection[randomIndex].place
            };
        },

        /**
         * Get the circles shape collection
         *
         * @returns {Array}
         */
        getCirclesCollection: function () {
            return this.circlesCollection;
        }
    };

    return CircleShapeGenerator;
});
