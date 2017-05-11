(function (angular) {
    angular
        .module('pds.navigation.model')
        .provider('Navigation', function () {
            var url = null;

            this.navigationEndpoint = function (value) {
                url = value;
                return this;
            };

            this.$get = ['$resource', 'locale', function ($resource, locale) {
                return new Navigation($resource, locale, url);
            }]
        });

    function Navigation($resource, locale, url) {
        var methods = {
            get: {method: 'GET', params: {locale: locale}, isArray: true, cache: true}
        };
        return $resource(url + '/:locale/catalog/hierarchy', null, methods);
    }
})(angular);
