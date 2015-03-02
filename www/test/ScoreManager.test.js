define([
    'src/ScoreManager',
    'sinon'
], function (ScoreManager, sinon) {
    "use strict";

    describe('ScoreManager', function(){

        var scoreManager;

        beforeEach(function () {
            scoreManager = new ScoreManager();
        });

        describe('#increaseScore()', function () {
            it('should increase the score', function () {
                var pos1 = 5,
                    pos2 = 1,
                    score;

                score = scoreManager.increaseScore(pos1, pos2);

                expect(score).to.be.equal(20);
                expect(scoreManager.getScore()).to.be.equal(20);

                score = scoreManager.increaseScore(pos1, pos2);

                expect(score).to.be.equal(20);
                expect(scoreManager.getScore()).to.be.equal(40);
            });

            it('should not increase the score if passed value are wrong.', function () {
                var score = scoreManager.increaseScore(0, 10);

                expect(score).to.be.equal(0);
                expect(scoreManager.getScore()).to.be.equal(0);
            });
        });

        describe('#decreaseScore()', function () {
            it('should decrease score', function () {
                var pos1 = 5,
                    pos2 = 1,
                    score;

                scoreManager.increaseScore(pos1, pos2);
                score = scoreManager.decreaseScore(pos1, pos2);
                expect(score).to.be.equal(-40);
                expect(scoreManager.getScore()).to.be.equal(0);
            });
        });

        describe('#increaseScoreForPileCompletion()', function () {
            it('should increase score for a pile completion', function () {
                var score = scoreManager.increaseScoreForPileCompletion(3);
                expect(score).to.be.equal(300);
            });
        });

        describe('#storeNewHighScore()', function () {
            var highScoreValue = 1000,
                spy = sinon.spy(window.localStorage, "setItem");
            it('should store the high score in localStorage', function () {
                scoreManager.storeNewHighScore(highScoreValue);
                expect(spy.calledWith(scoreManager.localStorageKey, highScoreValue)).to.be.true;
            });
            spy.reset();
        });

        describe('#getStoredHighScore()', function () {
            var highScoreValue = 2000,
                stub = sinon.stub(window.localStorage, "getItem");
            stub.returns(highScoreValue);

            it('should return the high score stored in localStorage', function () {
                scoreManager.getStoredHighScore();
                expect(stub.calledWith(scoreManager.localStorageKey)).to.be.true;
            });
            stub.reset();
        });

    });
});