(function(angular) {
    angular
        .module('pds.search.model')
        .config(SearchProvider);

    SearchProvider.$inject = ['env', 'SearchProvider'];

    function SearchProvider(env, SearchProvider) {
        SearchProvider.searchEndpoint(env.endPoint.searchService);
    }

})(angular);
