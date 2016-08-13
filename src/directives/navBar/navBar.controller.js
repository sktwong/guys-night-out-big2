/*
 * Guy's Night Out - Big 2
 * navBar.controller.js
 *
 * Navigation bar / menu controller
 *
 */
big2App.controller('navBarController', ['$scope', '$uibModal', 'big2AppService', '$route', navBarControllerFn]);

function navBarControllerFn($scope, $uibModal, big2AppService, $route) {

    var vm = this;
    vm.newGameModal = newGameModal;
    vm.dataModal = dataModal;
    vm.payoutModal = payoutModal;
    vm.statsModal = statsModal;
    vm.historyModal = historyModal;

    function newGameModal() {
        var newGameModal = $uibModal.open({
            size: 'sm',
            templateUrl: 'modals/newGame/newGame.tmpl.html',
            controller: 'modalNewGameController',
            controllerAs: 'vm'
        });

        newGameModal.result.then(function(newGameSettings) {
            big2AppService.createNewGame(newGameSettings);
            $route.reload();
        });
    }

    function dataModal() {
        var dataModal = $uibModal.open({
            size: 'md',
            templateUrl: 'modals/data/data.tmpl.html',
            controller: 'modalDataController',
            controllerAs: 'vm'
        });
    }

    function payoutModal() {
        var payoutModal = $uibModal.open({
            size: 'sm',
            templateUrl: 'modals/payout/payout.tmpl.html',
            controller: 'modalPayoutController',
            controllerAs: 'vm'
        });
    }

    function statsModal() {
        var statsModal = $uibModal.open({
            size: 'md',
            templateUrl: 'modals/stats/stats.tmpl.html',
            controller: 'modalStatsController',
            controllerAs: 'vm',
            resolve: { 
                historyData: function() {
                    return {
                        showHistory: false
                    };
                }
            }
        });
    }

    function historyModal(date) {
        var historyModal = $uibModal.open({
            size: 'md',
            templateUrl: 'modals/stats/stats.tmpl.html',
            controller: 'modalStatsController',
            controllerAs: 'vm',
            resolve: { 
                historyData: function() {
                    return {
                        showHistory: true, 
                        date: date
                    };
                }
            }
        });
    }
}