(function (angular) {
  angular.module('pds.search.route', ['pds.common.route', 'ui.router']);
  angular.module('pds.search.service', ['pds.navigation.model', 'pds.common.config']);
  angular.module('pds.search.config', []);
  angular.module('pds.search.directive', ['pds.search.service', 'ui.bootstrap']);
  angular.module('pds.search.model', []);
  angular.module('pds.search', ['pds.search.directive', 'pds.search.route', 'pds.search.service', 'pds.search.config', 'pds.search.model']);
})(angular);
