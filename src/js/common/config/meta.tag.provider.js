(function (angular) {
    angular
        .module('pds.common.config')
        .factory('metaTag', MetaTag);

    MetaTag.$inject = [];

    function MetaTag() {

        return {
            getSiteChannel: getSiteChannel,
            getOcsChannel: getOcsChannel,
            getOcsLocale: getOcsLocale,
            addMeta: addMeta
        };

        function getSiteChannel() {
            return getMetaTagContentByName('channel')
        }

        function getOcsChannel() {
            return getMetaTagContentByName('ocs-channel')
        }

        function getOcsLocale() {
            return getMetaTagContentByName('ocs-locale')
        }

        function getMetaTagContentByName(name) {
            var metaName = 'meta[name="' + name + '"]'
            return angular
                .element(metaName)
                .attr('content') || ''
        }

        function addMeta(name, content) {
            angular
                .element('meta[name="' + name + '"')
                .remove();

            angular
                .element('<meta>')
                .attr('name', name)
                .attr('content', content)
                .appendTo('head');
        }

    }
})(angular);
