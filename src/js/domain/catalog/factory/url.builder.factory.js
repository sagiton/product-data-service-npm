(function (angular) {

    angular
        .module('pds.catalog.factory')
        .factory('urlBuilder', UrlBuilder);

    UrlBuilder.$inject = ['$injector'];

    function UrlBuilder($injector) {
        return $injector.get('seoFriendlyUrlBuilder');
    }
})(angular);
