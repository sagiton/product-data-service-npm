(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('equalizeTeaserHeight', ['$timeout', EqualizeTeaserHeight]);

    function EqualizeTeaserHeight($timeout) {
        return {
            restrict: 'EA',
            controller: ['$scope', '$element', '$attrs', function (scope, element, attrs) {
                if (scope.$last) {
                    $timeout(equalHeightsTeaser, 0);
                }
            }]
        }
    }

})(angular);
