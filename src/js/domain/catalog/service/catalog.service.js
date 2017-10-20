(function (angular) {
    angular
        .module("pds.catalog.service")
        .service("CatalogService", CatalogService);

    CatalogService.$inject = ['$window', 'Catalog', 'MenuService', 'CatalogUrlSchema', 'catalogSearchListener', '_', '$q', 'locale'];

    function CatalogService($window, Catalog, menuService, catalogUrlSchema, catalogSearchListener, _, $q, locale) {
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
            redirectTo: navigateTo,
            travelUpNavigationHierarchy: travelUpNavigationHierarchy,
            getIdFromLocation: getIdFromLocation,
            resolveUriFromHierarchy: resolveUriFromHierarchy,
        };

        function getNewProducts() {
            var catalog = new Catalog({
                template: {name: 'NEW_PRODUCTS'},
                model: {
                    locale: locale.toString(),
                    channel: getOCSChannel()
                }
            });
            return catalog.$template();
        }

        function getById(categoryId) {
            return getTypeFromHierarchy(categoryId)
                .then(function (type) {
                    return Catalog.get({
                        id: categoryId,
                        type: type,
                        channel: getOCSChannel()
                    }).$promise;
                });
        }

        function getCatalogTemplate(catalogId) {
            catalogTemplate = catalogTemplate || getTemplate(catalogId)
            return catalogTemplate
        }

        function getTemplate(catalogId, type) {
            return getTypeFromHierarchy(catalogId)
                .then(function (typeFromHierarchy) {
                    var catalog = new Catalog({
                        template: {name: type || typeFromHierarchy},
                        model: {
                            locale: locale.toString(),
                            channel: getOCSChannel(),
                            catalogRequest: {
                                id: catalogId,
                                channel: getOCSChannel(),
                                type: typeFromHierarchy
                            }
                        }
                    });
                    return catalog.$template();
                });
        }

        function getOCSChannel() {
            return angular.element('meta[name="ocs-channel"]').attr('content')
        }

        function getTypeFromHierarchy(id) {
            return menuService
                .findInNavigation(id)
                .then(function (catalog) {
                    return catalog ? catalog.type : Catalog.fallbackType();
                });
        }

        function travelUpHierarchy(categoryId, tree) {
            tree = tree || [];
            return getById(categoryId)
                .then(function (data) {
                    tree.push({
                        id: data.id,
                        type: data.type,
                        name: data.name
                    });
                    if (data && data.parentId) {
                        return travelUpHierarchy(data.parentId, tree);
                    }
                    return tree;
                });
        }

        function travelUpNavigationHierarchy(categoryId, locale) {
            return menuService
                .findInNavigation(categoryId, locale)
                .then(function (item) {
                    var tree = [];
                    while (item != null) {
                        tree.push(item);
                        item = menuService.findParentInNavigation(item.id, locale);
                    }
                    return $q.all(tree);
                });
        }

        function navigateTo(id) {
            return resolveUri(id)
                .then(function (uri) {
                    $window.location.href = uri;
                });
        }

        function resolveUri(categoryId) {
            return travelUpHierarchy(categoryId)
                .then(catalogUrlSchema.build);
        }

        function resolveUriFromHierarchy(categoryId, locale, channel) {
            return travelUpNavigationHierarchy(categoryId, locale)
                .then(function (tree) {
                    return catalogUrlSchema.build(tree, channel)
                });
        }

        function getIdFromLocation(uri) {
            uri = uri || new URI().toString();
            var parts = uri.split('-');
            return parts[parts.length - 2];
        }

    }

})(angular);
