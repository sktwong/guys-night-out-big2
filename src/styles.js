/*
 * Guy's Night Out - Big 2
 * styles.js
 *
 * General page styling scripts
 *
 */
// Closes the navbar menu on click
$(document).on('click','.navbar-collapse.in',function(e) {
    if( $(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle' ) {
        $(this).collapse('hide');
    }
});