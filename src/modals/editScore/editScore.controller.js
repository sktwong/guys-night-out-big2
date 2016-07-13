/*
 * Guy's Night Out - Big 2
 * newGame.controller.js
 *
 * Creating new game - modal controller
 *
 */
big2App.controller('modalEditScoreController', ['$scope', 'big2AppService', '$uibModalInstance', 'data', modalEditScoreControllerFn]);

function modalEditScoreControllerFn($scope, big2AppService, $uibModalInstance, data) {

    var vm = this;
    vm.players = angular.copy(data.players);
    vm.gameData = angular.copy(data.gameData);

    $scope.close = function() {
        $uibModalInstance.close({ data: vm.gameData });
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

}
