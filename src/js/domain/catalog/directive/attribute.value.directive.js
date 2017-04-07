(function (angular) {
    var VALUE_TEMPLATE = '<span>{{value.value || \'-\'}}</span>';
    var IMAGE_MEDIA_TEMPLATE = '<img ng-src="{{value.value}}" alt="{{alt.value}}" title="{{title.value}}"/>';
    var OTHER_MEDIA_TEMPLATE = '<span><a ng-href="{{value.value | imageUrl}}" title="{{title.value}}" target="_blank"><span ng-bind-html="$sce.trustAsHtml(\'DOWNLOAD.NOW\' | translate)"></span>&nbsp;<i class="glyphicon glyphicon-download-alt"></i></a></span>';
    var IMAGE_EXTENSIONS = ['.jpg', '.png', '.jpeg', '.gif'];
    var DOT = '.';

    var templateStrategy = [
        {
            isApplicable: function (val, type) {
                return type == 'string' && IMAGE_EXTENSIONS.indexOf(val.slice(val.lastIndexOf(DOT))) >= 0;
            },
            template: IMAGE_MEDIA_TEMPLATE
        },
        {
            isApplicable: function (val, type) {
                return type == 'asset';
            },
            template: OTHER_MEDIA_TEMPLATE
        },
        {
            isApplicable: function () {
                return true;
            },
            template: VALUE_TEMPLATE
        }
    ];

    angular
        .module('pds.catalog.directive')
        .directive('attributeValue', ['$compile', '$sce', function ($compile, $sce) {
            return {
                restrict: 'EA',
                scope: {
                    value: '=attributeValue',
                    alt: "=attributeAlt",
                    title: "=attributeTitle"
                },
                link: function (scope, element, attrs, ctrl) {
                    scope.$sce = $sce;
                    for (var i = 0; i < templateStrategy.length; i++) {
                        if (scope.value && templateStrategy[i].isApplicable(scope.value.value, scope.value.type)) {
                            return element.html($compile(templateStrategy[i].template)(scope));
                        }
                    }
                }
            }
        }]);

})(angular);
