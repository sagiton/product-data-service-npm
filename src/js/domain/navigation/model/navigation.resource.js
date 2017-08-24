(function (angular) {
    angular
        .module('pds.navigation.model')
        .provider('Navigation', function () {
            var url = null;

            this.navigationEndpoint = function (value) {
                url = value;
                return this;
            };

            this.$get = ['$resource', '$cacheFactory', function ($resource, $cacheFactory) {
                return new Navigation($resource, $cacheFactory, url);
            }]
        });

    function Navigation($resource, $cacheFactory, url) {
        var catalogCache = $cacheFactory("navigation");
        var methods = {
            get: {method: 'GET', cache: catalogCache}
        };
        return $resource(url + 'rest/document/display', null, methods);
    }
})(angular);
