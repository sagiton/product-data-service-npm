(function (angular) {
    angular
        .module('pds.catalog.directive')
        .component('ocsNewProducts', {
            template:  ['$templateCache', function($templateCache) {
                return $templateCache.get('component/new_products.html')
            }],
            controller: NewProductsController
        });

    NewProductsController.$inject = ['CatalogService']

    function NewProductsController(CatalogService) {
        var self = this;

        self.slickSettings = {
            "arrows": false,
            "dots": true,
            "infinite": false,
            "speed": 1000,
            "cssEase": "ease-in-out",
            "slidesToShow": 4,
            "slidesToScroll": 4,
            "responsive": [
                {
                    "breakpoint": 992,
                    "settings": {
                        "slidesToShow": 2,
                        "slidesToScroll": 2
                    }
                },
                {
                    "breakpoint": 768,
                    "settings": {
                        "slidesToShow": 1,
                        "slidesToScroll": 1
                    }
                }
            ]
        };

        CatalogService
            .getNewProducts()
            .then(function (data) {
                self.products = data.products
                self.productsLoaded = true;
            });
    }
})(angular);
