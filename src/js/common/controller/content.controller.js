(function (angular) {
    angular
        .module('pds.common.controller')
        .controller('ContentController', ContentController);

    ContentController.$inject = ['SpinnerService'];

    function ContentController(spinnerService) {
        var vm = this;

        vm.isSpinning = spinnerService.isLoading;
    }

})(angular);
