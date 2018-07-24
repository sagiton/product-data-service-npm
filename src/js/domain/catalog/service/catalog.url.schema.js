(function (angular) {
    angular
        .module('pds.catalog.service')
        .service('catalogUrlSchema', CatalogUrlSchema);

    CatalogUrlSchema.$inject = ['SeoFriendlyUrlBuilder', 'metaTag', '_'];

    function CatalogUrlSchema(SeoFriendlyUrlBuilder, metaTag, _) {
        var productPrefix = 'p';
        var categoryPrefix = 'c';

        var schemas = {
            'commercial-industrial': industrialSchema,
            'residential': residentialSchema
        };

        this.build = function (catalogs, type) {
            return getSchema(type)(catalogs);
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
