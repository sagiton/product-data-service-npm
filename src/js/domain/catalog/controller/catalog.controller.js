(function (angular) {

    angular
        .module('pds.catalog.controller')
        .controller("CatalogController", CatalogController);

    CatalogController.$inject = ['$scope', '$rootScope', 'urlParserService', '_', 'MetaService', 'CatalogService'];

    function CatalogController($scope, $rootScope, urlParserService, _, MetaService, CatalogService) {
        var vm = this;

        vm.catalogId = urlParserService.getCatalogId();

        vm.isArray = _.isArray;

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

            if (_.get(vm.catalog, 'redirectCategory.id')) {
                return CatalogService.redirectTo(vm.catalog.redirectCategory.id);
            }

            vm.catalog.energyEfficiency = vm.catalog.energyEfficiency || {};
            return catalog
        }
    }

})(angular);
