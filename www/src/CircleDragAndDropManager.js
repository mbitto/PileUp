define(function () {

    "use strict";

    var CircleDragAndDropManager = function CircleDragAndDropManager(shape) {

        this.onPressCallbacks = [];
        this.onMoveCallbacks = [];
        this.onReleaseCallbacks = [];
        this.onTapCallbacks = [];

        var self = this,
            dragAndDropMinimumTime = 100,
            downTimestamp,
            upTimestamp,
            downTime,
            wasMoved = false;

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
        onPress: function (callback) {
            this.onPressCallbacks.push(callback);
        },

        onMove: function(callback){
            this.onMoveCallbacks.push(callback);
        },

        onRelease: function (callback) {
            this.onReleaseCallbacks.push(callback);
        },

        onTap: function (callback) {
            this.onTapCallbacks.push(callback);
        }
    };

    return CircleDragAndDropManager;
});