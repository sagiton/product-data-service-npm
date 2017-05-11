(function(angular) {
    angular
        .module('pds.navigation.model')
        .config(NavigationConfig);

    NavigationConfig.$inject = ['env', 'NavigationProvider'];

    function NavigationConfig(env, NavigationProvider) {
        NavigationProvider.navigationEndpoint(env.endPoint.productDataService);
    }

})(angular);
