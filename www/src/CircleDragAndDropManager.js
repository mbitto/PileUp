/**
 * Manage drag and drop actions callbacks
 *
 * @module src/CircleDragAndDropManager
 */
define(function () {

    "use strict";

    /**
     * @constructor
     * @param {createjs.Shape} shape
     *
     * @alias src/Canvas
     */
    var CircleDragAndDropManager = function CircleDragAndDropManager(shape) {

        // callbacks arrays
        this.onPressCallbacks = [];
        this.onMoveCallbacks = [];
        this.onReleaseCallbacks = [];
        this.onTapCallbacks = [];

        var self = this,
            // Minimum time to recognise a mousedown event as a drag start
            dragAndDropMinimumTime = 100,
            downTimestamp,
            upTimestamp,
            downTime,
            wasMoved = false;

        // Attach createjs' event listeners to shape
        shape.addEventListener("mousedown", function(e){
            downTimestamp = Date.now();
            self.onPressCallbacks.forEach(function(callback){callback(e);});
            // console.log("press");
        });
        shape.addEventListener("pressmove", function(e){
            wasMoved = true;
            self.onMoveCallbacks.forEach(function(callback){callback(e);});
            // console.log("move");
        });
        shape.addEventListener("pressup", function(e){
            upTimestamp = Date.now();
            downTime = upTimestamp - downTimestamp;

            if(wasMoved && downTime > dragAndDropMinimumTime){
                self.onReleaseCallbacks.forEach(function(callback){callback(e);});
                // console.log("release");
            }
            else{
                self.onTapCallbacks.forEach(function(callback){callback(e);});
                // console.log("tap");
            }
        });
    };

    CircleDragAndDropManager.prototype = {
        /**
         * onPress callback manager
         *
         * @param callback
         */
        onPress: function (callback) {
            this.onPressCallbacks.push(callback);
        },

        /**
         * onMove callback manager
         *
         * @param callback
         */
        onMove: function(callback){
            this.onMoveCallbacks.push(callback);
        },

        /**
         * onRelease callback manager
         *
         * @param callback
         */
        onRelease: function (callback) {
            this.onReleaseCallbacks.push(callback);
        },

        /**
         * onTap callback manager
         *
         * @param callback
         */
        onTap: function (callback) {
            this.onTapCallbacks.push(callback);
        }
    };

    return CircleDragAndDropManager;
});