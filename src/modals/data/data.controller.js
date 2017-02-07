/*
 * Guy's Night Out - Big 2
 * data.controller.js
 *
 * Data - modal controller
 *
 */
big2App.controller('modalDataController', ['$scope', 'big2AppService', '$uibModalInstance', modalDataControllerFn]);

function modalDataControllerFn($scope, big2AppService, $uibModalInstance) {

    var vm = this;
    vm.data = JSON.stringify(big2AppService.getData(), null, 4); // Formatted
    vm.email = big2AppService.getEmailInfo();

    $scope.textSelect = function($event) {
        $event.target.setSelectionRange(0, JSON.stringify(vm.data).length);
    }

    $scope.close = function() {
        $uibModalInstance.dismiss('cancel');
    };
}
