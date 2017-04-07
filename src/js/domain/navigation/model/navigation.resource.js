(function (angular) {
    angular
        .module('pds.navigation.model')
        .factory('Navigation', ['$resource', 'locale', Navigation]);

    function Navigation($resource, locale) {
        var methods = {
            get: {method: 'GET', params: {locale: locale}, isArray: true, cache: true}
        };
        return $resource('/:locale/catalog/hierarchy', null, methods);
    }
})(angular);
