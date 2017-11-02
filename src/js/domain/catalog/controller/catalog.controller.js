(function (angular) {

    angular
        .module('pds.catalog.controller')
        .controller("CatalogController", CatalogController);

    CatalogController.$inject = ['$scope', '$rootScope', 'urlParserService', '_', 'metaService', 'CatalogService'];

    function CatalogController($scope, $rootScope, urlParserService, _, metaService, CatalogService) {
        var vm = this;

        vm.catalogId = urlParserService.getCatalogId();

        vm.isArray = _.isArray;
        vm.hasAnyOfValues = hasAnyOfValues

        metaService.updateMetaByCategory(vm.catalogId);
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

            var redirectDestination = _.get(vm.catalog, 'redirectCategory.id')
            if (redirectDestination) {
                return CatalogService.redirectTo(redirectDestination);
            }

            vm.catalog.energyEfficiency = vm.catalog.energyEfficiency || {};
            return catalog
        }

        function hasAnyOfValues(data, properties) {
            return !!_(properties)
                .filter(function(property) {
                    return !_.isEmpty(_.get(data, property))
                })
                .value().length
        }
    }

})(angular);
