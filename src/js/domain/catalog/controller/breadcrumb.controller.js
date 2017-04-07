(function (angular) {
    angular
        .module('pds.catalog.controller')
        .controller('BreadcrumbController', BreadcrumbController);

    BreadcrumbController.$inject = ['$scope', 'BreadcrumbService'];

    function BreadcrumbController($scope, BreadcrumbService) {
        var vm = this;

        $scope.$on('pds.breadcrumb.update', function (event, params) {
            BreadcrumbService
                .build(params.categoryId)
                .then(function (res) {
                    vm.breadcrumbs = res;
                    if (_.last(vm.breadcrumbs).type == 'product_details') {
                        angular.element('#nav-breadcrumbs').addClass('dark-breadcrumb');
                    }
                });
        });
    }

})(angular);
