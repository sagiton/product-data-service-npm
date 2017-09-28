(function (angular, $) {
    angular
        .module('pds.catalog.directive')
        .directive('fullWidthTable', FullWidthTable);

    FullWidthTable.$inject = [];

    function FullWidthTable() {
        return {
            restrict: 'EA',
            link: link
        }
    }

    function link(scope, element, attrs) {

        var viewportWidth = $(window).width();
        var tableSliderElements = element.find(".slick-track .card");
        var tableSliderElementsAmount = $(tableSliderElements).length;

        //desktop
        if (viewportWidth > 991) {
            if (tableSliderElementsAmount < 3) {
                element.addClass("js-full-width-slick-track");
            } else {
                element.removeClass("js-full-width-slick-track");
            }
        }

        //tablet
        if ((viewportWidth < 992) && (viewportWidth > 767)) {
            if (tableSliderElementsAmount < 2) {
                element.addClass("js-full-width-slick-track");
            } else {
                element.removeClass("js-full-width-slick-track");
            }
        }

    }

})(angular, $);
