/*
 * Guy's Night Out - Big 2
 * payout.controller.js
 *
 * Game payouts - modal controller
 *
 */
big2App.controller('modalPayoutController', ['$scope', 'big2AppService', '$uibModalInstance', modalPayoutControllerFn]);

function modalPayoutControllerFn($scope, big2AppService, $uibModalInstance) {

    var vm = this;
    var data = big2AppService.getData();
    vm.players = data.players;
    vm.totals = data.totals;
    vm.pointValue = data.settings.pointValue;

    $scope.close = function() {
        $uibModalInstance.dismiss('cancel');
    };
}
