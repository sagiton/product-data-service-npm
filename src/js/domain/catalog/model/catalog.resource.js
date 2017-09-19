(function (angular) {
    angular
        .module('pds.catalog.model')
        .provider('Catalog', function CatalogProvider() {
            var pdsUrl = null;
            var csUrl = null;

            this.productDataServiceEndPoint = function (value) {
                pdsUrl = value;
                return this;
            };

            this.contentServiceEndPoint = function (value) {
                csUrl = value;
                return this;
            };

            this.$get = ['$resource', '$cacheFactory', 'locale', '$http', '_', 'CatalogHelper', function ($resource, $cacheFactory, locale, $http, _, CatalogHelper) {
                return new Catalog($resource, $cacheFactory, locale, pdsUrl, csUrl, $http, _, CatalogHelper);
            }];
        });

    function Catalog($resource, $cacheFactory, locale, pdsUrl, csUrl, $http, _, catalogHelper) {
        var catalogCache = $cacheFactory("catalog");
        var customTransformations = [redirectChildren];
        var transformations = $http.defaults.transformResponse.concat(customTransformations);
        var transformResponse = function (data, headers, status) {
            var result = data;
            _.each(transformations, function (t) {
                result = t(result, headers, status);
            });
            return result;
        };
        var CatalogResource = $resource(pdsUrl + ':locale/:type/:queryType/:id', null, {
                get: {
                    method: 'GET',
                    params: {locale: locale, queryType: 'id'},
                    cache: catalogCache,
                    transformResponse: function (data, headers, status) {
                        return toCatalogView(transformResponse(data, headers, status))
                    }
                },
                query: {
                    method: 'GET',
                    isArray: true,
                    params: {locale: locale},
                    cache: catalogCache
                },
                template: {
                    method: 'POST',
                    url: csUrl + 'rest/document/display',
                    transformResponse: function (data, headers, status) {
                        return toCatalogTemplateView(transformResponse(data, headers, status));
                    }
                }
            }
        );

        function redirectChildren(data, headers, status) {
            data.children = _.map(data.children, function (child) {
                return child.redirectCategory ? child.redirectCategory : child;
            });
            return data;
        }

        function toCatalogView(catalog) {
            return catalogHelper.toView(catalog);
        }

        function toCatalogTemplateView(catalog) {
            return catalogHelper.toTemplateView(catalog);
        }

        CatalogResource.prototype.isLeafCatalog = function () {
            return this.getType() == 'leaf_category';
        };

        CatalogResource.prototype.isProductFamily = function () {
            return this.getType() == 'product_family';
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

        CatalogResource.prototype.technicalDataTable = function () {
            var section = _.find(this.sections, {name: 'TECHNICAL_DATA_TABLE'})
                       || _.find(this.sections, {name: 'TECHNICAL_DATA_TABLE_SLIDER'});
            return section && section.params;
        };

        CatalogResource.fallbackType = function () {
            return 'PRODUCT_FAMILY';
        };

        return CatalogResource;
    }

})(angular);
