(function (angular) {
    angular
        .module('pds.common.config')
        .factory('_', ['$window', function ($window) {
            return $window._;
        }]);

})(angular);
