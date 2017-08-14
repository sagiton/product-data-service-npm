(function(angular) {
    angular
        .module('pds.catalog.model')
        .config(CatalogConfig);

    CatalogConfig.$inject = ['env', 'CatalogProvider'];

    function CatalogConfig(env, catalogModelProvider) {
        catalogModelProvider
            .productDataServiceEndPoint(env.endPoint.productDataService)
            .contentServiceEndPoint(env.endPoint.contentService);
    }

})(angular);
