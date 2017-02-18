/*
 * Guy's Night Out - Big 2
 * editScore.controller.js
 *
 * Editing new / existing score - modal controller
 *
 */
big2App.controller('modalEditScoreController', ['$scope', 'big2AppService', '$uibModalInstance', 'data', '$timeout', modalEditScoreControllerFn]);

function modalEditScoreControllerFn($scope, big2AppService, $uibModalInstance, data, $timeout) {

    var vm = this;
    vm.biggestLoser = null;
    vm.gameData = convertScoreToCards(angular.copy(data.gameData));
    vm.players = angular.copy(data.players);
    vm.recentScores = angular.copy(data.scores);
    vm.settings = big2AppService.getSettings();
    vm.tiedPlayers = [];
    vm.winner = findWinner(vm.gameData);

    // Converts doubled / tripled scores into cards left
    function convertScoreToCards(data) {
        angular.forEach(data, function(val, key) {
            if (key.indexOf('player') > -1) {
                if (val == 20) { data[key] = 10; }
                else if (val == 22) { data[key] = 11; }
                else if (val == 24) { data[key] = 12; }
                else if (val == 39) { data[key] = 13; }
                else if (val == '') { data[key] = 0; }
            }
        });
        return data;
    }

    // Checks whether a winner exists in existing gameData
    function findWinner(gameData) {
        var winner = '';
        angular.forEach(vm.gameData, function(val, key) {
            if (key.indexOf('player') > -1) {
                if (val < 0) {
                    winner = key;
                }
            }
        });
        return winner;
    }

    // Converts cards left into double / tripled scores
    $scope.convertCardsToScore = function (cards) {
        var score = 0;
        if (cards == 10) { score = 20; }
        else if (cards == 11) { score = 22; }
        else if (cards == 12) { score = 24; }
        else if (cards == 13) { score = 39; }
        else if (cards == '') { score = 0; }
        else { score = cards; }
        return score;
    }

    // Sets the winning score, erases any previously set winner
    $scope.calculateWinningScore = function() {
        var playersArray = [];
        vm.recentScores = angular.copy(data.scores); // Reset score data to erase any previous biggestLoserScore property

        // Only set the winner if it has already been choosen in the modal
        if (vm.winner) {
            var total = 0;
            angular.forEach(vm.gameData, function(val, key) {
                if (key.indexOf('player') > -1) {
                    if (val == 10) { val = 20; }
                    else if (val == 11) { val = 22; }
                    else if (val == 12) { val = 24; }
                    else if (val == 13) { val = 39; }

                    // Only add a value if positive, ignore negative values
                    if (val > 0) {
                        total -= parseInt(val || 0);
                    }

                    // Erase any previous winner
                    if (val < 0) {
                        vm.gameData[key] = '';
                    }

                    // Create player array for determining biggest loser
                    playersArray.push(key);
                }
            });
            vm.gameData[vm.winner] = total;
            vm.biggestLoser = getBiggestLoserOfGame(vm.gameData.id, playersArray, true);
        }
    };

    // Determine who sits out next:
    // - biggest losing score
    // - if tied, look back to previous games
    //   - if score > other people's score -> biggest loser
    //   - score of people who sat out = 0 (i.e. if tied with someone who didn't play the last game, automatically sits out)
    // - recursive in case of ties
    // - isCurrentGame is used to determine where to pull scores array from
    function getBiggestLoserOfGame(gameId, biggestLoserArray, isCurrentGame) {
        var gameToCheck = isCurrentGame ? vm.gameData : vm.recentScores[gameId - 1];
        var tempBiggestLoser = null;
        var tempBiggestLoserArray = [];
        var biggestLoserScore = 0;

        angular.forEach(biggestLoserArray, function(loser) {
            angular.forEach(gameToCheck, function(val, key) {
                if (key == loser) {
                    if (val > biggestLoserScore) {
                        biggestLoserScore = val;
                        tempBiggestLoserArray = [key];
                    }

                    else if (val == biggestLoserScore) {
                        tempBiggestLoserArray.push(key);
                    }
                }
            });
        });

        // Add reference point in score object for highlighting in template
        gameToCheck.biggestLoserPlayers = tempBiggestLoserArray;

        // Set the tied players of the current game to highlight in score table
        if (isCurrentGame) { 
            vm.tiedPlayers = tempBiggestLoserArray;
        }

        if (tempBiggestLoserArray.length > 1) {
            tempBiggestLoser = getBiggestLoserOfGame(gameId - 1, tempBiggestLoserArray, false);

        } else {
            tempBiggestLoser = tempBiggestLoserArray[0];
        }

        return tempBiggestLoser;
    }

    $scope.close = function() {
        vm.gameData.timestamp = (new Date()).toJSON();
        delete vm.gameData.biggestLoserPlayers;

        $uibModalInstance.close({ 
            data: vm.gameData,
            winner: vm.winner
        });
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
}