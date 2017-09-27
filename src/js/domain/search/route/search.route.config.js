(function(angular) {
    angular
        .module('pds.search.route')
        .config(RouteConfig);

    RouteConfig.$inject = ['$stateProvider'];

    function RouteConfig($stateProvider) {
        $stateProvider.pdsRoute({
            name: 'search',
            params: {
                terms: null
            },
            url: 'search.html',
            templateUrl: 'search.html'
        });
    }
})(angular);
