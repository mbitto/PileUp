define(function() {

    "use strict";

    var UserInteractionManager = function UserInteractionManager(stage, game, positioningManager) {
        this.stage = stage;
        this.game = game;
        this.positioningManager = positioningManager;
    };

    UserInteractionManager.prototype = {
        move: function(e, circle, circlesIterator){

            circlesIterator.forEachCircleInTower(function (circleToMove) {
                circleToMove.getShape().x = e.stageX;
                circleToMove.getShape().y = e.stageY;
            });
        },

        tap: function(e, circle, circlesIterator){

            var self = this;

            if(circlesIterator.getHeight() == 1){ return; }

            // Find top circle id
            var oldBaseCircle = circle.getBaseCircle(),
            // Pop out top circle
                poppedOutCircle = circle.pop();

            // Place circle near tower base circle
            poppedOutCircle.moveSmooth(this.positioningManager.moveNear(this.stage.getCircles(), poppedOutCircle , oldBaseCircle));

            this.game.splittedTower();

            // Add new Circle on stage when some circles have been splitted
            setTimeout(function(){
                self.stage.addCircle();
                self.game.addedCircle();
            }, 300);
        },

        release: function(e, circle, circlesIterator){
            var self = this,
                collidingCircles = this.positioningManager.detectCollision(this.stage.getCircles(), circle);

            if (collidingCircles.length > 0) {
                var collidingCirclesBase = collidingCircles[0],
                    movingCirclesBase = collidingCircles[1];

                if (collidingCirclesBase.canBeMergedWith(movingCirclesBase)) {
                    collidingCirclesBase.mergeWith(movingCirclesBase);
                    this.game.mergedTower();

                    // Add new Circle on stage when some circles have been merged
                    setTimeout(function() {
                        self.stage.addCircle();
                        self.game.addedCircle();
                    }, 300);

                    // TODO: refactor this part
                    if(this.game.isCirclesLimitReached(this.stage.getCircles().length)){
                        circlesIterator.forEachCircleInTower(function(circle){
                            self.stage.removeCircle(circle);
                        });
                        this.game.gameOver();
                    }

                    else if(this.game.isTowerCompleted(circlesIterator.getHeight())){
                        circlesIterator.forEachCircleInTower(function(circle){
                            self.stage.removeCircle(circle);
                        });
                        this.game.doneTower(collidingCirclesBase.getCoordinates());
                    }
                }
                else {
                    collidingCircles[1].moveSmooth(this.positioningManager.moveNear(this.stage.getCircles(), collidingCircles[1], collidingCircles[0]));
                }
            }
        }
    };
    return UserInteractionManager;
});