(function (angular) {
    angular
        .module('pds.search.service')
        .service('cmsSearchListener', CmsSearchListener);

    CmsSearchListener.$inject = ['$rootScope', '$q', 'config'];

    function CmsSearchListener($root, $q, config) {
        this.listen = function () {
            var def = $q.defer();
            $root.$on('pds.search.navigate', function (event, params) {
                if (!!params.target.resourceLocation) {
                    def.resolve(params);
                }
            });
            return def.promise;
        }
    }
})(angular);
