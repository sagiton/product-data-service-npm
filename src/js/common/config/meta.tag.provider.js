(function (angular) {
    angular
        .module('pds.common.config')
        .factory('metaTag', MetaTag);

    MetaTag.$inject = [];

    function MetaTag() {

        return {
            getSiteChannel: getSiteChannel
        };

        function getSiteChannel() {
            return getMetaTagContentByName('meta[name="ocs-channel"]')
        }

        function getMetaTagContentByName(name) {
            return angular.element(name).attr('content') || ''
        }

    }
})(angular);
