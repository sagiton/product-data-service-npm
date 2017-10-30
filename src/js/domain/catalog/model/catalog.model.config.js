(function(angular) {
    angular
        .module('pds.catalog.model')
        .config(CatalogConfig);

    CatalogConfig.$inject = ['env', 'CatalogProvider'];

    function CatalogConfig(env, catalogModelProvider) {
        catalogModelProvider
            .contentServiceEndPoint(env.endPoint.contentService);
    }

})(angular);
