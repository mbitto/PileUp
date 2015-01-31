define([
    'src/CircleShapeGenerator',
    'src/Circle'
],function(CircleShapeGenerator, Circle) {

    "use strict";

    var CircleFactory = function CircleFactory() {
        this.circleShapeGenerator = new CircleShapeGenerator();
    };

    CircleFactory.prototype = {

        createCircle: function(){
            var shape = this.circleShapeGenerator.getCircleRandomFeatures();
            return new Circle(shape.color, shape.radius);
        }
    };
    return CircleFactory;
});