(function (angular) {
    angular.module('pds.environment', []);
    angular.module('product-data-service', ['pds.catalog', 'pds.navigation', 'pds.environment', 'pds.search', 'pds.common', 'ui.router', 'ngSanitize']);
})(angular);
