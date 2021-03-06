(function (angular) {
    angular
        .module('pds.search.directive')
        .component('ocsSearch', {
            template:  ['$templateCache', function($templateCache) {
                return $templateCache.get('component/search.html')
            }],
            controller: ocsSearchController
        });

    ocsSearchController.$inject = ['$anchorScroll', 'SearchService', '$location', '_', 'translateFilter'];

    function ocsSearchController($anchorScroll, SearchService, $location, _, translateFilter) {
        var self = this;
        self.finalSearchResults = [];
        self.searchTerm = $location.search().terms;
        self.contactText = translateFilter('SEARCH.NO.RESULT.CHECKLIST.3', {contactLink: "<a href='" + translateFilter('SEARCH.CONTACT.URL') + "' class='link-more' target='_self'>" + translateFilter('SEARCH.CONTACT') + "</a>"});
        self.onSearchInput = onSearchInput;
        self.goToAnchor = goToAnchor;

        search();

        function search() {
            if (!self.searchTerm) {
                return;
            }
            self.totalLength = false;
            $location.search('terms', self.searchTerm);

            return SearchService
                .search(self.searchTerm)
                .then(function(data) {
                    self.totalLength = data.length;
                    self.finalSearchResults = _.groupBy(data, 'channelDiscriminator');
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

    }
})(angular);
