(function (angular) {
    angular
        .module('pds.catalog.model')
        .factory('Catalog', ['$resource', '$cacheFactory', 'locale', Catalog]);

    function Catalog($resource, $cacheFactory, locale) {
        var catalogCache = $cacheFactory("catalog");
        return $resource('/:locale/:type/:queryType/:id', null, {
                get: {
                    method: 'GET',
                    params: {locale: locale, queryType: 'id'},
                    cache: catalogCache
                },
                query: {
                    method: 'GET',
                    isArray: true,
                    params: {locale: locale},
                    cache: catalogCache
                }
            }
        );
    }
})(angular);
