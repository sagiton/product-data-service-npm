(function(angular) {
    angular
        .module('pds.common.route')
        .config(RouteConfig);

    RouteConfig.$inject = ['$locationProvider'];

    function RouteConfig($locationProvider) {
        $locationProvider.html5Mode(true);
    }

})(angular);
