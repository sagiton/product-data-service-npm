(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('scrollableTableCard', ScrollableTableCard);

    function ScrollableTableCard() {
        return {
            restrict: 'EA',
            controller: ['$scope', '$element', '$attrs', function (scope, element, attrs) {
                if (scope.$last) {
                    window.scrollableTable && window.scrollableTable();
                }
            }]
        }
    }

})(angular);
