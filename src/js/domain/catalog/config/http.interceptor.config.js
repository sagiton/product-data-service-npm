(function (angular) {
    angular
        .module('pds.catalog.config')
        .config(['$httpProvider', HttpConfig]);

    function HttpConfig($httpProvider) {
        $httpProvider.interceptors.push(['$q', '$injector', function ($q, $injector) {
            return {
                responseError: function(rejection) {
                    $injector.get('$state').go('error');
                    return $q.reject(rejection);
                }
            }
        }]);
    }

})(angular);
