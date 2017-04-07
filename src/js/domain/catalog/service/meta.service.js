(function (angular) {
    angular
        .module('pds.catalog.service')
        .service('MetaService', MetaService);

    MetaService.$inject = ['$rootScope', '$q', '$location', 'CatalogService', 'imageUrlFilter', 'config'];

    var TITLE_DELIMITER = ' | ';
    var LOCALE_DELIMITER = '-';
    var LOCALE_PROPER_DELIMITER = '_';

    function MetaService($rootScope, $q, $location, CatalogService, imageUrlFilter, config) {

        return {
            updateMetaByCategory: updateMetaByCategory
        };

        function updateMetaByCategory(categoryId) {
            CatalogService
                .getById(categoryId)
                .then(function (currentCatalog) {
                    return CatalogService
                        .travelUpNavigationHierarchy(categoryId)
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
                    angular
                        .element('link[hreflang]')
                        .each(function (index, link) {
                            var linkObject = angular.element(link);
                            var locale = linkObject.attr('hreflang');
                            locale = locale.replace(LOCALE_DELIMITER, LOCALE_PROPER_DELIMITER);
                            CatalogService
                                .resolveUriFromHierarchy(categoryId, locale)
                                .then(function (url) {
                                    linkObject.attr('href', url);
                                });
                        });
                });
        }
    }
})(angular);
