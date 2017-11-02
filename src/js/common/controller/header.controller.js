(function (angular) {
    angular
        .module('pds.common.controller')
        .controller('headerController', HeaderController);

    HeaderController.$inject = ['$scope', '$location', 'locale', 'config', '_', 'breadcrumbService', 'metaTag'];

    var contentGroups = ['WT.cg_n', 'WT.cg_s', 'WT.z_cg3', 'WT.z_cg4', 'WT.z_cg5', 'WT.z_cg6', 'WT.z_cg7', 'WT.z_cg8', 'WT.z_cg9', 'WT.z_cg10'];

    function HeaderController($scope, $location, locale, config, _, breadcrumbService, metaTag) {
        var vm = this;
        var rootContentGroup = {name: config.metaTags.siteName};

        vm.url = $location.absUrl();
        vm.locale = locale.toString();
        vm.brand = config.metaTags.brand;
        vm.country = locale.country;
        vm.language = locale.language;

        $scope.$on('pds.header.update', headerUpdate);
        $scope.$on('pds.breadcrumb.update', breadcrumbUpdate);

        function headerUpdate(e, params) {
            _.assign(vm, params)

            metaTag.addJsonLD({
                "@context": "http://schema.org/",
                "@type": "Product",
                "name" : params.title,
                "image": params.image,
                "description": params.description,
                "brand": params.siteName
            });
        }

        function breadcrumbUpdate(e, params) {
            breadcrumbService
                .build(params.catalogId)
                .then(function(breadcrumbs) {
                    addBreadcrumbsJsonLds(breadcrumbs)
                    buildContentGroups(breadcrumbs)
                })
        }

        function addBreadcrumbsJsonLds(breadcrumbs) {
            var itemListElement = _.map(breadcrumbs, function (crumb, index) {
                return {
                    '@type': 'ListItem',
                    position: index,
                    item: {
                        '@id': crumb.url,
                        name: crumb.name
                    }
                }
            })
            metaTag.addJsonLD({
                "@context": "http://schema.org/",
                "@type": "BreadcrumbList",
                "itemListElement": itemListElement
            });
        }

        function buildContentGroups(tree) {
            tree.unshift(rootContentGroup);
            _.forEach(tree, function (element, idx) {
                metaTag.addMeta(contentGroups[idx], element.name);
            });
        }

    }

})(angular);
