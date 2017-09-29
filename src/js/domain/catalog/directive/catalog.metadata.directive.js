(function (angular, $) {
    angular
        .module('pds.catalog.directive')
        .directive('catalogMetadata', CatalogMetadata);

    function CatalogMetadata() {
        return {
            restrict: 'EA',
            controller: CatalogMetadataController,
            scope: {
                data: '=data'
            }
        }
    }

    CatalogMetadataController.$inject = ['_', '$scope', 'CatalogService'];

    function CatalogMetadataController(_, $scope, CatalogService) {

        var redirectCategoryId = _.get($scope.data, 'redirect.id')
        if (redirectCategoryId) {
            return CatalogService.redirectTo(redirectCategoryId)
        }

        var canonicalReference = _.get($scope.data, 'canonicalReference')
        if (canonicalReference) {
            angular.element('head')
                .find('link[rel=canonical]')
                .attr({'href': canonicalReference})
                .attr({'ng-href': canonicalReference})
        }

    }

})(angular, $);
