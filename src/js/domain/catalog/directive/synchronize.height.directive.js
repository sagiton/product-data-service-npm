(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('synchronizeHeight', SynchronizeHeight);

    SynchronizeHeight.$inject = ['$timeout', '$window'];

    function SynchronizeHeight($timeout, $window) {
        return {
            restrict: 'EA',
            link: function (scope, element, attrs) {
                $timeout(function() { //FIXME Remove timeout hack if possible
                    var firstColumnRow = angular
                        .element(document)
                        .find('.card.card-column table tr')
                        .eq(scope.$index + 1)

                    scope.$watchCollection(function () {
                        return {
                            headerCellHeight: firstColumnRow[0].offsetHeight,
                            thisCellHeight: element[0].offsetHeight
                        }
                    }, synchronizeRowHeight, true)

                    function synchronizeRowHeight(newVals) {
                        var maxHeight = newVals.headerCellHeight > newVals.thisCellHeight ? newVals.headerCellHeight : newVals.thisCellHeight
                        element.height(maxHeight)
                        firstColumnRow.height(maxHeight)
                    }
                }, 500)

                angular.element($window).bind('resize', function () {
                    scope.$apply();
                });

            }
        }
    }

})(angular);
