(function (angular, URITemplate) {
    angular
        .module('pds.common.filter')
        .filter('imageUrl', ImageUrlFilter);

    ImageUrlFilter.$inject = ['env', 'locale', 'metaTag', '_'];

    var rootSrc = '/media/images/'

    var defaultImages = {
        'img-sm':  rootSrc + 'default-460x460.jpg',
        'img-md':  rootSrc + 'default-640x372.jpg',
        'img-lg':  rootSrc + 'default-680x440.jpg',
        'img-xlg': rootSrc + 'default-1600x560.jpg'
    };

    function ImageUrlFilter(env, locale, metaTag, _) {
        return function (url, variant, size) {
            if (!_.isString(url)) {
                return defaultImages[variant || 'img-sm'];
            }
            var idx = url.lastIndexOf(".");
            var file = url.slice(0, idx);
            var extension = url.slice(idx);
            return new URITemplate(env.endPoint.ocsMediaEndpoint + "{channel}/{locale}/{filename}" + (size ? "_{size}" : "") + "{extension}")
                .expand({
                    channel: metaTag.getOcsChannel(),
                    locale: locale.toString(),
                    filename: file,
                    size: size,
                    extension: extension
                })
                .toString();
        }
    }
})(angular, URITemplate);
