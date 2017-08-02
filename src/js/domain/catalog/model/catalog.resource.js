(function (angular) {
    angular
        .module('pds.catalog.model')
        .provider('Catalog', function CatalogProvider() {
            var url = null;

            this.productDataServiceEndPoint = function (value) {
                url = value;
                return this;
            };

            this.$get = ['$resource', '$cacheFactory', 'locale', function ($resource, $cacheFactory, locale) {
                return new Catalog($resource, $cacheFactory, locale, url);
            }];
        });

    function Catalog($resource, $cacheFactory, locale, url) {
        var catalogCache = $cacheFactory("catalog");
        return $resource(url + '/:locale/:type/:queryType/:id', null, {
                get: {
                    method: 'GET',
                    params: {locale: locale, queryType: 'id'},
                    cache: catalogCache
                },
                query: {
                    method: 'GET',
                    isArray: true,
                    params: {locale: locale},
                    cache: catalogCache
                }
            }
        );
    }

    Catalog.prototype.isLeafCatalog = function () {
        return this.getType() == 'LEAF_CATEGORY';
    };

    Catalog.prototype.isProductFamily = function () {
        return this.getType() == 'PRODUCT_FAMILY';
    };

    Catalog.prototype.getType = function() {
        return this.type ? this.type.value : String();
    };

})(angular);
