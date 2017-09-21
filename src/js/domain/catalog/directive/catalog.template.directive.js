(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('catalogTemplate', ['CatalogService', '$rootScope', '_' ,function (CatalogService, $rootScope, _) {
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
                            .getCatalogTemplate(val)
                            .then(function (catalog) {
                                scope.$catalog = catalog;
                                $rootScope.$broadcast('pds.catalog.loaded', {catalog: catalog});
                            });
                    });
                }
            }
        }]);

})(angular);
