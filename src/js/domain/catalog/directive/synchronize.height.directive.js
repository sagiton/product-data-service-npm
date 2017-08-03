(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('synchronizeHeight', SynchronizeHeight);

    SynchronizeHeight.$inject = ['$timeout'];

    function SynchronizeHeight($timeout) {
        return {
            restrict: 'EA',
            link: function (scope, element, attrs) {
                $timeout(function () {
                    angular
                        .element(document)
                        .find('.card.card-sticky table tr')
                        .eq(scope.$index + 1)
                        .css('height', element.css('height'));
                }, 500);
            }
        }
    }

})(angular);
