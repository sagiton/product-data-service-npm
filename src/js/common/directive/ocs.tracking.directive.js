(function (angular) {
    angular
        .module('pds.common.directive')
        .directive('ocsTracking', TrackingDirective);

    TrackingDirective.$inject = [];

    function TrackingDirective() {
        return {
            restrict: 'A',
            priority: 10,
            scope: false,
            link: function (scope, element, attrs, ctrl) {
                element.click(function () {
                    var type = scope.$eval(attrs.ocsTracking);
                    var data = scope.$eval(attrs.ocsTrackingData);
                    scope.$emit('pds.tracking.' + type, data);
                });
            }
        }
    }

})(angular);
