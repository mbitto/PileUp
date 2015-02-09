define([
    'alertify'
],function(alertify){

    "use strict";

    var Information = function Information(circlesClass, towersClass) {
        this.towersCompleted = 0;
        this.circlesCounter = 0;

        this.circlesCounterElement = document.getElementsByClassName(circlesClass)[0];
        this.circlesCounterElement.textContent = "Circles : " + this.circlesCounter;

        this.towersCounterElement = document.getElementsByClassName(towersClass)[0];
        this.towersCounterElement.textContent = "Towers : " + this.towersCompleted;
    };

    Information.prototype = {
        incrementCirclesCounter: function () {
            this.circlesCounter++;
            this.circlesCounterElement.textContent = "Circles : " + this.circlesCounter;
        },

        decrementCirclesCounter: function (quantity) {
            this.circlesCounter = this.circlesCounter - quantity;
            this.circlesCounterElement.textContent = "Circles : " + this.circlesCounter;
        },

        incrementTowersCounter: function () {
            this.towersCompleted++;
            this.towersCounterElement.textContent = "Towers : " + this.towersCompleted;
        },

        displayGameOverMessage: function () {
            alertify.alert("Game Over!</br>Towers completed: " + this.towersCompleted);
        }
    };

    return Information;
});