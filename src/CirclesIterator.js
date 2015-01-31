define(function () {

    "use strict";

    var CirclesIterator = function CirclesIterator(circle) {
        this.circle = circle;
    };

    CirclesIterator.prototype = {
        hasUpper: function(circle){
            return circle.getUpperCircle().getId() !== circle.getId();
        },

        getUpper: function(circle) {
            return circle.getUpperCircle();
        },

        getCircleAtHeight: function(height){
            var circle = this.circle.getBaseCircle(),
                index = 1;

            if(height > this.getHeight()){
                return null;
            }

            while(index !== height){
                circle = this.getUpper(circle);
                index++;
            }
            return circle;
        },

        getTop: function(){
            var index = this.circle;
            while(this.hasUpper(index)){
                index = this.getUpper(index);
            }
            return index;
        },

        getHeight: function(){
            var counter = 1;
            var index = this.circle.getBaseCircle();
            while(this.hasUpper(index)){
                index = this.getUpper(index);
                counter++;
            }
            return counter;
        },

        forEachCircleInTower: function(callback) {
            var circle = this.circle.getBaseCircle();
            callback(circle);
            while(this.hasUpper(circle)){
                circle = this.getUpper(circle);
                callback(circle);
            }
        }
    };

    return CirclesIterator;
});