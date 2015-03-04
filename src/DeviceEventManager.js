/**
 * Handle device events
 *
 * @module src/DeviceEventManager
 */
define(function () {

    "use strict";

    /**
     *
     * @constructor
     *
     * @alias src/DeviceEventManager
     */
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
        /**
         * On menu button pressed callback manager
         * @param {function} callback
         */
        onMenu: function (callback) {
            this.onMenuCallbacks.push(callback);
        },

        /**
         * On device paused callback manager
         * @param {function} callback
         */
        onPause: function (callback) {
            this.onPauseCallbacks.push(callback);
        },

        /**
         * On device resumed callback manager
         * @param {function} callback
         */
        onResume: function (callback) {
            this.onResumeCallbacks.push(callback);
        }
    };

    return DeviceEventManager;
});