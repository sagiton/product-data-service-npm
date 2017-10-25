(function (angular) {
    angular
        .module('pds.common.config')
        .factory('metaTag', MetaTag);

    MetaTag.$inject = [];

    function MetaTag() {

        return {
            getSiteChannel: getSiteChannel,
            getOcsChannel: getOcsChannel
        };

        function getSiteChannel() {
            return getMetaTagContentByName('channel')
        }

        function getOcsChannel() {
            return getMetaTagContentByName('ocs-channel')
        }

        function getMetaTagContentByName(name) {
            var metaName = 'meta[name="' + name + '"]'
            return angular.element(metaName).attr('content') || ''
        }

    }
})(angular);
