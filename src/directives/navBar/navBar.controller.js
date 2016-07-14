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
}