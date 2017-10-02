(function (angular) {
    angular
        .module('pds.search.directive')
        .component('ocsQuickSearch', {
            template:  ['$templateCache', function($templateCache) {
                return $templateCache.get('component/quick_search.html')
            }],
            transclude: true,
            controller: ocsQuickSearchController
        });

    ocsQuickSearchController.$inject = ['_', '$location', '$state', '$rootScope', 'SearchService', '$window'];

    function ocsQuickSearchController(_, $location, $state, $rootScope, SearchService, $window) {
        var self = this;

        self.suggest = _.throttle(suggest, 200);
        self.goTo = goTo;
        self.doSearch = doSearch;

        //FIXME a hack to proceed to state `search` after entering search.html
        var path = $location.path();
        if (path && path.indexOf('search.html') > -1 && !$state.is('search')) {
            $state.go('search');
        }

        function suggest() {
            return SearchService
                .suggest(self.quicksearch)
                .then(function(data) {
                    return self.autosuggest = data;
                });
        }

        function goTo(target) {
            $rootScope.$broadcast('pds.search.navigate', {target: target});
        }

        function doSearch($item) {
            if (!$item || $item.which === 13) {
                $window.navigate('search.html?terms=' + self.quicksearch);
            }
        }
    }
})(angular);
