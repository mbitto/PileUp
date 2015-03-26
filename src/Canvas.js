/**
 * Represent the canvas and its attributes
 *
 * @module src/Canvas
 */
define(function(){

    "use strict";

    /**
     * @constructor
     * @param {external:Node} canvasElement
     *
     * @alias src/Canvas
     */
    var Canvas = function Canvas(canvasElement){

        this.width = canvasElement.width = document.documentElement.clientWidth - 5;
        this.height = canvasElement.height = document.documentElement.clientHeight - 5;

        console.log('window size', window.innerWidth + 'x' + window.innerHeight);
        console.log('canvas size', canvasElement.width + 'x' + canvasElement.height);

    };

    Canvas.prototype = {
        /**
         * get canvas' width
         *
         * @returns {number}
         */
        getWidth: function(){
            return this.width;
        },

        /**
         * get canvas' height
         *
         * @returns {number}
         */
        getHeight: function(){
            return this.height;
        }
    };

    return Canvas;
});