(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('catalogTemplate', ['CatalogService', '$rootScope' ,function (CatalogService, $rootScope) {
            return {
                restrict: 'EA',
                scope: {
                    catalogId: '='
                },
                transclude: true,
                template: '<div class="catalog-template" ng-transclude></div>',
                link: function (scope, element, attrs, ctrl) {
                    scope.$watch('catalogId', function (val) {
                        val && CatalogService
                            .getById(val)
                            .then(function (catalog) {
                                scope.$catalog = catalog;
                                $rootScope.$broadcast('pds.catalog.loaded', {catalog: catalog});
                            });
                    });
                }
            }
        }]);

})(angular);
