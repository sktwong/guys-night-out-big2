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
        templateUrl: 'directives/navBar/navBar.tmpl.html',
        controller: 'navBarController',
        controllerAs: 'vm',
        link: function(scope, element, attrs) {
            // Close navbar menu on document click
            $(document).on('click', function(e) {
                $('.navbar-collapse.in').collapse('hide');
            });
        }
    };
});