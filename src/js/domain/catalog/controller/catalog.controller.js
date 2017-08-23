(function (angular) {

    angular
        .module('pds.catalog.controller')
        .controller("CatalogController", CatalogController);

    CatalogController.$inject = ['$scope', '$rootScope', 'urlParserService', '_', 'MetaService'];

    function CatalogController($scope, $rootScope, urlParserService, _, MetaService) {
        var CATEGORY_TYPE = 'sub_category';
        var ERP_LABEL_LOGO_KEY = 'ocsErpLogo';
        var vm = this;
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
            vm.catalog.energyEfficiency = vm.catalog.energyEfficiency || {};
            var technicalDataTable = vm.catalog.technicalDataTable();
            if (technicalDataTable) {
                var tableDefinition = technicalDataTable.tableDefinition;
                technicalDataTable.tableDefinition = _
                    .chain(tableDefinition)
                    .filter(function(attr) {
                        return technicalDataTable.showAttributesWithNoValues || anyProductHasValue(technicalDataTable.products, attr);
                    })
                    .filter(isNotHeaderAttribute.bind(this, technicalDataTable.products))
                    .value();
            }
        }

        function isNotHeaderAttribute(products, attr) {
            return !isHeaderAttribute(products, attr);
        }

        function isHeaderAttribute(products, attr) {
            return _.some(products, function (product) {
                return product.header.key == attr.key;
            });
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

        function anyProductHasValue(products, attribute) {
            return _.some(products, attribute.key);
        }

        function tableDefinitionContains(definition, key) {
            return _.some(definition, {key: key});
        }
    }

})(angular);
