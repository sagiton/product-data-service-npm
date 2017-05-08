(function(angular) {
    angular
        .module('pds.search.route')
        .config(RouteConfig);

    RouteConfig.$inject = ['$stateProvider', 'config'];

    function RouteConfig($stateProvider, config) {
        $stateProvider.pdsRoute({
            name: 'search',
            params: {
                terms: null
            },
            templateUrl: 'search.html',
            controller: 'SearchController as vm'
        });
    }
})(angular);
