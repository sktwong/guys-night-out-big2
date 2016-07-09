/*
 * Guy's Night Out - Big 2
 * newGame.controller.js
 *
 * Creating new game - modal controller
 *
 */
 big2App.controller('modalNewGameController', ['$scope', 'big2AppService', ModalNewGameControllerFn]);

 function ModalNewGameControllerFn($scope, big2AppService) {
    // $scope.gameData = JSON.stringify(localStorageService.get('guysNightOut-big2'));

    $scope.yes = function() { 
        big2AppService.getData();
    }
 }
