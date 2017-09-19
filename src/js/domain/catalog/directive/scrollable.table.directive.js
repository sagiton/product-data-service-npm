(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('scrollableTableCard', function() {
            return {
                restrict: 'EA',
                controller: ScrollableTableCardController
            }
        });

    ScrollableTableCardController.$inject = ['$scope', '$element', '$attrs'];

    function ScrollableTableCardController(scope, element, attrs) {

        var $thisTable = $(this);
        var viewportWidth = $(window).width();
        var tableSliderElements = $thisTable.find(".card");
        var tableSliderElementsAmount = $(tableSliderElements).length;

        function setProperColumnQuantity() {
            element.each(function() {
                //desktop
                if (viewportWidth > 991) { //FIXME
                    if (tableSliderElementsAmount < 3) {
                        $thisTable.addClass("js-full-width-slick-track");
                    } else {
                        $thisTable.removeClass("js-full-width-slick-track");
                    }
                }

                //tablet
                if ((viewportWidth < 992) && (viewportWidth > 767)) { //FIXME
                    if (tableSliderElementsAmount < 2) {
                        $thisTable.addClass("js-full-width-slick-track");
                    } else {
                        $thisTable.removeClass("js-full-width-slick-track");
                    }
                }

            });
        }
        setProperColumnQuantity()
        $(window).on("resize orientationchange", setProperColumnQuantity)
    }

})(angular);
