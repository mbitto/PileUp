/**
 * Monitor user activity, providing callback for inactivity periods of time
 *
 * @module src/UserActivityMonitor
 */
define(function () {

    "use strict";

    /**
     * @constructor
     *
     * @alias src/UserActivityMonitor
     */
    var UserActivityMonitor = function UserActivityMonitor() {
        this.userInactivityCallback = null;
        this.inactivityInterval = null;
        this.inactivityTimeInterval = 4500;
    };

    UserActivityMonitor.prototype = {
        /**
         * Initialize timer and inactivity callback
         * @param {function} callback
         */
        init: function (callback) {
            var self = this;

            this.userInactivityCallback = callback;
            this.inactivityInterval = setInterval(function () {
                self.userInactivityCallback();
            }, this.inactivityTimeInterval);
        },

        /**
         * Report user activity
         */
        activityNoticed: function () {
            clearInterval(this.inactivityInterval);
            this.init(this.userInactivityCallback);
        },

        /**
         * Stop monitoring
         */
        stop: function () {
            clearInterval(this.inactivityInterval);
        }
    };

    return UserActivityMonitor;
});