(function (angular, URITemplate) {
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
        return function (url, variant, size) {
            if (!url) {
                return defaultImages[variant || 'img-sm'];
            }
            var file = url.split(".");
            return new URITemplate(env.endPoint.ocsMediaEndpoint + "{channel}/{locale}/{filename}" + (size ? "_{size}" : "") + "{.extension}")
                .expand({
                    channel: metaTag.getOcsChannel(),
                    locale: locale.toString(),
                    filename: file[0],
                    size: size,
                    extension: file[1]
                })
                .toString();
        }
    }
})(angular, URITemplate);
