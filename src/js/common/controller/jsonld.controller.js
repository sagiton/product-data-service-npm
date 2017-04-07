(function (angular) {
    angular
        .module('pds.common.controller')
        .controller('jsonLdController', JsonLdController);

    JsonLdController.$inject = ['$scope', '$location', 'BreadcrumbService', 'CatalogService', 'jsonFilter'];

    function JsonLdController($scope, $location, BreadcrumbService, CatalogService, jsonFilter) {
        var vm = this;
        vm.url = $location.absUrl();


    }

})(angular);
