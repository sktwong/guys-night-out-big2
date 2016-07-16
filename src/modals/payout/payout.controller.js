/*
 * Guy's Night Out - Big 2
 * newGame.controller.js
 *
 * Creating new game - modal controller
 *
 */
big2App.controller('modalPayoutController', ['$scope', 'big2AppService', '$uibModalInstance', modalPayoutControllerFn]);

function modalPayoutControllerFn($scope, big2AppService, $uibModalInstance) {

    var data = big2AppService.getData();
    var vm = this;
    vm.players = data.players;
    vm.totals = data.totals;
    vm.pointValue = data.settings.pointValue;

    $scope.close = function() {
        $uibModalInstance.dismiss('cancel');
    };
}
