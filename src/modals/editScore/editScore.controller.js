/*
 * Guy's Night Out - Big 2
 * editScore.controller.js
 *
 * Editing new / existing score - modal controller
 *
 */
big2App.controller('modalEditScoreController', ['$scope', 'big2AppService', '$uibModalInstance', 'data', modalEditScoreControllerFn]);

function modalEditScoreControllerFn($scope, big2AppService, $uibModalInstance, data) {

    var vm = this;
    vm.players = angular.copy(data.players);
    vm.gameData = angular.copy(data.gameData);
    vm.winner = findWinner(vm.gameData);

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

    $scope.calculateScore = function() {
        var total = '';
        angular.forEach(vm.gameData, function(val, key) {
            if (key.indexOf('player') > -1) {
                if (val == 10) { vm.gameData[key] = 20; }
                else if (val == 11) { vm.gameData[key] = 22; }
                else if (val == 12) { vm.gameData[key] = 24; }
                else if (val == 13) { vm.gameData[key] = 39; }
                else if (val < 0) { vm.gameData[key] = ''; }

                // Only add a value if positive, ignore negative values
                if (val > 0) {
                    total -= parseInt(vm.gameData[key] || 0);
                }
            }
        });
        vm.gameData[vm.winner] = total;
    }

    $scope.close = function() {
        $uibModalInstance.close({ data: vm.gameData });
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
}