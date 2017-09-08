(function (angular) {
    angular
        .module('pds.catalog.config')
        .config(['$sceDelegateProvider', SceConfig]);

    function SceConfig($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'https://services.kittelberger.net/**',
            'https://dev02.sagiton.pl/**',
            'http://localhost:8080/**',
            'https://mycliplister.com/**'
        ]);
    }

})(angular);
