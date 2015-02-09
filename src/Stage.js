define([
    'createjs',
    'src/CircleFactory',
    'src/PositioningManager',
    'src/CirclesIterator',
    'src/UserInteractionManager'
],function(createjs, CircleFactory, PositioningManager, CirclesIterator, UserInteractionManager){

    "use strict";

    var Stage = function Stage(game, createJSStage, width, height) {
        this.createJSStage = createJSStage;
        this.circleFactory = new CircleFactory();
        this.positioningManager = new PositioningManager(width, height);
        this.game = game;
        this.userInteractionManager = new UserInteractionManager(this, this.game, this.positioningManager);
        this.circles = [];
    };

    Stage.prototype = {

        update: function(){
            this.createJSStage.update();
        },

        start: function(){
            var startingCirclesQuantity = this.game.getStartingCirclesQuantity();

            // Create initial circles
            var i;

            for(i=0; i<startingCirclesQuantity; i++){
                this.addCircle();
                this.game.addedCircle();
            }

            this.update();
        },

        addCircle: function(){
            var circle = this.circleFactory.createCircle(),
                self = this;

            this.circles[circle.getId()] = circle;
            this.positioningManager.putCircle(this.circles, circle);
            this.createJSStage.addChild(circle.getShape());

            // Sort circles in order to allow correct overlapping
            this.createJSStage.sortChildren(function (s1, s2) {
                if (s1.radius < s2.radius) { return 1; }
                if (s1.radius > s2.radius) { return -1; }
                return 0;
            });

            var circlesIterator = new CirclesIterator(circle);

            circle.onPress(function(){
                circlesIterator.forEachCircleInTower(function(circle){
                    circle.setBlur();
                });
                self.update();
            });

            circle.onMove(function (e) {
                self.userInteractionManager.move(e, circle, circlesIterator);
                self.update();
            });

            circle.onTap(function (e) {

                circlesIterator.forEachCircleInTower(function(circle) {
                    circle.removeBlur();
                });

                self.userInteractionManager.tap(e, circle, circlesIterator);
                self.update();
            });

            circle.onRelease(function (e) {
                circlesIterator.forEachCircleInTower(function(circle) {
                    circle.removeBlur();
                });

                self.userInteractionManager.release(e, circle, circlesIterator);
                self.update();
            });

            return circle;
        },

        removeCircle: function(circle){
            this.createJSStage.removeChild(circle.getShape());
            delete this.circles[circle.getId()];
        },

        getCircles: function(){
            return this.circles;
        }
    };

    return Stage;
});
