/*
 * Guy's Night Out - Big 2
 * newGame.controller.js
 *
 * Creating new game - modal controller
 *
 */
big2App.controller('modalNewGameController', ['$scope', 'big2AppService', '$uibModalInstance', modalNewGameControllerFn]);

function modalNewGameControllerFn($scope, big2AppService, $uibModalInstance) {

    var vm = this;
    vm.numberOfPlayers = '5';
    vm.pointValue = '0.10';

    $scope.createGame = function() {
        var newGameSettings = {
            'numberOfPlayers': vm.numberOfPlayers,
            'pointValue': vm.pointValue
        };

        $uibModalInstance.close(newGameSettings);
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
}
