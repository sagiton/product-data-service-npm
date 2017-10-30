(function (angular) {
    angular
        .module('pds.common.config')
        .config(['localeProvider', 'metaTagProvider', function (localeProvider, metaTagProvider) {

            function byMetaTag() {
                var localeUrlPattern = /([a-zA-Z]{2})_([a-zA-Z]{2})/;
                var match = localeUrlPattern.exec(metaTagProvider.$get().getOcsLocale())
                return match && match.length === 3 ? [match[0], match[2], match[1]] : null
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
