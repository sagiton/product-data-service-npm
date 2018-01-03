(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('ocsNavigationMenu', OcsNavigationMenu);

    OcsNavigationMenu.$inject = ['config', '$templateCache']

    function OcsNavigationMenu(config, $templateCache) {
        return {
            restrict: 'A',
            scope: true,
            transclude: true,
            template: function(element, attrs) {
                return $templateCache.get('component/navigation_menu.html')
            },
            controller: NavigationMenuController,
            controllerAs: '$ctrl'
        }
    }

    NavigationMenuController.$inject = ['$scope', 'MenuService', '$element', '$transclude']

    function NavigationMenuController($scope, MenuService, $element, $transclude) {
        var self = this;
        $scope.abc = {a: 1};
        $transclude($scope, function (clone) {
            self.transcluded = !!clone.length;
            if (self.transcluded) {
                $element.replaceWith(clone);
            }
        });
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
