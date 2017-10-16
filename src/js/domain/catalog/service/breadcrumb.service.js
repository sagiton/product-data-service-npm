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
                    return _.map(tree, function (node) {
                        return _.pick(node, 'id', 'name', 'url', 'type')
                    })
                });
        }

        function decorateWithUrls(response) {
            var tree = response.nodes
            var promises = _.map(tree, function (node) {
                return CatalogService
                    .resolveUriFromHierarchy(node.id)
                    .then(function (url) {
                        node.url = url;
                        return node
                    });
            })
            return $q.all(promises)
        }
    }

})(angular);
