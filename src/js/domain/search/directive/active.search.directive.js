(function (angular) {
    angular
        .module('pds.search.directive')
        .directive('activeSearch', function() {
            return {
                restrict: 'A',
                link: link
            }
        });

        function link(scope, element, attrs) {

            element
                .on('focus', function(e) {
                    document.body.classList.add('search-active');
                })
                .on('blur', function(e) {
                    document.body.classList.remove('search-active');
                });

            angular.element('#js-show-header-search')
                .on('click', 'a', function(e) {
                    element.trigger('focus');
                });
        }

})(angular);
