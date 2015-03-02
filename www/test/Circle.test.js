define([
    'src/Circle',
    'sinon'
], function(Circle, sinon){
    "use strict";

    describe('Circle', function(){

        var circle = new Circle('#000000', 25, 7);

        describe('#move', function(){
            it('should move the circle to the new position', function(){
                circle.move({x:100, y:300});
                var coordinates = circle.getCoordinates();
                expect(coordinates.x).to.be.equal(100);
                expect(coordinates.y).to.be.equal(300);
            });
        });

        describe('#moveSmooth', function () {

            it('should move the circle to the new position smoothly', function(done){

                var sCircle = new Circle('#000000', 25, 7);

                sCircle.moveSmooth({x:500, y:50}, 100, function () {
                    var coordinates = sCircle.getCoordinates();
                    expect(coordinates.x).to.be.equal(500);
                    expect(coordinates.y).to.be.equal(50);
                    done();
                    console.log("done() called");
                });

            });
        });

        describe('#getBaseCircle', function(){
            it('should return itself', function(){
                expect(circle.getBaseCircle()).to.be.equal(circle);
            });
        });

        describe('#getUpperCircle', function(){
            it('should return itself', function(){
                expect(circle.getUpperCircle()).to.be.equal(circle);
            });
        });

        describe('#canBeMergedWith', function(){
            it('should return true if this circle can be merged', function(){
                var baseCircle = new Circle('#000000', 40, {x:100, y:100}),
                    movingCircle = new Circle('#000000', 30, {x:200, y:200});

                expect(baseCircle.canBeMergedWith(movingCircle)).to.be.ok;
                expect(movingCircle.canBeMergedWith(baseCircle)).to.not.be.ok;
            });
        });

        describe('#mergeWith', function(){
            it('should merge with the other circle', function(){
                var baseCircle = new Circle('#000000', 40, {x:100, y:100}),
                    movingCircle = new Circle('#000000', 30, {x:200, y:200});

                baseCircle.mergeWith(movingCircle);

                expect(baseCircle.getUpperCircle()).to.be.equal(movingCircle);
                expect(movingCircle.getBaseCircle()).to.be.equal(baseCircle);
            });
        });

        describe('#pop', function(){
            it('should pop out the last circle', function(){
                var baseCircle = new Circle('#000000', 40, {x:100, y:100}),
                    movingCircle = new Circle('#000000', 30, {x:200, y:200});

                baseCircle.mergeWith(movingCircle);

                baseCircle.pop();

                expect(baseCircle.getUpperCircle()).to.be.equal(baseCircle);
                expect(movingCircle.getBaseCircle()).to.be.equal(movingCircle);
                expect(baseCircle.pop()).to.be.null;
            });
        });
    });
});