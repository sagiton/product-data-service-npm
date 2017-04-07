(function (angular) {
    angular
        .module('pds.catalog.config')
        .config(['$sceDelegateProvider', SceConfig]);

    function SceConfig($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'https://pds-bosch-tt.kittelberger.net/**',
            'https://ss-bosch-tt.kittelberger.net/**',
            'https://mycliplister.com/**'
        ]);
    }

})(angular);
