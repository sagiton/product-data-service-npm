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

        function initProductFamilies() {
            return _.each(vm.products, function (product) {
                catalogService
                    .getProductFamily(product)
                    .then(function (family) {
                        return product.productFamilyId = family.id;
                    });
            })
        }

        function _initProductImages(products) {
            _
                .each(products, function (product) {
                    var parent = product.parentId.type == 'list' ? product.parentId.value.elements[0] : product.parentId.value;
                    catalogService
                        .getByIdAndType(parent, 'product_details')
                        .then(function (productFamily) {
                            product.productimage = productFamily.productimage;
                        });
                });
        }
    }
})(angular);
