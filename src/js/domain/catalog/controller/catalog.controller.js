(function (angular) {

    angular
        .module('pds.catalog.controller')
        .controller("CatalogController", CatalogController);

    CatalogController.$inject = ['$scope', '$rootScope', 'urlParserService', '_', 'MetaService'];

    function CatalogController($scope, $rootScope, urlParserService, _, MetaService) {
        var CATEGORY_TYPE = 'sub_category';
        var ERP_LABEL_LOGO_KEY = 'ocsErpLogo';
        var vm = this;
        vm.headerAttributes = ['marketGenericDescription', 'P11_KT1', 'name'];
        vm.catalogId = urlParserService.getCatalogId();
        vm.isCategory = isCategory;
        vm.anyProductHasAttribute = anyProductHasAttribute;
        vm.anyProductHasValue = anyProductHasValue;
        vm.tableDefinitionContains = tableDefinitionContains;

        MetaService.updateMetaByCategory(vm.catalogId);
        $rootScope.$broadcast('pds.breadcrumb.update', {catalogId: vm.catalogId});

        $scope.$on('pds.catalog.loaded', function (event, params) {
            return initCatalog(params.catalog);
        });

        $scope.$on('pds.catalog.loaded', function () {
            angular
                .element('#nav-primary-collapse')
                .find('li')
                .removeClass('active');
            angular
                .element('#ocs-nav')
                .addClass('active');
        });

        function initCatalog(catalog) {
            vm.catalog = catalog;
            vm.catalog.subheadlines = getDescriptions(vm.catalog);
            vm.catalog.energyEfficiency.image = findMainErpLabel(vm.catalog);
            if (vm.catalog.productTableDefinition) {
                var tableDefinition = vm.catalog.productTableDefinition.value.elements;
                vm.catalog.table = {};
                vm.catalog.table.attributes = _
                    .chain(tableDefinition)
                    .filter(anyProductHasAttribute)
                    .filter(isNotHeaderAttribute)
                    .value();
                vm.catalog.table.products = buildDetailsTable(tableDefinition, vm.catalog.children);
            }
        }

        function isNotHeaderAttribute(attr) {
            return !isHeaderAttribute(attr);
        }

        function findMainErpLabel(product) {
            return product.children.length && _.head(product.children)[ERP_LABEL_LOGO_KEY];
        }

        function getDescriptions(resource) {
            var i = 1;
            var subheadline = resource.detailsSubheadline1;
            var description = resource.detailsDescription1;
            var subheadlines = [];
            while(subheadline != null || description != null) {
                subheadlines.push({title: subheadline && subheadline.value, description: description});
                i++;
                description = resource['detailsDescription' + i];
                subheadline = resource['detailsSubheadline' + i];
            }
            return subheadlines;
        }

        function buildDetailsTable(tableDefinition, products) {
            return _.map(products, function (product) {
                product.attributes = buildProductAttributes(tableDefinition, product);
                product.header = _
                    .chain(product)
                    .at(vm.headerAttributes)
                    .compact()
                    .head()
                    .value()
                    .value;
                product.name = product.productname;
                return product;
            });
        }

        function buildProductAttributes(tableDefinition, product) {
            return _
                .chain(tableDefinition)
                .reject(isHeaderAttribute)
                .filter(anyProductHasValue)
                .map(function (attribute) {
                    var productAttribute = product[attribute.value] || {};
                    return {
                        name: attribute.name,
                        unit: attribute.unit,
                        id: attribute.value,
                        value: productAttribute.value,
                        type: productAttribute.type
                    }
                })
                .value();
        }

        function isHeaderAttribute(attr) {
            return _.includes(vm.headerAttributes, attr.value);
        }

        function isCategory() {
            return vm.catalog && vm.catalog.type.value == CATEGORY_TYPE;
        }

        function anyProductHasAttribute(item, index) {
            return _.some(vm.catalog.children, function (product) {
                var element = vm.catalog.productTableDefinition.value.elements[index];
                return product[(element  || {}).value];
            })
        }

        function anyProductHasValue(attribute) {
            return _.some(vm.catalog.children, attribute.value);
        }

        function tableDefinitionContains(definition, key) {
            return _.some(definition, {key: key});
        }
    }

})(angular);
