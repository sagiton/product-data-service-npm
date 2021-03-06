(function (angular) {
    angular
        .module("pds.catalog.service")
        .service("CatalogService", CatalogService);

    CatalogService.$inject = ['$window', 'Catalog', 'MenuService', 'catalogUrlSchema', '_', '$q', 'locale', 'metaTag'];

    function CatalogService($window, Catalog, menuService, catalogUrlSchema, _, $q, locale, metaTag) {
        var catalogTemplate;

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
            return menuService.findInNavigation({id: catalogId})
                .then(function (data) {
                    return new Catalog({
                        template: {name: type || data.type},
                        model: {
                            locale: locale.toString(),
                            channel: metaTag.getOcsChannel(),
                            catalogRequest: {
                                id: catalogId,
                                channel: metaTag.getOcsChannel(),
                                type: data.type,
                                cmsDefinitionUrl: metaTag.getOcsSnippetDefinition()
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

        function travelUpNavigationHierarchy(metadata) {
            return menuService
                .findInNavigation(metadata)
                .then(function (data) {
                    var catalogs = [];
                    while (data != null) {
                        catalogs.push(new Catalog(data));
                        data = menuService.findParentInNavigation(data.id, metadata.locale);
                    }
                    return $q.all(catalogs);
                });
        }

        function getIdFromLocation(uri) {
            uri = uri || new URI().toString();
            var parts = uri.split('-');
            return parts[parts.length - 2];
        }

        function resolveUriFromHierarchy(catalogId, locale, channel) {
            return travelUpNavigationHierarchy({id: catalogId, locale: locale, channel: channel})
                .then(function (catalogs) {
                    return catalogUrlSchema.build(catalogs, menuService.getHierarchyType())
                });
        }

    }

})(angular);
