(function (angular) {
    angular
        .module('pds.catalog.service')
        .service('catalogUrlSchema', CatalogUrlSchema);

    CatalogUrlSchema.$inject = ['SeoFriendlyUrlBuilder', 'metaTag', '_'];

    function CatalogUrlSchema(SeoFriendlyUrlBuilder, metaTag, _) {
        var productPrefix = 'p';
        var categoryPrefix = 'c';

        var schemas = {
            'comercial-e-industrial': industrialSchema, //TODO Make this locale independent
            'gewerbe-industrie': industrialSchema,
            'commercial-industrial': industrialSchema
        };

        this.build = function (catalogs) {
            return getSchema(metaTag.getSiteChannel())(catalogs);
        };

        function getSchema(name) {
            return schemas[name] || residentialSchema;
        }

        function industrialSchema(catalogs) {
            var builder = new SeoFriendlyUrlBuilder({ocsBasePath: metaTag.getSiteChannel() + '/ocs'});
            _.forEachRight(catalogs, function (catalog, index) {
                var fragments = [catalog.name];
                if (index === 0) {
                    fragments.push(catalog.id, categoryPrefix);
                }
                builder.addPath(fragments);

                if (catalog.isProductFamily()) {
                    builder.setPath([catalog.name, catalog.id, productPrefix]);
                }
            });
            return builder.build();
        }

        function residentialSchema(catalogs) {
            var builder = new SeoFriendlyUrlBuilder();
            _.forEachRight(catalogs, function (catalog, index) {
                var fragments = [catalog.name];
                if (index === 0) {
                    fragments.push(catalog.id, categoryPrefix);
                }
                if (index === catalogs.length - 1) {
                    fragments.unshift(metaTag.getSiteChannel());
                }
                builder.addPath(fragments);

                if (catalog.isProductFamily()) {
                    builder.setPath([catalog.name, catalog.id, productPrefix]);
                }
            });
            return builder.build();
        }
    }


})(angular);
