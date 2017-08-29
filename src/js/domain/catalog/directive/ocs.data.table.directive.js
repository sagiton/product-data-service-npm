(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('ocsDataTable', OcsDataTable);

    OcsDataTable.$inject = ['$timeout', '_'];


    function OcsDataTable($timeout, _) {
        return {
            restrict: 'EA',
            scope: {
                ocsDataTable: '=',
                odtResponsiveChange: '&'
            },
            link: function (scope, element, attrs) {
                scope.$watch('ocsDataTable', function (val) {
                    $timeout(function () {
                        element.DataTable();
                        element.off('responsive-resize.dt');
                        element.on('responsive-resize.dt', function (e, table, cols) {
                            scope.$apply(function () {
                                scope.odtResponsiveChange({$event: e, $table: table, $columns: cols});
                            })
                        });
                    });
                });
            }
        }
    }

})(angular);
