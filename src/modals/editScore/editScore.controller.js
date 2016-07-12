/*
 * Guy's Night Out - Big 2
 * newGame.controller.js
 *
 * Creating new game - modal controller
 *
 */
big2App.controller('modalEditScoreController', ['$scope', 'big2AppService', '$uibModalInstance', 'gameData', modalEditScoreControllerFn]);

function modalEditScoreControllerFn($scope, big2AppService, $uibModalInstance, gameData) {
    // $scope.gameData = JSON.stringify(localStorageService.get('guysNightOut-big2'));

    $scope.id = gameData.id;
    

    $scope.yes = function() {
        big2AppService.getData();
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    console.log('gameData', gameData);
}
