(function(angular) {
    angular
        .module("pds.navigation.controller")
        .controller("MenuController", MenuController);

    MenuController.$inject = ['MenuService', '_', 'config'];

    function MenuController(menuService, _, config) {
        var vm = this;
        vm.itemLimit = config.navigationMaxElements;
        vm.menu = vm.menu || {
            name: angular.element('#ocs-nav').children('a').text()
        };

        menuService
            .getMenu()
            .then(function(menu) {
                vm.menu = menu;
                //TODO Product finder removed for go-live
                vm.menu.children = _.reject(vm.menu.children, {type: 'toolfinder'});
            });
    }
})(angular);
