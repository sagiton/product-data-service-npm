(function (angular) {
    angular.module('pds.catalog.route', ['pds.common.route', 'ui.router', 'ncy-angular-breadcrumb']);
    angular.module('pds.catalog.service', ['pds.common.filter', 'pds.common.config']);
    angular.module('pds.catalog.config', ['pds.environment', 'ngResource', 'pds.common.config']);
    angular.module('pds.catalog.controller', ['ngSanitize', 'datatables', 'hl.sticky', 'dcbImgFallback', 'slickCarousel', 'pds.catalog.service', 'pds.catalog.directive', 'pds.navigation.service']);
    angular.module('pds.catalog.model', []);
    angular.module('pds.catalog.factory', ['pds.catalog.service']);
    angular.module('pds.catalog.directive', []);
    angular.module('pds.catalog', ['pds.catalog.controller', 'pds.catalog.route', 'pds.catalog.service', 'pds.catalog.config', 'pds.catalog.model']);
})(angular);
