define([
    'src/Circle'
], function(Circle){
    "use strict";

    describe('Circle', function(){

        describe('#getBaseCircle', function(){
            it('should return itself', function(){
                var circle = new Circle('#000000', 40, {x:100, y:100});
                assert.isTrue(circle.getBaseCircle() === circle);
            });
        });

        describe('#getUpperCircle', function(){
            it('should return itself', function(){
                var circle = new Circle('#000000', 40, {x:100, y:100});
                assert.isTrue(circle.getUpperCircle() === circle);
            });
        });

        describe('#canBeMergedWith', function(){
            it('should return true if this circle can be merged', function(){
                var baseCircle = new Circle('#000000', 40, {x:100, y:100}),
                    movingCircle = new Circle('#000000', 30, {x:200, y:200});

                assert.isTrue(baseCircle.canBeMergedWith(movingCircle));
                assert.isFalse(movingCircle.canBeMergedWith(baseCircle));
            });
        });

        describe('#mergeWith', function(){
            it('should merge with the other circle', function(){
                var baseCircle = new Circle('#000000', 40, {x:100, y:100}),
                    movingCircle = new Circle('#000000', 30, {x:200, y:200});

                baseCircle.mergeWith(movingCircle);

                assert.isTrue(baseCircle.getUpperCircle() === movingCircle);
                assert.isTrue(movingCircle.getBaseCircle() === baseCircle);
            });
        });

        describe('#pop', function(){
            it('should pop out the last circle', function(){
                var baseCircle = new Circle('#000000', 40, {x:100, y:100}),
                    movingCircle = new Circle('#000000', 30, {x:200, y:200});

                baseCircle.mergeWith(movingCircle);

                baseCircle.pop();

                assert.isTrue(baseCircle.getUpperCircle() === baseCircle);
                assert.isTrue(movingCircle.getBaseCircle() === movingCircle);
                assert.isNull(baseCircle.pop());
            });
        });
    });
});