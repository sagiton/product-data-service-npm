(function (angular) {

    angular
        .module('pds.common.config')
        .decorator('$window', ['$delegate', WindowDecorator]);

    function WindowDecorator($delegate) {
        $delegate.navigate = function (uri) {
            if (uri.indexOf('/') != 0) {
                uri = '/'.concat(uri);
            }
            $delegate.location.href = getBasePath() + uri;
        };
        $delegate.getBasePath = function getBasePath() {
            var basePath = angular.element('base').attr('href-override');

            if (!basePath)
                basePath = angular.element('base').attr('href');

            if (basePath.lastIndexOf('/') == (basePath.length - 1)) {
                basePath = basePath.slice(0, basePath.length - 1);
            }
            return basePath;
        };
        return $delegate;
    }
})(angular);
