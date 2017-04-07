(function (angular) {
    angular
        .module('pds.search.model')
        .factory('Search', ['$resource', 'config', 'locale', Search]);

    function Search($resource, config, locale) {
        var methods = {
            localize: {method: 'GET', isArray: true, params: {type: 'localize'}}
        };
        return $resource(config.endPoint.searchService + 'resource/:type/:locale', {locale: locale}, methods, {absolute: true});
    }
})(angular);
