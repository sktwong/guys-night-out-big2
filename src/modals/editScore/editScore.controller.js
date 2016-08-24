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
    vm.players = angular.copy(data.players);
    vm.gameData = convertScoreToCards(angular.copy(data.gameData));
    vm.winner = findWinner(vm.gameData);
    vm.starter = vm.gameData.starter;

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
                    if (val < 0) { vm.gameData[key] = ''; }
                }
            });
            vm.gameData[vm.winner] = total;
        }
    };

    $scope.close = function() {
        vm.gameData.timestamp = (new Date()).toJSON();
        vm.gameData.starter = vm.starter;
        $uibModalInstance.close({ 
            data: vm.gameData,
            winner: vm.winner
        });
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
}