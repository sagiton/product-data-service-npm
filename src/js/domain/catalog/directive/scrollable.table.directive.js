(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('scrollableTableCard', ScrollableTableCard);

    function ScrollableTableCard() {
        return {
            restrict: 'EA',
            controller: ['$scope', '$element', '$attrs', function (scope, element, attrs) {
                $('.fs-table-scrollable .js-slick-slider').each(function() {
                    var $thisTable = $(this);
                    var viewportWidth = $(window).width();
                    var tableSliderElements = $thisTable.find(".card");
                    var tableSliderElementsAmount = $(tableSliderElements).length;

                    //desktop
                    if (viewportWidth > 991) {
                        if (tableSliderElementsAmount < 3) {
                            $thisTable.addClass("js-full-width-slick-track");
                        } else {
                            $thisTable.removeClass("js-full-width-slick-track");
                        }
                    }

                    //tablet
                    if ((viewportWidth < 992) && (viewportWidth > 767)) {
                        if (tableSliderElementsAmount < 2) {
                            $thisTable.addClass("js-full-width-slick-track");
                        } else {
                            $thisTable.removeClass("js-full-width-slick-track");
                        }
                    }

                });
                if (scope.$last) {
                    //scrollable table slider-wrapper instance
                    var tableSlider = $(".fs-table-scrollable .scrollable-table-wrapper");

                    //scrollable table slider-wrapper instance (element)
                    var tableSliderElement = $(tableSlider).find(".card");


                    if (tableSlider.length > 0) {

                        //loop through ALL available Table-Elements
                        $(tableSliderElement).each(function() {
                            var $thisElement = $(this);

                            //add table-row-[row-count]-class to ALL Table-Elements
                            $thisElement.find("tr").each(function(i) {
                                var $thisRow = $(this);
                                $thisRow.addClass("table-row-" + (i + 1));
                            });

                        });

                        //function to equalize table rows
                        var equalHeightsRow = function() {

                            //loop through all table sliders
                            $(tableSlider).each(function() {
                                var $thisSlider = $(this);
                                var rowsCount = $(this).find(".card:first-of-type tr").length;

                                //loop through amount of table rows in table element
                                var i;
                                for (i = 1; i <= rowsCount; i++) {

                                    var $thisSliderRows = $(this).find("tr.table-row-" + i);
                                    var maxHeight = 0;

                                    $thisSliderRows.each(function() {
                                        if ($(this).height() > maxHeight) {
                                            maxHeight = $(this).height();
                                        }
                                    });

                                    $thisSliderRows.height(maxHeight);

                                }

                            });

                        }

                        var resetHeightsRow = function() {
                            //reset heights for window change
                            $(".fs-table-scrollable .scrollable-table-wrapper .card tr").height(0);
                        }
                        resetHeightsRow();
                        equalHeightsRow();
                    }
                }
            }]
        }
    }

})(angular);
