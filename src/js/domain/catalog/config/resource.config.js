(function(angular) {
    angular
        .module('pds.catalog.config')
        .config(ResourceConfig);

    ResourceConfig.$inject = ['$provide', 'config', 'ResourceDecorator'];

    function ResourceConfig($provide, config, ResourceDecorator) {
        $provide.decorator('$resource', ['$delegate', function ($delegate) {
            return ResourceDecorator.appendBaseUrl($delegate, config.endPoint.productDataService);
        }]);
    }

})(angular);
