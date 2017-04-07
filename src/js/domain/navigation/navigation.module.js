(function (angular) {
  angular.module('pds.navigation.route', ['ui.router']);
  angular.module('pds.navigation.service', ['pds.navigation.model', 'pds.common.service']);
  angular.module('pds.navigation.config', []);
  angular.module('pds.navigation.controller', ['pds.navigation.service', 'pds.common.service']);
  angular.module('pds.navigation.model', []);
  angular.module('pds.navigation.directive', []);
  angular.module('pds.navigation', ['pds.navigation.controller', 'pds.navigation.route', 'pds.navigation.service', 'pds.navigation.config', 'pds.navigation.model']);
})(angular);
