define([
    'createjs',
    'src/CircleFactory',
    'src/PositioningManager',
    'src/LevelManager',
    'src/CirclesIterator',
    'src/EventManager'
],function(createjs, CircleFactory, PositioningManager, LevelManager, CirclesIterator, EventManager){

    "use strict";

    var Stage = function Stage(canvas) {
        this.canvas = canvas;
        this.createJSStage = new createjs.Stage(canvas.getElement());
        this.circleFactory = new CircleFactory();
        this.positioningManager = new PositioningManager(this.canvas.getWidth(), this.canvas.getHeight());
        this.levelManager = new LevelManager();
        this.eventManager = new EventManager(this);
        this.circles = [];

        createjs.Touch.enable(this.createJSStage);
    };

    Stage.prototype = {

        update: function(){
            this.createJSStage.stage.update();
        },

        start: function(){

            // Create initial circles
            var startingCirclesQuantity = this.levelManager.getStartingCirclesQuantity(),
                i;

            for(i=0; i<startingCirclesQuantity; i++){
                this.addCircle();
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

            circle.onMove(function (e) {
                self.eventManager.onMove(e, circle, circlesIterator);
                self.update();
            });

            circle.onTap(function (e) {
                self.eventManager.onTap(e, circle, circlesIterator);
                self.update();
            });

            circle.onRelease(function (e) {
                self.eventManager.onRelease(e, circle, circlesIterator);
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
        },

        getCanvas: function () {
            return this.canvas;
        }
    };

    return Stage;
});
