(function (angular) {
    var CHARACTER_MAP = {
        '\u002E':    '',                                        //        . --> EMPTY
        '\u0020':    '\u002D',                                  //        SPACE --> -
        '\u002C':    '\u002D',                                  //        , --> -
        '\u0026':    '\u002D',                                  //        & --> -
        '\u005C':    '\u002D',                                  //        \ --> -
        '\u201E':    '\u002D',                                  //        „ --> -
        '\u0022':    '\u002D',                                  //        " --> -
        '\u0027':    '\u002D',                                  //        ' --> -
        '\u00B4':    '\u002D',                                  //        ´ --> -
        '\u0060':    '\u002D',                                  //        ` --> -
        '\u00BB':    '\u002D',                                  //        » --> -
        '\u00AB':    '\u002D',                                  //        « --> -
        '\u002F':    '\u002D',                                  //        / --> -
        '\u003A':    '\u002D',                                  //        : --> -
        '\u0021':    '\u002D',                                  //        ! --> -
        '\u002A':    '\u002D',                                  //        * --> -
        '\u0028':    '\u002D',                                  //        ( --> -
        '\u0029':    '\u002D',                                  //        ) --> -
        '\u2122':    '\u002D',                                  //        ™ --> -
        '\u00AE':    '\u002D',                                  //        ® --> -
        '\u00E1':    '\u0061',                                  //        á --> a
        '\u00F3':    '\u006F',                                  //        ó --> o
        '\u00ED':    '\u0069',                                  //        í --> i
        '\u00E9':    '\u0065',                                  //        é --> e
        '\u00E4':    '\u0061' + '\u0065',                       //        ä --> ae
        '\u00F6':    '\u006F',                                  //        ö --> o
        '\u0151':    '\u006F',                                  //        ő --> o
        '\u00FC':    '\u0075',                                  //        ü --> u
        '\u00FA':    '\u0075',                                  //        ú --> u
        '\u0171':    '\u0075',                                  //        ű --> u
        '\u00DF':    '\u0073' + '\u0073'                        //        ß --> ss
    };

    angular
        .module('pds.common.filter')
        .filter('simplifyCharacters', ['_', function (_) {
            return function (val) {
                var characterRegex = _
                    .map(CHARACTER_MAP, function (val, key) {
                        return '\\' + key;
                    })
                    .join('|');
                return val && val
                        .replace(new RegExp(characterRegex, 'g'), function (match) {
                            return CHARACTER_MAP[match];
                        })
                        .toLowerCase();
            }
        }])

})(angular);
