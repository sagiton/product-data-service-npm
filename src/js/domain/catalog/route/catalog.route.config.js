(function(angular) {
    angular
        .module('pds.catalog.route')
        .config(RouteConfig);

    RouteConfig.$inject = ['$stateProvider'];

    function RouteConfig($stateProvider) {
        $stateProvider.pdsRoute({
            name: 'catalog',
            url: '{catUrl:.*-[cp][/]?}',
            templateProvider: ['$templateCache', function($templateCache){
                return $templateCache.get('catalog3.html')
            }],
            controller: 'CatalogController as vm',
            resolve: {
                redirect: ['MetaService', function (metaService) {
                    return metaService.redirectOnInvalidUrl();
                }]
            }
        });
    }
})(angular);
