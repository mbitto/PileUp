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

        allCircles.push(new Circle('#ff0000', 25, 7));
        allCircles.push(new Circle('#ff0000', 46, 1));

        allCircles[0].move({x:100, y:100});
        allCircles[1].move({x:250, y:250});

        describe('#detectCollision', function(){
            it('should return an empty array if no collision is detected', function(){
                var movingCircle = new Circle('#ff0000', 25, 7);
                movingCircle.move({x:150, y:150});
                var collidingCircles = positioningManager.detectCollision(allCircles, movingCircle);

                expect(collidingCircles).to.be.an('Array');
                expect(collidingCircles).to.have.length(0);
            });


            it('should detect collisions between circles in stage and the moving circle', function(){
                var movingCircle = new Circle('#ff0000', 46, 1);
                movingCircle.move({x:110, y:110});
                var collidingCircles = positioningManager.detectCollision(allCircles, movingCircle);

                expect(collidingCircles).to.be.an('Array');
                expect(collidingCircles).to.have.length(2);
                expect(collidingCircles[0]).to.be.an.instanceOf(Circle);
                expect(collidingCircles[1]).to.be.an.instanceOf(Circle);
            });
        });

        describe('#getFreePositionNear', function(){
            it('should move the circle near the base circle', function(){
                var movingCircleRadius = 42.5,
                    movingCircle = new Circle('#ff0000', movingCircleRadius, 2),
                    referenceCircle = new Circle('#ff0000', movingCircleRadius, 2);

                movingCircle.move({x:110, y:110});
                referenceCircle.move({x:500, y:500});

                positioningManager.getFreePositionNear(allCircles, movingCircle, referenceCircle);
                expect(movingCircle.getCoordinates().x - referenceCircle.getCoordinates().x).to.be.lte(movingCircleRadius * 2);
                expect(movingCircle.getCoordinates().y - referenceCircle.getCoordinates().y).to.be.lte(movingCircleRadius * 2);
            });
        });
    });
});