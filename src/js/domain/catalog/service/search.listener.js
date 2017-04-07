(function (angular) {
    angular
        .module('pds.catalog.service')
        .service('catalogSearchListener', CatalogSearchListener);

    CatalogSearchListener.$inject = ['$rootScope', '$q', 'config'];

    function CatalogSearchListener($root, $q, config) {
        this.listen = function () {
            var def = $q.defer();
            $root.$on('pds.search.navigate', function (event, params) {
                if (params.target.channelDiscriminator == config.search.pdsChannelDiscriminator || params.target.resourceId) {
                    def.resolve(params);
                }
            });
            return def.promise;
        }
    }
})(angular);
