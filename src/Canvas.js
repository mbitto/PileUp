define(function(){
    var Canvas = function Canvas(canvasElement){

        this.width = canvasElement.width = window.innerWidth - 5;
        this.height = canvasElement.height = window.innerHeight - 5;

        console.log('window size', window.innerWidth + 'x' + window.innerHeight);
        console.log('canvas size', canvasElement.width + 'x' + canvasElement.height);

    };

    Canvas.prototype = {
        getWidth: function(){
            return this.width;
        },
        getHeight: function(){
            return this.height;
        }
    };

    return Canvas;
});