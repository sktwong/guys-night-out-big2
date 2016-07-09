/*
 * Guy's Night Out - Big 2
 * navBar.controller.js
 *
 * Navigation bar / menu controller
 *
 */
big2App.controller('navBarController', ['$scope', '$uibModal', navBarControllerFn]);

function navBarControllerFn($scope, $uibModal) {

    var vm = this;
    vm.newGameModal = newGameModal;

    function newGameModal() {
        $uibModal.open({
            templateUrl: 'modals/newGame/newGame.tmpl.html',
            controller: 'modalNewGameController'
        });
    }
}