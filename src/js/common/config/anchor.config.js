(function (angular, $) {
    angular
        .module('pds.common.config')
        .config(function () {
            $(document).ready(function () {
                $('a')
                    .filter(function (idx, el) {
                        return !$(el).attr('target');
                    })
                    .attr('target', '_self');
            })
        })
})(angular, $);
