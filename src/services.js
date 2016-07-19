/*
 * Guy's Night Out - Big 2
 * services.js
 *
 * All game services
 * - saving data
 * - retrieving data
 * - clearing data
 *
 */
big2App.factory('big2AppService', ['localStorageService', Big2AppServiceFn]);

function Big2AppServiceFn(localStorageService) {

    return {
        createNewGame: createNewGame,
        createNewScore: createNewScore,
        getData: getData,
        getSettings: getSettings,
        saveData: saveData,
        loadMockdata: loadMockdata
    };

    function createNewGame(settings) {
        // Temp setting of players
        var players = {'player1': '', 'player2': '', 'player3': '', 'player4': ''};
        if (settings.numberOfPlayers == '5') {
            players.player5 = '';
        }

        var scores = [];
        // scores.push(createNewScore(1, settings));

        var newGameData = {
            'settings': settings,
            'players': players,
            'scores': scores
        }
        saveData(newGameData);
    }

    function createNewScore(newGameId, settings) {
        var newScore = { 
            'id': newGameId,
            'timestamp': (new Date()).toJSON()
        };
        for (var i = 0; i < settings.numberOfPlayers; i++) {
            newScore['player' + (i + 1)] = '';
        }
        return newScore;
    }

    function getData() {
        return localStorageService.get('guysNightOut-big2');
    }

    function getSettings() {
        return getData().settings;
    }

    function saveData(data) {
        localStorageService.set('guysNightOut-big2', data);
    }

    function loadMockdata() {
        var mockData = {"players":{"player1":"Rob","player2":"Steve","player3":"James","player4":"Marcus","player5":"Kelvin"},"scores":[{"id":1,"player1":"1","player2":"-9","player3":"","player4":"3","player5":"5"},{"id":2,"player1":"6","player2":"-18","player3":"6","player4":"6","player5":""},{"id":3,"player1":"4","player2":"-29","player3":"3","player4":"","player5":"22"},{"id":4,"player1":"-6","player2":"1","player3":"1","player4":"4","player5":""},{"id":5,"player1":"1","player2":"-6","player3":"2","player4":"","player5":"3"},{"id":6,"player1":"24","player2":"24","player3":"-72","player4":"24","player5":""},{"id":7,"player1":"","player2":"1","player3":"3","player4":"4","player5":"-8"},{"id":8,"player1":"4","player2":"-15","player3":"4","player4":"","player5":"7"},{"id":9,"player1":"39","player2":"-49","player3":"5","player4":"5","player5":""},{"id":10,"player1":"","player2":"7","player3":"20","player4":"-33","player5":"6"},{"id":11,"player1":"2","player2":"5","player3":"","player4":"6","player5":"-13"},{"id":12,"player1":"-10","player2":"1","player3":"6","player4":"","player5":"3"},{"id":13,"player1":"4","player2":"-26","player3":"","player4":"2","player5":"20"},{"id":14,"player1":"3","player2":"-14","player3":"4","player4":"7","player5":""},{"id":15,"player1":"2","player2":"-6","player3":"1","player4":"","player5":"3"},{"id":16,"player1":"6","player2":"24","player3":"39","player4":"-69","player5":""},{"id":17,"player1":"1","player2":"5","player3":"","player4":"-12","player5":"6"},{"id":18,"player1":"-15","player2":"6","player3":"3","player4":"6","player5":""},{"id":19,"player1":"2","player2":"","player3":"9","player4":"-17","player5":"6"},{"id":20,"player1":"20","player2":"8","player3":"","player4":"-36","player5":"8"},{"id":21,"player1":"","player2":"9","player3":"22","player4":"-35","player5":"4"},{"id":22,"player1":"1","player2":"3","player3":"","player4":"-5","player5":"1"},{"id":23,"player1":"6","player2":"","player3":"1","player4":"-8","player5":"1"},{"id":24,"player1":"","player2":"1","player3":"4","player4":"9","player5":"-14"},{"id":25,"player1":"","player2":"","player3":"","player4":"","player5":""}]};
        return mockData;
    }
}