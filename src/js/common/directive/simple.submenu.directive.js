(function (angular) {
    angular
        .module('pds.common.directive')
        .directive('simpleSubmenu', function () {
            return {
                restrict: 'EA',
                link: function (scope, element, attrs) {
                    // initNavCollapse(element);
                    //
                    // function initNavCollapse(submenus) {
                    //     var backLabel = window.cmsTranslations && window.cmsTranslations.MOBILE_NAVIGATION_BACK;
                    //
                    //     submenus
                    //         .append('<li class="dl-back"><a>' + backLabel + '</a></li>')
                    //         .end()
                    //         .on('click', '.js-open-submenu', function (e) {
                    //             if (Kit.bIsXs) {
                    //                 $(this).parent('li').addClass('is-open').parent('ul').addClass('nav-expanded').closest('li.is-open').addClass('trail');
                    //             }
                    //         })
                    //         .on('click', 'li.dl-back', function (e) {
                    //             if (Kit.bIsXs) {
                    //                 $(this).closest('li.is-open').removeClass('is-open').parent('ul.nav-expanded').removeClass('nav-expanded').parent('li.trail').removeClass('trail');
                    //             }
                    //         })
                    //         .on('hidden.bs.collapse', function (e) {
                    //             Kit.reset_navPrimary();
                    //         })
                    //         .on('click', 'li', function () {
                    //             var ocsNav = $('#ocs-nav').find('ul.nav');
                    //             ocsNav.addClass('hidden');
                    //             setTimeout(ocsNav.removeClass.bind(ocsNav, 'hidden'), 500);
                    //         });
                    // };
                }
            }
        })

})(angular);
