(function (angular) {
    'use strict';

    angular
        .module('pds.common.directive')
        .directive('httpSrc', HttpSrc)

    var defaultImages = {
        'img-bg_BG': '/src/media/img_Default_BG_1.jpg',
        'img-es_ES': '/src/media/img_Default_ES_1.jpg',
        'img-hu_HU': '/src/media/img_Default_HU_1.jpg',
        'img-ro_RO': '/src/media/img_Default_RO_1.jpg'
    };
    var defaultLang = 'bg_BG'

    HttpSrc.$inject = ['_', '$http', 'locale'];

    function HttpSrc(_, $http, locale) {
        return {
            scope: {
                httpSrc: '='
            },
            link: link,
            restrict: 'A'
        };

        function link(scope, element, attrs) {

            if (!scope.httpSrc) {
                return defaultImage();
            }

            $http.get(scope.httpSrc)
                .then(function(response) {
                    attrs.$set('src', scope.httpSrc)
                })
                .catch(defaultImage)

            element.bind('error', defaultImage);

            function defaultImage() {
                var image = defaultImages['img-'+locale.toString()] || defaultImages['img-'+defaultLang]
                attrs.$set('src', image);
            }

        }

    }
})(angular);
