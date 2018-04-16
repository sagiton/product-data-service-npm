(function (angular) {
    angular
        .module('pds.search.model')
        .provider('Search', function () {
            var url = null;

            this.searchEndpoint = function (value) {
                url = value;
                return this;
            };

            this.$get = ['$resource', 'locale', 'metaTag', function ($resource, locale, metaTag) {
                return new Search($resource, locale, url, metaTag);
            }];
        });

    function Search($resource, locale, url, metaTag) {
        var methods = {
            localize: {method: 'GET', isArray: true, params: {type: 'localize'}}
        };
        return $resource(url + 'resource/:type/:locale', {locale: locale, consumer: metaTag.getOcsChannel()}, methods);
    }
})(angular);
