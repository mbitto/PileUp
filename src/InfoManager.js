define(function(){

    "use strict";

    var InfoManager = function InfoManager() {
        this.towersCompleted = 0;
    };

    InfoManager.prototype = {
        setTowersQuantity: function (qty) {
            console.log("Towers: ", qty);
        },

        setCirclesQuantity: function (qty) {
            console.log("Circles: ", qty);
        },

        towerCompleted: function () {
            console.log("Towers completed: ", ++this.towersCompleted);
        },

        addLooseMessage: function () {
            console.log("LOOSE");
        },

        clear: function () {

        }
    };

    return InfoManager;
});