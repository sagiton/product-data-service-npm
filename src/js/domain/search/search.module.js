(function (angular) {
  angular.module('pds.search.route', ['ui.router']);
  angular.module('pds.search.service', ['pds.navigation.model', 'pds.common.config']);
  angular.module('pds.search.config', []);
  angular.module('pds.search.controller', ['pds.search.service', 'ui.bootstrap']);
  angular.module('pds.search.model', []);
  angular.module('pds.search.directive', []);
  angular.module('pds.search', ['pds.search.controller', 'pds.search.route', 'pds.search.service', 'pds.search.config', 'pds.search.model']);
})(angular);
