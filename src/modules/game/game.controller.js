/*
 * Guy's Night Out - Big 2
 * game.controller.js
 *
 * The core game table
 *
 */
 big2App.controller('gameController', ['$scope', 'big2AppService', '$timeout', '$uibModal', '$location', '$anchorScroll', '$route', gameControllerFn]);

 function gameControllerFn($scope, big2AppService, $timeout, $uibModal, $location, $anchorScroll, $route) {

    // Available functions
    $scope.editScore = editScore;
    $scope.addNewScore = addNewScore;
    $scope.editPlayers = editPlayers;

    // Data objects
    var gameData = null; // Game data object, used for data storage
    $scope.players = {}; // Player names
    $scope.settings = {}; // Game settings
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
        gameData = getGameData();
        if (!gameData) {
            createNewGame();
        }
        $scope.gameData = gameData;
        $scope.players = gameData.players;
        $scope.scores = gameData.scores;
        $scope.totals = gameData.totals;
        $scope.settings = big2AppService.getSettings();

        saveGameData();
        updateScoreTotals();

        // Keep player names at top of screen when scrolling
        $timeout(function() {
            $('table.scores').floatThead({
                position: 'fixed',
                top: 50
            });
        }, 0);
    }

    function createNewGame() {
        var newGameModal = $uibModal.open({
            size: 'md',
            templateUrl: 'modals/newGame/newGame.tmpl.html',
            controller: 'modalNewGameController',
            controllerAs: 'vm'
        });

        newGameModal.result.then(function(newGameSettings) {
            big2AppService.createNewGame(newGameSettings);
            $route.reload();
        });
    }

    function editPlayers() {
        var editScoreModal = $uibModal.open({
            size: 'md',
            templateUrl: 'modals/editPlayers/editPlayers.tmpl.html',
            controller: 'modalEditPlayersController',
            controllerAs: 'vm',
            resolve: {
                data: function() {
                    return {
                        players: $scope.players,
                        settings: $scope.settings
                    };
                }
            }
        });

        editScoreModal.result.then(function(result) {
            $scope.players = result.data;
            saveGameData();

            // Update table header position
            $('table.scores').trigger('reflow');

        });
    }

    // Edits score for a game
    function editScore(gameData, isNew) {
        var editScoreModal = $uibModal.open({
            size: 'md',
            templateUrl: 'modals/editScore/editScore.tmpl.html',
            controller: 'modalEditScoreController',
            controllerAs: 'vm',
            resolve: {
                data: function() {
                    return {
                        players: $scope.players,
                        gameData: gameData,
                        scores: $scope.scores
                    };
                }
            }
        });

        editScoreModal.result.then(function(result) {
            // Add a timeout to avoid modal data updating when $scope.score is updated
            $timeout(function() {
                // Find game via index and update
                var gameId = parseInt(result.data.id);
                var gameIndex = gameId - 1
                $scope.scores[gameIndex] = calculateAllScores(result.data, result.winner);

                // Update score totals
                updateScoreTotals();

                // Save latest game data
                saveGameData();

                // Scroll to bottom of page
                $location.hash('totals');
                $anchorScroll();

                // Display seat change reminder modal
                if (isNew && (gameId % $scope.settings.seatChange == 0)) { 
                    var seatChangeReminderModal = $uibModal.open({
                        size: 'sm',
                        templateUrl: 'modals/seatChange/seatChange.tmpl.html',
                        controller: 'modalSeatChangeController',
                        controllerAs: 'vm'
                    });
                }
            }, 100);
        });
    }

    // Adds a new score
    function addNewScore() {
        var newGameId = 0;
        angular.forEach($scope.scores, function(score) {
            if (newGameId <= score.id) {
                newGameId = score.id;
            }
        });

        var newScore = big2AppService.createNewScore(newGameId + 1, big2AppService.getSettings());
        editScore(newScore, true);
    }

    // Calculates all game scores, doubling / tripling where necessary
    function calculateAllScores(data, winner) {
        var total = '';
        angular.forEach(data, function(val, key) {
            if (key.indexOf('player') > -1) {
                if (val == 10) { data[key] = 20; }
                else if (val == 11) { data[key] = 22; }
                else if (val == 12) { data[key] = 24; }
                else if (val == 13) { data[key] = 39; }
                else if (val < 0) { data[key] = ''; }

                // Only add a value if positive, ignore negative values
                if (val > 0) {
                    total -= parseInt(data[key] || 0);
                }
            }
        });
        data[winner] = total;
        return data;
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
    function calculateScore(score) {
        angular.forEach(score, function(val, key) {
            if (key.indexOf('player') > -1) {
                if (val == 10) { score[key] = 20; }
                else if (val == 11) { score[key] = 22; }
                else if (val == 12) { score[key] = 24; }
                else if (val == 13) { score[key] = 39; }
            }
        });
        return score;
    }

    // Updates score totals
    function updateScoreTotals() {
        var numberOfPlayers = big2AppService.getSettings().numberOfPlayers;
        var totals = {};
        for (var i = 0; i < numberOfPlayers; i++) {
            totals['player' + (i + 1)] = 0;
        }

        angular.forEach($scope.scores, function(score) {
            angular.forEach(score, function(val, key) {
                if (key.indexOf('player') > -1) {
                    totals[key] += parseInt(val || 0);
                }
            });
        });

        $scope.totals = totals;
    }

    // Saves game data
    function saveGameData() {
        // Update game data with latest scope data
        gameData.players = $scope.players;
        gameData.scores = $scope.scores;
        gameData.totals = $scope.totals;
 
        big2AppService.saveData(gameData);
    }

    // Gets game data
    function getGameData() {
        return big2AppService.getData();
    }
}