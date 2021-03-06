(function (angular) {
    angular
        .module('pds.common.config')
        .provider('locale', LocaleProvider);


    function LocaleProvider() {
        var discoveryMethods = [];

        this.addDiscoveryMethod = function (method) {
            discoveryMethods.push(method);
            return this;
        };

        this.$get = ['_', function (_) {
            return new Locale(_, discoveryMethods);
        }];
    }

    function Locale(_, discoveryMethods) {
        var method = _.find(discoveryMethods, _.attempt);
        var result =  method ? method() : [];
        var country = result[1];
        var language = result[2];
        if (!country || !language) {
            throw new Error("OCS Locale cannot be discovered - country: " + country + ", language: " + language)
        }
        return {
            country: country,
            language: language,
            toString: function() {
                return this.language.toLowerCase() + "_" + this.country.toUpperCase();
            }
        };
    }
})(angular);
