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
            catalogTemplate = catalogTemplate || getTemplate(catalogId)
            return catalogTemplate
        }

        function getTemplate(catalogId, type) {
            return menuService.findInNavigation(catalogId)
                .then(function (catalog) {
                    catalog.template = {
                        name: type || catalog.type
                    }
                    catalog.model = {
                        locale: locale.toString(),
                        channel: metaTag.getOcsChannel(),
                        catalogRequest: {
                            id: catalogId,
                            channel: metaTag.getOcsChannel(),
                            type: catalog.type
                        }
                    }
                    return catalog.$template();
                });
        }

        function redirectTo(id) {
            return resolveUri(id)
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

        function getById(categoryId) {
            return menuService.findInNavigation(categoryId)
                .then(function (catalog) {
                    catalog.channel = metaTag.getOcsChannel()
                    return catalog.$get().$promise;
                });
        }

        function travelUpHierarchy(categoryId) {
            return getById(categoryId)
                .then(function (catalog) {
                    var catalogs = [];
                    while (catalog != null) {
                        catalogs.push(catalog);
                        catalog = getById(catalog.parentId, locale);
                    }
                    return $q.all(catalogs);
                });
        }

        function resolveUri(categoryId) {
            return travelUpHierarchy(categoryId)
                .then(catalogUrlSchema.build);
        }

    }

})(angular);
