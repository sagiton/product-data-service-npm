(function (angular) {
    angular
        .module('pds.common.config')
        .config(['localeProvider', 'metaTagProvider', function (localeProvider, metaTagProvider) {

            function byMetaTag() {
                var localeUrlPattern = /([a-zA-Z]{2})_([a-zA-Z]{2})/;
                return localeUrlPattern.exec(metaTagProvider.$get().getOcsLocale())
            }

            function byUrlPath() {
                var localeUrlPattern = /^\/([a-zA-Z]{2})\/([a-zA-Z]{2})/;
                return localeUrlPattern.exec(new URI().path());
            }

            localeProvider // order by priority
                .addDiscoveryMethod(byMetaTag)
                .addDiscoveryMethod(byUrlPath)
        }]);

})(angular);
