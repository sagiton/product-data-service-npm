(function (angular, window) {
    angular
        .module('pds.common.config')
        .config(['$translateProvider', function ($translateProvider) {
            if (window.cmsTranslations) {
                $translateProvider
                    .translations('this', window.cmsTranslations)
                    .useSanitizeValueStrategy('sanitizeParameters')
                    .preferredLanguage('this')
                    .use('this');
            }
        }]);

})(angular, window);
