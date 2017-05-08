(function(angular) {
    angular
        .module('pds.catalog.config')
        .config(ResourceConfig);

    ResourceConfig.$inject = ['$provide', 'env', 'ResourceDecorator'];

    function ResourceConfig($provide, env, ResourceDecorator) {
        $provide.decorator('$resource', ['$delegate', function ($delegate) {
            return ResourceDecorator.appendBaseUrl($delegate, env.endPoint.productDataService);
        }]);
    }

})(angular);
