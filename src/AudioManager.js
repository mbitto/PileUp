define([
    'createjs',
    'soundjs'
],function(createjs) {

    var AudioManager = function AudioManager() {
        this.audioPath = "./assets/";
        this.mergeSound = {id: "merge", src: "merge.ogg"};
        this.splitSound = {id: "split", src: "split.ogg"};
        this.winSound = {id: "win", src: "win.ogg"};
        this.lossSound = {id: "loss", src: "loss.ogg"};
        this.manifest = [this.mergeSound, this.splitSound, this.winSound, this.lossSound];

        createjs.Sound.alternateExtensions = ["mp3"];
        createjs.Sound.registerManifest(this.manifest, this.audioPath);

    };

    AudioManager.prototype = {
        playMerge: function () {
            createjs.Sound.play(this.audioPath + this.mergeSound.src);
        },
        playSplit: function () {
            createjs.Sound.play(this.audioPath + this.splitSound.src);
        },
        playWin: function () {
            createjs.Sound.play(this.audioPath + this.winSound.src);
        },
        playLoss: function () {
            createjs.Sound.play(this.audioPath + this.lossSound.src);
        }

    };

    return AudioManager;
});