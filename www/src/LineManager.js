define(function () {

    "use strict";

    var LineManager = function LineManager(stage, line) {
        stage.addChild(line.getShape());
        this.line = line;
    };

    LineManager.prototype = {
        setLineStartingPoint: function (x, y) {
            console.log('setLineStartingPoint');
            this.line.setStartingPoint(x, y);
        },

        getLineStartingPoint: function () {
            return this.line.getStartingPoint();
        },

        extendLineTo: function (x, y) {
            console.log('extendLineTo');
            this.line.extendTo(x, y);
        },

        removeLine: function () {
            console.log('removeLine');
            this.line.remove();
        }
    };

    return LineManager;
});