(function (angular) {
    angular
        .module("pds.catalog.service")
        .service("CatalogService", CatalogService);

    CatalogService.$inject = ['$window', 'Catalog', 'MenuService', 'catalogUrlSchema', 'catalogSearchListener', '_', '$q', 'locale', 'metaTag'];

    function CatalogService($window, Catalog, menuService, catalogUrlSchema, catalogSearchListener, _, $q, locale, metaTag) {
        var catalogTemplate;

        catalogSearchListener
            .listen()
            .then(function (params) {
                return resolveUriFromHierarchy(params.target.resourceId, null, params.consumer);
            })
            .then(function (uri) {
                $window.location.href = uri;
            });

        return {
            getNewProducts: getNewProducts,
            getCatalogTemplate: getCatalogTemplate,
            getTemplate: getTemplate,
            redirectTo: redirectTo,
            travelUpNavigationHierarchy: travelUpNavigationHierarchy,
            getIdFromLocation: getIdFromLocation,
            resolveUriFromHierarchy: resolveUriFromHierarchy,
        };

        function getNewProducts() {
            var catalog = new Catalog({
                template: {name: 'NEW_PRODUCTS'},
                model: {
                    locale: locale.toString(),
                    channel: metaTag.getOcsChannel()
                }
            });
            return catalog.$template();
        }

        function getCatalogTemplate(catalogId) {
            return catalogTemplate = catalogTemplate || getTemplate(catalogId)
        }

        function getTemplate(catalogId, type) {
            return menuService.findInNavigation(catalogId)
                .then(function (data) {
                    return new Catalog({
                        template: {name: type || data.type},
                        model: {
                            locale: locale.toString(),
                            channel: metaTag.getOcsChannel(),
                            catalogRequest: {
                                id: catalogId,
                                channel: metaTag.getOcsChannel(),
                                type: data.type
                            }
                        }
                    }).$template()
                });
        }

        function redirectTo(id) {
            return resolveUriFromHierarchy(id)
                .then(function (uri) {
                    $window.location.href = uri;
                });
        }

        function travelUpNavigationHierarchy(categoryId, locale) {
            return menuService
                .findInNavigation(categoryId, locale)
                .then(function (catalog) {
                    var catalogs = [];
                    while (catalog != null) {
                        catalogs.push(catalog);
                        catalog = menuService.findParentInNavigation(catalog.id, locale);
                    }
                    return $q.all(catalogs);
                });
        }

        function getIdFromLocation(uri) {
            uri = uri || new URI().toString();
            var parts = uri.split('-');
            return parts[parts.length - 2];
        }

        function resolveUriFromHierarchy(categoryId, locale, channel) {
            return travelUpNavigationHierarchy(categoryId, locale)
                .then(function (catalogs) {
                    return catalogUrlSchema.build(catalogs, channel)
                });
        }

    }

})(angular);
