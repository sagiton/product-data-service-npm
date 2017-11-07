(function(angular) {
    angular
        .module('pds.catalog.route')
        .config(RouteConfig);

    RouteConfig.$inject = ['$stateProvider'];

    function RouteConfig($stateProvider) {
        $stateProvider.state({
            name: 'catalog',
            url: '{catUrl:.*-[cp][/]?}',
            templateProvider: ['$templateCache', function($templateCache){
                return $templateCache.get('catalog3.html')
            }],
            controller: 'CatalogController as vm',
            resolve: {
                redirect: ['metaService', function (metaService) {
                    return metaService.redirectOnInvalidUrl();
                }]
            }
        });
    }
})(angular);
