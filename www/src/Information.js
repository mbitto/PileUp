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

        getCirclesCount: function () {
            return this.circlesCounter;
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
        },

        displayPraiseMessage: function (message, color, posX, posY) {
            var praiseMessageDomElement = document.getElementsByClassName('praise-message')[0];
            praiseMessageDomElement.textContent = message;
            praiseMessageDomElement.style.color = color;
            praiseMessageDomElement.style.left = posX + 'px';
            praiseMessageDomElement.style.top = posY + 'px';
            setTimeout(function(){
                praiseMessageDomElement.textContent = '';
            }, 1500);
        }
    };

    return Information;
});