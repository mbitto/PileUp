/**
 * Handle game's sounds
 *
 * @module src/Sound
 * @requires createjs
 * @requires soundjs
 *
 *
 */
define([
    'createjs',
    'soundjs'
],function(createjs) {

    "use strict";

    /**
     * @constructor
     * @alias src/Sound
     */
    var Sound = function Sound() {

        this.audioPath = "sounds/";
        this.gameStartSound = {id: "game-start", src: "game-start.ogg"};
        this.mergeSound = {
            1: {id: "merge1", src: "merge1.ogg"},
            2: {id: "merge2", src: "merge2.ogg"},
            3: {id: "merge3", src: "merge3.ogg"}
        };
        this.splitSound = {id: "split", src: "split.ogg"};
        this.winSound = {id: "win", src: "win.ogg"};
        this.lossSound = {id: "loss", src: "loss.ogg"};
        this.inactivitySound = {id: "inactivity", src: "inactivity.ogg"};

        this.manifest = [
            this.mergeSound[1], this.mergeSound[2], this.mergeSound[3], this.splitSound,
            this.winSound, this.lossSound, this.gameStartSound, this.inactivitySound
        ];


        createjs.Sound.alternateExtensions = ["mp3"];
        createjs.Sound.registerSounds(this.manifest, this.audioPath);

    };

    Sound.prototype = {

        /**
         * Play sound for user game start
         */
        playGameStart: function () {
            createjs.Sound.play(this.audioPath + this.gameStartSound.src);
        },

        /**
         * Play sound for a merge
         *
         * @param mergeImportance
         */
        playMerge: function (mergeImportance) {
            createjs.Sound.play(this.audioPath + this.mergeSound[mergeImportance].src);
        },

        /**
         * Play sound for a split
         */
        playSplit: function () {
            createjs.Sound.play(this.audioPath + this.splitSound.src);
        },

        /**
         * Play sound for a level win
         */
        playWin: function () {
            createjs.Sound.play(this.audioPath + this.winSound.src);
        },

        /**
         * Play sound for a game loss
         */
        playLoss: function () {
            createjs.Sound.play(this.audioPath + this.lossSound.src);
        },

        /**
         * Play sound for user inactivity
         */
        playInactivity: function () {
            createjs.Sound.play(this.audioPath + this.inactivitySound.src);
        }

    };

    return Sound;
});