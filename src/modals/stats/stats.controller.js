/*
 * Guy's Night Out - Big 2
 * stats.controller.js
 *
 * Game stats - modal controller
 *
 */
big2App.controller('modalStatsController', ['$scope', 'big2AppService', '$uibModalInstance', modalStatsControllerFn]);

function modalStatsControllerFn($scope, big2AppService, $uibModalInstance) {

    var vm = this;
    var data = big2AppService.getData();
    vm.players = data.players;
    vm.totals = data.totals;
    vm.gamesPlayed = data.scores.length;

    vm.stats = {
        totalWins: initBlankStats(),
        totalSmallWins: initBlankStats(),
        totalLosses: initBlankStats(),
        totalSmallLosses: initBlankStats(),
        totalSits: initBlankStats(),
        totalPlayed: initBlankStats(),
        totalDoubles: initBlankStats(),
        totalTriples: initBlankStats(),
        winPercentage: initBlankStats(),
        smallWinPercentage: initBlankStats(),
        lossPercentage: initBlankStats(),
        smallLossPercentage: initBlankStats(),
        totalBigLoser: initBlankStats(),
        avgWinningScore: initBlankStats(),
        avgLosingScore: initBlankStats(),
        winningScores: initBlankStatsArray(),
        losingScores: initBlankStatsArray(),
        winningStreaks: initBlankStats(),
        biggestWinningStreak: initBlankStats(),
        losingStreaks: initBlankStats(),
        biggestLosingStreak: initBlankStats(),
        playingStreaks: initBlankStats(),
        biggestPlayingStreak: initBlankStats()
    };

    vm.gameStats = {
        mostWins: { number: 0, players: [] },
        mostLosses: { number: 0, players: [] },
        biggestWin: { score: 0, winners: [], formattedWinners: '' }
    }

    // Calculate majority of stats
    angular.forEach(data.scores, function(score) {
        var biggestLosingScore = 0;

        angular.forEach(score, function(val, key) {

            if (key.indexOf('player') > -1) {
                // Total wins, win streaks
                if (val < 0) {
                    vm.stats.totalWins[key]++;
                    vm.stats.winningScores[key].push({ id: score.id, score: val });

                    // Increment winning streak
                    vm.stats.winningStreaks[key]++;

                    // Set biggest losing streak
                    if (vm.stats.losingStreaks[key] > vm.stats.biggestLosingStreak[key]) {
                        vm.stats.biggestLosingStreak[key] = vm.stats.losingStreaks[key];
                    }
                    vm.stats.losingStreaks[key] = 0;

                    // Increment playing streak
                    vm.stats.playingStreaks[key]++;
                }

                // Total losses / loss streaks
                if (val > 0) {
                    vm.stats.totalLosses[key]++;
                    vm.stats.losingScores[key].push({ id: score.id, score: val });

                    // Increment losing streak
                    vm.stats.losingStreaks[key]++;

                    // Set biggest winning streak
                    if (vm.stats.winningStreaks[key] > vm.stats.biggestWinningStreak[key]) {
                        vm.stats.biggestWinningStreak[key] = vm.stats.winningStreaks[key];
                    }
                    vm.stats.winningStreaks[key] = 0;

                    // Increment playing streak
                    vm.stats.playingStreaks[key]++;
                }

                // Total games sat out
                if (val == 0) {
                    vm.stats.totalSits[key]++;

                    // Set biggest playing streak
                    if (vm.stats.playingStreaks[key] > vm.stats.biggestPlayingStreak[key]) {
                        vm.stats.biggestPlayingStreak[key] = vm.stats.playingStreaks[key];
                    }
                    vm.stats.playingStreaks[key] = 0;
                }

                // Total games played
                if (val < 0 || val > 0) {
                    vm.stats.totalPlayed[key]++;
                }

                // Total Doubles
                if (val == 20 || val == 22 || val == 24) {
                    vm.stats.totalDoubles[key]++;
                }

                // Total Triples
                if (val == 39) {
                    vm.stats.totalTriples[key]++;
                }

                // Set the biggest losing score
                if (val > biggestLosingScore) {
                    biggestLosingScore = val;
                }

                // Total small wins (3 - 9 cards)
                if (val >= -9 && val <= -3) {
                    vm.stats.totalSmallWins[key]++;
                }

                // Total small losses (1 - 3 cards)
                if (val == 1 || val == 2 || val == 3) {
                    vm.stats.totalSmallLosses[key]++;
                }
            }
        });

        // Set the big losers (account for ties)
        angular.forEach(score, function(val, key) {
            if (val == biggestLosingScore) {
                vm.stats.totalBigLoser[key]++;
            }
        });
    });

    // Calculate:
    // - win / loss percentages
    // - average winning / losing score
    angular.forEach(vm.players, function(val, key) {
        vm.stats.winPercentage[key] = (vm.stats.totalWins[key] / vm.stats.totalPlayed[key] * 100).toFixed(0);
        vm.stats.smallWinPercentage[key] = (vm.stats.totalSmallWins[key] / vm.stats.totalWins[key] * 100).toFixed(0);
        vm.stats.lossPercentage[key] = (vm.stats.totalLosses[key] / vm.stats.totalPlayed[key] * 100).toFixed(0);
        vm.stats.smallLossPercentage[key] = (vm.stats.totalSmallLosses[key] / vm.stats.totalLosses[key] * 100).toFixed(0);

        var totalWinningScores = 0;
        angular.forEach(vm.stats.winningScores[key], function(val, key) {
            totalWinningScores += val.score;
        });
        vm.stats.avgWinningScore[key] = (totalWinningScores / (vm.stats.totalWins[key] || 1)).toFixed(0);

        var totalLosingScores = 0;
        angular.forEach(vm.stats.losingScores[key], function(val, key) {
            totalLosingScores += val.score;
        });
        vm.stats.avgLosingScore[key] = (totalLosingScores / (vm.stats.totalLosses[key] || 1)).toFixed(0);
    });

    // Calculate most wins, biggest win
    var biggestWin = 0;
    angular.forEach(vm.stats.winningScores, function(val, key) {
        if (val.length > vm.gameStats.mostWins.number) {
            vm.gameStats.mostWins.number = val.length;
            vm.gameStats.mostWins.players = [vm.players[key] || key];
        }

        else if (val.length == vm.gameStats.mostWins.number) {
            vm.gameStats.mostWins.players.push(vm.players[key] || key);   
        }

        // Determine the biggest win(s)
        angular.forEach(val, function(val) {
            if (val.score < vm.gameStats.biggestWin.score) {
                vm.gameStats.biggestWin.score = val.score;
                vm.gameStats.biggestWin.winners = [{
                    player: vm.players[key],
                    gameId: val.id
                }];
                vm.gameStats.biggestWin.formattedWinners = [vm.players[key] + ' - Game ' + val.id];
            }

            else if (val.score == vm.gameStats.biggestWin.score) {
                vm.gameStats.biggestWin.winners.push({
                    player: vm.players[key],
                    gameId: val.id
                });
                vm.gameStats.biggestWin.formattedWinners.push(vm.players[key] + ' - Game ' + val.id);
            }
        });
    });

    // Calculate most losses
    angular.forEach(vm.stats.losingScores, function(val, key) {
        if (val.length > vm.gameStats.mostLosses.number) {
            vm.gameStats.mostLosses.number = val.length;
            vm.gameStats.mostLosses.players = [vm.players[key] || key];
        }

        else if (val.length == vm.gameStats.mostLosses.number) {
            vm.gameStats.mostLosses.players.push(vm.players[key] || key);
        }
    });

    function initBlankStats() {
        var settings = big2AppService.getSettings();
        var stat = {};
        for (var i = 0; i < settings.numberOfPlayers; i++) {
            stat['player' + (i + 1)] = 0;
        }
        return stat;
    }

    function initBlankStatsArray() {
        var settings = big2AppService.getSettings();
        var stat = {};
        for (var i = 0; i < settings.numberOfPlayers; i++) {
            stat['player' + (i + 1)] = [];
        }
        return stat;
    }

    $scope.close = function() {
        $uibModalInstance.dismiss('cancel');
    };
}