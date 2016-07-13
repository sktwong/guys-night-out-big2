/*
 * Guy's Night Out - Big 2
 * game.controller.js
 *
 * The core game table
 *
 */
 big2App.controller('gameController', ['$scope', 'big2AppService', '$timeout', '$uibModal', GameControllerFn]);

 function GameControllerFn($scope, big2AppService, $timeout, $uibModal) {

    // Available functions
    $scope.editPlayers = editPlayers;
    $scope.savePlayers = savePlayers;
    $scope.editScores = editScores; // Delete this after refactoring
    $scope.editScore = editScore;
    $scope.saveScores = saveScores;
    $scope.newGame = newGame;
    $scope.newGameModal = newGameModal;
    $scope.toggleTotals = toggleTotals;

    // Data objects
    var gameData = null; // Game data object, used for data storage
    $scope.players = {}; // Player names
    $scope.scores = []; // All game scores
    $scope.totals = {}; // All game score totals
    $scope.hideTotals = true;

    // Initialize app
    init();

    // Initializes app
    // - loads an existing game if found
    // - starts a new game if none is found
    function init() {

        // Use existing game data if available
        // gameData = getGameData();
        if (!gameData) {
            gameData = initGameData();
        }
        $scope.gameData = gameData;
        $scope.players = gameData.players;
        $scope.scores = removeStartTime(gameData.scores);

        saveGameData();
        updateScoreTotals();

        // Keep player names at top of screen when scrolling
        $timeout(function() {
            $('#scores').floatThead({
                position: 'fixed',
                top: 50
            });
        }, 0);
    }

    // Initializes game data
    function initGameData() {
        var data = {
            'players': {
                'player1': '',
                'player2': '',
                'player3': '',
                'player4': ''
            },
            'scores': [{
                'id': '1',
                'player1': '',
                'player2': '',
                'player3': '',
                'player4': ''
            }]
        };

        // Sample data
        // data = {'players': {'player1': '', 'player2': '', 'player3': '', 'player4': ''}, 'scores': [{'id': '1', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '2', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '3', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '4', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '5', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '6', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '7', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '8', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '9', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '10', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '11', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '12', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '13', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '14', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '15', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '16', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '17', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '18', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '19', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '20', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '21', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '22', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '23', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '24', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '25', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '26', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '27', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '28', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '29', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '30', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '31', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '32', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '33', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '34', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '35', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '36', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '37', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '38', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '39', 'player1': '5', 'player2': '5', 'player3': '5', 'player4': '-15'}, {'id': '40', 'player1': '', 'player2': '', 'player3': '', 'player4': ''}] };
        // data = {"players":{"player1":"Rob","player2":"Steve","player3":"James","player4":"Marcus","player5":"Kelvin"},"scores":[{"id":1,"player1":"1","player2":"-9","player3":"","player4":"3","player5":"5"},{"id":2,"player1":"6","player2":"-18","player3":"6","player4":"6","player5":""},{"id":3,"player1":"4","player2":"-29","player3":"3","player4":"","player5":"22"},{"id":4,"player1":"-6","player2":"1","player3":"1","player4":"4","player5":""},{"id":5,"player1":"1","player2":"-6","player3":"2","player4":"","player5":"3"},{"id":6,"player1":"24","player2":"24","player3":"-72","player4":"24","player5":""},{"id":7,"player1":"","player2":"1","player3":"3","player4":"4","player5":"-8"},{"id":8,"player1":"4","player2":"-15","player3":"4","player4":"","player5":"7"},{"id":9,"player1":"39","player2":"-49","player3":"5","player4":"5","player5":""},{"id":10,"player1":"","player2":"7","player3":"20","player4":"-33","player5":"6"},{"id":11,"player1":"2","player2":"5","player3":"","player4":"6","player5":"-13"},{"id":12,"player1":"-10","player2":"1","player3":"6","player4":"","player5":"3"},{"id":13,"player1":"4","player2":"-26","player3":"","player4":"2","player5":"20"},{"id":14,"player1":"3","player2":"-14","player3":"4","player4":"7","player5":""},{"id":15,"player1":"2","player2":"-6","player3":"1","player4":"","player5":"3"},{"id":16,"player1":"6","player2":"24","player3":"39","player4":"-69","player5":""},{"id":17,"player1":"1","player2":"5","player3":"","player4":"-12","player5":"6"},{"id":18,"player1":"-15","player2":"6","player3":"3","player4":"6","player5":""},{"id":19,"player1":"2","player2":"","player3":"9","player4":"-17","player5":"6"},{"id":20,"player1":"20","player2":"8","player3":"","player4":"-36","player5":"8"},{"id":21,"player1":"","player2":"9","player3":"22","player4":"-35","player5":"4"},{"id":22,"player1":"1","player2":"3","player3":"","player4":"-5","player5":"1"},{"id":23,"player1":"6","player2":"","player3":"1","player4":"-8","player5":"1"},{"id":24,"player1":"","player2":"1","player3":"4","player4":"9","player5":"-14"},{"id":25,"player1":"","player2":"","player3":"","player4":"","player5":""}]};
        data = {'players': {'player1': 'Steve', 'player2': 'Marcus', 'player3': 'Rob', 'player4': 'James', 'player5': 'Kelvin'}, 'scores': [{'id': '1', 'player1': '1', 'player2': '2', 'player3': '3', 'player4': '4', 'player5': '5', 'startTime': '2016-07-12T03:25:43.071Z'}, {'id': '2', 'player1': '1', 'player2': '2', 'player3': '3', 'player4': '4', 'player5': '5', 'startTime': '2016-07-12T03:25:43.071Z'}, {'id': '3', 'player1': '1', 'player2': '2', 'player3': '3', 'player4': '4', 'player5': '5', 'startTime': '2016-07-12T03:25:43.071Z'}, {'id': '4', 'player1': '1', 'player2': '2', 'player3': '3', 'player4': '4', 'player5': '5', 'startTime': '2016-07-12T03:25:43.071Z'}, {'id': '5', 'player1': '1', 'player2': '2', 'player3': '3', 'player4': '4', 'player5': '5', 'startTime': '2016-07-12T03:25:43.071Z'}, {'id': '6', 'player1': '', 'player2': '', 'player3': '', 'player4': '', 'player5': '', 'startTime': '2016-07-12T03:25:43.071Z'}] };
        return data;
    }

    // New game modal
    function newGameModal() {
        // Show modal
        $('#new-game').modal('show');
    }

    // Removes startTime from scores data object
    function removeStartTime(scores) {
        var newScores = angular.copy(scores);
        angular.forEach(newScores, function(score) {
            delete score.startTime;
        });
        return newScores;
    }

    // New game
    function newGame() {
        gameData = initGameData();
        $scope.players = gameData.players;
        $scope.scores = gameData.scores;
        $scope.totals = {}
        saveGameData();
        $('#new-game').modal('hide');
    }

    // Displays edit players modal
    function editPlayers() {
        // Set player names if present
        $('#edit-players .player1').val($scope.players.player1);
        $('#edit-players .player2').val($scope.players.player2);
        $('#edit-players .player3').val($scope.players.player3);
        $('#edit-players .player4').val($scope.players.player4);

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

        // Save latest game data
        saveGameData();

        $('#edit-players').modal('hide');
    }

    // Edits score for a game
    function editScore(gameData) {
        var editScoreModal = $uibModal.open({
            size: 'sm',
            templateUrl: 'modals/editScore/editScore.tmpl.html',
            controller: 'modalEditScoreController',
            controllerAs: 'vm',
            resolve: {
                data: function() {
                    return {
                        players: $scope.players,
                        gameData: gameData
                    };
                }
            }
        });

        editScoreModal.result.then(function(data) {
            console.log('new scores', data);
        });
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
        var game = {
            'id': gameId,
            'player1': score.player1,
            'player2': score.player2,
            'player3': score.player3,
            'player4': score.player4
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

        // Save latest game data
        saveGameData();

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

    // Updates score totals
    function updateScoreTotals() {
        var sumPlayer1 = 0;
        var sumPlayer2 = 0;
        var sumPlayer3 = 0;
        var sumPlayer4 = 0;

        angular.forEach($scope.scores, function(val, key) {
            sumPlayer1 += parseInt(val.player1 || 0);
            sumPlayer2 += parseInt(val.player2 || 0);
            sumPlayer3 += parseInt(val.player3 || 0);
            sumPlayer4 += parseInt(val.player4 || 0);
        });

        $scope.totals = {
            'player1': sumPlayer1,
            'player2': sumPlayer2,
            'player3': sumPlayer3,
            'player4': sumPlayer4
        };
    }

    // Toggles display of score total row
    function toggleTotals(trueOrFalse) {
        $scope.hideTotals = trueOrFalse;
    }

    // Saves game data
    function saveGameData() {
        // Update game data with latest scope data
        gameData.players = $scope.players;
        gameData.scores = $scope.scores;
 
        big2AppService.saveData(gameData);
    }

    // Gets game data
    function getGameData() {
        return big2AppService.getData();
    }
}