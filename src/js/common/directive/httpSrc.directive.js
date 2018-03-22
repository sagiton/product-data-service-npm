(function (angular) {
    'use strict';

    angular
        .module('pds.common.directive')
        .directive('httpSrc', HttpSrc);

    HttpSrc.$inject = ['$http', 'translateFilter'];

    function HttpSrc($http, translateFilter) {
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
                attrs.$set('src', translateFilter('SEARCH.DEFAULT.IMAGE.PATH'));
            }

        }

    }
})(angular);
