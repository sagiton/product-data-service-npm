(function (angular) {
    angular
        .module('pds.common.config')
        .run(['$window', '$rootScope', 'simplifyCharactersFilter', function ($window, $rootScope, simplifyCharactersFilter) {
            if ($window.dcsMultiTrack) {
                var track = $window.dcsMultiTrack;
                $rootScope.$on('pds.tracking.more.details', function (event, params) {
                    track('WT.z_UserAction', 'moreDetails_' + simplifyCharactersFilter(params.value));
                });
            }
        }]);
})(angular);
