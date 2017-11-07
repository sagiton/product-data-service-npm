(function (angular) {
    angular
        .module('pds.catalog.service')
        .service('metaService', MetaService);

    MetaService.$inject = ['$rootScope', '_', '$q', '$location', '$window', 'CatalogService', 'imageUrlFilter', 'config', 'urlParserService', 'breadcrumbService'];

    var TITLE_DELIMITER = ' | ';

    function MetaService($rootScope, _, $q, $location, $window, CatalogService, imageUrlFilter, config, urlParserService, breadcrumbService) {

        return {
            updateMetaByCategory: updateMetaByCategory,
            redirectOnInvalidUrl: redirectOnInvalidUrl
        };

        function updateMetaByCategory(catalogId) {
            return $q.all([
                    breadcrumbService.getData(catalogId),
                    CatalogService.getCatalogTemplate(catalogId)
                ])
                .then(broadcastMetaData)
        }

        function redirectOnInvalidUrl() {
            return CatalogService
                .resolveUriFromHierarchy(urlParserService.getCatalogId())
                .then(function (url) {
                    if (encodeURI(url) != URI().toString()) {
                        $window.location.href = url;
                    }
                })
        }

        function broadcastMetaData(data) {
            var tree = (_.get(data, '[0].nodes') || []).reverse()
            var currentNode = _.get(data, '[1]')
            var headerTitle = _.map(tree, 'name')
            headerTitle.push($window.cmsTranslations.PAGE_TITLE)

            var image = currentNode.getParameter('PRODUCT_HEADER', 'productImgUrl')
                    || currentNode.getParameter('KEYVISUAL', 'backgroundImgUrl')

            var description = currentNode.getParameter('SEO_TEXT', 'seoText')
                    || currentNode.getParameter('CATEGORY_DESCRIPTION', 'text')
                    || currentNode.getParameter('PRODUCT_HEADER', 'subtitle')

            var params = {
                title: headerTitle.join(TITLE_DELIMITER),
                description: description,
                image: image ? imageUrlFilter(image) : undefined,
                siteName: config.metaTags.siteName,
                webTrends: {
                    cg_s: _.get(tree, '[0].name'),
                    z_cg3: _.get(tree, '[1].name'),
                    z_cg4: _.get(tree, '[2].name')
                },
                canonicalUrl: $location.absUrl()
            }
            $rootScope.$broadcast('pds.header.update', params)
            return params
        }
    }
})(angular);
