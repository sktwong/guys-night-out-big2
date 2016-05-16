/*
 * Guy's Night Out
 * Big 2 - Score Calculator
 */
 var big2App = angular.module('big2App',[]);
 big2App.controller('Big2Controller', ['$scope', Big2ControllerFn]);

 function Big2ControllerFn ($scope) {

    // Available functions
    $scope.editScores = editScores;
    $scope.editPlayers = editPlayers;
    $scope.savePlayers = savePlayers;

    // Data objects
    $scope.players = {}; // Player names

    function editScores() {
        $('#edit-scores').modal('show');
    }

    // Displays edit players modal
    function editPlayers() {
        // Set player names if present
        $('#player1').val($scope.players.one);
        $('#player2').val($scope.players.two);
        $('#player3').val($scope.players.three);
        $('#player4').val($scope.players.four);

        // Show modal
        $('#edit-players').modal('show');

        // Auto focus first field (doesn't work on iOS)
        // $('#edit-players').on('shown.bs.modal', function () {
        //     $('#player1').focus();
        // })  

        // Allow Enter key to save players
        $('#edit-players').keypress(function(e) {
            console.log('enter');
            if(e.which == 13) {
                $('#save-players').click();
            }
        });
    }

    // Saves player names to scope, then closes modal
    function savePlayers() {
        $scope.players.one = $('#player1').val();
        $scope.players.two = $('#player2').val();
        $scope.players.three = $('#player3').val();
        $scope.players.four = $('#player4').val();

        $('#edit-players').modal('hide');
    }
}
