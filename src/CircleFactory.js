define([
    'src/CircleShapeGenerator',
    'src/Circle'
],function(CircleShapeGenerator, Circle) {

    "use strict";

    var CircleFactory = function CircleFactory() {
        this.circleShapeGenerator = new CircleShapeGenerator();
    };

    CircleFactory.prototype = {

        createCircle: function(startingPoint){
            var shape = this.circleShapeGenerator.getCircleRandomFeatures();
            console.log(startingPoint);
            return new Circle(shape.color, shape.radius, startingPoint);
        }
    };
    return CircleFactory;
});