(function (angular) {
    angular
        .module('pds.common.filter')
        .filter('imageUrl', ImageUrlFilter);

    ImageUrlFilter.$inject = ['env', 'locale', 'ocsChannel'];

    var defaultImages = {
        'img-sm': '/src/media/default-460x460.jpg',
        'img-md': '/src/media/default-640x372.jpg',
        'img-lg': '/src/media/default-680x440.jpg',
        'img-xlg': '/src/media/default-1600x560.jpg'
    };

    function ImageUrlFilter(env, locale, ocsChannel) {
        return function (mediaObject, size) {
            return mediaObject ? env.endPoint.ocsMediaEndpoint + ocsChannel + "/" + locale.toString() + "/" + mediaObject : defaultImages[size || 'img-sm'];
        }
    }
})(angular);
