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
    vm.players = angular.copy(data.players);

    $scope.save = function() {
        $uibModalInstance.close({ data: vm.players });
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
}