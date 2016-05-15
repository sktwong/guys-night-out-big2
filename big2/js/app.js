/*
 * Guy's Night Out
 * Big 2 - Score Calculator
 */
$(document).ready(function() {

    // Enable modal click on rows
    $('tr.players').on('click touch', function() {
        $('#edit-players').modal('show');
    });

    $('tr.scores').on('click touch', function() {
        $('#edit-scores').modal('show');
    });
});