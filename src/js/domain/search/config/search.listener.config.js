(function (angular) {
    angular
        .module('pds.search.config')
        .run(ListenerInit);

    ListenerInit.$inject = ['cmsSearchListener', '$window'];

    function ListenerInit(cmsSearchListener, $window) {
        cmsSearchListener
            .listen()
            .then(function (param) {
                $window.location.href = param.target.resourceLocation;
            });
    }
})(angular);
