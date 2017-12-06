(function (angular) {

    const PAGE_OFFSET = 170;

    angular
        .module('pds.common.directive')
        .directive('stickyHeader', function () {
            return {
                restrict: 'EA',
                link: function (scope, element, attrs) {

                    var elNavPrimary = angular.element('#nav-primary')[0]
                    var $content = angular.element('#content')

                    if (elNavPrimary) {
                        new Waypoint({
                            element: elNavPrimary,
                            handler: function(direction) {
                                element.toggleClass('sticked', direction == 'down');
                                $content.css('margin-top', direction == 'down' ? PAGE_OFFSET : '');
                                // START 20170214 dsp workaround iOS scrolling bug, email mho>dsp Mo 13.02.2017 14:35
                                var iOS = ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0;
                                if (iOS) {$content.css('margin-top','85px')}
                                // END 20170214 dsp workaround iOS scrolling bug, email mho>dsp Mo 13.02.2017 14:35
                            }, offset: 0
                        });
                    }

                }
            }
        })

})(angular);
