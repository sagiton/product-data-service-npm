(function(angular) {
	angular
		.module("pds.navigation.service")
		.service("MenuService", MenuService);

	MenuService.$inject = ['_', 'Navigation', 'locale'];

	function MenuService(_, Navigation, locale) {
        var NAVIGATION_TEMPLATE_NAME = 'CATALOG_HIERARCHY';
        var self = this;
        self.currentLocale = locale.toString();
        self.flatNavigation = {};
        self.getMenu = getMenu;
        self.findInNavigation = findInNavigation;
        self.findParentInNavigation = findParentInNavigation;

		function getMenu(locale) {
            var properLocale = locale || self.currentLocale;
            var nav = new Navigation({
                template: {
                    name: NAVIGATION_TEMPLATE_NAME,
                    channel: getOCSChannel()
                },
                model: {
                    locale: properLocale,
                    channel: getOCSChannel()
                }
            });
			return Navigation
                .get({query: nav})
                .$promise
				.then(function (res) {
                    if(!res.root) {
                        return {};
                    }
                    res.root.children[0].maxNavigationItems = res.root.maxNavigationItems;
                    return res.root.children[0];
				})
		}


        function getOCSChannel() {
            return angular.element('meta[name="ocs-channel"]').attr('content')
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
            return getFlatMenu(locale)
                .then(function(flat) {
                    return _.find(flat, function (val) {
                        return !!_.find(val.children, {id: childId});
                    });
                })
        }
	}

})(angular);
