(function (angular) {
    angular
        .module('pds.common.controller')
        .controller('headerController', HeaderController);

    HeaderController.$inject = ['$scope', '$location', 'locale', 'config', 'jsonFilter', '_', 'BreadcrumbService'];

    function HeaderController($scope, $location, locale, config, jsonFilter, _, BreadcrumbService) {
        var vm = this;
        vm.url = $location.absUrl();
        vm.locale = locale.toString();
        vm.brand = config.brand;
        vm.country = locale.country;
        vm.language = locale.language;

        $scope.$on('pds.header.update', function (event, params) {
            vm.title = params.title;
            vm.description = params.description;
            vm.image = params.image;
            vm.webTrends = params.webTrends;
            vm.siteName = params.siteName;
            vm.canonicalUrl = params.canonicalUrl;
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

        $scope.$on('pds.breadcrumb.update', function (event, params) {
            BreadcrumbService
                .build(params.categoryId)
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
                });
        });

        function buildJsonLD(model) {
            angular
                .element('<script>')
                .attr('type', 'application/ld+json')
                .text(jsonFilter(model))
                .appendTo('head');
        }
    }

})(angular);
