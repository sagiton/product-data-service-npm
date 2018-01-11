(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('navLang', function() {
            return {
                restrict: 'EA',
                controller: SwitchLanguageController
            }
        });

    SwitchLanguageController.$inject = ['$element', 'urlParserService', 'CatalogService', 'locale', '$window', 'metaTag']

    function SwitchLanguageController(element, urlParserService, catalogService, locale, $window, metaTag) {
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

            var $span = this.children('span')

            var language = $span.text().toLowerCase();
            var newLocale = $span.attr('ocs-locale');
            var ocsChannel = $span.attr('ocs-channel') || metaTag.getOcsChannel();

            catalogService
                .resolveUriFromHierarchy(catalogService.getIdFromLocation(), newLocale, ocsChannel)
                .then(function (uri) {
                    $window.location.href = urlParserService.setLanguage(uri, language);
                });
        }

    }

})(angular);
