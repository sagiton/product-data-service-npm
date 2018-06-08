(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('ocsBreadcrumb', OcsBreadcrumb);

    var crumbTemplate =
        "<li ng-repeat=\"crumb in $breadcrumbs\" ng-class=\"{'active ocs-breadcrumb-last': $last}\" class='ocs-breadcrumb-{{crumb.type | lowercase}}'>"
            + "<a ocs-navigate=\"crumb.id\">{{crumb.name}}</a>"
        + "</li>";

    function OcsBreadcrumb() {
        return {
            restrict: 'EA',
            scope: {
                ocsNavigate: '='
            },
            controller: BreadcrumbController
        }
    }

    BreadcrumbController.$inject = ['$scope', '$compile', 'breadcrumbService', '_']

    function BreadcrumbController($scope, $compile, breadcrumbService, _) {
        $scope.$on('pds.breadcrumb.update', function (event, params) {
            breadcrumbService
                .build(params.catalogId)
                .then(function (res) {
                    $scope.$breadcrumbs = res || {};
                    var breadcrumbs = $compile(crumbTemplate)($scope);
                    var breadcrumbsContainer = angular.element('#nav-breadcrumbs');
                    breadcrumbsContainer.find('.dropdown-menu').append(breadcrumbs);
                    breadcrumbsContainer
                        .find('.dropdown-toggle')
                        .text(_.last($scope.$breadcrumbs).name);
                });
        });
    }

})(angular);
