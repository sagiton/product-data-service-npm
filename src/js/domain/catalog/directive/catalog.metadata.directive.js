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

    CatalogMetadataController.$inject = ['_', '$scope', 'CatalogService', 'Locale'];

    var PATH_SEPARATOR = '/';

    function CatalogMetadataController(_, $scope, CatalogService, Locale) {

        var redirectCategoryId = _.get($scope.data, 'redirect.id')
        if (redirectCategoryId) {
            return CatalogService.redirectTo(redirectCategoryId)
        }

        var canonicalReference = _.get($scope.data, 'canonicalReference')
        if (canonicalReference) {
            angular
                .element('<link>')
                .attr('href', canonicalReference)
                .attr('ng-href', canonicalReference)
                .appendTo('head');
        }

        var catalogId = $scope.data.catalogId
        if (canonicalReference !== catalogId) {
            angular.element('link[hreflang]').remove();
        } else {
            angular
                .element('link[hreflang]')
                .each(function (index, link) {
                    var linkObject = angular.element(link);
                    var locale = new Locale(linkObject.attr('hreflang'));
                    CatalogService
                        .resolveUriFromHierarchy(catalogId, locale.toString())
                        .then(function (url) {
                            linkObject.attr('href', url.replace(/\/[a-z]{2}\/[a-z]{2}\//, PATH_SEPARATOR + locale.toString(PATH_SEPARATOR)  + PATH_SEPARATOR));
                            return !!url;
                        })
                        .then(function (result) {
                            return result || linkObject.remove();
                        });
                });
        }

    }

})(angular, $);
