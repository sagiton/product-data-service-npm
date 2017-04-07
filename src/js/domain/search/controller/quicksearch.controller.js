(function(angular) {
    angular
        .module("pds.search.controller")
        .controller("QuicksearchController", QuicksearchController);

    QuicksearchController.$inject = ['$location', '$state', '$rootScope', 'SearchService', '$window'];

    function QuicksearchController($location, $state, $rootScope, SearchService, $window) {
        var vm = this;
        vm.suggest = suggest;
        vm.goTo = goTo;
        vm.doSearch = doSearch;

        //FIXME a hack to proceed to state `search` after entering search.html
        var path = $location.path();
        if (path && path.indexOf('search.html') > -1 && !$state.is('search')) {
            $state.go('search');
        }

        function suggest() {
            return SearchService
                .suggest(vm.quicksearch)
                .then(function(data) {
                    return vm.autosuggest = data;
                });
        }

        function goTo(target) {
            $rootScope.$broadcast('pds.search.navigate', {target: target});
        }

        function doSearch($item) {
            if (!$item || $item.which === 13) {
                $window.navigate('search.html?terms=' + vm.quicksearch);
            }
        }
    }
})(angular);
