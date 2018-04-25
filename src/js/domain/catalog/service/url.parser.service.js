(function (angular) {

    angular
        .module('pds.catalog.service')
        .service('urlParserService', UrlParser);

    UrlParser.$inject = ['config'];

    var countryMatchIndex = 1;
    var languageMatchIndex = 2;
    var rootSegmentMatchIndex = 3;
    var catalogIdMatchIndex = 4;

                      /**  {1}{2}   {3}                                    {4}    **/
                      /** /ch/de/residential.html/qwe/asd/qwe/asd/poiuuy-134233-c **/
    var pathPattern = /^\/([a-z]{2}|global)\/([a-z]{2})\/(?:ocs\/)?([^\/]*)(?:\.html)?\/(?:.*-([0-9]*)-[pc]\/?$)?/i;
    var catalogPattern = /\/ocs\/(.*)/;

    function UrlParser(config) {
        this.config = config;
    }

    UrlParser.prototype.isOCS = function() {
        return !!this.getCatalogId();
    };

    UrlParser.prototype.getRootSegment = function getRootSegment() {
        return matchForIndex(rootSegmentMatchIndex) || this.config.metaTags.siteName;
    };

    UrlParser.prototype.getCatalogId = function () {
        return matchForIndex(catalogIdMatchIndex);
    };

    UrlParser.prototype.getLanguage = function () {
        return matchForIndex(languageMatchIndex);
    };

    UrlParser.prototype.getCatalogPath = function (url) {
        var uri = new URI();
        if (url) {
            uri = new URI(url);
        }
        var match = uri.path().match(catalogPattern);
        return match && match[1];
    };

    function matchForIndex(index) {
        var match = new URI().path().match(pathPattern);
        return match && match[index];
    }

})(angular);
