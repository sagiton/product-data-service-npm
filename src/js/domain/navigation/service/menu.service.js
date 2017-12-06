(function(angular) {
	angular
		.module("pds.navigation.service")
		.service("MenuService", MenuService);

	MenuService.$inject = ['_', 'Navigation', 'locale', 'metaTag'];

	function MenuService(_, Navigation, locale, metaTag) {
        var self = this;
        var NAVIGATION_TEMPLATE_NAME = 'CATALOG_HIERARCHY';

        self.locale = locale.toString();
        self.flatNavigation = {};

        self.getMenu = getMenu;
        self.findInNavigation = findInNavigation;
        self.findParentInNavigation = findParentInNavigation;

		function getMenu(locale) {
            var properLocale = locale || self.locale;
            var nav = new Navigation({
                template: {
                    name: NAVIGATION_TEMPLATE_NAME,
                    channel: metaTag.getOcsChannel()
                },
                model: {
                    locale: properLocale,
                    channel: metaTag.getOcsChannel()
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

		function getFlatMenu(locale) {
            return getMenu(locale)
                .then(function (menu) {
                    locale = locale || self.locale;
                    self.flatNavigation[locale] = self.flatNavigation[locale] || flatMenu(menu);
                    return self.flatNavigation[locale];
                })
        }

        function flatMenu(menu) {
		    var children = _.get(menu, 'children')
            return children.reduce(function(acc, elem) {
                acc = acc.concat(elem)
                if (!_.isEmpty(elem.children)) {
                    acc = acc.concat(flatMenu(elem));
                    elem.children = []
                }
                return acc
            }, [menu])
        }

        function findInNavigation(id, locale) {
            return getFlatMenu(locale)
                .then(function(flat) {
                    return _.find(flat, {id: String(id)})
                });
        }

        function findParentInNavigation(childId, locale) {
            return _.find(self.flatNavigation[locale || self.locale], function (val) {
                return !!_.find(val.children, {id: childId});
            });
        }
	}

})(angular);
