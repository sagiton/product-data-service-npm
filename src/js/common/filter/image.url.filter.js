(function (angular) {
    angular
        .module('pds.common.filter')
        .filter('imageUrl', ImageUrlFilter);

    ImageUrlFilter.$inject = ['env', 'locale', 'ocsChannel'];

    var defaultImages = {
        sm: '/media/images/default-category-image_460x460.jpg',
        category: '/media/images/cat_category-name.jpg',
        product: '/media/images/p1_product-name.jpg',
        keyvisual: '/media/images/skv_keyvisual_1.jpg'
    };

    function ImageUrlFilter(env, locale, ocsChannel) {
        return function (mediaObject, size) {
            return mediaObject ? env.endPoint.ocsMediaEndpoint + ocsChannel + "/" + locale.toString() + "/" + mediaObject : defaultImages[size || 'product'];
        }
    }
})(angular);
