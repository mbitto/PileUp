define([
    'src/PositioningManager',
    'src/LevelManager',
    'src/AudioManager',
    'src/InfoManager'
], function(PositioningManager, LevelManager, AudioManager, InfoManager) {

    "use strict";

    var EventManager = function EventManager(stage) {
        this.stage = stage;
        this.canvas = stage.getCanvas()
        this.positioningManager = new PositioningManager(this.canvas.getWidth(), this.canvas.getHeight());

        // TODO: level audio and info should be hidden by a facade
        this.levelManager = new LevelManager();
        this.audioManager = new AudioManager();
        this.infoManager = new InfoManager();
    };

    EventManager.prototype = {
        onMove: function(e, circle, circlesIterator){
            circlesIterator.forEachCircleInTower(function (circleToMove) {
                circleToMove.getShape().x = e.stageX;
                circleToMove.getShape().y = e.stageY;
            });
        },

        onTap: function(e, circle, circlesIterator){
            if(circlesIterator.getHeight() == 1){ return; }

            // Find top circle id
            var oldBaseCircle = circle.getBaseCircle(),
            // Pop out top circle
                poppedOutCircle = circle.pop();

            // Place circle near tower base circle
            this.positioningManager.moveNear(this.stage.getCircles(), poppedOutCircle , oldBaseCircle);

            this.audioManager.playSplit();

            // Add new Circle on stage when some circles have been splitted
            this.stage.addCircle();
        },

        onRelease: function(e, circle, circlesIterator){
            var self = this,
                collidingCircles = this.positioningManager.detectCollision(this.stage.getCircles(), circle);

            if (collidingCircles.length > 0) {
                var collidingCirclesBase = collidingCircles[0],
                    movingCirclesBase = collidingCircles[1];

                if (collidingCirclesBase.canBeMergedWith(movingCirclesBase)) {
                    collidingCirclesBase.mergeWith(movingCirclesBase);
                    this.audioManager.playMerge();

                    // Add new Circle on stage when some circles have been merged
                    this.stage.addCircle();

                    if(circlesIterator.getHeight() === this.levelManager.getMaxCirclesPerTower()){

                        circlesIterator.forEachCircleInTower(function(circle){
                            self.stage.removeCircle(circle);
                        });

                        this.infoManager.towerCompleted();
                        this.audioManager.playWin();
                    }
                }
                else {
                    this.positioningManager.moveNear(this.stage.getCircles(), collidingCircles[1], collidingCircles[0]);
                }
            }
        }
    };
    return EventManager;
});