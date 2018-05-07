(function (angular) {
    angular
        .module('pds.catalog.service')
        .service('catalogSearchListener', CatalogSearchListener);

    CatalogSearchListener.$inject = ['CatalogService', '$q', 'env'];

    function CatalogSearchListener(catalogService, $q, env) {
        this.handle = function (params) {
            if (params.target.channelDiscriminator == env.search.pdsChannelDiscriminator) {
                return catalogService.resolveUriFromHierarchy(params.target.resourceId, null, params.consumer);
            }
            return $q.reject();
        }
    }
})(angular);
