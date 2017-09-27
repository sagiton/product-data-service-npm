(function (angular) {
    angular.module('pds.common.route', ['ui.router', 'ncy-angular-breadcrumb', 'pds.environment']);
    angular.module('pds.common.service', []);
    angular.module('pds.common.config', ['pascalprecht.translate']);
    angular.module('pds.common.controller', ['ngAnimate', 'ngSanitize', 'datatables', 'hl.sticky', 'dcbImgFallback', 'slickCarousel']);
    angular.module('pds.common.model', []);
    angular.module('pds.common.factory', []);
    angular.module('pds.common.directive', []);
    angular.module('pds.common.filter', ['pds.environment']);
    angular.module('pds.common', ['pds.common.controller', 'pds.common.route', 'pds.common.service', 'pds.common.config', 'pds.common.model', 'pds.common.directive']);
})(angular);
