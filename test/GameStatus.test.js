define([
    'src/GameStatus',
    'src/Level',
    'sinon'
], function(GameStatus, Level, sinon){
    "use strict";

    describe('GameStatus', function(){

        var level,
            gameStatus,
            time = 60,
            circlesPerPile = 5,
            pilesGoal = 5,
            maxCircles = 10,
            startingCirclesQuantity = 3;

        beforeEach(function(){
            level =  new Level(time, circlesPerPile, pilesGoal, maxCircles);
            level.startingCirclesQuantity = startingCirclesQuantity;
            gameStatus = new GameStatus(level);
        });

        describe('#init()', function () {
            before(function () {
                this.clock = sinon.useFakeTimers();
            });

            it('should call timeTick and gameOver callbacks', function () {
                var timeTickCounter = 0,
                    gameOverCallbackCalled = false,
                    timeTickCallback = function () {
                        timeTickCounter++;
                    },
                    gameOverCallback = function () {
                        gameOverCallbackCalled = true;
                    };

                gameStatus.init(timeTickCallback, gameOverCallback);
                expect(timeTickCounter).to.be.equal(0);
                this.clock.tick(1000);
                expect(timeTickCounter).to.be.equal(1);
                expect(gameOverCallbackCalled).to.be.false;
                this.clock.tick(1000);
                expect(timeTickCounter).to.be.equal(2);
                expect(gameOverCallbackCalled).to.be.false;
                this.clock.tick(1000);
                expect(timeTickCounter).to.be.equal(3);
                expect(gameOverCallbackCalled).to.be.false;
                this.clock.tick(58000);
                expect(timeTickCounter).to.be.equal(60);
                expect(gameOverCallbackCalled).to.be.true;
            });
            after(function () {
                this.clock.restore();
            });
        });

        describe('#getStartingCirclesQuantity()', function () {
            it('should return the starting circles quantity', function() {
                expect(gameStatus.getStartingCirclesQuantity()).to.equal(startingCirclesQuantity);
            });
        });

        describe('#isPileCompleted()', function () {
            it('should return false if argument is less than piles goal', function() {
                expect(gameStatus.isPileCompleted(pilesGoal - 1)).to.be.false;
            });

            it('should return true if argument is equal to piles goal', function() {
                expect(gameStatus.isPileCompleted(pilesGoal)).to.be.true;
            });

            it('should return true if argument is more then piles goal', function() {
                expect(gameStatus.isPileCompleted(pilesGoal + 1)).to.be.true;
            });

        });

        describe('#isCirclesLimitReached()', function () {
            it('should return false if number of circles added is less or equal than circles per pile value', function() {
                for(var i = 1; i<10; i++){
                    gameStatus.circleAdded();
                }
                expect(gameStatus.isCirclesLimitReached()).to.be.false;
            });

            it('should return true if number of circles added is more than circles per pile value', function() {
                for(var i = 1; i<=10; i++){
                    gameStatus.circleAdded();
                }
                expect(gameStatus.isCirclesLimitReached()).to.be.true;
            });
        });

        describe('#pileCompleted()', function () {
            it('should update the circle counter according to circles per pile value', function() {
                var circlesAdded = 7;
                for(var i = 1; i <= circlesAdded; i++){
                    gameStatus.circleAdded();
                }
                gameStatus.pileCompleted();
                expect(gameStatus.circlesCounter).to.equal(circlesAdded - circlesPerPile);
                expect(gameStatus.getCompletedPilesQuantity()).to.equal(1);
            });
        });

        describe('#circleAdded()', function () {
            it('should update the circle counter', function () {
                var circlesAdded = 7;
                for(var i = 1; i <= circlesAdded; i++){
                    gameStatus.circleAdded();
                    expect(gameStatus.circlesCounter).to.equal(i);
                }
            });
        });

        describe('#isLevelCompleted()', function () {
            it('should return false if piles completed level ', function () {
                var pilesCompleted = 4;

                for(var i = 1; i <= pilesCompleted; i++){
                    gameStatus.pileCompleted();
                }

                expect(gameStatus.isLevelCompleted()).to.be.false;

                gameStatus.pileCompleted();

                expect(gameStatus.isLevelCompleted()).to.be.true;
            });
        });

        describe('#getCompletedPilesQuantity()', function () {
            it('should return completed piles quantity', function () {
                var pilesCompleted = 10;

                for(var i = 1; i <= pilesCompleted; i++){
                    gameStatus.pileCompleted();
                }

                expect(gameStatus.getCompletedPilesQuantity()).to.equal(pilesCompleted);
            });
        });

        describe('#clearCurrentGame()', function () {
            before(function () {
                this.clock = sinon.useFakeTimers();
            });
            it('should clear internal interval', function () {
                var timeTickCounter = 0,
                    gameOverCallbackCalled = false,
                    timeTickCallback = function () {
                        timeTickCounter++;
                    },
                    gameOverCallback = function () {
                        gameOverCallbackCalled = true;
                    };

                gameStatus.init(timeTickCallback, gameOverCallback);
                expect(timeTickCounter).to.be.equal(0);
                this.clock.tick(1000);
                expect(timeTickCounter).to.be.equal(1);
                gameStatus.clearCurrentGame();
                this.clock.tick(1000);
                expect(timeTickCounter).to.be.equal(1);
            });
            after(function () {
                this.clock.restore();
            });
        });

        describe('#startTimer()', function () {
            before(function () {
                this.clock = sinon.useFakeTimers();
            });

            it('should pause internal timer and restart it on request', function () {
                var timeTickCounter = 0,
                    timeTickCallback = function () {
                        timeTickCounter++;
                    };

                gameStatus.init(timeTickCallback, function () {});
                expect(timeTickCounter).to.be.equal(0);
                this.clock.tick(1000);
                expect(timeTickCounter).to.be.equal(1);
                gameStatus.clearCurrentGame();
                this.clock.tick(1000);
                expect(timeTickCounter).to.be.equal(1);
                gameStatus.startTimer(1);
                this.clock.tick(1000);
                expect(timeTickCounter).to.be.equal(2);
            });

            after(function () {
                this.clock.restore();
            });
        });
    });
});