define([
    'src/utils',
    'alertify'
],function(utils, alertify){

    "use strict";

    var GameInfo = function GameInfo(timeLeftClass, circlesClass, towersClass, sound) {
        this.praiseMessages = ['Well done!', 'Great!', 'Good one!', 'Good!', 'Nice one!', 'Wow!'];

        this.timeLeftElement = document.querySelector('.' + timeLeftClass);
        this.circlesCounterElement = document.querySelector('.' + circlesClass);
        this.towersCounterElement = document.querySelector('.' + towersClass);

        this.sound = sound;
    };

    GameInfo.prototype = {
        setTimeLeft: function (timeLeft) {
            this.timeLeftElement.textContent = "Time left: " + timeLeft;
        },

        setCirclesCounter: function (circles) {
            this.circlesCounterElement.textContent = "Circles : " + circles;
        },

        setTowersCompletedCounter: function (towersCompleted, towersGoal) {
            this.towersCounterElement.textContent = "Towers : " + towersCompleted + "/" + towersGoal;
        },

        displayGameOverMessage: function (callback) {
            alertify.alert("Game Over!", callback);
        },

        displayNextLevelMessage: function (level, callback) {
            alertify.alert("Yeah!</br>Go to level: " + level, callback);
        },

        towerSplitted: function () {
            this.sound.playSplit();
        },

        circlesMerged: function () {
            this.sound.playMerge();
        },

        towerCompleted: function (posX, posY) {
            var randomPraiseMessage = this.praiseMessages[utils.getRandomInt(0, this.praiseMessages.length - 1)],
                praiseMessageDomElement = document.querySelector('.praise-message');

            praiseMessageDomElement.textContent = randomPraiseMessage;
            praiseMessageDomElement.style.left = posX + 'px';
            praiseMessageDomElement.style.top = posY + 'px';
            setTimeout(function(){
                praiseMessageDomElement.textContent = '';
            }, 3000);
            this.sound.playWin();
        }
    };

    return GameInfo;
});