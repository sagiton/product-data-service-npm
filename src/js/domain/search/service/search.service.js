(function(angular) {
	angular
		.module("pds.search.service")
		.service("SearchService", SearchService);

	SearchService.$inject = ['$q', 'Search', 'locale'];

    var MIN_AUTOSUGGEST_TERM_LENGTH = 2;

    function SearchService($q, Search, locale) {
		return {
			search: search,
			suggest: suggest
		};

		function search(search) {
			return Search.query({locale: locale, searchTerm: search}).$promise;
		}

		function suggest(searchTerm) {
            if (searchTerm && searchTerm.length > MIN_AUTOSUGGEST_TERM_LENGTH) {
                return Search.localize({locale: locale, searchTerm: searchTerm}).$promise;
            }
			return $q.resolve([]);
		}

	}

})(angular);
