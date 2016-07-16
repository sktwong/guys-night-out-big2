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
    vm.data = JSON.stringify(big2AppService.getData(), null, 4);

    $scope.close = function() {
        $uibModalInstance.dismiss('cancel');
    };
}
