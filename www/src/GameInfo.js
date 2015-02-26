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

        displayGameOverMessage: function (score, highScore, newHighScore, callback) {
            var message = "<strong>Game Over!</strong><br/><br/>"+
                    "Your Score: " + score + "<br/><br/>" +
                    "High score: " + highScore + "<br/><br/>";

            if(newHighScore){
                message += "<strong>New high score!</strong>"
            }

            alertify.alert(message, callback);
        },

        displayInstructionMessage: function (time, cpt, towers, maxCircles, callback) {
            var message = "Time: <strong>" + time + " seconds</strong><br/><br/>" +
                    "Complete a tower piling up: <strong>" + cpt + " circles</strong><br/><br/>" +
                    "Pass this level completing: <strong>" + towers + " towers</strong><br/><br/>" +
                    "Game over with more than: <strong>" + maxCircles + " circles</strong><br/><br/>";

            alertify.alert(message, callback);
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