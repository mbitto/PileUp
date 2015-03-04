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
        this.audioPath = "./assets/";
        this.mergeSound = {id: "merge", src: "merge.ogg"};
        this.splitSound = {id: "split", src: "split.ogg"};
        this.winSound = {id: "win", src: "win.ogg"};
        this.lossSound = {id: "loss", src: "loss.ogg"};
        this.manifest = [this.mergeSound, this.splitSound, this.winSound, this.lossSound];

        createjs.Sound.alternateExtensions = ["mp3"];
        createjs.Sound.registerSounds(this.manifest, this.audioPath);

    };

    Sound.prototype = {
        /**
         * Play sound for a merge
         */
        playMerge: function () {
            createjs.Sound.play(this.audioPath + this.mergeSound.src);
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
            //createjs.Sound.play(this.audioPath + this.winSound.src);
        },

        /**
         * Play sound for a game loss
         */
        playLoss: function () {
            //createjs.Sound.play(this.audioPath + this.lossSound.src);
        }

    };

    return Sound;
});