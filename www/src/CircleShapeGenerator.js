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

        var RED = "#FF0000",
            ORANGE = "#FF7F00",
            YELLOW = "#FFFF00",
            GREEN = "#00FF00",
            BLUE = "#0000FF",
            INDIGO = "#5A00FF",
            VIOLET = "#7F00FF";

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
            {radius: 46, color: RED},
            {radius: 42.5, color: ORANGE},
            {radius: 39, color: YELLOW},
            {radius: 35.5, color: GREEN},
            {radius: 32, color: BLUE},
            {radius: 28.5, color: INDIGO},
            {radius: 25, color: VIOLET}
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
         * @returns {{radius: number, color: string}}
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
                color: this.circlesCollection[randomIndex].color
            };
        },

        /**
         * Get the circles shape collection
         *
         * @returns {Array}
         */
        getCirclesCollection: function () {
            return this.circlesCollection;
        },

        /**
         * Get the max generable radius
         *
         * @returns {number}
         */
        getMaximumGenerableRadius: function(){
            return this.circlesCollection[0].radius;
        }
    };

    return CircleShapeGenerator;
});
