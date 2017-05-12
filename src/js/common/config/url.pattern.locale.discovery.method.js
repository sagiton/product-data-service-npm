(function (angular) {
    angular
        .module('pds.common.config')
        .config(['localeProvider', function (localeProvider) {
            var localeUrlPattern = /^\/([a-zA-Z]{2})\/([a-zA-Z]{2})/;
            localeProvider.addDiscoveryMethod(function () {
                return localeUrlPattern.exec(new URI().path());
            });
        }]);

})(angular);
