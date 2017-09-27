(function (angular) {
  angular
    .module('pds.common.directive')
    .directive('simpleSubmenu', function () {
      return {
        restrict: 'EA',
        link: function (scope, element, attrs) {
          // initNavCollapse(element);
        }
      }
    })

})(angular);
