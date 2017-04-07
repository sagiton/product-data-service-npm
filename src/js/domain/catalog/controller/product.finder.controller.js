(function (angular) {
    angular
        .module('pds.catalog.controller')
        .controller('ProductFinderController', ProductFinderController);

    ProductFinderController.$inject = ['$scope', 'MenuService', 'CatalogService', '_'];

    function ProductFinderController($scope, menuService, catalogService, _) {
        var PRODUCT_FINDER_CATEGORY_ID = 'Produktfinder';
        var vm = this;
        vm.selection = [];
        vm.levels = [];
        vm.remove = remove;
        vm.select = select;
        vm.isCompleted = isCompleted;
        vm.reset = reset;
        vm.getProductFamily = catalogService.getProductFamily;

        menuService
            .getMenu()
            .then(function (menu) {
                vm.hierarchy = _.find(menu.children, {name: PRODUCT_FINDER_CATEGORY_ID});
                vm.levels = _.range(1, getDepth(vm.hierarchy.children));
                reset();
            });

        function getDepth(children, depth) {
            depth = depth || 1;
            return children && children.length ? getDepth(children[0].children, ++depth) : depth + 1;
        }

        function select(id, isRoot) {
            return catalogService
                .getById(id)
                .then(function (category) {
                    vm.selected = category;
                    !isRoot ? vm.selection.push(category) : null;
                })
        }

        function remove(item) {
            vm.selection = _.dropRight(vm.selection, vm.selection.length - vm.selection.indexOf(item));
            vm.selected = _.last(vm.selection);
            if (!vm.selected) {
                reset();
            }
        }

        function isCompleted() {
            return vm.selection.length >= vm.levels.length - 1;
        }

        function reset() {
            vm.selection.length = 0;
            select(vm.hierarchy.id, true);
        }
    }

})(angular);
