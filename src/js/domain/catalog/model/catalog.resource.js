(function (angular) {
    angular
        .module('pds.catalog.model')
        .provider('Catalog', function CatalogProvider() {
            var csUrl = null;

            this.contentServiceEndPoint = function (value) {
                csUrl = value;
                return this;
            };

            this.$get = ['$resource', '$http', '_', function ($resource, $http, _) {
                return new Catalog($resource, $http, _, csUrl);
            }];
        });

    function Catalog($resource, $http, _, csUrl) {
        var customTransformations = [redirectChildren]
        var transformations = $http.defaults.transformResponse.concat(customTransformations);

        var transformResponse = function (data, headers, status) {
            var result = data;
            _.each(transformations, function (t) {
                result = t(result, headers, status);
            });
            return result;
        };

        var CatalogResource = $resource(csUrl + 'rest/document/display', null, {
                template: {
                    method: 'POST',
                    transformResponse: transformResponse
                }
            }
        );

        function redirectChildren(data, headers, status) {
            if(data && _.isArray(data.children)) {
                data.children = _.map(data.children, function (child) {
                    return child.redirectCategory ? child.redirectCategory : child;
                });
            }
            return data;
        }

        CatalogResource.prototype.isLeafCatalog = function () {
            return this.getType() === 'leaf_category';
        };

        CatalogResource.prototype.isProductFamily = function () {
            return this.getType() === 'product_family';
        };

        CatalogResource.prototype.isSubCatalog = function () {
            return this.getType() === 'sub_category';
        };

        CatalogResource.prototype.isRootCatalog = function () {
            return this.getType() === 'root_category';
        };

        CatalogResource.prototype.getType = function() {
            return this.type ? this.type.toLowerCase() : String();
        };

        CatalogResource.fallbackType = function () {
            return 'PRODUCT_FAMILY';
        };

        CatalogResource.prototype.getParameter = function (section, parameter) {
            var params = (_.find(this.sections, {name: section}) || {}).params
            return _.get(params, parameter)
        }

        return CatalogResource;
    }

})(angular);
