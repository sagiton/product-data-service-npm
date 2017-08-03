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
        var CatalogResource = $resource(url + '/:locale/:type/:queryType/:id', null, {
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

        CatalogResource.prototype.isLeafCatalog = function () {
            return this.getType() == 'leaf_category';
        };

        CatalogResource.prototype.isProductFamily = function () {
            return this.getType() == 'product_details';
        };

        CatalogResource.prototype.isSubCatalog = function () {
            return this.getType() == 'sub_category';
        };

        CatalogResource.prototype.isRootCatalog = function () {
            return this.getType() == 'root_category';
        };

        CatalogResource.prototype.getType = function() {
            return this.type ? this.type.value.toLowerCase() : String();
        };

        return CatalogResource;
    }

})(angular);
