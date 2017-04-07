(function(angular) {
    angular
        .module('pds.catalog.route')
        .config(RouteConfig);

    RouteConfig.$inject = ['$stateProvider', '$locationProvider'];

    function RouteConfig($stateProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        //TODO Config states
    }
})(angular);
