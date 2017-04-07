(function (angular) {
    angular
        .module('pds.common.service')
        .service('SpinnerService', SpinnerService);

    SpinnerService.$inject = ['$http'];

    function SpinnerService($http) {
        var self = this;

        self.isLoading = function () {
            return $http.pendingRequests.length > 0;
        }

    }

})(angular);
