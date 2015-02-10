define([
    'createjs',
    'src/CircleFactory',
    'src/PositioningManager',
    'src/CirclesIterator',
    'src/UserInteractionManager'
],function(createjs, CircleFactory, PositioningManager, CirclesIterator, UserInteractionManager){

    "use strict";

    var Stage = function Stage(game, createJSStage, width, height, enableTicker) {
        this.enableTicker = enableTicker;
        this.createJSStage = createJSStage;
        this.circleFactory = new CircleFactory();
        this.positioningManager = new PositioningManager(width, height);
        this.game = game;
        this.userInteractionManager = new UserInteractionManager(this, this.game, this.positioningManager);
        this.circles = [];


        createjs.Touch.enable(createJSStage);
        if(this.enableTicker){
            createjs.Ticker.setFPS(30);
            createjs.Ticker.addEventListener("tick", createJSStage);
        }

    };

    Stage.prototype = {

        update: function(){
            if(!this.enableTicker){
                console.log("Stage update");
                this.createJSStage.update();
            }
        },

        start: function(){
            var startingCirclesQuantity = this.game.getStartingCirclesQuantity();

            // Create initial circles
            var self = this,
                i;

            for(i=0; i<startingCirclesQuantity; i++){
                setTimeout(function(){
                    self.addCircle();
                    self.game.addedCircle();
                    self.update();
                }, 600 * i);
            }
        },

        addCircle: function(){
            var circle = this.circleFactory.createCircle(this.positioningManager.getRandomStartingPoint()),
                self = this;

            this.circles[circle.getId()] = circle;
            var coordinates = this.positioningManager.putCircle(this.circles, circle);
            this.createJSStage.addChild(circle.getShape());

            // Sort circles in order to allow correct overlapping
            this.createJSStage.sortChildren(function (s1, s2) {
                if (s1.radius < s2.radius) { return 1; }
                if (s1.radius > s2.radius) { return -1; }
                return 0;
            });

            circle.moveSmooth(coordinates, 500);

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
