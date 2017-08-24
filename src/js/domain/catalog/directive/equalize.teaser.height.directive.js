(function (angular, $) {
    angular
        .module('pds.catalog.directive')
        .directive('equalizeTeaserHeight', ['$timeout', EqualizeTeaserHeight]);

    function EqualizeTeaserHeight($timeout) {
        return {
            restrict: 'EA',
            controller: ['$scope', '$element', '$attrs', function (scope, element, attrs) {
                if (scope.$last) {
                    $timeout(function() {
                        var maxHeight = 0;
                        var cardBlock = $(".card .card-block");

                        $(cardBlock).each(function() {
                            if ($(this).height() > maxHeight) {
                                maxHeight = $(this).height();
                            }
                        });

                        $(cardBlock).height(maxHeight);
                    }, 0);
                }
            }]
        }
    }

})(angular, jQuery);
