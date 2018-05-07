(function (angular) {
  angular
    .module('pds.search.directive')
    .directive('searchResultLink', SearchResultLink);

  SearchResultLink.$inject = ['SearchService'];

  function SearchResultLink(searchService) {
    return {
      restrict: 'A',
      scope: {
        searchResultLink: '=',
        searchTerm: '='
      },
      link: function (scope, element, attrs, ctrl) {
        scope.$watch('searchResultLink', function (val) {
          searchService
            .resolveTarget({target: val, searchTerm: scope.searchTerm})
            .then(function (target) {
              element.attr('href', target);
            });
        });
      }
    }
  }

})(angular);
