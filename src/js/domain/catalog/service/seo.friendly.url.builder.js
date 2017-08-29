(function (angular, URI) {
    angular
        .module('pds.catalog.service')
        .factory('SeoFriendlyUrlBuilder', SeoFriendlyUrlBuilderFactory);

    SeoFriendlyUrlBuilderFactory.$inject = ['$window', '_', 'simplifyCharactersFilter', 'config'];

    var fragmentSeparator = '-';
    var pathSeparator = '/';

    function SeoFriendlyUrlBuilderFactory($window, _, simplifyCharactersFilter, config) {
        function SeoFriendlyUrlBuilder(options) {
            this.path = buildBasePath();
            this.simplifyCharactersFilter = simplifyCharactersFilter;
            this.options = options || {};
        }

        SeoFriendlyUrlBuilder.prototype.addPath = function(fragments) {
            if (!fragments) {
                return this;
            }
            var args = _.compact([].concat(fragments));
            this.path += pathSeparator + this.simplifyCharactersFilter(args.join(fragmentSeparator));
            return this;
        };

        SeoFriendlyUrlBuilder.prototype.setPath = function (fragments) {
            this.path = buildBasePath();
            this.addPath(fragments);
            return this;
        };

        SeoFriendlyUrlBuilder.prototype.build = function () {
            return this.path + (config.urlSchema.trailingSlash ? '/' : '');
        };

        return SeoFriendlyUrlBuilder;

        function buildBasePath() {
            return URI().origin() + $window.getBasePath() + config.pdsPathPrefix;
        }
    }


})(angular, URI);
