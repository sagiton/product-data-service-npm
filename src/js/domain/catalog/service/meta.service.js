(function (angular) {
    angular
        .module('pds.catalog.service')
        .service('metaService', MetaService);

    MetaService.$inject = ['$rootScope', '$q', '$location', '$window', 'CatalogService', 'imageUrlFilter', 'config', 'urlParserService'];

    var TITLE_DELIMITER = ' | ';
    var LOCALE_DELIMITER = '-';
    var LOCALE_PROPER_DELIMITER = '_';
    var PATH_SEPARATOR = '/';

    function MetaService($rootScope, $q, $location, $window, CatalogService, imageUrlFilter, config, urlParserService) {

        return {
            updateMetaByCategory: updateMetaByCategory,
            redirectOnInvalidUrl: redirectOnInvalidUrl
        };

        function updateMetaByCategory(catalogId) {
            var excludeHreflangs = false;
            CatalogService
                .getCatalogTemplate(catalogId)
                .then(function (currentCatalog) {
                    return CatalogService
                        .travelUpNavigationHierarchy(catalogId)
                        .then(function (tree) {
                            tree[0] = currentCatalog;
                            return tree;
                        });
                })
                .then(function (tree) {
                    var q = $q.defer();
                    var currentNode = tree[0];
                    tree[0].name = tree[0].name.value;
                    var headerTitle = [];

                    for (var i = 0; i < tree.length; i++) {
                        if (tree[i] && tree[i].name) {
                            headerTitle.push(tree[i].name);
                        }
                    }
                    headerTitle.push(config.metaTags.siteName);

                    var image = (currentNode.keyVisual || currentNode.productimage || {}).value;
                    var event = {
                        title: headerTitle.join(TITLE_DELIMITER),
                        description: (currentNode.seoMetaText || currentNode.descriptionLong || currentNode.descriptionShort || {}).value,
                        image: image ? imageUrlFilter(image) : undefined,
                        siteName: config.metaTags.siteName,
                        webTrends: {
                            cg_s: tree[0] ? tree[0].name : null,
                            z_cg3: tree[1] ? tree[1].name : null,
                            z_cg4: tree[2] ? tree[2].name : null
                        },
                        canonicalUrl: $location.absUrl()
                    };

                    if (!(currentNode.blockCanonicalTag || {}).value) {
                        var canonicalRef = (currentNode.canonicalRef || {}).value;
                        if(canonicalRef) {
                            excludeHreflangs = canonicalRef != catalogId;
                            CatalogService
                                .resolveUriFromHierarchy(canonicalRef)
                                .then(function (url) {
                                    event.canonicalUrl = url;
                                    q.resolve(event);
                                });
                        } else {
                            q.resolve(event);
                        }
                    }

                    return q.promise;
                })
                .then(function (params) {
                    $rootScope.$broadcast('pds.header.update', params);
                })
                .then(function () {
                    if (excludeHreflangs) {
                        angular.element('link[hreflang]').remove();
                        return false;
                    }
                    angular
                        .element('link[hreflang]')
                        .each(function (index, link) {
                            var linkObject = angular.element(link);
                            var locale = linkObject.attr('hreflang');
                            locale = locale.split(LOCALE_DELIMITER);
                            CatalogService
                                .resolveUriFromHierarchy(catalogId, locale[0] + LOCALE_PROPER_DELIMITER + locale[1])
                                .then(function (url) {
                                    linkObject.attr('href', url.replace(/\/[a-z]{2}\/[a-z]{2}\//, PATH_SEPARATOR + locale[1].toLowerCase() + PATH_SEPARATOR + locale[0].toLowerCase()  + PATH_SEPARATOR));
                                    return !!url;
                                })
                                .then(function (result) {
                                    return result || linkObject.remove();
                                });
                        });
                });
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
    }
})(angular);
