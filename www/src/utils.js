define(function() {
    "use strict";

    /**
     * utils module, export generic use functions
     * @exports src/utils
     */

    return {
        /**
         * Get a random integer from min and max
         *
         * @param {Number} min (integer)
         * @param {Number} max (integer)
         * @returns {Number} (integer)
         */
        getRandomInt: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        /**
         * Get random coordinates for x and y in a range that varies from a common minimum distance to
         * a specified max distance for x and y
         *
         * @param commonMinDistance (integer)
         * @param xMaxDistance (integer)
         * @param yMaxDistance (integer)
         * @returns {{x: *, y: *}} (both integer)
         */
        getRandomCoordinates: function (commonMinDistance, xMaxDistance, yMaxDistance) {
            var xMultiplier = xMaxDistance - commonMinDistance,
                yMultiplier = yMaxDistance - commonMinDistance;

            return {
                x: commonMinDistance + parseInt(Math.random() * xMultiplier, 10),
                y: commonMinDistance + parseInt(Math.random() * yMultiplier, 10)
            };
        }
    };
});