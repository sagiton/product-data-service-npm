(function (angular) {
  angular
    .module('pds.search.service')
    .factory('searchHandlers', SearchHandlers);

  SearchHandlers.$inject = ['cmsSearchListener', 'catalogSearchListener'];

  function SearchHandlers() {
    return arguments;
  }
})(angular);
