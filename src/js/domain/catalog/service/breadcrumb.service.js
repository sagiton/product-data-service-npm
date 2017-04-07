(function(angular) {
    angular
        .module("pds.catalog.service")
        .service("BreadcrumbService", BreadcrumbService);

    BreadcrumbService.$inject = ['CatalogService', '_', '$q'];

    function BreadcrumbService(CatalogService, _, $q) {
        return {
            build: build
        };

        function build(categoryId) {
            return CatalogService
                .travelUpNavigationHierarchy(categoryId)
                .then(decorateWithUrls)
                .then(function (tree) {
                    return _
                        .chain(tree)
                        .map(function (node) {
                            return {
                                id: node.id,
                                name: node.name,
                                url: node.url,
                                type: node.type
                            }
                        })
                        .reverse()
                        .value();
                });
        }

        function decorateWithUrls(tree) {
            return $q
                .all(_.map(tree, function (node) {
                    return CatalogService
                        .resolveUriFromHierarchy(node.id)
                        .then(function (url) {
                            node.url = url;
                        });
                }))
                .then(function () {
                    return tree;
                })
        }
    }

})(angular);
