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
    vm.gamesPlayed = data.scores.length;

    vm.stats = {
        totalWins: initBlankStats(),
        totalLosses: initBlankStats(),
        totalSits: initBlankStats(),
        totalPlayed: initBlankStats(),
        totalDoubles: initBlankStats(),
        totalTriples: initBlankStats(),
        winPercentage: initBlankStats(),
        lossPercentage: initBlankStats(),
        totalBigLoser: initBlankStats(),
        avgWinningScore: initBlankStats(),
        avgLosingScore: initBlankStats(),
        winningScores: initBlankStatsArray(),
        losingScores: initBlankStatsArray()
    };

    // Calculate majority of stats
    angular.forEach(data.scores, function(score) {
        var biggestLosingScore = 0;
        console.log('score', score);

        angular.forEach(score, function(val, key) {

            if (key.indexOf('player') > -1) {
                // Total wins
                if (val < 0) {
                    vm.stats.totalWins[key]++;
                    vm.stats.winningScores[key].push({ id: score.id, score: val });
                }

                // Total losses
                if (val > 0) {
                    vm.stats.totalLosses[key]++;
                    vm.stats.losingScores[key].push({ id: score.id, score: val });
                }

                // Total games sat out
                if (val == 0) {
                    vm.stats.totalSits[key]++;
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

                if (val > biggestLosingScore) {
                    biggestLosingScore = val;
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
        vm.stats.lossPercentage[key] = (vm.stats.totalLosses[key] / vm.stats.totalPlayed[key] * 100).toFixed(0);

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

    // Calculate average winning score
    // console.log('winning scores', vm.stats.winningScores);

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