/**
 * Handle UI game information
 *
 * @module src/GameInfo
 *
 * @requires src/utils
 * @requires alertify
 */
define([
    'src/utils',
    'alertify'
],function(utils, alertify){

    "use strict";

    /**
     * @constructor
     *
     * @param {Sound} sound
     *
     * @alias src/GameInfo
     */
    var GameInfo = function GameInfo(sound) {

        // Dom elements used to show information
        this.scoreMessageDomElement = document.querySelector('.score-message');
        this.pileCompletedScoreMessageDomElement = document.querySelector('.pile-completed-score-message');
        this.timeLeftElement = document.querySelector('.timeLeft');
        this.userScoreElement = document.querySelector('.userScore');
        this.pilesCounterElement = document.querySelector('.pilesCompleted');

        this.sound = sound;
    };

    GameInfo.prototype = {
        /**
         * Set time left for current level
         *
         * @param timeLeft
         */
        setTimeLeft: function (timeLeft) {
            this.timeLeftElement.textContent = "Time: " + timeLeft;
        },

        /**
         * Set current user's score
         *
         * @param {number} score
         */
        setUserScore: function (score) {
            this.userScoreElement.textContent = "Score : " + score;
        },

        /**
         * Set piles completed in current level and piles needed to complete it
         *
         * @param {number} pilesCompleted
         * @param {number} pilesGoal
         */
        setPilesCompletedCounter: function (pilesCompleted, pilesGoal) {
            this.pilesCounterElement.textContent = "Piles : " + pilesCompleted + "/" + pilesGoal;
        },

        /**
         * Display information after game over
         *
         * @param {number} score
         * @param {number} highScore
         * @param {boolean} newHighScore
         * @param {function} callback - Called when user presses ok
         */
        displayGameOverMessage: function (score, highScore, newHighScore, callback) {
            var message = "<strong>Game Over!</strong><br/><br/>"+
                    "Your Score: " + score + "<br/><br/>" +
                    "High score: " + highScore + "<br/><br/>";

            if(newHighScore){
                message += "<strong>New high score!</strong>";
            }

            alertify.alert(message, callback);
            this.sound.playLoss();
        },

        /**
         * Display current level instructions
         *
         * @param {number} time
         * @param {number} cpt
         * @param {number} piles
         * @param {number} maxCircles
         * @param {function} callback - Called when user presses ok
         */
        displayInstructionMessage: function (time, cpt, piles, maxCircles, callback) {
            var message = "Time: <strong>" + time + " seconds</strong><br/><br/>" +
                    "Complete a pile piling up: <strong>" + cpt + " circles</strong><br/><br/>" +
                    "Pass this level completing: <strong>" + piles + " piles</strong><br/><br/>" +
                    "Game over with more than: <strong>" + maxCircles + " circles</strong><br/><br/>";

            alertify.alert(message, callback);
        },

        displayResetMessage: function (okCallback, cancelCallback) {
            var message = "<strong>Paused!</strong><br/><br/> Do you want to restart? <br/><br/>";
            alertify.confirm(message, function (e) {
                if (e) {
                    okCallback();

                } else {
                    cancelCallback();
                }
            });
        },

        /**
         * Display message before to go on the next level
         *
         * @param {number} level
         * @param {function} callback - Called when user presses ok
         */
        displayNextLevelMessage: function (level, callback) {
            alertify.alert("Yeah!</br>Go to level: " + level, callback);
        },

        /**
         * Display generated score on stage
         *
         * @param {number} score
         * @param {number} posX
         * @param {number} posY
         * @param {number} time - time of permanence
         * @param {boolean} pileCompleted - switch to a different style if a pile has been completed
         */
        showScoreMessage: function (score, posX, posY, time, pileCompleted) {
            var element = pileCompleted ? this.pileCompletedScoreMessageDomElement : this.scoreMessageDomElement;


            element.style.left = posX + 'px';
            element.style.top = posY + 'px';
            element.style.color = score > 0 ? 'lime' : 'red';
            element.textContent = score > 0 ? '+' + score : score;

            setTimeout(function(){
                element.textContent = '';
            }, time);
        },

        /**
         * Message to show when pile has been splitted
         *
         * @param {number} score
         * @param {{x: number, y: number}} coordinates
         */
        pileSplitted: function (score, coordinates) {
            this.showScoreMessage(score, coordinates.x + 50, coordinates.y, 500);
            this.sound.playSplit();
        },

        /**
         * Message to show when circles ore piles has been merged
         *
         * @param {number} score
         * @param {{x: number, y: number}} coordinates
         */
        circlesMerged: function (score, coordinates) {
            this.showScoreMessage(score, coordinates.x + 50, coordinates.y, 500);
            this.sound.playMerge();
        },

        /**
         * Message to show when a pile has been completed
         *
         * @param {number} score
         * @param {{x: number, y: number}} coordinates
         */
        pileCompleted: function (score, coordinates) {
            console.log(score, coordinates.x - 50, coordinates.y);
            this.showScoreMessage(score, coordinates.x - 50, coordinates.y, 1000, true);
            this.sound.playWin();
        }
    };

    return GameInfo;
});