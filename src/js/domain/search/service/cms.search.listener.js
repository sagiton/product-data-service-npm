(function (angular) {
    angular
        .module('pds.search.service')
        .service('cmsSearchListener', CmsSearchListener);

    CmsSearchListener.$inject = ['$q'];

    var HIGHLIGHT_PARAM = "hl";

    function CmsSearchListener($q) {
        this.handle = function (params) {
            if (!!params.target.resourceLocation) {
                return $q.resolve(new URI(params.target.resourceLocation)
                    .addQuery(HIGHLIGHT_PARAM, params.searchTerm)
                    .toString());
            }
            return $q.reject();
        }
    }
})(angular);
