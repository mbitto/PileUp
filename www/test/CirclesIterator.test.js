define([
    'src/CirclesIterator',
    'src/Circle'
], function(CirclesIterator, Circle){
    "use strict";

    describe('CirclesIterator', function(){

        var circle = new Circle('#000000', 40, {x:100, y:100}),
            middleCircle = new Circle('#000000', 30, {x:200, y:200}),
            topCircle = new Circle('#000000', 20, {x:300, y:300}),
            circlesIterator = new CirclesIterator(circle);

        circle.mergeWith(middleCircle);
        circle.mergeWith(topCircle);


        describe('#getTop', function(){
            it('should return the top circle', function(){
                assert.equal(circlesIterator.getTop(), topCircle);
            });

            it('should return itself', function(){
                var singleCircle = new Circle('#000000', 40, {x:100, y:100}),
                    singleCirclesIterator = new CirclesIterator(singleCircle);

                assert.equal(singleCirclesIterator.getTop(), singleCircle);
            });
        });

        describe('#getHeight', function(){
            it('should return the circle height', function(){
                assert.isTrue(circlesIterator.getHeight() === 3);
            });
        });

        describe('#getCircleAtHeight', function(){
            it('should return the circle situated to the given height', function(){
                assert.equal(circlesIterator.getCircleAtHeight(1), circle);
                assert.equal(circlesIterator.getCircleAtHeight(2), middleCircle);
                assert.equal(circlesIterator.getCircleAtHeight(3), topCircle);
            });
        });

        describe('#forEachCircleInTower', function(){
            it('should loop through the circle collection', function(){
                var index = 0,
                    circles = [circle, middleCircle, topCircle];

                circlesIterator.forEachCircleInTower(function(circle){
                    assert.equal(circles[index], circle);
                    index++;
                });
            });
        });

    });
});