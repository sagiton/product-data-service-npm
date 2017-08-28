(function(angular) {
    angular
        .module("pds.search.controller")
        .controller("SearchController", SearchController);

    SearchController.$inject = ['$anchorScroll', 'SearchService', 'cmsSearchListener', '$rootScope', '$location', '$window', '_', 'translateFilter'];

    function SearchController($anchorScroll, SearchService, cmsSearchListener, $rootScope, $location, $window, _, translateFilter) {
        var vm = this;
        vm.finalSearchResults = [];
        vm.searchTerm = $location.search().terms;
        vm.contactText = translateFilter('SEARCH.NO.RESULT.CHECKLIST.3', {contactLink: "<a href='" + translateFilter('SEARCH.CONTACT.URL') + "' class='link-inline' target='_self'>" + translateFilter('SEARCH.CONTACT') + "</a>"});
        vm.onSearchInput = onSearchInput;
        vm.goToAnchor = goToAnchor;
        vm.goMore = goMore;

        cmsSearchListener
            .listen()
            .then(function (param) {
                $window.location.href = param.target.resourceLocation;
            });
        search();

        function search() {
            if (!vm.searchTerm) {
                return;
            }
            vm.totalLength = false;
            $location.search('terms', vm.searchTerm);

            return SearchService
                .search(vm.searchTerm)
                .then(function(data) {
                    vm.totalLength = data.length;
                    vm.finalSearchResults = _.groupBy(data, 'channelDiscriminator');
                });
        }

        function onSearchInput(keyEvent) {
            if (keyEvent.which === 13) {
                search();
            }
        }

        function goToAnchor(idToGo) {
            $location.hash(idToGo);
            $anchorScroll.yOffset = 80;
            $anchorScroll();
        }

        function goMore(param) {
            $rootScope.$broadcast('pds.search.navigate', {target: param});
        }
    }
})(angular);
