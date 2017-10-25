(function (angular) {
    angular
        .module('pds.common.filter')
        .filter('imageUrl', ImageUrlFilter);

    ImageUrlFilter.$inject = ['env', 'locale', 'metaTag'];

    var rootSrc = '/media/images/'

    var defaultImages = {
        'img-sm':  rootSrc + 'default-460x460.jpg',
        'img-md':  rootSrc + 'default-640x372.jpg',
        'img-lg':  rootSrc + 'default-680x440.jpg',
        'img-xlg': rootSrc + 'default-1600x560.jpg'
    };

    function ImageUrlFilter(env, locale, metaTag) {
        return function (mediaObject, size) {
            return mediaObject ? env.endPoint.ocsMediaEndpoint + metaTag.getSiteChannel()
                + "/" + locale.toString() + "/" + mediaObject : defaultImages[size || 'img-sm'];
        }
    }
})(angular);
