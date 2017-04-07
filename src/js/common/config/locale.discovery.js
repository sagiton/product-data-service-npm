(function (angular) {
    angular
        .module('pds.common.config')
        .factory('locale', ['config', '_', Locale]);

    var discoveryMethods = [urlPatternDiscovery];

    function Locale(config, _) {
        var method = _.find(discoveryMethods, _.attempt);
        var result =  method ? method() : [];
        var country = config.forceCountry || result[1];
        var language = config.forceLanguage || result[2];
        return {
            country: country,
            language: language,
            toString: function() {
                return this.language.toLowerCase() + "_" + this.country.toUpperCase();
            }
        };
    }

    var localeUrlPattern = /^\/([a-zA-Z]{2})\/([a-zA-Z]{2})/;
    function urlPatternDiscovery() {
        return localeUrlPattern.exec(new URI().path());
    }
})(angular);
