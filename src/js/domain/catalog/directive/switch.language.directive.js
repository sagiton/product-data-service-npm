(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('navLang', function() {
            return {
                restrict: 'EA',
                controller: SwitchLanguageController
            }
        });

    SwitchLanguageController.$inject = ['$element', 'urlParserService', 'CatalogService', 'locale', '$window', 'metaTag', 'Locale']

    function SwitchLanguageController(element, urlParserService, catalogService, locale, $window, metaTag, Locale) {
        if (!urlParserService.isOCS()) {
            return
        }

        element
            .children('li')
            .each(function (index, el) {
                var link = angular.element(el).children('a');
                link.click(changeLanguage.bind(link));
            });

        function changeLanguage (event) {
            event.preventDefault();

            var link = this;
            var $span = this.children('span');
            var newLocale = new Locale($span.attr('ocs-locale'));
            var ocsChannel = $span.attr('ocs-channel') || metaTag.getOcsChannel();

            catalogService
                .resolveUriFromHierarchy(catalogService.getIdFromLocation(), newLocale.toString(), ocsChannel)
                .then(function (uri) {
                    $window.location.href = link.attr('href') + urlParserService.getCatalogPath(uri);
                });
        }

    }

})(angular);
