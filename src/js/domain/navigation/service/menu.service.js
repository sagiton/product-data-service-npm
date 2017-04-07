(function(angular) {
	angular
		.module("pds.navigation.service")
		.service("MenuService", MenuService);

	MenuService.$inject = ['urlParserService', '_', 'Navigation', 'locale'];

	function MenuService(urlParserService, _, Navigation, locale) {
        var self = this;
        self.currentLocale = locale.toString();
        self.flatNavigation = {};
        self.getMenu = getMenu;
        self.findInNavigation = findInNavigation;
        self.findParentInNavigation = findParentInNavigation;

		function getMenu(locale) {
			return Navigation
				.get(locale ? {locale: locale} : {})
                .$promise
				.then(function (res) {
                    var segment = _.find(res, {name: urlParserService.getRootSegment()}) || res[0];
                    return _.head(segment.children);
				});
		}

		function getFlatMenu(locale) {
            return getMenu(locale)
                .then(function (menu) {
                    locale = locale || self.currentLocale;
                    self.flatNavigation[locale] = self.flatNavigation[locale] || flatMenu(menu);
                    return self.flatNavigation[locale];
                })
        }

        function flatMenu(menu, flat) {
            flat = flat || [];
            flat.push(menu);
            _.each(menu.children, function (item) {
                flatMenu(item, flat);
            });
            return flat;
        }

        function findInNavigation(id, locale) {
            return getFlatMenu(locale)
                .then(function(flat) {
                    return _.find(flat, {id: String(id)});
                });
        }

        function findParentInNavigation(childId, locale) {
            return _.find(self.flatNavigation[locale || self.currentLocale], function (val) {
                return !!_.find(val.children, {id: childId});
            });
        }
	}

})(angular);
