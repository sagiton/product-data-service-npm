(function (angular) {

    angular
        .module('pds.catalog.controller')
        .controller("CatalogController", CatalogController);

    CatalogController.$inject = ['$rootScope', 'urlParserService', 'CatalogService', 'MetaService', '_'];

    function CatalogController($rootScope, urlParserService, CatalogService, MetaService, _) {
        var CATEGORY_TYPE = 'sub_category';
        var vm = this;
        var catalogId = urlParserService.getCatalogId();
        vm.isCategory = isCategory;
        vm.anyProductHasAttribute = anyProductHasAttribute;
        vm.anyProductHasValue = anyProductHasValue;

        CatalogService.setOcsActiveNavigation();
        MetaService.updateMetaByCategory(catalogId);

        $rootScope.$broadcast('pds.breadcrumb.update', {catalogId: catalogId});

        CatalogService
            .getById(catalogId)
            .then(function (data) {
                vm.catalog = data;
                vm.catalog.subheadlines = getDescriptions(vm.catalog);
                if (vm.catalog.productTableDefinition) {
                    vm.detailsTable = buildDetailsTable(vm.catalog.productTableDefinition.value.elements, vm.catalog.children);
                }
            });

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

        function buildDetailsTable(tableDefinition, children) {
            return _
                .chain(children)
                .map(function (elem) {
                    return {
                        rows: buildDetailsTableColumn(tableDefinition, elem),
                        children: elem
                    };
                })
                .value()
        }

        function buildDetailsTableColumn(tableDefinition, children) {
            return _
                .chain(tableDefinition)
                .reject(isHeaderAttribute)
                .map(function (elem) {
                    var valueDetails = children[elem.value];
                    return {
                        name: elem.name,
                        unit: elem.unit,
                        id: elem.value,
                        value: valueDetails ? valueDetails.value : undefined,
                        type: valueDetails ? valueDetails.type : undefined
                    }
                })
                .value();
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

        function anyProductHasValue(value) {
            return _.some(vm.catalog.children, function (product) {
                return !!product[value.id];
            });
        }
    }

})(angular);
