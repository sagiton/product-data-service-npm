(function (angular) {
    angular
        .module('pds.common.service')
        .service('SpinnerService', SpinnerService);

    SpinnerService.$inject = ['$http'];

    function SpinnerService($http) {
        var self = this;

        self.isLoading = isLoading
        self.startLoading = startLoading
        self.stopLoading = stopLoading

        function isLoading() {
            return $http.pendingRequests.length > 0 || self.loading;
        }

        function startLoading() {
            self.loading = true
        }

        function stopLoading() {
            self.loading = false
        }

    }

})(angular);
