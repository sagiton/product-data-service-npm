(function (angular) {
    angular
        .module('pds.common.directive')
        .run(function () {


            var standardHeader = $("#header:not(.special-header)");

            window.Kit = window.Kit || {};

            Kit.bIsXs = false;
            Kit.nPageOffset = 0;

            Kit.check_deviceWidth = function() {
                Kit.bIsXs = (Kit.detectXs || {}).clientHeight ? false: true;
            };

            Kit.reset_navPrimary = function() {
                $('#nav-primary-collapse')
                    .find('li.is-open').removeClass('is-open, trail')
                    .end()
                    .find('ul.nav-expanded').removeClass('nav-expanded');
            };


            if (standardHeader.length) {

                jQuery(window).resize(function (e) {
                    Kit.nHeaderHeight = document.getElementById('header').clientHeight;

                    Kit.check_deviceWidth();

                    if (window.Waypoint) {
                        Waypoint.refreshAll();
                    }

                    if (!Kit.bIsXs) {
                        Kit.reset_navPrimary();
                    }
                });
            }

            jQuery(document).ready(function($) {
                if (standardHeader.length) {
                    window.scrollTo(0, 0);
                    Kit.nHeaderHeight = document.getElementById('header').clientHeight;

                    Kit.detectXs = document.getElementById('js-detect-xs');
                    Kit.check_deviceWidth();
                    Kit.nPageOffset = document.querySelector('.supergraphic.fixed') ? document.querySelector('.supergraphic.fixed').clientHeight : 0;
                }

                if (window.Waypoint) {


                    if (standardHeader.length) {
                        /**
                         * Header
                         */
                        var elHeader = document.getElementById('header')
                            , elNavPrimary = document.getElementById('nav-primary')
                            , $content = $('#content');

                        if (elHeader && elNavPrimary) {
                            var navPrimary = new Waypoint({
                                element: elNavPrimary
                                , handler: function (direction) {
                                    $(elHeader).toggleClass('sticked', direction == 'down');
                                    $content.css('margin-top', direction == 'down' ? Kit.nHeaderHeight : '');
                                    // START 20170214 dsp workaround iOS scrolling bug, email mho>dsp Mo 13.02.2017 14:35
                                    var iOS = ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0;
                                    if (iOS) {
                                        $content.css('margin-top', '85px')
                                    }
                                    // END 20170214 dsp workaround iOS scrolling bug, email mho>dsp Mo 13.02.2017 14:35
                                }
                                , offset: Kit.nPageOffset
                            });
                        } // END Header

                        $('.js-go-top').on('click', 'a', function(e) {
                            $('html:not(:animated), body:not(:animated)').animate({ scrollTop: 0 }, 240);
                        });

                    }
                }
            })

        })

})(angular);
