define([
    'src/PositioningManager',
    'src/Circle'
], function(PositioningManager, Circle) {

    "use strict";

    describe('PositioningManager', function(){

        var canvasWidth = 500,
            canvasHeight = 500,
            positioningManager = new PositioningManager(canvasWidth, canvasHeight),
            allCircles = [];

        allCircles.push(new Circle('#ff0000', 20, {x:100, y:100}));
        allCircles.push(new Circle('#ff0000', 50, {x:250, y:250}));

        describe('#detectCollision', function(){
            it('should return an empty array if no collision is detected', function(){
                var movingCircle = new Circle('#ff0000', 20, {x:150, y:150});
                var collidingCircles = positioningManager.detectCollision(allCircles, movingCircle);

                assert.isArray(collidingCircles);
                assert.lengthOf(collidingCircles, 0);
            });


            it('should detect collisions between circles in stage and the moving circle', function(){
                var movingCircle = new Circle('#ff0000', 40, {x:110, y:110});
                var collidingCircles = positioningManager.detectCollision(allCircles, movingCircle);

                assert.isArray(collidingCircles);
                assert.lengthOf(collidingCircles, 2);
                assert.instanceOf(collidingCircles[0], Circle);
                assert.instanceOf(collidingCircles[1], Circle);
            });
        });

        describe('#getFreePositionNear', function(){
            it('should move the circle near the base circle', function(){
                var movingCircleRadius = 40,
                    movingCircle = new Circle('#ff0000', movingCircleRadius, {x:110, y:110}),
                    referenceCircle = new Circle('#ff0000', movingCircleRadius, {x:500, y:500});

                positioningManager.getFreePositionNear(allCircles, movingCircle, referenceCircle);
                assert.isTrue(movingCircle.getCoordinates().x - referenceCircle.getCoordinates().x <= movingCircleRadius * 2);
                assert.isTrue(movingCircle.getCoordinates().y - referenceCircle.getCoordinates().y <= movingCircleRadius * 2);
            });
        });
    });
});