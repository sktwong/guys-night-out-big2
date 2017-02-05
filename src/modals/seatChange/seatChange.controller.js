/*
 * Guy's Night Out - Big 2
 * seatChange.controller.js
 *
 * Seat Change Reminder - modal controller
 *
 */
big2App.controller('modalSeatChangeController', ['$scope', 'big2AppService', '$uibModalInstance', modalSeatChangeControllerFn]);

function modalSeatChangeControllerFn($scope, big2AppService, $uibModalInstance) {

    $scope.ok = function() {
        $uibModalInstance.dismiss('cancel');
    };
}
