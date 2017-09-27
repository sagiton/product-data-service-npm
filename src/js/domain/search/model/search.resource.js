(function (angular) {
    angular
        .module('pds.search.model')
        .provider('Search', function () {
            var url = null;

            this.searchEndpoint = function (value) {
                url = value;
                return this;
            };

            this.$get = ['$resource', 'locale', function ($resource, locale) {
                return new Search($resource, locale, url);
            }];
        });

    function Search($resource, locale, url) {
        var methods = {
            localize: {method: 'GET', isArray: true, params: {type: 'localize'}}
        };
        return $resource(url + 'resource/:type/:locale', {locale: locale}, methods);
    }
})(angular);
