(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('sectionTechnicalDataTable', SectionTechnicalDataTable);

    function SectionTechnicalDataTable() {
        return {
            restrict: 'EA',
            controller: SectionTechnicalDataTableController,
            scope: {},
            bindToController: {
                $section: '=sectionTechnicalDataTable'
            },
            controllerAs: '$ctrl',
        }
    }

    SectionTechnicalDataTableController.$inject = ['_', '$timeout', '$element']

    function SectionTechnicalDataTableController(_, $timeout, $element) {
        var self = this

        var PRODUCT_COUNT_LAYOUT_BREAKPOINT = 4
        self.$section = self.$section || {}

        self.responsiveChange = responsiveChange
        self.doDisplaySection = doDisplaySection

        $timeout(initSection)

        function initSection() {
            self.$section.tableDefinition = _
                .chain(self.$section.tableDefinition)
                .filter(function(attr) {
                    return anyProductHasValue(self.$section.products, attr);
                })
                .filter(isNotHeaderAttribute.bind(this, self.$section.products))
                .value();

            if(!doDisplaySection()) {
                $element.remove()
                return
            }

            responsiveChange();
        }

        function doDisplaySection() {
            var section = self.$section
            return section
                && !_.isEmpty(section.tableDefinition)
                && !_.isEmpty(section.products)
        }

        function responsiveChange(e, table, columns) {
            self.$section.partitions = _.chunk(self.$section.products, _.every(columns) ? PRODUCT_COUNT_LAYOUT_BREAKPOINT : Number.POSITIVE_INFINITY);
        }

        function isNotHeaderAttribute(products, attr) {
            return !isHeaderAttribute(products, attr);
        }

        function isHeaderAttribute(products, attr) {
            return _.some(products, function (product) {
                return product.header && product.header.key == attr.key;
            });
        }

        function anyProductHasValue(products, attribute) {
            return _.some(products, attribute.key);
        }

        function tableDefinitionContains(definition, key) {
            return _.some(definition, {key: key});
        }

    }

})(angular);
