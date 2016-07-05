/*
 * Guy's Night Out - Big 2
 * data.controller.js
 *
 * Raw game data
 *
 */
 big2App.controller('dataController', ['$scope', 'localStorageService', DataControllerFn]);

 function DataControllerFn($scope, localStorageService) {
    $scope.gameData = JSON.stringify(localStorageService.get('guysNightOut-big2'));
 }
