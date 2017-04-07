(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('navLang', SwitchLanguage);

    SwitchLanguage.$inject = ['urlParserService', 'CatalogService', 'locale', '$window'];

    function SwitchLanguage(urlParserService, catalogService, locale, $window) {
        return {
            restrict: 'EAC',
            controller: ['$scope', '$element', '$attrs', function (scope, element, attrs) {
                if (urlParserService.isOCS()) {
                    element
                        .children('li')
                        .each(function (index, el) {
                            var link = angular.element(el).children('a');

                            link.click(function (e) {
                                e.preventDefault();
                                var language = link.children('span').text().toLowerCase();
                                var newLocale = locale.toString().replace(locale.language, language);
                                catalogService
                                    .resolveUriFromHierarchy(catalogService.getIdFromLocation(), newLocale)
                                    .then(function (uri) {
                                        $window.location.href = urlParserService.setLanguage(uri, language);
                                    });
                            });
                        });
                }
            }]
        }
    }

})(angular);
