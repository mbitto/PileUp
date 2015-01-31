define([
    'src/CircleShapeGenerator'
], function(CircleShapeGenerator) {

    "use strict";

    describe('CircleShapeGenerator', function(){

        describe('#_updateRepetitionsIndex', function(){
            it('should update the index of this.circlesIndex passed as param', function(){
                var circleShapeGenerator = new CircleShapeGenerator(2);
                circleShapeGenerator._updateRepetitionsIndex(0);
                assert.isTrue(circleShapeGenerator.circlesIndex[0] === 1);

                circleShapeGenerator._updateRepetitionsIndex(0);
                assert.isTrue(circleShapeGenerator.circlesIndex[0] === 2);
            });

            it('should reset index to 0 if all index reach the limit set by constructor', function(){
                var circleShapeGenerator = new CircleShapeGenerator(3);
                for(var i = 0; i<7; i++){
                    circleShapeGenerator._updateRepetitionsIndex(i);
                    circleShapeGenerator._updateRepetitionsIndex(i);
                    circleShapeGenerator._updateRepetitionsIndex(i);
                }
                for(var j = 0; j<7; j++){
                    assert.isTrue(circleShapeGenerator.circlesIndex[j] === 0);
                }
            });
        });

        describe('#getCircleRandomFeatures', function(){
            var circleShapeGenerator = new CircleShapeGenerator();

            it('should return a random shape object having radius and color params', function(){
                var res = circleShapeGenerator.getCircleRandomFeatures();

                assert.isObject(res);
                assert.property(res, 'radius');
                assert.property(res, 'color');
            });

            it('should return an object of circleCollection property', function() {
                var res = circleShapeGenerator.getCircleRandomFeatures(),
                    circlesCollection = circleShapeGenerator.getCirclesCollection();

                assert.include(circlesCollection, res);
            });


        });
    });
});