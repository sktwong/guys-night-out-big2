/*
 * Guy's Night Out - Big 2
 * navBar.directive.js
 *
 * Navigation bar / menu
 *
 */
big2App.directive('navBar', function() {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'directives/navBar/navBar.tmpl.html',
        controller: 'navBarController',
        controllerAs: 'vm'
    };
});