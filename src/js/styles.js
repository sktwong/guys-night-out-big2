/*
 * Guy's Night Out
 * Big 2 - Score Calculator
 *
 * styles.js
 * - various look and feel related scripts
 */

$(document).ready(function() {
//     var table = $('table thead');
//     var position = table.position();

//     $(window).scroll(function() {
//         var windowPosition = $(window).scrollTop();

//         if (windowPosition >= position.top) {
//             table.addClass('stick');
//         } else {
//             table.removeClass('stick');
//         }
//     });

    var $table = $('table');
    $table.floatThead({
        position: 'absolute'
    });
});
