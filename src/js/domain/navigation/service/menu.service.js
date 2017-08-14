(function(angular) {
	angular
		.module("pds.navigation.service")
		.service("MenuService", MenuService);

	MenuService.$inject = ['urlParserService', '_', 'Navigation', 'locale', '$q'];

	function MenuService(urlParserService, _, Navigation, locale, $q) {
        var NAVIGATION_TEMPLATE_NAME = 'CATALOG_HIERARCHY';
        var self = this;
        self.currentLocale = locale.toString();
        self.flatNavigation = {};
        self.navigationCache = {};
        self.getMenu = getMenu;
        self.findInNavigation = findInNavigation;
        self.findParentInNavigation = findParentInNavigation;

		function getMenu(locale) {
            var properLocale = locale || self.currentLocale;
            var nav = new Navigation({
                template: {name: NAVIGATION_TEMPLATE_NAME},
                model: {locale: properLocale}
            });
            if (self.navigationCache[properLocale]) {
                return $q.resolve(self.navigationCache[properLocale]);
            }
			return nav
                .$save()
				.then(function (res) {
                    self.navigationCache[properLocale] = res.root.children[0];
                    return res.root.children[0];
				})
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
