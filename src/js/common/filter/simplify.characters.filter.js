(function (angular) {
    var CHARACTER_MAP = {
        '\u002E':   '',  //.
        '\u0020':   '-', //SPACE
        '\u002C':   '-', //,
        '\u0026':   '-', //&
        '\u005C':   '-', //\
        '\u201E':   '-', //„
        '\u0022':   '-', //'
        '\u0027':   '-', //'
        '\u00B4':   '-', //´
        '\u0060':   '-', //`
        '\u00BB':   '-', //»
        '\u00AB':   '-', //«
        '\u002F':   '-', ///
        '\u003A':   '-', //:
        '\u0021':   '-', //!
        '\u002A':   '-', //*
        '\u0028':   '-', //(
        '\u0029':   '-', //)
        '\u2122':   '-', //™
        '\u00AE':   '-', //®
        '\u00E1':   'a', //á
        '\u00F3':   'o', //ó
        '\u00ED':   'i', //í
        '\u00E9':   'e', //é
        '\u00E4':   'ae',//ä
        '\u00F6':   'oe',//ö
        '\u0151':   'o', //ő
        '\u00FC':   'u', //ü
        '\u00FA':   'u', //ú
        '\u0171':   'u', //ű
        '\u00DF':   'ss',//ß
        '\u00EE':   'i', //î
        '\u00E2':   'a', //â
        '\u0103':   'a', //ă
        '\u021B':   't', //ț
        '\u0163':   't', //ţ
        '\u015F':   't', //ş
        '\u0219':   's', //ș
        '\u0159':   'r', //ř
        '\u016f':   'u', //ů
        '\u00FD':   'y', //ý
        '\u010D':   'c', //č
        '\u011B':   'e', //ě
        '\u017E':   'z', //ž
        '\u0161':   's', //š
        '\u0165':   't', //ť
        '\u0148':   'n'  //ň
    };
    var characterRegex = _
        .map(CHARACTER_MAP, function (val, key) {
            return '\\' + key;
        })
        .join('|');
    var regExp = new RegExp(characterRegex, 'g');

    angular
        .module('pds.common.filter')
        .filter('simplifyCharacters', ['_', function (_) {
            return function (val) {
                return val && val
                        .toLowerCase()
                        .replace(regExp, function (match) {
                            return CHARACTER_MAP[match];
                        });
            }
        }])

})(angular);
