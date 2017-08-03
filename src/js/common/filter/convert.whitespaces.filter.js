(function (angular) {

    angular
        .module('pds.common.filter')
        .filter('convertWhitespaces', function () {
            return function (input) {
                return input && input
                        .replace(/\n/g, '</br>')
                        .replace(/<!--.*language.*missing.*-->/g, '');
            }
        });
})(angular);
