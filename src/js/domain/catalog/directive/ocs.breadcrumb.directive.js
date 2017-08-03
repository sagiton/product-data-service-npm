(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('ocsBreadcrumb', OcsBreadcrumb);

    var crumbTemplate = "<li ng-repeat=\"crumb in $breadcrumbs\" ng-class=\"{'active': $last}\">"
            + "<a ocs-navigate=\"crumb.id\">{{crumb.name}}</a>"
        + "</li>";

    function OcsBreadcrumb() {
        return {
            restrict: 'EA',
            scope: {
                ocsNavigate: '='
            },
            controller: ['$scope', '$compile', 'BreadcrumbService', '_', BreadcrumbController]
        }
    }

    function BreadcrumbController($scope, $compile, BreadcrumbService, _) {
        $scope.$on('pds.breadcrumb.update', function (event, params) {
            BreadcrumbService
                .build(params.catalogId)
                .then(function (res) {
                    $scope.$breadcrumbs = res || {};
                    var breadcrumbs = $compile(crumbTemplate)($scope);
                    var breadcrumbsContainer = angular.element('#nav-breadcrumbs');
                    breadcrumbsContainer.find('.dropdown-menu').append(breadcrumbs);

                    //TODO Move this stuff
                    if (_.last($scope.$breadcrumbs).type == 'product_details') {
                        breadcrumbsContainer.addClass('dark-breadcrumb');
                    }

                    breadcrumbsContainer
                        .find('.dropdown-toggle')
                        .text(_.last($scope.$breadcrumbs).name);
                });
        });
    }

})(angular);
