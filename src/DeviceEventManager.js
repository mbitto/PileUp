define(function () {

    "use strict";

    var DeviceEventManager = function DeviceEventManager() {

        var self = this;

        this.onMenuCallbacks = [];
        this.onPauseCallbacks = [];
        this.onResumeCallbacks = [];

        document.addEventListener("deviceready", function () {
            document.addEventListener("menubutton", function () {
                self.onMenuCallbacks.forEach(function (callback) {
                    callback.call(this);
                });
            }, false);
            document.addEventListener("pause", function () {
                self.onPauseCallbacks.forEach(function (callback) {
                    callback.call(this);
                });
            }, false);
            document.addEventListener("resume", function () {
                self.onResumeCallbacks.forEach(function (callback) {
                    callback.call(this);
                });
            }, false);
        }, false);

    };

    DeviceEventManager.prototype = {
        onMenu: function (callback) {
            this.onMenuCallbacks.push(callback);
        },

        onPause: function (callback) {
            this.onPauseCallbacks.push(callback);
        },

        onResume: function (callback) {
            this.onResumeCallbacks.push(callback);
        }
    };

    return DeviceEventManager;
});