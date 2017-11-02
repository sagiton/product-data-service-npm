(function (angular) {
    angular
        .module('pds.common.config')
        .factory('metaTag', MetaTag);

    MetaTag.$inject = ['jsonFilter'];

    function MetaTag(jsonFilter) {

        return {
            getSiteChannel: getSiteChannel,
            getOcsChannel: getOcsChannel,
            getOcsLocale: getOcsLocale,
            addMeta: addMeta,
            addJsonLD: addJsonLD
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

        function addJsonLD(model) {
            angular
                .element('<script>')
                .attr('type', 'application/ld+json')
                .text(jsonFilter(model))
                .appendTo('head');
        }

    }
})(angular);
