(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('ocsNavigationMenu', OcsNavigationMenu);

    OcsNavigationMenu.$inject = []

    function OcsNavigationMenu() {
        return {
            restrict: 'A',
            scope: true,
            transclude: true,
            controller: NavigationMenuController,
            controllerAs: '$ctrl'
        }
    }

    NavigationMenuController.$inject = ['$scope', 'MenuService', '$element', '$transclude', '$templateCache', '$compile']

    function NavigationMenuController($scope, MenuService, $element, $transclude, $templateCache, $compile) {
        var self = this;
        $transclude($scope, function (clone) {
            self.transcluded = !!clone
                .filter(function () {
                    return this.nodeType !== 3;
                })
                .length;
            $element.empty();
            $element.append(self.transcluded ? clone : $compile($templateCache.get('component/navigation_menu.html'))($scope));
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
