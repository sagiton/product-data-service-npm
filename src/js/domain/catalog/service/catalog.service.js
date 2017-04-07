(function(angular) {
    angular
        .module("pds.catalog.service")
        .service("CatalogService", CatalogService);

    CatalogService.$inject = ['$window', 'Catalog', 'MenuService', 'SeoFriendlyUrlBuilder', 'catalogSearchListener', '_', '$q'];

    function CatalogService($window, Catalog, menuService, SeoFriendlyUrlBuilder, catalogSearchListener, _, $q) {
        var self = this;
        var productPrefix = 'p';
        var categoryPrefix = 'c';
        var productDetailsType = 'product_details';

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
            getNewProductFamilies: getNewProductFamilies,
            getById: getById,
            getByIdAndType: getByIdAndType,
            redirectTo: navigateTo,
            navigateTo: navigateTo,
            setOcsActiveNavigation: setOcsActiveNavigation,
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

        function getNewProductFamilies() {
            return getByTag("product_details", "new");
        }

        function getById(categoryId) {
            return getTypeFromHierarchy(categoryId)
                .then(function (type) {
                    return Catalog.get({id: categoryId, type: type}).$promise;
                });
        }

        function getByIdAndType(id, type) {
            return Catalog.get({id: id, type: type}).$promise;
        }

        function getTypeFromHierarchy(id) {
            return menuService
                .findInNavigation(id)
                .then(function (catalog) {
                    return catalog ? catalog.type : productDetailsType;
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

                if (node.type == productDetailsType) {
                    builder.setPath([node.name, node.id, productPrefix]);
                }
            });
            return builder.build();
        }

        function resolveUriFromHierarchy(categoryId, locale) {
            return travelUpNavigationHierarchy(categoryId, locale).then(buildUri);
        }

        function setOcsActiveNavigation() {
            angular
                .element('#nav-primary-collapse')
                .find('li')
                .removeClass('active');
            angular
                .element('#ocs-nav')
                .addClass('active');
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
                        return node.type === productDetailsType;
                    });
                });
        }
    }

})(angular);
