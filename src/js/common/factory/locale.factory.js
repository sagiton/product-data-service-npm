(function (angular) {
    angular
        .module('pds.common.factory')
        .factory('Locale', LocaleFactory);

    LocaleFactory.$inject = ['_'];
    var splitCharacters = ['_', '-'];
    function LocaleFactory(_) {
        var localeFn = function Locale(locale) {
            this.locale = {};
            if (!_.isString(locale)) {
                return;
            }
            var character = _.find(splitCharacters, function (character) {
                return locale.split(character).length > 1;
            });
            var split = locale.split(character);
            this.locale = {
                language: split[0].trim().toLowerCase(),
                country: split[1].trim().toLowerCase()
            }
        };

        localeFn.prototype.getLanguage = function () {
            return this.locale.language;
        };

        localeFn.prototype.getCountry = function () {
            return this.locale.country;
        };

        localeFn.prototype.toString = function (separator) {
            return this.getLanguage() + (separator || splitCharacters[0]) + this.getCountry().toUpperCase();
        };

        return localeFn;
    }

})(angular);
