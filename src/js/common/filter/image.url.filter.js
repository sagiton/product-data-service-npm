(function (angular) {
    angular
        .module('pds.common.filter')
        .filter('imageUrl', ImageUrlFilter);

    ImageUrlFilter.$inject = ['config'];

    var defaultImages = {
        sm: '/media/images/default-category-image_460x460.jpg',
        category: '/media/images/cat_category-name.jpg',
        product: '/media/images/p1_product-name.jpg',
        keyvisual: '/media/images/skv_keyvisual_1.jpg'
    };

    function ImageUrlFilter(config) {
        return function (mediaObject, size) {
            return mediaObject ? config.endPoint.ocsMediaEndpoint + "media/" + mediaObject : defaultImages[size || 'product'];
        }
    }
})(angular);
