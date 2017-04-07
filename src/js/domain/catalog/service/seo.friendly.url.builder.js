(function (angular) {
    angular
        .module('pds.catalog.service')
        .factory('SeoFriendlyUrlBuilder', SeoFriendlyUrlBuilderFactory);

    SeoFriendlyUrlBuilderFactory.$inject = ['$window', '_', 'simplifyCharactersFilter'];

    var fragmentSeparator = '-';
    var pathSeparator = '/';
    var basePath = 'ocs';

    function SeoFriendlyUrlBuilderFactory($window, _, simplifyCharactersFilter) {
        function SeoFriendlyUrlBuilder() {
            this.path = buildBasePath($window);
            this.simplifyCharactersFilter = simplifyCharactersFilter;
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
            this.path = buildBasePath($window);
            this.addPath(fragments);
            return this;
        };

        SeoFriendlyUrlBuilder.prototype.build = function () {
            return this.path;
        };

        return SeoFriendlyUrlBuilder;
    }

    function buildBasePath($window) {
        return $window.location.origin + $window.getBasePath() + pathSeparator + basePath;
    }

})(angular);
