define(function () {

    "use strict";

    var Instructions = function Instructions() {
        
    };

    Instructions.prototype = {
        start: function () {
            
        },

        closed: function (callback) {
            callback();
        }
    };

    return Instructions;
});