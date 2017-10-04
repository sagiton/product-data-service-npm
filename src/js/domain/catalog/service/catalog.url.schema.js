(function (angular) {
    angular
        .module('pds.catalog.service')
        .service('CatalogUrlSchema', CatalogUrlSchema);

    CatalogUrlSchema.$inject = ['SeoFriendlyUrlBuilder', '_'];

    function CatalogUrlSchema(SeoFriendlyUrlBuilder, _) {
        var productPrefix = 'p';
        var categoryPrefix = 'c';
        var productDetailsType = 'product_details';
        var schemas = {
            'comercial-e-industrial': industrialSchema //TODO Make this locale independent
        };

        function getSiteChannel() {
            return angular.element('meta[name="channel"]').attr('content') || '';
        }

        this.build = function (tree) {
            if (!_.size(tree)) {
                return String();
            }
            return getSchema(getSiteChannel())(tree);
        };

        function getSchema(name) {
            return schemas[name] || residentialSchema;
        }

        function industrialSchema(tree) {
            var builder = new SeoFriendlyUrlBuilder({ocsBasePath: getSiteChannel() + '/ocs'});
            _.forEachRight(tree, function (node, index) {
                var fragments = [node.name];
                if (index == 0) {
                    fragments.push(node.id, categoryPrefix);
                }
                builder.addPath(fragments);

                if (node.type == productDetailsType) {
                    builder.setPath([node.name, node.id, productPrefix]);
                }
            });
            return builder.build();
        }

        function residentialSchema(tree) {
            var builder = new SeoFriendlyUrlBuilder();
            _.forEachRight(tree, function (node, index) {
                var fragments = [node.name];
                if (index == 0) {
                    fragments.push(node.id, categoryPrefix);
                }
                if (index == tree.length - 1) {
                    fragments.unshift(getSiteChannel());
                }
                builder.addPath(fragments);

                if (node.type == productDetailsType) {
                    builder.setPath([node.name, node.id, productPrefix]);
                }
            });
            return builder.build();
        }
    }


})(angular);
