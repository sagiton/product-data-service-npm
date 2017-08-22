(function (angular) {
    angular
        .module('pds.common.config')
        .factory('ocsChannel', OcsChannel);

    function OcsChannel() {
        return angular.element('meta[name="ocs-channel"]').attr('content');
    }
})(angular);
