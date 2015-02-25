define([
    'src/utils',
    'alertify'
],function(utils, alertify){

    "use strict";

    var GameInfo = function GameInfo(timeLeftClass, userScoreClass, towersClass, sound) {

        this.scoreMessageDomElement = document.querySelector('.score-message');
        this.towerCompletedScoreMessageDomElement = document.querySelector('.tower-completed-score-message');

        this.timeLeftElement = document.querySelector('.' + timeLeftClass);
        this.userScoreElement = document.querySelector('.' + userScoreClass);
        this.towersCounterElement = document.querySelector('.' + towersClass);

        this.sound = sound;
    };

    GameInfo.prototype = {
        setTimeLeft: function (timeLeft) {
            this.timeLeftElement.textContent = "Time left: " + timeLeft;
        },

        setUserScore: function (score) {
            this.userScoreElement.textContent = "Score : " + score;
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

        showScoreMessage: function (score, posX, posY, time, towerCompleted) {
            var element = towerCompleted ? this.towerCompletedScoreMessageDomElement : this.scoreMessageDomElement;


            element.style.left = posX + 'px';
            element.style.top = posY + 'px';
            element.style.color = score > 0 ? 'lime' : 'red';
            element.textContent = score > 0 ? '+' + score : score;

            setTimeout(function(){
                element.textContent = '';
            }, time);
        },

        towerSplitted: function (score, coordinates) {
            this.showScoreMessage(score, coordinates.x + 50, coordinates.y, 500);
            this.sound.playSplit();
        },

        circlesMerged: function (score, coordinates) {
            this.showScoreMessage(score, coordinates.x + 50, coordinates.y, 500);
            this.sound.playMerge();
        },

        towerCompleted: function (score, coordinates) {
            console.log(score, coordinates.x - 50, coordinates.y);
            this.showScoreMessage(score, coordinates.x - 50, coordinates.y, 1000, true);
            //this.sound.playWin();
        }
    };

    return GameInfo;
});