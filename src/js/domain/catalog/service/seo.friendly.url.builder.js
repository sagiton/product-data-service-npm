(function (angular, URI) {
    angular
        .module('pds.catalog.service')
        .factory('SeoFriendlyUrlBuilder', SeoFriendlyUrlBuilderFactory);

    SeoFriendlyUrlBuilderFactory.$inject = ['$window', '_', 'simplifyCharactersFilter'];

    var fragmentSeparator = '-';
    var pathSeparator = '/';
    var ocsBasePath = 'ocs';

    function SeoFriendlyUrlBuilderFactory($window, _, simplifyCharactersFilter) {
        function SeoFriendlyUrlBuilder(options) {
            options = options || {};
            this.ocsBasePath = options.ocsBasePath || ocsBasePath;
            this.path = this.buildBasePath();
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
            this.path = this.buildBasePath();
            this.addPath(fragments);
            return this;
        };

        SeoFriendlyUrlBuilder.prototype.build = function () {
            return this.path;
        };

        SeoFriendlyUrlBuilder.prototype.buildBasePath = function() {
            return URI().origin() + $window.getBasePath() + pathSeparator + this.ocsBasePath;
        };

        return SeoFriendlyUrlBuilder;
    }


})(angular, URI);
