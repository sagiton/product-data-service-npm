(function (angular) {
    var DESCRIPTION_RETRIEVING_STRATEGIES = [
        {
            supports: function(resource) {
                return resource.type == "string"
            },
            retrieve: function(resource) {
                return [resource.value];
            }
        },
        {
            supports: function(resource) {
                return resource.type == "list" && resource.value.type == "string";
            },
            retrieve: function(resource) {
                return resource.value.elements;
            }
        }
    ];

    angular
        .module('pds.catalog.controller')
        .controller("CatalogController", CatalogController);

    CatalogController.$inject = ['$rootScope', 'urlParserService', 'CatalogService', 'MetaService', '_'];

    function CatalogController($rootScope, urlParserService, CatalogService, MetaService, _) {
        var PRODUCT_COUNT_LAYOUT_BREAKPOINT = 4;
        var vm = this;
        var categoryRegex = /.*_category$/;
        var ERP_LABEL_LOGO_KEY = 'ocsErpLogo';
        var categoryId = urlParserService.getCatalogId();
        vm.headerAttributes = ['marketGenericDescription', 'P11_KT1', 'name'];
        vm.isCategory = isCategory;
        vm.takeFirstHeaderAttributeWithValue = takeFirstHeaderAttributeWithValue;
        vm.isHeaderAttribute = isHeaderAttribute;
        vm.isNotHeaderAttribute = isNotHeaderAttribute;
        vm.isScrollableTechnicalTable = isScrollableTechnicalTable;
        vm.isSimpleTechnicalTable = isSimpleTechnicalTable;
        vm.anyProductHasAttribute = anyProductHasAttribute;
        vm.anyProductHasValue = anyProductHasValue;

        CatalogService.setOcsActiveNavigation();
        MetaService.updateMetaByCategory(categoryId);

        $rootScope.$broadcast('pds.breadcrumb.update', {categoryId: categoryId});

        CatalogService
            .getById(categoryId)
            .then(function (data) {
                vm.category = data;
                vm.category.subheadlines = getDescriptions(vm.category);
                vm.category.mainErpLabel = findMainErpLabel(vm.category);
                if (vm.category.productTableDefinition) {
                    vm.detailsTable = buildDetailsTable(vm.category.productTableDefinition.value.elements, vm.category.children);
                }
            });

        function findMainErpLabel(product) {
            return _.head(product.children)[ERP_LABEL_LOGO_KEY];
        }

        function getDescriptions(resource) {
            var i = 1;
            var subheadline = resource.detailsSubheadline1;
            var description = resource.detailsDescription1;
            var subheadlines = [];
            while(subheadline != null || description != null) {
                subheadlines.push({title: subheadline && subheadline.value, description: retrieveDescription(description)});
                i++;
                description = resource['detailsDescription' + i];
                subheadline = resource['detailsSubheadline' + i];
            }
            return subheadlines;
        }

        function retrieveDescription(descriptionResource) {
            for(var i = 0; i < DESCRIPTION_RETRIEVING_STRATEGIES.length; i++) {
                var descriptionRetrievingStrategy = DESCRIPTION_RETRIEVING_STRATEGIES[i];
                if(descriptionRetrievingStrategy.supports(descriptionResource)) {
                    return descriptionRetrievingStrategy.retrieve(descriptionResource);
                }
            }
            return [];
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

        function takeFirstHeaderAttributeWithValue(product) {
            var attr = _.find(vm.headerAttributes, function (attr) {
                return !!product[attr];
            });
            return product[attr];
        }


        function isNotHeaderAttribute(attr) {
            return !isHeaderAttribute(attr);
        }

        function isHeaderAttribute(attr) {
            return _.includes(vm.headerAttributes, attr.value);
        }

        function isCategory() {
            return vm.category && categoryRegex.test(vm.category.type.value);
        }

        function isSimpleTechnicalTable() {
            return _.isArray(vm.detailsTable) && _.size(vm.category.children) < PRODUCT_COUNT_LAYOUT_BREAKPOINT;
        }

        function isScrollableTechnicalTable() {
            return _.size(vm.category.children) >= PRODUCT_COUNT_LAYOUT_BREAKPOINT;
        }

        function anyProductHasAttribute(item, index) {
            return _.some(vm.category.children, function (product) {
                var element = vm.category.productTableDefinition.value.elements[index];
                return product[(element  || {}).value];
            })
        }

        function anyProductHasValue(value) {
            return _.some(vm.category.children, function (product) {
                return !!product[value.id];
            });
        }
    }

})(angular);
