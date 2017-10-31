(function(angular) {
    angular
        .module("pds.catalog.service")
        .service("breadcrumbService", BreadcrumbService);

    BreadcrumbService.$inject = ['CatalogService', '_', '$q'];

    function BreadcrumbService(CatalogService, _, $q) {
        var templatePromise

        return {
            getData: getData,
            build: build
        };

        function getData(categoryId) {
            return templatePromise = templatePromise || CatalogService.getTemplate(categoryId, 'BREADCRUMBS')
        }

        function build(categoryId) {
            return getData(categoryId)
                .then(decorateWithUrls)
                .then(mapData);
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

        function mapData(tree) {
            return _.map(tree, function (node) {
                return _.pick(node, 'id', 'name', 'url', 'type')
            })
        }
    }

})(angular);
