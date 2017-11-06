(function (angular) {
    angular
        .module('pds.search.directive')
        .component('ocsQuickSearch', {
            template:  ['$templateCache', function($templateCache) {
                return $templateCache.get('component/quick_search.html')
            }],
            controller: ocsQuickSearchController,
            bindings: {
                searchPageUrl: '@'
            },
            transclude: true
        });

    ocsQuickSearchController.$inject = ['_', '$rootScope', 'SearchService', '$window'];

    function ocsQuickSearchController(_, $rootScope, SearchService, $window) {
        var self = this;

        self.suggest = _.throttle(suggest, 200);
        self.goTo = goTo;
        self.doSearch = doSearch;

        self.$onInit = function() {
            self.searchPageUrl = self.searchPageUrl || angular.element('#header-search').attr('search-page-url') || 'search.html';
        };

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
                $window.navigate(self.searchPageUrl + '?terms=' + self.quicksearch);
            }
        }
    }
})(angular);
