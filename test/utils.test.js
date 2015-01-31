define([
    'src/utils'
], function(utils) {

    describe('utils', function(){

        describe('#getRandomInt', function(){
            it('should return an integer between @min and @max params', function(){
                var res = utils.getRandomInt(1, 2);

                assert.isNumber(res);
                assert.isTrue(Math.floor(res) === res);
                assert.isTrue(res >= 1);
                assert.isTrue(res <= 2);
            });

            it('should work even with negative numbers', function(){
                var res = utils.getRandomInt(-1, 1);

                assert.isTrue(res >= -1);
                assert.isTrue(res <= 1);
            });
        });

        describe('#getRandomCoordinates', function(){

            var res = utils.getRandomCoordinates(10, 15, 15);
            it('should be an object', function(){
                assert.isObject(res);
            });

            it('should has coordinates with value between @minDistance and @maxDistance params', function(){
                assert.isTrue(res.x >= 10);
                assert.isTrue(res.x <= 15);
                assert.isTrue(res.y >= 10);
                assert.isTrue(res.y <= 15);
            });
        });
    });
});