(function (angular) {
    angular
        .module('pds.catalog.service')
        .service('catalogSearchListener', CatalogSearchListener);

    CatalogSearchListener.$inject = ['$rootScope', '$q', 'env'];

    function CatalogSearchListener($root, $q, env) {
        this.listen = function () {
            var def = $q.defer();
            $root.$on('pds.search.navigate', function (event, params) {
                if (params.target.channelDiscriminator == env.search.pdsChannelDiscriminator) {
                    def.resolve(params);
                }
            });
            return def.promise;
        }
    }
})(angular);
