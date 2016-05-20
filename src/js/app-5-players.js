/*
 * Guy's Night Out
 * Big 2 - Score Calculator
 */
 var big2App = angular.module('big2App', ['ngCookies']);
 big2App.controller('Big2Controller', ['$scope', '$cookies', Big2ControllerFn]);

 function Big2ControllerFn($scope, $cookies) {

    // Available functions
    $scope.editPlayers = editPlayers;
    $scope.savePlayers = savePlayers;
    $scope.editScores = editScores;
    $scope.saveScores = saveScores;
    $scope.newGame = newGame;
    $scope.newGameModal = newGameModal;

    // Data objects
    var gameData = {}; // Game data object, used for data storage
    $scope.players = {}; // Player names
    $scope.scores = []; // All game scores
    $scope.totals = {}; // All game score totals

    // Initialize app
    init();

    // Initializes app
    // - loads an existing game if found
    // - starts a new game if none is found
    function init() {

        // Use data from cookies if exists
        gameData = getCookieData();
        if (!gameData) {
            gameData = initGameData();
        }
        $scope.gameData = gameData;
        $scope.players = gameData.players;
        $scope.scores = gameData.scores;
        saveCookieData();
        updateScoreTotals();
    }

    // Initializes game data
    function initGameData() {
        var data = {
            'players': {
                'player1': '',
                'player2': '',
                'player3': '',
                'player4': '',
                'player5': ''
            },
            'scores': [{
                'id': '1',
                'player1': '',
                'player2': '',
                'player3': '',
                'player4': '',
                'player5': ''
            }]
        };
        return data;
    }

    // New game modal
    function newGameModal() {
        // Show modal
        $('#new-game').modal('show');
    }

    // New game
    function newGame() {
        gameData = initGameData();
        $scope.players = gameData.players;
        $scope.scores = gameData.scores;
        $scope.totals = {}
        saveCookieData();
        $('#new-game').modal('hide');
    }

    // Displays edit players modal
    function editPlayers() {
        // Set player names if present
        $('#edit-players .player1').val($scope.players.player1);
        $('#edit-players .player2').val($scope.players.player2);
        $('#edit-players .player3').val($scope.players.player3);
        $('#edit-players .player4').val($scope.players.player4);
        $('#edit-players .player5').val($scope.players.player5);

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
        $scope.players.player1 = $('#edit-players .player1').val();
        $scope.players.player2 = $('#edit-players .player2').val();
        $scope.players.player3 = $('#edit-players .player3').val();
        $scope.players.player4 = $('#edit-players .player4').val();
        $scope.players.player5 = $('#edit-players .player5').val();

        // Save latest game data to cookie
        saveCookieData();

        $('#edit-players').modal('hide');
    }

    // Displays save scores modal
    function editScores(game) {
        // Update player names
        $('#edit-scores label.player1').text($('.players .player1').text());
        $('#edit-scores label.player2').text($('.players .player2').text());
        $('#edit-scores label.player3').text($('.players .player3').text());
        $('#edit-scores label.player4').text($('.players .player4').text());
        $('#edit-scores label.player5').text($('.players .player5').text());

        // Set scores if present
        $('#edit-scores-id').text(game.id);
        $('#edit-scores input.player1').val(game.player1);
        $('#edit-scores input.player2').val(game.player2);
        $('#edit-scores input.player3').val(game.player3);
        $('#edit-scores input.player4').val(game.player4);
        $('#edit-scores input.player5').val(game.player5);

        // Show modal and set Save button disable status
        $('#edit-scores').modal('show');

        // Enable save button if score validation passes
        // - validate after each number entry
        $('#edit-scores').keyup(function(e) {

            // Allow enter key to save
            if (e.which == 13) {
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
        var game = {
            'id': gameId,
            'player1': score.player1,
            'player2': score.player2,
            'player3': score.player3,
            'player4': score.player4,
            'player5': score.player5,
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
                'player4': '',
                'player5': ''
            }
            $scope.scores.push(newGame);
        }

        // Save latest game data to cookie
        saveCookieData();

        // Update score totals
        updateScoreTotals();

        $('#edit-scores').modal('hide');
    }

    // Validates score entries
    function isScoreValid() {
        var scorePlayer1 = $('#edit-scores input.player1').val();
        var scorePlayer2 = $('#edit-scores input.player2').val();
        var scorePlayer3 = $('#edit-scores input.player3').val();
        var scorePlayer4 = $('#edit-scores input.player4').val();
        var scorePlayer5 = $('#edit-scores input.player5').val();
        var allScores = [scorePlayer1, scorePlayer2, scorePlayer3, scorePlayer4, scorePlayer5];

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
        var scorePlayer5 = $('#edit-scores input.player5').val();
        var allScores = [scorePlayer1, scorePlayer2, scorePlayer3, scorePlayer4, scorePlayer5];
        var totalScore = 0;

        // Iterate through scores, doubling / tripling if needed, and adding total score
        angular.forEach(allScores, function(val, key) {
            if (val == 10) { allScores[key] = 20; }
            else if (val == 11) { allScores[key] = 22; }
            else if (val == 12) { allScores[key] = 24; }
            else if (val == 13) { allScores[key] = 39; }
            totalScore += parseInt(allScores[key]) || 0;
        });

        // Update scores and return
        score.player1 = allScores[0];
        score.player2 = allScores[1];
        score.player3 = allScores[2];
        score.player4 = allScores[3];
        score.player5 = allScores[4];
        return score;
    }

    // Updates score totals
    function updateScoreTotals() {
        var sumPlayer1 = 0;
        var sumPlayer2 = 0;
        var sumPlayer3 = 0;
        var sumPlayer4 = 0;
        var sumPlayer5 = 0;

        angular.forEach($scope.scores, function(val, key) {
            sumPlayer1 += parseInt(val.player1 || 0);
            sumPlayer2 += parseInt(val.player2 || 0);
            sumPlayer3 += parseInt(val.player3 || 0);
            sumPlayer4 += parseInt(val.player4 || 0);
            sumPlayer5 += parseInt(val.player5 || 0);
        });

        $scope.totals = {
            'player1': sumPlayer1,
            'player2': sumPlayer2,
            'player3': sumPlayer3,
            'player4': sumPlayer4,
            'player5': sumPlayer5
        };
    }

    // Saves cookie data
    function saveCookieData() {
        // Update game data with latest scope data
        gameData.players = $scope.players;
        gameData.scores = $scope.scores;
 
        // Set expiration date to future
        var now = new Date();
        var expiryDate = new Date(now.getFullYear()+20, now.getMonth(), now.getDate());
        $cookies.putObject('guysNightOut-big2-5-players', gameData, { expires: expiryDate });
    }

    // Gets cookie data
    function getCookieData() {
        var cookieData = $cookies.getObject('guysNightOut-big2-5-players');
        return cookieData;
    }
}