(function(angular) {
    angular
        .module("pds.catalog.service")
        .service("CatalogService", CatalogService);

    CatalogService.$inject = ['$window', 'Catalog', 'MenuService', 'SeoFriendlyUrlBuilder', 'catalogSearchListener', '_', '$q', 'locale'];

    function CatalogService($window, Catalog, menuService, SeoFriendlyUrlBuilder, catalogSearchListener, _, $q, locale) {
        var self = this;
        var productPrefix = 'p';
        var categoryPrefix = 'c';
        var catalogTemplate;

        catalogSearchListener
            .listen()
            .then(function (params) {
                return resolveUriFromHierarchy(params.target.resourceId);
            })
            .then(function (uri) {
                $window.location.href = uri;
            });

        return {
            getByTag: getByTag,
            getNewProducts: getNewProducts,
            getCatalogTemplate: getCatalogTemplate,
            getById: getById,
            getTemplate: getTemplate,
            getByIdAndType: getByIdAndType,
            redirectTo: navigateTo,
            navigateTo: navigateTo,
            travelUpHierarchy: travelUpHierarchy,
            travelUpNavigationHierarchy: travelUpNavigationHierarchy,
            getIdFromLocation: getIdFromLocation,
            resolveUri: resolveUri,
            resolveUriFromHierarchy: resolveUriFromHierarchy,
            getProductFamily: getProductFamily
        };

        function getByTag(type, tag) {
            return Catalog.query({type: type, id: tag, queryType: 'tag'}).$promise;
        }

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
                    return Catalog.get({id: categoryId, type: type}).$promise;
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

        function getByIdAndType(id, type) {
            return Catalog.get({id: id, type: type}).$promise;
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
                        id: data.id.value,
                        type: data.type.value,
                        name: data.name.value
                    });
                    if (data && data.parentId) {
                        return travelUpHierarchy(data.parentId.value, tree);
                    }
                    return tree;
                });
        }

        function travelUpNavigationHierarchy(categoryId, locale) {
            return menuService
                .findInNavigation(categoryId, locale)
                .then(function (item) {
                    var tree = [];
                    while(item != null) {
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
            return travelUpHierarchy(categoryId).then(buildUri);
        }

        function buildUri(tree) {
            var builder = new SeoFriendlyUrlBuilder();
            _.forEachRight(tree, function (node) {
                var fragments = [node.name];
                if (tree.indexOf(node) == 0) {
                    fragments.push(node.id, categoryPrefix);
                }
                builder.addPath(fragments);

                if (node.type == Catalog.fallbackType()) {
                    builder.setPath([node.name, node.id, productPrefix]);
                }
            });
            return builder.build();
        }

        function resolveUriFromHierarchy(categoryId, locale) {
            return travelUpNavigationHierarchy(categoryId, locale).then(buildUri);
        }

        function getIdFromLocation(uri) {
            uri = uri || new URI().toString();
            var parts = uri.split('-');
            return parts[parts.length - 2];
        }

        function getProductFamily(product) {
            if (!product) {
                return $q.resolve(null);
            }
            var elements = product.parentId.value.elements || [product.parentId.value];
            return $q
                .all(_.map(elements, function (parentId) {
                    return menuService.findInNavigation(parentId) || {};
                }))
                .then(function (nodes) {
                    return _.find(nodes, function (node) {
                        return node.type === Catalog.fallbackType();
                    });
                });
        }
    }

})(angular);
