/*
 * Guy's Night Out
 * Big 2 - Score Calculator
 */
 var big2App = angular.module('big2App',[]);
 big2App.controller('Big2Controller', ['$scope', Big2ControllerFn]);

 function Big2ControllerFn ($scope) {

    // Available functions
    $scope.editPlayers = editPlayers;
    $scope.savePlayers = savePlayers;
    $scope.editScores = editScores;
    $scope.saveScores = saveScores;

    // Data objects
    $scope.players = {}; // Player names
    $scope.scores = {}; // Scores
    $scope.scores = [
        {
            'id': '1',
            'player1': '',
            'player2': '',
            'player3': '',
            'player4': ''
        }
    ];

    // Displays edit players modal
    function editPlayers() {
        // Set player names if present
        $('#edit-players .player1').val($scope.players.one);
        $('#edit-players .player2').val($scope.players.two);
        $('#edit-players .player3').val($scope.players.three);
        $('#edit-players .player4').val($scope.players.four);

        // Show modal
        $('#edit-players').modal('show');

        // Allow Enter key to save players
        $('#edit-players').keypress(function(e) {
            if(e.which == 13) {
                $('#save-players').click();
            }
        });
    }

    // Saves player names to scope, then closes modal
    function savePlayers() {
        $scope.players.one = $('#edit-players .player1').val();
        $scope.players.two = $('#edit-players .player2').val();
        $scope.players.three = $('#edit-players .player3').val();
        $scope.players.four = $('#edit-players .player4').val();

        $('#edit-players').modal('hide');
    }

    // Displays save scores modal
    function editScores(game) {
        // Update player names
        $('#edit-scores label.player1').text($('.players .player1').text());
        $('#edit-scores label.player2').text($('.players .player2').text());
        $('#edit-scores label.player3').text($('.players .player3').text());
        $('#edit-scores label.player4').text($('.players .player4').text());

        // Set scores if present
        $('#edit-scores-id').text(game.id);
        $('#edit-scores input.player1').val(game.player1);
        $('#edit-scores input.player2').val(game.player2);
        $('#edit-scores input.player3').val(game.player3);
        $('#edit-scores input.player4').val(game.player4);

        // Show modal and set Save button disable status
        $('#edit-scores').modal('show');
        setSaveDisableStatus();

        // Enable save button if score validation passes
        // - validate after each number entry
        $('#edit-scores').keyup(function(e) {
            setSaveDisableStatus();

            // Allow enter key to save
            if (isScoreValid() && e.which == 13) {
                $('#save-scores').click();
            }
        });
    }

    // Toggles disabled status of Save button
    function setSaveDisableStatus() {
        if (isScoreValid()) {
            $('#save-scores').prop('disabled', false);
        } else {
            $('#save-scores').prop('disabled', true);
        }
    }

    // Saves scores to scope, then closes modal
    function saveScores() {
        var gameId = parseInt($('#edit-scores-id').text());
        var index = gameId - 1;

        // Calculate individual / total scores
        var score = calculateScore();
        console.log('score', score);

        var game = {
            'id': gameId,
            'player1': score.player1,
            'player2': score.player2,
            'player3': score.player3,
            'player4': score.player4,
        }

        // Find game via index and update
        $scope.scores[index] = game;

        // If this is the latest game, add a new blank row to score table
        if ($scope.scores.length == gameId) {
            var newGame =  {
                'id': gameId + 1,
                'player1': '',
                'player2': '',
                'player3': '',
                'player4': ''
            }
            $scope.scores.push(newGame);
        }

        $('#edit-scores').modal('hide');
    }

    // Validates score entries
    function isScoreValid() {
        var scorePlayer1 = $('#edit-scores input.player1').val();
        var scorePlayer2 = $('#edit-scores input.player2').val();
        var scorePlayer3 = $('#edit-scores input.player3').val();
        var scorePlayer4 = $('#edit-scores input.player4').val();
        var allScores = [scorePlayer1, scorePlayer2, scorePlayer3, scorePlayer4];

        // Iterate through all scores and record number of positive entries, negative entries, and sums
        var positiveScores = 0;
        var positiveScoresSum = 0;
        var negativeScores = 0;
        var negativeScoresSum = 0;
        angular.forEach(allScores, function(val, key) {
            // If positive score, increase tally and add to score total
            if (val > 0) {
                positiveScores++;
                positiveScoresSum += parseInt(val);
            }
            // If negative score, assume a total was manually entered, record the value
            if (val < 0) {
                negativeScores++;
                negativeScoresSum += parseInt(val);
            }
        });

        // Validate using the following rules:
        // - if 3 positive numbers are entered
        // - if 3 positive numbers and a negative number equal to the sum of the 3 positive numbers
        if (positiveScores == 3) {
            if (negativeScores == 0) {
                return true;
            }
            if (negativeScores == 1 && positiveScoresSum == Math.abs(negativeScoresSum)) {
                return true;
            }
        }
        return false;
    }

    // Calculates scores for a game
    // - if an entered value is 10, 11, 12 -> double
    // - if an entered value is 13 -> triple
    // - if an entered value is blank -> sum up other scores
    function calculateScore() {
        var score = {};
        var scorePlayer1 = $('#edit-scores input.player1').val();
        var scorePlayer2 = $('#edit-scores input.player2').val();
        var scorePlayer3 = $('#edit-scores input.player3').val();
        var scorePlayer4 = $('#edit-scores input.player4').val();
        var allScores = [scorePlayer1, scorePlayer2, scorePlayer3, scorePlayer4];
        var totalScore = 0;

        // Iterate through scores, doubling / tripling if needed, and adding total score
        angular.forEach(allScores, function(val, key) {
            if (val == 10) { allScores[key] = 20; }
            else if (val == 11) { allScores[key] = 22; }
            else if (val == 12) { allScores[key] = 24; }
            else if (val == 13) { allScores[key] = 39; }
            totalScore += parseInt(allScores[key]) || 0;
        });

        // Apply total score to the missing entry
        angular.forEach(allScores, function(val, key) {
            if (val == 0 || val == '') {
                allScores[key] = -Math.abs(totalScore);
            }
        });

        // Update scores and return
        score.player1 = allScores[0];
        score.player2 = allScores[1];
        score.player3 = allScores[2];
        score.player4 = allScores[3];
        return score;
    }
}