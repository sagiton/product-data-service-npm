(function(angular) {
    angular
        .module('pds.common.route')
        .config(RouteConfig);

    RouteConfig.$inject = ['$stateProvider', '$locationProvider', 'config'];

    function RouteConfig($stateProvider, $locationProvider, config) {
        $locationProvider.html5Mode(true);
        $stateProvider.pdsRoute = function (route) {
            route.url = urlPath(route.url);
            $stateProvider.state(route);
        };

        function urlPath(path) {
            return config.pdsPathPrefix + '/' + path;
        }

    }
})(angular);
