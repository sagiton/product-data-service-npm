(function (angular) {
    angular
        .module('pds.common.controller')
        .controller('headerController', HeaderController);

    HeaderController.$inject = ['$scope', '$location', 'locale', 'config', 'jsonFilter', '_', 'breadcrumbService', 'metaTag'];

    var contentGroups = ['WT.cg_n', 'WT.cg_s', 'WT.z_cg3', 'WT.z_cg4', 'WT.z_cg5', 'WT.z_cg6', 'WT.z_cg7', 'WT.z_cg8', 'WT.z_cg9', 'WT.z_cg10'];

    function HeaderController($scope, $location, locale, config, jsonFilter, _, breadcrumbService, metaTag) {
        var vm = this;
        var rootContentGroup = {name: config.metaTags.siteName};

        vm.url = $location.absUrl();
        vm.locale = locale.toString();
        vm.brand = config.metaTags.brand;
        vm.country = locale.country;
        vm.language = locale.language;

        $scope.$on('pds.header.update', function (event, params) {
            _.assign(vm, params)
        });

        $scope.$on('pds.header.update', function (event, params) {
            buildJsonLD({
                "@context": "http://schema.org/",
                "@type": "Product",
                "name" : params.title,
                "image": params.image,
                "description": params.description,
                "brand": config.metaTags.siteName
            });
        });

        //FIXME
        $scope.$on('pds.breadcrumb.update', function (event, params) {
            breadcrumbService
                .build(params.catalogId)
                .then(function (breadcrumbs) {
                    buildJsonLD({
                        "@context": "http://schema.org/",
                        "@type": "BreadcrumbList",
                        "itemListElement": _.map(breadcrumbs, function (crumb, index) {
                            return {
                                '@type': 'ListItem',
                                position: index,
                                item: {
                                    '@id': crumb.url,
                                    name: crumb.name
                                }
                            }
                        })
                    });
                    return breadcrumbs;
                })
                .then(buildContentGroups);
        });

        function buildJsonLD(model) {
            angular
                .element('<script>')
                .attr('type', 'application/ld+json')
                .text(jsonFilter(model))
                .appendTo('head');
        }

        function buildContentGroups(tree) {
            tree.unshift(rootContentGroup);
            _.forEach(tree, function (element, idx) {
                metaTag.addMeta(contentGroups[idx], element.name);
            });
        }

    }

})(angular);
