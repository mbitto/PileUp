//TODO: test it as last

define([
    'Squire',
    'sinon',
    'src/CircleFactory'
], function(Squire, sinon, CircleFactory){
    "use strict";

    var injector = new Squire();
    var stage;
    var createJsStageMock = {
        update: sinon.spy()
    };

    describe('Stage', function(){
        describe('#update', function(){

            beforeEach(function(done) {
                injector.mock({
                    'src/CircleFactory': sinon.stub(),
                    'src/PositionManager': sinon.stub(),
                    'src/CirclesIterator': sinon.stub(),
                    'src/UserInteractionManager': sinon.stub()
                }).require(['src/Stage'], function(Stage) {
                    var game = sinon.stub();
                    stage = new Stage(game, createJsStageMock, 200, 200);
                    done();
                });
            });

            it('should update the stage', function(){
                stage.update();
                //TODO: change assert with should or expect (everywhere in tests)
                assert.ok(createJsStageMock.update.calledOnce);
            });


            it('should add a circle on stage', function(){
            });

            it('should add n circles on stage, with n equal to starting circles quantity given by game', function(){

            });

        });
    });
});