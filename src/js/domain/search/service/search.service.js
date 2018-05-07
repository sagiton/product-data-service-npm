(function(angular, $) {
	angular
		.module("pds.search.service")
		.service("SearchService", SearchService);

	SearchService.$inject = ['$q', 'Search', 'locale', 'searchHandlers'];

    var MIN_AUTOSUGGEST_TERM_LENGTH = 2;

    function SearchService($q, Search, locale, searchHandlers) {
		return {
			search: search,
			suggest: suggest,
            resolveTarget: resolveTarget
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

        function resolveTarget(params) {
            var deferred = $q.defer();
            angular.forEach(searchHandlers, function (handler) {
                handler
                    .handle(params)
                    .then(deferred.resolve)
                    .catch($.noop);
            });
            return deferred.promise;
        }
	}

})(angular, jQuery);
