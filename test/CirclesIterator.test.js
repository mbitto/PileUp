define([
    'src/CirclesIterator',
    'src/Circle'
], function(CirclesIterator, Circle){
    "use strict";

    describe('CirclesIterator', function(){

        var circle = new Circle('#000000', '#000000', 25, 7),
            middleCircle = new Circle('#000000', '#000000', 32, 5),
            topCircle = new Circle('#000000', '#000000', 39, 3),
            circlesIterator = new CirclesIterator(circle);

        circle.mergeWith(middleCircle);
        circle.mergeWith(topCircle);

        describe('#getTop', function(){
            it('should return the top circle', function(){
                expect(circlesIterator.getTop()).to.be.equal(topCircle);
            });

            it('should return itself', function(){
                var singleCircle = new Circle('#000000', '#000000', 39, 3),
                    singleCirclesIterator = new CirclesIterator(singleCircle);
                expect(singleCirclesIterator.getTop()).to.be.equal(singleCircle);
            });
        });

        describe('#getHeight', function(){
            it('should return the circle height', function(){
                expect(circlesIterator.getHeight()).to.be.equal(3);
            });
        });

        describe('#getCircleAtHeight', function(){
            it('should return the circle situated to the given height', function(){
                expect(circlesIterator.getCircleAtHeight(1)).to.be.equal(circle);
                expect(circlesIterator.getCircleAtHeight(2)).to.be.equal(middleCircle);
                expect(circlesIterator.getCircleAtHeight(3)).to.be.equal(topCircle);
            });
        });

        describe('#forEachCircleInPile', function(){
            it('should loop through the circle collection', function(){
                var index = 0,
                    circles = [circle, middleCircle, topCircle];

                circlesIterator.forEachCircleInPile(function(circle){
                    expect(circles[index]).to.be.equal(circle);
                    index++;
                });
            });
        });

    });
});