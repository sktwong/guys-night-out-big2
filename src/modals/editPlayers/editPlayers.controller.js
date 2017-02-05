/*
 * Guy's Night Out - Big 2
 * editScore.controller.js
 *
 * Editing new / existing score - modal controller
 *
 */
big2App.controller('modalEditPlayersController', ['$scope', 'big2AppService', '$uibModalInstance', 'data', modalEditPlayersControllerFn]);

function modalEditPlayersControllerFn($scope, big2AppService, $uibModalInstance, data) {

    var vm = this;
    vm.hasError = {};
    vm.playerNames = big2AppService.getPlayerNames();
    vm.players = angular.copy(data.players);
    vm.settings = angular.copy(data.settings);

    $scope.duplicatePlayer = function(player) {
        var count = 0;
        angular.forEach(vm.players, function(val) {
            if (val == player) {
                count++;
            }
        });

        if (count >= 2) {
            vm.hasError[player] = true;
            return true;

        } else {
            vm.hasError[player] = false;
        }
    }

    $scope.checkIfError = function() {
        var hasError = false;
        angular.forEach(vm.hasError, function(val, key) {
            if (val == true) {
                hasError = true;
            }
        });
        return hasError;
    }

    $scope.save = function() {
        $uibModalInstance.close({ data: vm.players });
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
}