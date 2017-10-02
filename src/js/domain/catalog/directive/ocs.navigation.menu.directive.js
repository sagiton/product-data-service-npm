(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('ocsNavigationMenu', OcsNavigationMenu);

    OcsNavigationMenu.$inject = ['config']

    function OcsNavigationMenu(config) {
        return {
            restrict: 'A',
            scope: true,
            templateUrl: 'component/navigation_menu.html',
            controller: NavigationMenuController,
            controllerAs: '$ctrl'
        }
    }

    NavigationMenuController.$inject = ['MenuService', '$element']

    function NavigationMenuController(MenuService, $element) {
        var self = this;

        self.menu = self.menu || {
            name: $element.children('a').text()
        };

        MenuService
            .getMenu()
            .then(function(menu) {
                self.menu = menu;
            });

    }
})(angular);
