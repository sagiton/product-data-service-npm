(function(angular) {
    angular
        .module('pds.catalog.route')
        .config(RouteConfig);

    RouteConfig.$inject = ['$stateProvider', 'config'];

    function RouteConfig($stateProvider, config) {
        $stateProvider.pdsRoute({
            name: 'catalog',
            url: '{catUrl:.*-[cp]$}',
            templateUrl: 'catalog.html',
            controller: 'CatalogController as vm'
        });
    }
})(angular);
