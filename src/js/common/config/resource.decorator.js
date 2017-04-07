(function(angular) {
    angular
        .module('pds.common.config')
        .constant('ResourceDecorator', ResourceDecorator);

    function ResourceDecorator() {

    }

    ResourceDecorator.appendBaseUrl = function($delegate, restUrl) {
        return function () {
            if (restUrl.slice(-1) != '/') {
                restUrl += '/';
            }
            if (arguments[0].charAt(0) == '/') {
                arguments[0] = arguments[0].slice(1);
            }

            var absolute = arguments[3] && arguments[3].absolute;
            arguments[0] = absolute ? arguments[0] : restUrl + arguments[0];
            var instance = $delegate.apply(this, arguments);
            instance.path = arguments[0];
            return instance;
        }
    }

})(angular);
