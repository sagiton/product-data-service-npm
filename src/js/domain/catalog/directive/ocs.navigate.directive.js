(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('ocsNavigate', OcsNavigateDirective);

    OcsNavigateDirective.$inject = ['CatalogService'];

    function OcsNavigateDirective(CatalogService) {
        return {
            restrict: 'EA',
            scope: {
                ocsNavigate: '='
            },
            controller: ['$scope', '$element', '$attrs', function (scope, element, attrs) {
                scope.$watch('ocsNavigate', function (val) {
                    val && CatalogService
                        .resolveUriFromHierarchy(val)
                        .then(function (uri) {
                            element.attr('href', uri);
                        });
                    element.filter(function (idx, el) {
                        return !$(el).attr('target');
                    })
                    .attr('target', '_self');
                })
            }]
        }
    }

})(angular);
