/*
 * Guy's Night Out - Big 2
 * stats.controller.js
 *
 * Game stats - modal controller
 *
 */
big2App.controller('modalStatsController', ['$scope', 'big2AppService', '$uibModalInstance', modalStatsControllerFn]);

function modalStatsControllerFn($scope, big2AppService, $uibModalInstance) {

    var vm = this;
    var data = big2AppService.getData();
    vm.players = data.players;
    vm.gamesPlayed = data.scores.length;

    $scope.close = function() {
        $uibModalInstance.dismiss('cancel');
    };
}