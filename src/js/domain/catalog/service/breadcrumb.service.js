(function(angular) {
    angular
        .module("pds.catalog.service")
        .service("BreadcrumbService", BreadcrumbService);

    BreadcrumbService.$inject = ['CatalogService', '_', '$q'];

    function BreadcrumbService(CatalogService, _, $q) {
        var templatePromise

        return {
            build: build
        };

        function build(categoryId) {
            templatePromise = templatePromise || CatalogService.getTemplate(categoryId, 'BREADCRUMBS')
            
            return templatePromise
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
                        .value();
                });
        }

        function decorateWithUrls(response) {
            var tree = response.nodes
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
