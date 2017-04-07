(function (angular) {
    angular
        .module('pds.common.directive')
        .directive('jsonld', JsonLdDirective);

    JsonLdDirective.$inject = ['$filter', '$sce'];

    function JsonLdDirective($filter, $sce) {
        return {
            restrict: 'E',
            template: '<script type="application/ld+json" ng-bind-html="onGetJson()"></script>',
            scope: {
                json: '=json'
            },
            link: function(scope, element, attrs) {
                scope.onGetJson = function() {
                    return $sce.trustAsHtml($filter('json')(scope.json));
                }
            },
            replace: true
        }
    };

})(angular);
