(function(angular) {
    angular
        .module('pds.catalog.controller')
        .controller("NewProductController", NewProductController);

    NewProductController.$inject = ['CatalogService', '_'];

    function NewProductController(catalogService, _) {
        var vm = this;

        vm.productsLoaded = false;
        vm.slickSettings = {
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

        catalogService
            .getNewProductFamilies()
            .then(function (result) {
                vm.productFamilies = result;
                vm.productsLoaded = true;
            });
    }
})(angular);
