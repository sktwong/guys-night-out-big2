/*
 * Guy's Night Out - Big 2
 * stats.controller.js
 *
 * Game stats - modal controller
 *
 */
big2App.controller('modalStatsController', ['$scope', 'big2AppService', '$uibModalInstance', 'historyData', '$timeout', modalStatsControllerFn]);

function modalStatsControllerFn($scope, big2AppService, $uibModalInstance, historyData, $timeout) {

    var vm = this;
    var data = (historyData.showHistory) ? big2AppService.getHistory(historyData.date) : big2AppService.getData();

    vm.players = data.players;
    vm.scores = data.scores;
    vm.totals = angular.copy(data.totals);
    vm.settings = data.settings;
    vm.gamesPlayed = data.scores.length;
    vm.showHistory = historyData.showHistory;
    vm.historyDate = historyData.date ? formatHistoryDate(historyData.date) : '';

    vm.stats = {
        totals: data.totals || initBlankStats(),
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
        biggestPlayingStreak: initBlankStats(),
        biggestWin: initBlankStats(),
        secondPlace: initBlankStats(),
        thirdPlace: initBlankStats(),
        totalThreeDiamonds: initBlankStats()
    };

    vm.gameStats = {
        mostWins: { number: 0, players: [] },
        mostLosses: { number: 0, players: [] },
        biggestWin: { score: 0, winners: [], formattedWinners: '' },
        biggestLosingStreak: { number: 0, players: [] },
        avgGameLength: { minutes: 0, seconds: 0 }
    }

    var chartStats = {
        'player1': [],
        'player2': [],
        'player3': [],
        'player4': [],
        'player5': []
    };

    // Calculate majority of stats
    angular.forEach(data.scores, function(score) {
        var biggestLosingScore = 0;
        var secondBestScore = 39; // Start second best score at biggest possible (39)
        var thirdBestScore = 39; // Start third best score at biggest possible (39)

        angular.forEach(score, function(val, key) {

            if (key.indexOf('player') > -1) {
                chartStats[key].push(val);

                // Total wins, win streaks
                if (val < 0) {
                    vm.stats.totalWins[key]++;
                    vm.stats.winningScores[key].push({ id: score.id, score: val });

                    // Increment winning streak, set biggest winning streak
                    vm.stats.winningStreaks[key]++;
                    if (vm.stats.winningStreaks[key] > vm.stats.biggestWinningStreak[key]) {
                        vm.stats.biggestWinningStreak[key] = vm.stats.winningStreaks[key];
                    }

                    // Reset losing streak
                    vm.stats.losingStreaks[key] = 0;

                    // Increment playing streak, set biggest playing streak
                    vm.stats.playingStreaks[key]++;
                    if (vm.stats.playingStreaks[key] > vm.stats.biggestPlayingStreak[key]) {
                        vm.stats.biggestPlayingStreak[key] = vm.stats.playingStreaks[key];
                    }
                }

                // Total losses / loss streaks
                if (val > 0) {
                    vm.stats.totalLosses[key]++;
                    vm.stats.losingScores[key].push({ id: score.id, score: val });

                    // Increment losing streak, set biggest losing streak
                    vm.stats.losingStreaks[key]++;
                    if (vm.stats.losingStreaks[key] > vm.stats.biggestLosingStreak[key]) {
                        vm.stats.biggestLosingStreak[key] = vm.stats.losingStreaks[key];
                    }

                    // Reset winning streak
                    vm.stats.winningStreaks[key] = 0;

                    // Increment playing streak, set biggest playing streak
                    vm.stats.playingStreaks[key]++;
                    if (vm.stats.playingStreaks[key] > vm.stats.biggestPlayingStreak[key]) {
                        vm.stats.biggestPlayingStreak[key] = vm.stats.playingStreaks[key];
                    }
                }

                // Total games sat out
                if (val == 0) {
                    vm.stats.totalSits[key]++;

                    // Reset playing streak
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

                // Set second / third place
                if (val > 0 && val <= secondBestScore) {
                    secondBestScore = val;

                } else if (val > 0 && val > secondBestScore && val <= thirdBestScore) {
                    thirdBestScore = val;
                }
            }
        });

        // Set the big losers, second / third place finishers
        angular.forEach(score, function(val, key) {
            if (val == biggestLosingScore) {
                vm.stats.totalBigLoser[key]++;
            }

            if (val == secondBestScore) {
                vm.stats.secondPlace[key]++;
            }

            if (val == thirdBestScore) {
                vm.stats.thirdPlace[key]++;
            }
        });
    });

    var newChartStats = {};
    angular.forEach(chartStats, function(playerVal, playerKey) {
        var total = 0;
        newChartStats[playerKey] = [];
        angular.forEach(playerVal, function(scoreVal, scoreKey) {
            total = (scoreVal || 0) + total;
            newChartStats[playerKey].push({ x: scoreKey, y: total });
        });
    });
    $timeout(function() {
        plotChart(newChartStats);
    }, 0);

    // Calculate:
    // - win / loss percentages
    // - average winning / losing score
    angular.forEach(vm.players, function(val, key) {
        vm.stats.winPercentage[key] = (vm.stats.totalWins[key] / (vm.stats.totalPlayed[key] || 1) * 100).toFixed(0);
        vm.stats.smallWinPercentage[key] = (vm.stats.totalSmallWins[key] / (vm.stats.totalWins[key] || 1) * 100).toFixed(0);
        vm.stats.lossPercentage[key] = (vm.stats.totalLosses[key] / (vm.stats.totalPlayed[key] || 1) * 100).toFixed(0);
        vm.stats.smallLossPercentage[key] = (vm.stats.totalSmallLosses[key] / (vm.stats.totalLosses[key] || 1) * 100).toFixed(0);

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
            // Set overall biggest win
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

            // Set individual biggest win
            if (val.score < vm.stats.biggestWin[key]) {
                vm.stats.biggestWin[key] = val.score;
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

    // Find longest losing streak
    angular.forEach(vm.stats.biggestLosingStreak, function(val, key) {
        if (val > vm.gameStats.biggestLosingStreak.number) {
            vm.gameStats.biggestLosingStreak.number = val;
            vm.gameStats.biggestLosingStreak.players = [vm.players[key] || key];
        }

        else if (val == vm.gameStats.biggestLosingStreak.number) {
            vm.gameStats.biggestLosingStreak.players.push(vm.players[key] || key);
        }
    });

    // Flag the biggest stat in each set
    angular.forEach(vm.stats, function(stat, statKey) {
        var biggestVal = 0;
        var biggestKey = [];

        angular.forEach(stat, function(val, key) {
            if (statKey == 'totals') {
                if (val < biggestVal) {
                    biggestVal = val;
                    biggestKey = [key];

                } else if (val == biggestVal) {
                    biggestKey.push(key);
                }

            } else {
                if (Math.abs(val) > biggestVal) {
                    biggestVal = Math.abs(val);
                    biggestKey = [key];

                } else if (Math.abs(val) == biggestVal) {
                    biggestKey.push(key);
                }
            }
        });
        if (stat) {
            stat.biggest = biggestKey;
        }
    });

    // Calculate average game length
    // - game start time not available, so we take an average out of all the games minus 1
    var startTime = new Date(data.scores[0].timestamp);
    var endTime = new Date(data.scores[data.scores.length - 1].timestamp);
    var totalTime = endTime.getTime() - startTime.getTime();
    var avgGameLength = totalTime / (data.scores.length - 1);

    var avgGameLengthMinutes = Math.floor(avgGameLength / 1000 / 60);
    var avgGameLengthSeconds = ((avgGameLength / 1000) % 60).toFixed(0);
    if (avgGameLengthSeconds >= 0 && avgGameLengthSeconds <= 9) {
        avgGameLengthSeconds = '0' + avgGameLengthSeconds; // pad a leading zero
    }

    vm.gameStats.avgGameLength = {
        minutes: avgGameLengthMinutes,
        seconds: avgGameLengthSeconds
    };

    function initBlankStats() {
        var stat = {};
        for (var i = 0; i < data.settings.numberOfPlayers; i++) {
            stat['player' + (i + 1)] = 0;
        }
        return stat;
    }

    function initBlankStatsArray() {
        var stat = {};
        for (var i = 0; i < data.settings.numberOfPlayers; i++) {
            stat['player' + (i + 1)] = [];
        }
        return stat;
    }

    // Formats historical date format yyyy.mm.dd
    function formatHistoryDate(date) {
        var year = date.substring(0, 4);
        var month = date.substring(5, 7) - 1;
        var day = date.substring(8, 10);
        return new Date(year, month, day);
    }

    $scope.close = function() {
        $uibModalInstance.dismiss('cancel');
    };

    function plotChart(data) {
        var ctx = angular.element('#scoring-trends');
        var myChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: vm.players.player1,
                    fill: false,
                    data: data.player1,
                    borderColor: 'rgba(255, 99, 132, 1)', // red
                    borderWidth: 3,
                    pointRadius: 0
                }, {
                    label: vm.players.player2,
                    fill: false,
                    data: data.player2,
                    borderColor: 'rgba(54, 162, 235, 1)', // blue
                    borderWidth: 3,
                    pointRadius: 0
                }, {
                    label: vm.players.player3,
                    fill: false,
                    data: data.player3,
                    borderColor: 'rgba(255, 206, 86, 1)', // yellow
                    borderWidth: 3,
                    pointRadius: 0
                }, {
                    label: vm.players.player4,
                    fill: false,
                    data: data.player4,
                    borderColor: 'rgba(75, 192, 192, 1)', // green
                    borderWidth: 3,
                    pointRadius: 0
                }, {
                    label: vm.players.player5,
                    fill: false,
                    data: data.player5,
                    borderColor: 'rgba(153, 102, 255, 1)', // purple
                    borderWidth: 3,
                    pointRadius: 0
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            reverse: true
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Score'
                        },
                        gridLines: {
                            display:false
                        }
                    }],
                    xAxes: [{
                        type: 'linear',
                        position: 'bottom',
                        scaleLabel: {
                            display: true,
                            labelString: 'Game #'
                        },
                        gridLines: {
                            display:false
                        }
                    }]
                }
            }
        });
    }
}