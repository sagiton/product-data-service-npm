(function (angular) {
    angular
        .module('pds.common.directive')
        .directive('translateExists', TranslateExists);

    TranslateExists.$inject = ['$translate'];

    function TranslateExists($translate) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                $translate(attrs.translate || attrs.translateExists).catch(function () {
                    element.remove();
                });
            }
        }
    }

})(angular);
