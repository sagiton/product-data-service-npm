/*! product-data-service - v2.0.1-0 - 2017-08-29T15:45:28.103Z */ 

(function (angular) {
    angular.module('pds.environment', []);
    angular.module('product-data-service', ['pds.catalog', 'pds.navigation', 'pds.environment', 'pds.search', 'pds.common', 'ui.router', 'ngSanitize']);
})(angular);

(function () { 
 return angular.module("pds.environment")
.constant("config", {
  "metaTags": {
    "siteName": "Buderus"
  },
  "urlSchema": {
    "trailingSlash": false
  },
  "pdsPathPrefix": "/ocs",
  "pdsTemplatePath": "/src/html",
  "forceLanguage": null,
  "search": {
    "defaultImage": "default-search"
  }
});

})();

(function () { 
 return angular.module("pds.environment")
.constant("env", {
  "endPoint": {
    "productDataService": "https://dev02.sagiton.pl/catalog-service-dev/",
    "contentService": "https://dev02.sagiton.pl/content-service-dev/",
    "searchService": "https://services.kittelberger.net/search/v1/",
    "ocsMediaEndpoint": "https://dev02.sagiton.pl/asset-service-dev/asset/"
  },
  "search": {
    "cmsChannelDiscriminator": "deCHCmsDiscriminator",
    "pdsChannelDiscriminator": "buderusPdsDiscriminator"
  }
});

})();

(function (angular) {
    angular.module('pds.common.route', ['ui.router', 'ncy-angular-breadcrumb', 'pds.environment']);
    angular.module('pds.common.service', []);
    angular.module('pds.common.config', ['pascalprecht.translate']);
    angular.module('pds.common.controller', ['ngAnimate', 'ngSanitize', 'datatables', 'hl.sticky', 'dcbImgFallback', 'slickCarousel']);
    angular.module('pds.common.model', []);
    angular.module('pds.common.factory', []);
    angular.module('pds.common.directive', []);
    angular.module('pds.common.filter', ['pds.environment']);
    angular.module('pds.common', ['pds.common.controller', 'pds.common.route', 'pds.common.service', 'pds.common.config', 'pds.common.model']);
})(angular);

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

(function (angular, window) {
    angular
        .module('pds.common.config')
        .config(['$translateProvider', function ($translateProvider) {
            if (window.cmsTranslations) {
                $translateProvider
                    .translations('this', window.cmsTranslations)
                    .useSanitizeValueStrategy('sanitize')
                    .preferredLanguage('this')
                    .use('this');
            }
        }]);

})(angular, window);

(function (angular) {
    angular
        .module('pds.common.config')
        .provider('locale', LocaleProvider);


    function LocaleProvider() {
        var discoveryMethods = [];

        this.addDiscoveryMethod = function (method) {
            discoveryMethods.push(method);
            return this;
        };

        this.$get = ['_', function (_) {
            return new Locale(_, discoveryMethods);
        }];
    }

    function Locale(_, discoveryMethods) {
        var method = _.find(discoveryMethods, _.attempt);
        var result =  method ? method() : [];
        var country = result[1];
        var language = result[2];
        return {
            country: country,
            language: language,
            toString: function() {
                return this.language.toLowerCase() + "_" + this.country.toUpperCase();
            }
        };
    }
})(angular);

(function (angular) {
    angular
        .module('pds.common.config')
        .factory('_', ['$window', function ($window) {
            return $window._;
        }]);

})(angular);

(function (angular) {
    angular
        .module('pds.common.config')
        .factory('ocsChannel', OcsChannel);

    function OcsChannel() {
        return angular.element('meta[name="ocs-channel"]').attr('content');
    }
})(angular);

(function (angular) {
    angular
        .module('pds.common.config')
        .config(['localeProvider', function (localeProvider) {
            var localeUrlPattern = /^\/([a-zA-Z]{2})\/([a-zA-Z]{2})/;
            localeProvider.addDiscoveryMethod(function () {
                return localeUrlPattern.exec(new URI().path());
            });
        }]);

})(angular);

(function (angular) {

    angular
        .module('pds.common.config')
        .decorator('$window', ['$delegate', WindowDecorator]);

    function WindowDecorator($delegate) {
        $delegate.navigate = function (uri) {
            if (uri.indexOf('/') != 0) {
                uri = '/'.concat(uri);
            }
            $delegate.location.href = getBasePath() + uri;
        };
        $delegate.getBasePath = function getBasePath() {
            var basePath = angular.element('base').attr('href-override');

            if (!basePath)
                basePath = angular.element('base').attr('href');

            if (basePath.lastIndexOf('/') == (basePath.length - 1)) {
                basePath = basePath.slice(0, basePath.length - 1);
            }
            return basePath;
        };
        return $delegate;
    }
})(angular);

(function (angular) {
    angular
        .module('pds.common.controller')
        .controller('ContentController', ContentController);

    ContentController.$inject = ['SpinnerService'];

    function ContentController(spinnerService) {
        var vm = this;

        vm.isSpinning = spinnerService.isLoading;
    }

})(angular);

(function (angular) {
    angular
        .module('pds.common.controller')
        .controller('headerController', HeaderController);

    HeaderController.$inject = ['$scope', '$location', 'locale', 'config', 'jsonFilter', '_', 'BreadcrumbService'];
    var contentGroups = ['WT.cg_n', 'WT.cg_s', 'WT.z_cg3', 'WT.z_cg4', 'WT.z_cg5', 'WT.z_cg6', 'WT.z_cg7', 'WT.z_cg8', 'WT.z_cg9', 'WT.z_cg10'];

    function HeaderController($scope, $location, locale, config, jsonFilter, _, BreadcrumbService) {
        var rootContentGroup = {name: config.metaTags.siteName};
        var vm = this;
        vm.url = $location.absUrl();
        vm.locale = locale.toString();
        vm.brand = config.metaTags.brand;
        vm.country = locale.country;
        vm.language = locale.language;

        $scope.$on('pds.header.update', function (event, params) {
            vm.title = params.title;
            vm.description = params.description;
            vm.image = params.image;
            vm.webTrends = params.webTrends;
            vm.siteName = params.siteName;
            vm.canonicalUrl = params.canonicalUrl;
        });

        $scope.$on('pds.header.update', function (event, params) {
            buildJsonLD({
                "@context": "http://schema.org/",
                "@type": "Product",
                "name" : params.title,
                "image": params.image,
                "description": params.description,
                "brand": config.metaTags.siteName
            });
        });

        $scope.$on('pds.breadcrumb.update', function (event, params) {
            BreadcrumbService
                .build(params.catalogId)
                .then(function (breadcrumbs) {
                    buildJsonLD({
                        "@context": "http://schema.org/",
                        "@type": "BreadcrumbList",
                        "itemListElement": _.map(breadcrumbs, function (crumb, index) {
                            return {
                                '@type': 'ListItem',
                                position: index,
                                item: {
                                    '@id': crumb.url,
                                    name: crumb.name
                                }
                            }
                        })
                    });
                    return breadcrumbs;
                })
                .then(buildContentGroups);
        });

        function buildJsonLD(model) {
            angular
                .element('<script>')
                .attr('type', 'application/ld+json')
                .text(jsonFilter(model))
                .appendTo('head');
        }

        function buildContentGroups(tree) {
            tree.unshift(rootContentGroup);
            _.forEach(tree, function (element, idx) {
                addMeta(contentGroups[idx], element.name);
            });
        }


        function addMeta(name, content) {
            angular
                .element('meta[name="' + name + '"')
                .remove();
            angular
                .element('<meta>')
                .attr('name', name)
                .attr('content', content)
                .appendTo('head');
        }
    }

})(angular);

(function (angular) {
    angular
        .module('pds.common.controller')
        .controller('jsonLdController', JsonLdController);

    JsonLdController.$inject = ['$scope', '$location', 'BreadcrumbService', 'CatalogService', 'jsonFilter'];

    function JsonLdController($scope, $location, BreadcrumbService, CatalogService, jsonFilter) {
        var vm = this;
        vm.url = $location.absUrl();


    }

})(angular);

(function (angular) {
    angular
        .module('pds.common.directive')
        .directive('cliplister', CliplisterDirective);

    CliplisterDirective.$inject = ['$filter', '$sce'];

    function CliplisterDirective($filter, $sce) {
        return {
            restrict: 'E',
            template: '<div id="video" style="height:400px;"></div>',
            scope: {
                videoId: '=videoId'
            },
            link: function(scope, element, attrs) {
                new CliplisterControl.Viewer({
                    parentId: "video",
                    customer: 157893,
                    assets: [scope.videoId],
                    keyType: 10000,
                    fsk: 18,
                    autoplay: false,
                    plugins: {
                        InnerControls: {
                            layer: 2,
                            mobileDefaultControls: true,
                            id: "controls",
                            blacklist: ["share","quality","playback-speed"],
                            template: {
                                type: "external",
                                source: "https://mycliplister.com/static/viewer/assets/skins/default/controls.html"
                            }
                        },
                        ClickableVideo: {layer: 1},
                        PlayButton: {
                            id: "playButton",
                            layer: 7,
                            image: "https://mycliplister.com/static/viewer/assets/skins/default/playButton.png",
                            width: 100,
                            height: 100
                        },
                        PreviewImage: {layer: 6}
                    }
                });
            },
            replace: true
        }
    };

})(angular);

(function (angular) {
    angular
        .module('pds.common.directive')
        .directive('jsonld', JsonLdDirective);

    JsonLdDirective.$inject = ['$filter', '$sce'];

    function JsonLdDirective($filter, $sce) {
        return {
            restrict: 'E',
            template: '<script type="application/ld+json" ng-bind-html="onGetJson()"></script>',
            scope: {
                json: '=json'
            },
            link: function(scope, element, attrs) {
                scope.onGetJson = function() {
                    return $sce.trustAsHtml($filter('json')(scope.json));
                }
            },
            replace: true
        }
    };

})(angular);

(function (angular) {
  angular
    .module('pds.common.directive')
    .directive('simpleSubmenu', function () {
      return {
        restrict: 'EA',
        link: function (scope, element, attrs) {
          initNavCollapse(element);
        }
      }
    })

})(angular);

(function (angular) {

    angular
        .module('pds.common.filter')
        .filter('convertWhitespaces', function () {
            return function (input) {
                return input && input
                        .replace(/\n/g, '</br>')
                        .replace(/<!--.*language.*missing.*-->/g, '');
            }
        });
})(angular);

(function (angular) {
    angular
        .module('pds.common.filter')
        .filter('imageUrl', ImageUrlFilter);

    ImageUrlFilter.$inject = ['env', 'locale', 'ocsChannel'];

    var defaultImages = {
        'img-sm': '/src/media/default-460x460.jpg',
        'img-md': '/src/media/default-640x372.jpg',
        'img-lg': '/src/media/default-680x440.jpg',
        'img-xlg': '/src/media/default-1600x560.jpg'
    };

    function ImageUrlFilter(env, locale, ocsChannel) {
        return function (mediaObject, size) {
            return mediaObject ? env.endPoint.ocsMediaEndpoint + ocsChannel + "/" + locale.toString() + "/" + mediaObject : defaultImages[size || 'img-sm'];
        }
    }
})(angular);

(function (angular) {
    var CHARACTER_MAP = {
        '\u002E':   '',  //.
        '\u0020':   '-', //SPACE
        '\u002C':   '-', //,
        '\u0026':   '-', //&
        '\u005C':   '-', //\
        '\u201E':   '-', //„
        '\u0022':   '-', //'
        '\u0027':   '-', //'
        '\u00B4':   '-', //´
        '\u0060':   '-', //`
        '\u00BB':   '-', //»
        '\u00AB':   '-', //«
        '\u002F':   '-', ///
        '\u003A':   '-', //:
        '\u0021':   '-', //!
        '\u002A':   '-', //*
        '\u0028':   '-', //(
        '\u0029':   '-', //)
        '\u2122':   '-', //™
        '\u00AE':   '-', //®
        '\u00E1':   'a', //á
        '\u00F3':   'o', //ó
        '\u00ED':   'i', //í
        '\u00E9':   'e', //é
        '\u00E4':   'ae',//ä
        '\u00F6':   'oe',//ö
        '\u0151':   'o', //ő
        '\u00FC':   'u', //ü
        '\u00FA':   'u', //ú
        '\u0171':   'u', //ű
        '\u00DF':   'ss',//ß
        '\u00EE':   'i', //î
        '\u00E2':   'a', //â
        '\u0103':   'a', //ă
        '\u021B':   't', //ț
        '\u0163':   't', //ţ
        '\u015F':   't', //ş
        '\u0219':   's', //ș
        '\u0159':   'r', //ř
        '\u016f':   'u', //ů
        '\u00FD':   'y', //ý
        '\u010D':   'c', //č
        '\u011B':   'e', //ě
        '\u017E':   'z', //ž
        '\u0161':   's', //š
        '\u0165':   't', //ť
        '\u0148':   'n', //ň
        '\u2019':   '-', //’
        '\u00e0':   'a'  //à
    };
    var characterRegex = _
        .map(CHARACTER_MAP, function (val, key) {
            return '\\' + key;
        })
        .join('|');
    var regExp = new RegExp(characterRegex, 'g');

    angular
        .module('pds.common.filter')
        .filter('simplifyCharacters', ['_', function (_) {
            return function (val) {
                return val && val
                        .toLowerCase()
                        .replace(regExp, function (match) {
                            return CHARACTER_MAP[match];
                        });
            }
        }])

})(angular);

(function(angular) {
    angular
        .module('pds.common.route')
        .config(RouteConfig);

    RouteConfig.$inject = ['$stateProvider', '$locationProvider', 'config'];

    function RouteConfig($stateProvider, $locationProvider, config) {
        $locationProvider.html5Mode(true);
        $stateProvider.pdsRoute = function (route) {
            route.url = urlPath(route.url);
            route.templateUrl = htmlPath(route.templateUrl);
            $stateProvider.state(route);
        };

        function urlPath(path) {
            return config.pdsPathPrefix + '/' + path;
        }

        function htmlPath(path) {
            return config.pdsTemplatePath + '/' + path;
        }
    }
})(angular);

(function (angular) {
    angular
        .module('pds.common.service')
        .service('SpinnerService', SpinnerService);

    SpinnerService.$inject = ['$http'];

    function SpinnerService($http) {
        var self = this;

        self.isLoading = function () {
            return $http.pendingRequests.length > 0;
        }

    }

})(angular);

(function (angular) {
    angular.module('pds.catalog.route', ['pds.common.route', 'ui.router', 'ncy-angular-breadcrumb']);
    angular.module('pds.catalog.service', ['pds.common.filter']);
    angular.module('pds.catalog.config', ['pds.environment', 'ngResource', 'pds.common.config']);
    angular.module('pds.catalog.controller', ['ngSanitize', 'datatables', 'hl.sticky', 'dcbImgFallback', 'slickCarousel', 'pds.catalog.service', 'pds.catalog.directive', 'pds.navigation.service']);
    angular.module('pds.catalog.model', []);
    angular.module('pds.catalog.factory', ['pds.catalog.service']);
    angular.module('pds.catalog.directive', []);
    angular.module('pds.catalog', ['pds.catalog.controller', 'pds.catalog.route', 'pds.catalog.service', 'pds.catalog.config', 'pds.catalog.model']);
})(angular);

(function (angular) {
  angular.module('pds.navigation.route', ['ui.router']);
  angular.module('pds.navigation.service', ['pds.navigation.model', 'pds.common.service']);
  angular.module('pds.navigation.config', []);
  angular.module('pds.navigation.controller', ['pds.navigation.service', 'pds.common.service']);
  angular.module('pds.navigation.model', []);
  angular.module('pds.navigation.directive', []);
  angular.module('pds.navigation', ['pds.navigation.controller', 'pds.navigation.route', 'pds.navigation.service', 'pds.navigation.config', 'pds.navigation.model']);
})(angular);

(function (angular) {
  angular.module('pds.search.route', ['pds.common.route', 'ui.router']);
  angular.module('pds.search.service', ['pds.navigation.model', 'pds.common.config']);
  angular.module('pds.search.config', []);
  angular.module('pds.search.controller', ['pds.search.service', 'ui.bootstrap']);
  angular.module('pds.search.model', []);
  angular.module('pds.search.directive', []);
  angular.module('pds.search', ['pds.search.controller', 'pds.search.route', 'pds.search.service', 'pds.search.config', 'pds.search.model']);
})(angular);

(function (angular) {
    angular
        .module('pds.catalog.config')
        .config(['$httpProvider', HttpConfig]);

    function HttpConfig($httpProvider) {
        $httpProvider.interceptors.push(['$q', '$injector', function ($q, $injector) {
            return {
                responseError: function(rejection) {
                    $injector.get('$state').go('error');
                    return $q.reject(rejection);
                }
            }
        }]);
    }

})(angular);

(function (angular) {
    angular
        .module('pds.catalog.config')
        .config(['$sceDelegateProvider', SceConfig]);

    function SceConfig($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'https://pds-bosch-tt.kittelberger.net/**',
            'https://ss-bosch-tt.kittelberger.net/**',
            'https://mycliplister.com/**'
        ]);
    }

})(angular);

(function (angular) {
    angular
        .module('pds.catalog.controller')
        .controller('BreadcrumbController', BreadcrumbController);

    BreadcrumbController.$inject = ['$scope', 'BreadcrumbService'];

    function BreadcrumbController($scope, BreadcrumbService) {
        var vm = this;

        $scope.$on('pds.breadcrumb.update', function (event, params) {
            BreadcrumbService
                .build(params.categoryId)
                .then(function (res) {
                    vm.breadcrumbs = res;
                    if (_.last(vm.breadcrumbs).type == 'product_details') {
                        angular.element('#nav-breadcrumbs').addClass('dark-breadcrumb');
                    }
                });
        });
    }

})(angular);

(function (angular) {

    angular
        .module('pds.catalog.controller')
        .controller("CatalogController", CatalogController);

    CatalogController.$inject = ['$scope', '$rootScope', 'urlParserService', '_', 'MetaService'];

    function CatalogController($scope, $rootScope, urlParserService, _, MetaService) {
        var vm = this;
        var PRODUCT_COUNT_LAYOUT_BREAKPOINT = 4;
        vm.catalogId = urlParserService.getCatalogId();
        vm.anyProductHasValue = anyProductHasValue;
        vm.tableDefinitionContains = tableDefinitionContains;
        vm.responsiveChange = responsiveChange;

        MetaService.updateMetaByCategory(vm.catalogId);
        $rootScope.$broadcast('pds.breadcrumb.update', {catalogId: vm.catalogId});

        $scope.$on('pds.catalog.loaded', function (event, params) {
            return initCatalog(params.catalog);
        });

        $scope.$on('pds.catalog.loaded', function () {
            angular
                .element('#nav-primary-collapse')
                .find('li')
                .removeClass('active');
            angular
                .element('#ocs-nav')
                .addClass('active');
        });

        function initCatalog(catalog) {
            vm.catalog = catalog;
            if (_.get(vm.catalog, 'redirectCategory.id') > 0) {
                return CatalogService.redirectTo(vm.catalog.redirectCategory.id.value);
            }
            vm.catalog.energyEfficiency = vm.catalog.energyEfficiency || {};
            var technicalDataTable = vm.catalog.technicalDataTable();
            if (technicalDataTable) {
                var tableDefinition = technicalDataTable.tableDefinition;
                technicalDataTable.tableDefinition = _
                    .chain(tableDefinition)
                    .filter(function(attr) {
                        return technicalDataTable.showAttributesWithNoValues || anyProductHasValue(technicalDataTable.products, attr);
                    })
                    .filter(isNotHeaderAttribute.bind(this, technicalDataTable.products))
                    .value();
                vm.responsiveChange();
            }
        }

        function isNotHeaderAttribute(products, attr) {
            return !isHeaderAttribute(products, attr);
        }

        function isHeaderAttribute(products, attr) {
            return _.some(products, function (product) {
                return product.header.key == attr.key;
            });
        }

        function anyProductHasValue(products, attribute) {
            return _.some(products, attribute.key);
        }

        function tableDefinitionContains(definition, key) {
            return _.some(definition, {key: key});
        }

        function responsiveChange(e, table, columns) {
            var technicalDataTable = vm.catalog.technicalDataTable();
            technicalDataTable.partitions = _.chunk(technicalDataTable.products, _.every(columns) ? PRODUCT_COUNT_LAYOUT_BREAKPOINT : Number.POSITIVE_INFINITY);
        }
    }

})(angular);

(function(angular) {
    angular
        .module('pds.catalog.controller')
        .controller("NewProductController", NewProductController);

    NewProductController.$inject = ['CatalogService', '_'];

    function NewProductController(catalogService, _) {
        var vm = this;

        vm.productsLoaded = false;
        vm.slickSettings = {
            "arrows": false,
            "dots": true,
            "infinite": false,
            "speed": 1000,
            "cssEase": "ease-in-out",
            "slidesToShow": 4,
            "slidesToScroll": 4,
            "responsive": [
                {
                    "breakpoint": 992,
                    "settings": {
                        "slidesToShow": 2,
                        "slidesToScroll": 2
                    }
                },
                {
                    "breakpoint": 768,
                    "settings": {
                        "slidesToShow": 1,
                        "slidesToScroll": 1
                    }
                }
            ]
        };

        catalogService
            .getNewProductFamilies()
            .then(function (result) {
                vm.productFamilies = result;
                vm.productsLoaded = true;
            });
    }
})(angular);

(function (angular) {
    var VALUE_TEMPLATE = '<span>{{value.value || \'-\'}}</span>';
    var IMAGE_MEDIA_TEMPLATE = '<img ng-src="{{value.value}}" alt="{{alt.value}}" title="{{title.value}}"/>';
    var OTHER_MEDIA_TEMPLATE = '<span><a ng-href="{{value.value | imageUrl}}" title="{{title.value}}" target="_blank"><span translate="DOWNLOAD.NOW"></span>&nbsp;<i class="glyphicon glyphicon-download-alt"></i></a></span>';
    var LIST_TEMPLATE = '<span ng-repeat="el in value.value">{{el + (!$last ? ", ": "")}}</span>';
    var IMAGE_EXTENSIONS = ['.jpg', '.png', '.jpeg', '.gif'];
    var DOT = '.';

    var templateStrategy = [
        {
            isApplicable: function (val, type) {
                return type && type.toLowerCase() == 'string' && IMAGE_EXTENSIONS.indexOf(val.slice(val.lastIndexOf(DOT))) >= 0;
            },
            template: IMAGE_MEDIA_TEMPLATE
        },
        {
            isApplicable: function (val, type) {
                return type && type.toLowerCase() == 'asset';
            },
            template: OTHER_MEDIA_TEMPLATE
        },
        {
            isApplicable: function (val, type) {
                return type && type.toLowerCase() == 'list';
            },
            template: LIST_TEMPLATE
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

(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('catalogTemplate', ['CatalogService', '$rootScope', '_' ,function (CatalogService, $rootScope, _) {
            return {
                restrict: 'EA',
                scope: {
                    catalogId: '='
                },
                transclude: true,
                template: '<div class="catalog-template" ng-transclude></div>',
                link: function (scope, element, attrs, ctrl) {
                    scope.$watch('catalogId', function (val) {
                        val && CatalogService
                            .getTemplate(val)
                            .then(function (catalog) {
                                scope.$catalog = catalog;
                                $rootScope.$broadcast('pds.catalog.loaded', {catalog: catalog});
                            });
                    });
                }
            }
        }]);

})(angular);

(function (angular, $) {
    angular
        .module('pds.catalog.directive')
        .directive('equalizeTeaserHeight', ['$timeout', EqualizeTeaserHeight]);

    function EqualizeTeaserHeight($timeout) {
        return {
            restrict: 'EA',
            controller: ['$scope', '$element', '$attrs', function (scope, element, attrs) {
                if (scope.$last) {
                    $timeout(function() {
                        var maxHeight = 0;
                        var cardBlock = $(".card .card-block");

                        $(cardBlock).each(function() {
                            if ($(this).height() > maxHeight) {
                                maxHeight = $(this).height();
                            }
                        });

                        $(cardBlock).height(maxHeight);
                    }, 0);
                }
            }]
        }
    }

})(angular, jQuery);

(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('ocsBreadcrumb', OcsBreadcrumb);

    var crumbTemplate = "<li ng-repeat=\"crumb in $breadcrumbs\" ng-class=\"{'active': $last}\">"
            + "<a ocs-navigate=\"crumb.id\">{{crumb.name}}</a>"
        + "</li>";

    function OcsBreadcrumb() {
        return {
            restrict: 'EA',
            scope: {
                ocsNavigate: '='
            },
            controller: ['$scope', '$compile', 'BreadcrumbService', '_', BreadcrumbController]
        }
    }

    function BreadcrumbController($scope, $compile, BreadcrumbService, _) {
        $scope.$on('pds.breadcrumb.update', function (event, params) {
            BreadcrumbService
                .build(params.catalogId)
                .then(function (res) {
                    $scope.$breadcrumbs = res || {};
                    var breadcrumbs = $compile(crumbTemplate)($scope);
                    var breadcrumbsContainer = angular.element('#nav-breadcrumbs');
                    breadcrumbsContainer.find('.dropdown-menu').append(breadcrumbs);

                    //TODO Move this stuff, but where.......................................................................
                    if (_.last($scope.$breadcrumbs).type == 'PRODUCT_FAMILY') {
                        breadcrumbsContainer.addClass('dark-breadcrumb');
                    }

                    breadcrumbsContainer
                        .find('.dropdown-toggle')
                        .text(_.last($scope.$breadcrumbs).name);
                });
        });
    }

})(angular);

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

(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('ocsNavigate', OcsNavigateDirective);

    OcsNavigateDirective.$inject = ['CatalogService'];

    function OcsNavigateDirective(CatalogService) {
        return {
            restrict: 'EA',
            scope: {
                ocsNavigate: '='
            },
            controller: ['$scope', '$element', '$attrs', function (scope, element, attrs) {
                scope.$watch('ocsNavigate', function (val) {
                    val && CatalogService
                        .resolveUriFromHierarchy(val)
                        .then(function (uri) {
                            element.attr('href', uri);
                        });
                    element.filter(function (idx, el) {
                        return !$(el).attr('target');
                    })
                    .attr('target', '_self');
                })
            }]
        }
    }

})(angular);

(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('scrollableTableCard', ScrollableTableCard);

    function ScrollableTableCard() {
        return {
            restrict: 'EA',
            controller: ['$scope', '$element', '$attrs', function (scope, element, attrs) {
                $('.fs-table-scrollable .js-slick-slider').each(function() {
                    var $thisTable = $(this);
                    var viewportWidth = $(window).width();
                    var tableSliderElements = $thisTable.find(".card");
                    var tableSliderElementsAmount = $(tableSliderElements).length;

                    //desktop
                    if (viewportWidth > 991) {
                        if (tableSliderElementsAmount < 3) {
                            $thisTable.addClass("js-full-width-slick-track");
                        } else {
                            $thisTable.removeClass("js-full-width-slick-track");
                        }
                    }

                    //tablet
                    if ((viewportWidth < 992) && (viewportWidth > 767)) {
                        if (tableSliderElementsAmount < 2) {
                            $thisTable.addClass("js-full-width-slick-track");
                        } else {
                            $thisTable.removeClass("js-full-width-slick-track");
                        }
                    }

                });
                if (scope.$last) {
                    //scrollable table slider-wrapper instance
                    var tableSlider = $(".fs-table-scrollable .scrollable-table-wrapper");

                    //scrollable table slider-wrapper instance (element)
                    var tableSliderElement = $(tableSlider).find(".card");


                    if (tableSlider.length > 0) {

                        //loop through ALL available Table-Elements
                        $(tableSliderElement).each(function() {
                            var $thisElement = $(this);

                            //add table-row-[row-count]-class to ALL Table-Elements
                            $thisElement.find("tr").each(function(i) {
                                var $thisRow = $(this);
                                $thisRow.addClass("table-row-" + (i + 1));
                            });

                        });

                        //function to equalize table rows
                        var equalHeightsRow = function() {

                            //loop through all table sliders
                            $(tableSlider).each(function() {
                                var $thisSlider = $(this);
                                var rowsCount = $(this).find(".card:first-of-type tr").length;

                                //loop through amount of table rows in table element
                                var i;
                                for (i = 1; i <= rowsCount; i++) {

                                    var $thisSliderRows = $(this).find("tr.table-row-" + i);
                                    var maxHeight = 0;

                                    $thisSliderRows.each(function() {
                                        if ($(this).height() > maxHeight) {
                                            maxHeight = $(this).height();
                                        }
                                    });

                                    $thisSliderRows.height(maxHeight);

                                }

                            });

                        }

                        var resetHeightsRow = function() {
                            //reset heights for window change
                            $(".fs-table-scrollable .scrollable-table-wrapper .card tr").height(0);
                        }
                        resetHeightsRow();
                        equalHeightsRow();
                    }
                }
            }]
        }
    }

})(angular);

(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('navLang', SwitchLanguage);

    SwitchLanguage.$inject = ['urlParserService', 'CatalogService', 'locale', '$window'];

    function SwitchLanguage(urlParserService, catalogService, locale, $window) {
        return {
            restrict: 'EAC',
            controller: ['$scope', '$element', '$attrs', function (scope, element, attrs) {
                if (urlParserService.isOCS()) {
                    element
                        .children('li')
                        .each(function (index, el) {
                            var link = angular.element(el).children('a');

                            link.click(function (e) {
                                e.preventDefault();
                                var language = link.children('span').text().toLowerCase();
                                var newLocale = locale.toString().replace(locale.language, language);
                                catalogService
                                    .resolveUriFromHierarchy(catalogService.getIdFromLocation(), newLocale)
                                    .then(function (uri) {
                                        $window.location.href = urlParserService.setLanguage(uri, language);
                                    });
                            });
                        });
                }
            }]
        }
    }

})(angular);

(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('synchronizeHeight', SynchronizeHeight);

    SynchronizeHeight.$inject = ['$timeout'];

    function SynchronizeHeight($timeout) {
        return {
            restrict: 'EA',
            link: function (scope, element, attrs) {
                $timeout(function () {
                    angular
                        .element(document)
                        .find('.card.card-column table tr')
                        .eq(scope.$index + 1)
                        .css('height', element.css('height'));
                }, 500);
            }
        }
    }

})(angular);

(function (angular) {

    angular
        .module('pds.catalog.factory')
        .factory('urlBuilder', UrlBuilder);

    UrlBuilder.$inject = ['$injector'];

    function UrlBuilder($injector) {
        return $injector.get('seoFriendlyUrlBuilder');
    }
})(angular);

(function (angular) {
    angular
        .module('pds.catalog.model')
        .factory('CatalogHelper', CatalogHelper);

    function CatalogHelper() {
        this.toView = function (catalog) {
            catalog.description = catalog.descriptionLong;
            catalog.title = catalog.descriptionShort;
            catalog.image = catalog.keyVisual || catalog.productimage;
            catalog.showImage = function () {
                return !!catalog.keyVisual;
            };
            catalog.showTiles = function () {
                return catalog.isRootCatalog() || catalog.isSubCatalog();
            };
            catalog.tiles = _.map(catalog.children, function (child) {
                return {
                    id: child.id,
                    name: child.name,
                    title: child.headline,
                    description: child.descriptionShort,
                    image: child.categoryImage
                }
            });
            catalog.showList = catalog.isLeafCatalog;
            catalog.list = _.map(catalog.children, function (child) {
                return {
                    id: child.id,
                    name: child.name,
                    title: child.productname,
                    image: child.productcategoryimage,
                    new: child.new,
                    bullets: _.has(child, 'highlightCatOverview.value.elements') && child.highlightCatOverview.value.elements

                }
            });
            catalog.showTeaser = catalog.isProductFamily;
            catalog.new = catalog.neuheitOcs;
            catalog.newImage = '/media/new.png';
            catalog.name = catalog.headline || catalog.productname;
            catalog.energyEfficiency = {
                image: catalog.mainErpLabel
            };
            catalog.showTechnicalInformation = function () {
                return _.has(catalog, 'highlights.value.elements') && catalog.highlights.value.elements.length;
            };
            catalog.technicalInformation = _.has(catalog, 'highlights.value.elements')  && catalog.highlights.value.elements;
            catalog.showMoreDetails = function () {
                return _.size(catalog.subheadlines) > 0;
            };
            catalog.subheadlines = (function (catalog) {
                var i = 1;
                var subheadline = catalog.detailsSubheadline1;
                var description = catalog.detailsDescription1;
                var image = catalog.detailsImage1;
                var subheadlines = [];
                while(subheadline != null || description != null) {
                    subheadlines.push({title: subheadline && subheadline.value, description: description && description.value, image: image && image.value});
                    i++;
                    description = catalog['detailsDescription' + i];
                    subheadline = catalog['detailsSubheadline' + i];
                    image = catalog['detailsImage' + i];
                }
                return subheadlines;
            })(catalog);
            catalog.moreDetails = {
                title: catalog.headlineOverview,
                elements: catalog.subheadlines
            };

            catalog.showTechnicalTable = function () {
                return catalog.productTableDefinition && catalog.children; //FIXME Take logic from controller, Make this customizable
            };
            catalog.showFootnotes = function () {
                return catalog.footnotesTechData;
            };
            catalog.footnotes = catalog.footnotesTechData;
            return catalog;
        };

        this.toTemplateView = function (template) {
            return template;
        };

        function findSection(sections, name) {
            return _.find(sections, {name: name});
        }

        return this;
    }

})(angular);

(function(angular) {
    angular
        .module('pds.catalog.model')
        .config(CatalogConfig);

    CatalogConfig.$inject = ['env', 'CatalogProvider'];

    function CatalogConfig(env, catalogModelProvider) {
        catalogModelProvider
            .productDataServiceEndPoint(env.endPoint.productDataService)
            .contentServiceEndPoint(env.endPoint.contentService);
    }

})(angular);

(function (angular) {
    angular
        .module('pds.catalog.model')
        .provider('Catalog', function CatalogProvider() {
            var pdsUrl = null;
            var csUrl = null;

            this.productDataServiceEndPoint = function (value) {
                pdsUrl = value;
                return this;
            };

            this.contentServiceEndPoint = function (value) {
                csUrl = value;
                return this;
            };

            this.$get = ['$resource', '$cacheFactory', 'locale', '$http', '_', 'CatalogHelper', function ($resource, $cacheFactory, locale, $http, _, CatalogHelper) {
                return new Catalog($resource, $cacheFactory, locale, pdsUrl, csUrl, $http, _, CatalogHelper);
            }];
        });

    function Catalog($resource, $cacheFactory, locale, pdsUrl, csUrl, $http, _, catalogHelper) {
        var catalogCache = $cacheFactory("catalog");
        var customTransformations = [redirectChildren];
        var transformations = $http.defaults.transformResponse.concat(customTransformations);
        var transformResponse = function (data, headers, status) {
            var result = data;
            _.each(transformations, function (t) {
                result = t(result, headers, status);
            });
            return result;
        };
        var CatalogResource = $resource(pdsUrl + ':locale/:type/:queryType/:id', null, {
                get: {
                    method: 'GET',
                    params: {locale: locale, queryType: 'id'},
                    cache: catalogCache,
                    transformResponse: function (data, headers, status) {
                        return toCatalogView(transformResponse(data, headers, status))
                    }
                },
                query: {
                    method: 'GET',
                    isArray: true,
                    params: {locale: locale},
                    cache: catalogCache
                },
                template: {
                    method: 'POST',
                    url: csUrl + 'rest/document/display',
                    transformResponse: function (data, headers, status) {
                        return toCatalogTemplateView(transformResponse(data, headers, status));
                    }
                }
            }
        );

        function redirectChildren(data, headers, status) {
            data.children = _.map(data.children, function (child) {
                return child.redirectCategory ? child.redirectCategory : child;
            });
            return data;
        }

        function toCatalogView(catalog) {
            return catalogHelper.toView(catalog);
        }

        function toCatalogTemplateView(catalog) {
            return catalogHelper.toTemplateView(catalog);
        }

        CatalogResource.prototype.isLeafCatalog = function () {
            return this.getType() == 'leaf_category';
        };

        CatalogResource.prototype.isProductFamily = function () {
            return this.getType() == 'product_family';
        };

        CatalogResource.prototype.isSubCatalog = function () {
            return this.getType() == 'sub_category';
        };

        CatalogResource.prototype.isRootCatalog = function () {
            return this.getType() == 'root_category';
        };

        CatalogResource.prototype.getType = function() {
            return this.type ? this.type.value.toLowerCase() : String();
        };

        CatalogResource.prototype.technicalDataTable = function () {
            var section = _.find(this.sections, {name: 'TECHNICAL_DATA_TABLE'});
            return section && section.params;
        };

        CatalogResource.fallbackType = function () {
            return 'PRODUCT_FAMILY';
        };

        return CatalogResource;
    }

})(angular);

(function(angular) {
    angular
        .module('pds.catalog.route')
        .config(RouteConfig);

    RouteConfig.$inject = ['$stateProvider'];

    function RouteConfig($stateProvider) {
        $stateProvider.pdsRoute({
            name: 'catalog',
            url: '{catUrl:.*-[cp][/]?}',
            templateUrl: 'catalog3.html',
            controller: 'CatalogController as vm',
            resolve: {
                redirect: ['MetaService', function (metaService) {
                    return metaService.redirectOnInvalidUrl();
                }]
            }
        });
    }
})(angular);

(function(angular) {
    angular
        .module("pds.catalog.service")
        .service("BreadcrumbService", BreadcrumbService);

    BreadcrumbService.$inject = ['CatalogService', '_', '$q'];

    function BreadcrumbService(CatalogService, _, $q) {
        return {
            build: build
        };

        function build(categoryId) {
            return CatalogService
                .travelUpNavigationHierarchy(categoryId)
                .then(decorateWithUrls)
                .then(function (tree) {
                    return _
                        .chain(tree)
                        .map(function (node) {
                            return {
                                id: node.id,
                                name: node.name,
                                url: node.url,
                                type: node.type
                            }
                        })
                        .reverse()
                        .value();
                });
        }

        function decorateWithUrls(tree) {
            return $q
                .all(_.map(tree, function (node) {
                    return CatalogService
                        .resolveUriFromHierarchy(node.id)
                        .then(function (url) {
                            node.url = url;
                        });
                }))
                .then(function () {
                    return tree;
                })
        }
    }

})(angular);

(function(angular) {
    angular
        .module("pds.catalog.service")
        .service("CatalogService", CatalogService);

    CatalogService.$inject = ['$window', 'Catalog', 'MenuService', 'SeoFriendlyUrlBuilder', 'catalogSearchListener', '_', '$q', 'locale'];

    function CatalogService($window, Catalog, menuService, SeoFriendlyUrlBuilder, catalogSearchListener, _, $q, locale) {
        var self = this;
        var productPrefix = 'p';
        var categoryPrefix = 'c';

        catalogSearchListener
            .listen()
            .then(function (params) {
                return resolveUriFromHierarchy(params.target.resourceId);
            })
            .then(function (uri) {
                $window.location.href = uri;
            });

        return {
            getByTag: getByTag,
            getNewProductFamilies: getNewProductFamilies,
            getById: getById,
            getTemplate: getTemplate,
            getByIdAndType: getByIdAndType,
            redirectTo: navigateTo,
            navigateTo: navigateTo,
            travelUpHierarchy: travelUpHierarchy,
            travelUpNavigationHierarchy: travelUpNavigationHierarchy,
            getIdFromLocation: getIdFromLocation,
            resolveUri: resolveUri,
            resolveUriFromHierarchy: resolveUriFromHierarchy,
            getProductFamily: getProductFamily
        };

        function getByTag(type, tag) {
            return Catalog.query({type: type, id: tag, queryType: 'tag'}).$promise;
        }

        function getNewProductFamilies() {
            return getByTag(Catalog.fallbackType(), "new");
        }

        function getById(categoryId) {
            return getTypeFromHierarchy(categoryId)
                .then(function (type) {
                    return Catalog.get({id: categoryId, type: type}).$promise;
                });
        }

        function getTemplate(catalogId) {
            return getTypeFromHierarchy(catalogId)
                .then(function (type) {
                    var catalog = new Catalog({
                        template: {name: type},
                        model: {
                            locale: locale.toString(),
                            channel: getOCSChannel(),
                            catalogRequest: {
                                id: catalogId,
                                channel: getOCSChannel(),
                                type: type
                            }
                        }
                    });
                    return catalog.$template();
                });
        }

        function getOCSChannel() {
            return angular.element('meta[name="ocs-channel"]').attr('content')
        }

        function getByIdAndType(id, type) {
            return Catalog.get({id: id, type: type}).$promise;
        }

        function getTypeFromHierarchy(id) {
            return menuService
                .findInNavigation(id)
                .then(function (catalog) {
                    return catalog ? catalog.type : Catalog.fallbackType();
                });
        }

        function travelUpHierarchy(categoryId, tree) {
            tree = tree || [];
            return getById(categoryId)
                .then(function (data) {
                    tree.push({
                        id: data.id.value,
                        type: data.type.value,
                        name: data.name.value
                    });
                    if (data && data.parentId) {
                        return travelUpHierarchy(data.parentId.value, tree);
                    }
                    return tree;
                });
        }

        function travelUpNavigationHierarchy(categoryId, locale) {
            return menuService
                .findInNavigation(categoryId, locale)
                .then(function (item) {
                    var tree = [];
                    while(item != null) {
                        tree.push(item);
                        item = menuService.findParentInNavigation(item.id, locale);
                    }
                    return $q.all(tree);
                });
        }

        function navigateTo(id) {
            return resolveUri(id)
                .then(function (uri) {
                    $window.location.href = uri;
                });
        }

        function resolveUri(categoryId) {
            return travelUpHierarchy(categoryId).then(buildUri);
        }

        function buildUri(tree) {
            var builder = new SeoFriendlyUrlBuilder();
            _.forEachRight(tree, function (node) {
                var fragments = [node.name];
                if (tree.indexOf(node) == 0) {
                    fragments.push(node.id, categoryPrefix);
                }
                builder.addPath(fragments);

                if (node.type == Catalog.fallbackType()) {
                    builder.setPath([node.name, node.id, productPrefix]);
                }
            });
            return builder.build();
        }

        function resolveUriFromHierarchy(categoryId, locale) {
            return travelUpNavigationHierarchy(categoryId, locale).then(buildUri);
        }

        function getIdFromLocation(uri) {
            uri = uri || new URI().toString();
            var parts = uri.split('-');
            return parts[parts.length - 2];
        }

        function getProductFamily(product) {
            if (!product) {
                return $q.resolve(null);
            }
            var elements = product.parentId.value.elements || [product.parentId.value];
            return $q
                .all(_.map(elements, function (parentId) {
                    return menuService.findInNavigation(parentId) || {};
                }))
                .then(function (nodes) {
                    return _.find(nodes, function (node) {
                        return node.type === Catalog.fallbackType();
                    });
                });
        }
    }

})(angular);

(function (angular) {
    angular
        .module('pds.catalog.service')
        .service('MetaService', MetaService);

    MetaService.$inject = ['$rootScope', '$q', '$location', '$window', 'CatalogService', 'imageUrlFilter', 'config', 'urlParserService'];

    var TITLE_DELIMITER = ' | ';
    var LOCALE_DELIMITER = '-';
    var LOCALE_PROPER_DELIMITER = '_';
    var PATH_SEPARATOR = '/';

    function MetaService($rootScope, $q, $location, $window, CatalogService, imageUrlFilter, config, urlParserService) {

        return {
            updateMetaByCategory: updateMetaByCategory,
            redirectOnInvalidUrl: redirectOnInvalidUrl
        };

        function updateMetaByCategory(catalogId) {
            var excludeHreflangs = false;
            CatalogService
                .getTemplate(catalogId)
                .then(function (currentCatalog) {
                    return CatalogService
                        .travelUpNavigationHierarchy(catalogId)
                        .then(function (tree) {
                            tree[0] = currentCatalog;
                            return tree;
                        });
                })
                .then(function (tree) {
                    var q = $q.defer();
                    var currentNode = tree[0];
                    tree[0].name = tree[0].name.value;
                    var headerTitle = [];

                    for (var i = 0; i < tree.length; i++) {
                        if (tree[i] && tree[i].name) {
                            headerTitle.push(tree[i].name);
                        }
                    }
                    headerTitle.push(config.metaTags.siteName);

                    var image = (currentNode.keyVisual || currentNode.productimage || {}).value;
                    var event = {
                        title: headerTitle.join(TITLE_DELIMITER),
                        description: (currentNode.seoMetaText || currentNode.descriptionLong || currentNode.descriptionShort || {}).value,
                        image: image ? imageUrlFilter(image) : undefined,
                        siteName: config.metaTags.siteName,
                        webTrends: {
                            cg_s: tree[0] ? tree[0].name : null,
                            z_cg3: tree[1] ? tree[1].name : null,
                            z_cg4: tree[2] ? tree[2].name : null
                        },
                        canonicalUrl: $location.absUrl()
                    };

                    if (!(currentNode.blockCanonicalTag || {}).value) {
                        var canonicalRef = (currentNode.canonicalRef || {}).value;
                        if(canonicalRef) {
                            excludeHreflangs = canonicalRef != catalogId;
                            CatalogService
                                .resolveUriFromHierarchy(canonicalRef)
                                .then(function (url) {
                                    event.canonicalUrl = url;
                                    q.resolve(event);
                                });
                        } else {
                            q.resolve(event);
                        }
                    }

                    return q.promise;
                })
                .then(function (params) {
                    $rootScope.$broadcast('pds.header.update', params);
                })
                .then(function () {
                    if (excludeHreflangs) {
                        angular.element('link[hreflang]').remove();
                        return false;
                    }
                    angular
                        .element('link[hreflang]')
                        .each(function (index, link) {
                            var linkObject = angular.element(link);
                            var locale = linkObject.attr('hreflang');
                            locale = locale.split(LOCALE_DELIMITER);
                            CatalogService
                                .resolveUriFromHierarchy(catalogId, locale[0] + LOCALE_PROPER_DELIMITER + locale[1])
                                .then(function (url) {
                                    linkObject.attr('href', url.replace(/\/[a-z]{2}\/[a-z]{2}\//, PATH_SEPARATOR + locale[1].toLowerCase() + PATH_SEPARATOR + locale[0].toLowerCase()  + PATH_SEPARATOR));
                                    return !!url;
                                })
                                .then(function (result) {
                                    return result || linkObject.remove();
                                });
                        });
                });
        }

        function redirectOnInvalidUrl() {
            return CatalogService
                .resolveUriFromHierarchy(urlParserService.getCatalogId())
                .then(function (url) {
                    if (encodeURI(url) != URI().toString()) {
                        $window.location.href = url;
                    }
                })
        }
    }
})(angular);

(function (angular) {
    angular
        .module('pds.catalog.service')
        .service('catalogSearchListener', CatalogSearchListener);

    CatalogSearchListener.$inject = ['$rootScope', '$q', 'env'];

    function CatalogSearchListener($root, $q, env) {
        this.listen = function () {
            var def = $q.defer();
            $root.$on('pds.search.navigate', function (event, params) {
                if (params.target.channelDiscriminator == env.search.pdsChannelDiscriminator || params.target.resourceId) {
                    def.resolve(params);
                }
            });
            return def.promise;
        }
    }
})(angular);

(function (angular, URI) {
    angular
        .module('pds.catalog.service')
        .factory('SeoFriendlyUrlBuilder', SeoFriendlyUrlBuilderFactory);

    SeoFriendlyUrlBuilderFactory.$inject = ['$window', '_', 'simplifyCharactersFilter', 'config'];

    var fragmentSeparator = '-';
    var pathSeparator = '/';

    function SeoFriendlyUrlBuilderFactory($window, _, simplifyCharactersFilter, config) {
        function SeoFriendlyUrlBuilder(options) {
            this.path = buildBasePath();
            this.simplifyCharactersFilter = simplifyCharactersFilter;
            this.options = options || {};
        }

        SeoFriendlyUrlBuilder.prototype.addPath = function(fragments) {
            if (!fragments) {
                return this;
            }
            var args = _.compact([].concat(fragments));
            this.path += pathSeparator + this.simplifyCharactersFilter(args.join(fragmentSeparator));
            return this;
        };

        SeoFriendlyUrlBuilder.prototype.setPath = function (fragments) {
            this.path = buildBasePath();
            this.addPath(fragments);
            return this;
        };

        SeoFriendlyUrlBuilder.prototype.build = function () {
            return this.path + (config.urlSchema.trailingSlash ? '/' : '');
        };

        return SeoFriendlyUrlBuilder;

        function buildBasePath() {
            return URI().origin() + $window.getBasePath() + config.pdsPathPrefix;
        }
    }


})(angular, URI);

(function (angular) {

    angular
        .module('pds.catalog.service')
        .service('urlParserService', UrlParser);

    UrlParser.$inject = ['config'];

    var countryMatchIndex = 1;
    var languageMatchIndex = 2;
    var rootSegmentMatchIndex = 3;
    var catalogIdMatchIndex = 4;

                      /**  {1}{2}   {3}                                    {4}    **/
                      /** /ch/de/residential.html/qwe/asd/qwe/asd/poiuuy-134233-c **/
    var pathPattern = /^\/([a-z]{2})\/([a-z]{2})\/(?:ocs\/)?([^\/]*)(?:\.html)?\/(?:.*-([0-9]*)-[pc]\/?$)?/i;
    var languagePattern = /(\/[a-z]{2}\/)([a-z]{2})(.*)/i;

    function UrlParser(config) {
        this.config = config;
    }

    UrlParser.prototype.isOCS = function() {
        return !!this.getCatalogId();
    };

    UrlParser.prototype.getRootSegment = function getRootSegment() {
        return matchForIndex(rootSegmentMatchIndex) || this.config.metaTags.siteName;
    };

    UrlParser.prototype.getCatalogId = function () {
        return matchForIndex(catalogIdMatchIndex);
    };

    UrlParser.prototype.getLanguage = function () {
        return matchForIndex(languageMatchIndex);
    };

    UrlParser.prototype.setLanguage = function (url, language) {
        var uri = new URI(url);
        uri.path(uri.path().replace(languagePattern, '$1' + language + '$3'));
        return uri.toString();
    };

    function matchForIndex(index) {
        var match = new URI().path().match(pathPattern);
        return match && match[index];
    }

})(angular);

(function(angular) {
    angular
        .module("pds.navigation.controller")
        .controller("MenuController", MenuController);

    MenuController.$inject = ['MenuService', '_', 'config'];

    function MenuController(menuService, _, config) {
        var vm = this;
        vm.itemLimit = config.navigationMaxElements;
        vm.menu = vm.menu || {
            name: angular.element('#ocs-nav').children('a').text()
        };

        menuService
            .getMenu()
            .then(function(menu) {
                vm.menu = menu;
            });
    }
})(angular);

(function(angular) {
    angular
        .module('pds.navigation.model')
        .config(NavigationConfig);

    NavigationConfig.$inject = ['env', 'NavigationProvider'];

    function NavigationConfig(env, NavigationProvider) {
        NavigationProvider.navigationEndpoint(env.endPoint.contentService);
    }

})(angular);

(function (angular) {
    angular
        .module('pds.navigation.model')
        .provider('Navigation', function () {
            var url = null;

            this.navigationEndpoint = function (value) {
                url = value;
                return this;
            };

            this.$get = ['$resource', '$cacheFactory', function ($resource, $cacheFactory) {
                return new Navigation($resource, $cacheFactory, url);
            }]
        });

    function Navigation($resource, $cacheFactory, url) {
        var catalogCache = $cacheFactory("navigation");
        var methods = {
            get: {method: 'GET', cache: catalogCache}
        };
        return $resource(url + 'rest/document/display', null, methods);
    }
})(angular);

(function(angular) {
	angular
		.module("pds.navigation.service")
		.service("MenuService", MenuService);

	MenuService.$inject = ['urlParserService', '_', 'Navigation', 'locale', '$q'];

	function MenuService(urlParserService, _, Navigation, locale, $q) {
        var NAVIGATION_TEMPLATE_NAME = 'CATALOG_HIERARCHY';
        var self = this;
        self.currentLocale = locale.toString();
        self.flatNavigation = {};
        self.getMenu = getMenu;
        self.findInNavigation = findInNavigation;
        self.findParentInNavigation = findParentInNavigation;

		function getMenu(locale) {
            var properLocale = locale || self.currentLocale;
            var nav = new Navigation({
                template: {
                    name: NAVIGATION_TEMPLATE_NAME,
                    channel: getOCSChannel()
                },
                model: {
                    locale: properLocale,
                    channel: getOCSChannel()
                }
            });
			return Navigation
                .get({query: nav})
                .$promise
				.then(function (res) {
                    if(!res.root) {
                        return {};
                    }
                    return res.root.children[0];
				})
		}


        function getOCSChannel() {
            return angular.element('meta[name="ocs-channel"]').attr('content')
        }

		function getFlatMenu(locale) {
            return getMenu(locale)
                .then(function (menu) {
                    locale = locale || self.currentLocale;
                    self.flatNavigation[locale] = self.flatNavigation[locale] || flatMenu(menu);
                    return self.flatNavigation[locale];
                })
        }

        function flatMenu(menu, flat) {
            flat = flat || [];
            flat.push(menu);
            _.each(menu.children, function (item) {
                flatMenu(item, flat);
            });
            return flat;
        }

        function findInNavigation(id, locale) {
            return getFlatMenu(locale)
                .then(function(flat) {
                    return _.find(flat, {id: String(id)});
                });
        }

        function findParentInNavigation(childId, locale) {
            return _.find(self.flatNavigation[locale || self.currentLocale], function (val) {
                return !!_.find(val.children, {id: childId});
            });
        }
	}

})(angular);

(function(angular) {
    angular
        .module("pds.search.controller")
        .controller("QuicksearchController", QuicksearchController);

    QuicksearchController.$inject = ['$location', '$state', '$rootScope', 'SearchService', '$window'];

    function QuicksearchController($location, $state, $rootScope, SearchService, $window) {
        var vm = this;
        vm.suggest = suggest;
        vm.goTo = goTo;
        vm.doSearch = doSearch;

        //FIXME a hack to proceed to state `search` after entering search.html
        var path = $location.path();
        if (path && path.indexOf('search.html') > -1 && !$state.is('search')) {
            $state.go('search');
        }

        function suggest() {
            return SearchService
                .suggest(vm.quicksearch)
                .then(function(data) {
                    return vm.autosuggest = data;
                });
        }

        function goTo(target) {
            $rootScope.$broadcast('pds.search.navigate', {target: target});
        }

        function doSearch($item) {
            if (!$item || $item.which === 13) {
                $window.navigate('search.html?terms=' + vm.quicksearch);
            }
        }
    }
})(angular);

(function(angular) {
    angular
        .module("pds.search.controller")
        .controller("SearchController", SearchController);

    SearchController.$inject = ['$anchorScroll', 'SearchService', 'cmsSearchListener', '$rootScope', '$location', '$window', '_', 'translateFilter'];

    function SearchController($anchorScroll, SearchService, cmsSearchListener, $rootScope, $location, $window, _, translateFilter) {
        var vm = this;
        vm.finalSearchResults = [];
        vm.searchTerm = $location.search().terms;
        vm.contactText = translateFilter('SEARCH.NO.RESULT.CHECKLIST.3', {contactLink: "<a href='" + translateFilter('SEARCH.CONTACT.URL') + "' class='link-inline' target='_self'>" + translateFilter('SEARCH.CONTACT') + "</a>"});
        vm.onSearchInput = onSearchInput;
        vm.goToAnchor = goToAnchor;
        vm.goMore = goMore;

        cmsSearchListener
            .listen()
            .then(function (param) {
                $window.location.href = param.target.resourceLocation;
            });
        search();

        function search() {
            if (!vm.searchTerm) {
                return;
            }
            vm.totalLength = false;
            $location.search('terms', vm.searchTerm);

            return SearchService
                .search(vm.searchTerm)
                .then(function(data) {
                    vm.totalLength = data.length;
                    vm.finalSearchResults = _.groupBy(data, 'channelDiscriminator');
                });
        }

        function onSearchInput(keyEvent) {
            if (keyEvent.which === 13) {
                search();
            }
        }

        function goToAnchor(idToGo) {
            $location.hash(idToGo);
            $anchorScroll.yOffset = 80;
            $anchorScroll();
        }

        function goMore(param) {
            $rootScope.$broadcast('pds.search.navigate', {target: param});
        }
    }
})(angular);

(function(angular) {
    angular
        .module('pds.search.model')
        .config(SearchProvider);

    SearchProvider.$inject = ['env', 'SearchProvider'];

    function SearchProvider(env, SearchProvider) {
        SearchProvider.searchEndpoint(env.endPoint.searchService);
    }

})(angular);

(function (angular) {
    angular
        .module('pds.search.model')
        .provider('Search', function () {
            var url = null;

            this.searchEndpoint = function (value) {
                url = value;
                return this;
            };

            this.$get = ['$resource', 'locale', function ($resource, locale) {
                return new Search($resource, locale, url);
            }];
        });

    function Search($resource, locale, url) {
        var methods = {
            localize: {method: 'GET', isArray: true, params: {type: 'localize'}}
        };
        return $resource(url + '/resource/:type/:locale', {locale: locale}, methods);
    }
})(angular);

(function(angular) {
    angular
        .module('pds.search.route')
        .config(RouteConfig);

    RouteConfig.$inject = ['$stateProvider', 'config'];

    function RouteConfig($stateProvider, config) {
        $stateProvider.pdsRoute({
            name: 'search',
            params: {
                terms: null
            },
            templateUrl: 'search.html',
            controller: 'SearchController as vm'
        });
    }
})(angular);

(function (angular) {
    angular
        .module('pds.search.service')
        .service('cmsSearchListener', CmsSearchListener);

    CmsSearchListener.$inject = ['$rootScope', '$q', 'config'];

    function CmsSearchListener($root, $q, config) {
        this.listen = function () {
            var def = $q.defer();
            $root.$on('pds.search.navigate', function (event, params) {
                if (!!params.target.resourceLocation) {
                    def.resolve(params);
                }
            });
            return def.promise;
        }
    }
})(angular);

(function(angular) {
	angular
		.module("pds.search.service")
		.service("SearchService", SearchService);

	SearchService.$inject = ['$q', 'Search', 'locale'];

    var MIN_AUTOSUGGEST_TERM_LENGTH = 2;

    function SearchService($q, Search, locale) {
		return {
			search: search,
			suggest: suggest
		};

		function search(search) {
			return Search.query({locale: locale, searchTerm: search}).$promise;
		}

		function suggest(searchTerm) {
            if (searchTerm && searchTerm.length > MIN_AUTOSUGGEST_TERM_LENGTH) {
                return Search.localize({locale: locale, searchTerm: searchTerm}).$promise;
            }
			return $q.resolve([]);
		}

	}

})(angular);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbmZpZy5qcyIsImVudi5qcyIsImNvbW1vbi9jb21tb24ubW9kdWxlLmpzIiwiY29tbW9uL2NvbmZpZy9hbmNob3IuY29uZmlnLmpzIiwiY29tbW9uL2NvbmZpZy9pMThuLmNvbmZpZy5qcyIsImNvbW1vbi9jb25maWcvbG9jYWxlLmRpc2NvdmVyeS5qcyIsImNvbW1vbi9jb25maWcvbG9kYXNoLmZhY3RvcnkuanMiLCJjb21tb24vY29uZmlnL29jcy5jaGFubmVsLnByb3ZpZGVyLmpzIiwiY29tbW9uL2NvbmZpZy91cmwucGF0dGVybi5sb2NhbGUuZGlzY292ZXJ5Lm1ldGhvZC5qcyIsImNvbW1vbi9jb25maWcvd2luZG93LmRlY29yYXRvci5qcyIsImNvbW1vbi9jb250cm9sbGVyL2NvbnRlbnQuY29udHJvbGxlci5qcyIsImNvbW1vbi9jb250cm9sbGVyL2hlYWRlci5jb250cm9sbGVyLmpzIiwiY29tbW9uL2NvbnRyb2xsZXIvanNvbmxkLmNvbnRyb2xsZXIuanMiLCJjb21tb24vZGlyZWN0aXZlL2NsaXBsaXN0ZXIuZGlyZWN0aXZlLmpzIiwiY29tbW9uL2RpcmVjdGl2ZS9qc29ubGQuZGlyZWN0aXZlLmpzIiwiY29tbW9uL2RpcmVjdGl2ZS9zaW1wbGUuc3VibWVudS5kaXJlY3RpdmUuanMiLCJjb21tb24vZmlsdGVyL2NvbnZlcnQud2hpdGVzcGFjZXMuZmlsdGVyLmpzIiwiY29tbW9uL2ZpbHRlci9pbWFnZS51cmwuZmlsdGVyLmpzIiwiY29tbW9uL2ZpbHRlci9zaW1wbGlmeS5jaGFyYWN0ZXJzLmZpbHRlci5qcyIsImNvbW1vbi9yb3V0ZS9yb3V0ZS5jb25maWcuanMiLCJjb21tb24vc2VydmljZS9zcGlubmVyLnNlcnZpY2UuanMiLCJkb21haW4vY2F0YWxvZy9jYXRhbG9nLm1vZHVsZS5qcyIsImRvbWFpbi9uYXZpZ2F0aW9uL25hdmlnYXRpb24ubW9kdWxlLmpzIiwiZG9tYWluL3NlYXJjaC9zZWFyY2gubW9kdWxlLmpzIiwiZG9tYWluL2NhdGFsb2cvY29uZmlnL2h0dHAuaW50ZXJjZXB0b3IuY29uZmlnLmpzIiwiZG9tYWluL2NhdGFsb2cvY29uZmlnL3Nhbml0aXplLmNvbmZpZy5qcyIsImRvbWFpbi9jYXRhbG9nL2NvbnRyb2xsZXIvYnJlYWRjcnVtYi5jb250cm9sbGVyLmpzIiwiZG9tYWluL2NhdGFsb2cvY29udHJvbGxlci9jYXRhbG9nLmNvbnRyb2xsZXIuanMiLCJkb21haW4vY2F0YWxvZy9jb250cm9sbGVyL25ldy1wcm9kdWN0LmNvbnRyb2xsZXIuanMiLCJkb21haW4vY2F0YWxvZy9kaXJlY3RpdmUvYXR0cmlidXRlLnZhbHVlLmRpcmVjdGl2ZS5qcyIsImRvbWFpbi9jYXRhbG9nL2RpcmVjdGl2ZS9jYXRhbG9nLnRlbXBsYXRlLmRpcmVjdGl2ZS5qcyIsImRvbWFpbi9jYXRhbG9nL2RpcmVjdGl2ZS9lcXVhbGl6ZS50ZWFzZXIuaGVpZ2h0LmRpcmVjdGl2ZS5qcyIsImRvbWFpbi9jYXRhbG9nL2RpcmVjdGl2ZS9vY3MuYnJlYWRjcnVtYi5kaXJlY3RpdmUuanMiLCJkb21haW4vY2F0YWxvZy9kaXJlY3RpdmUvb2NzLmRhdGEudGFibGUuZGlyZWN0aXZlLmpzIiwiZG9tYWluL2NhdGFsb2cvZGlyZWN0aXZlL29jcy5uYXZpZ2F0ZS5kaXJlY3RpdmUuanMiLCJkb21haW4vY2F0YWxvZy9kaXJlY3RpdmUvc2Nyb2xsYWJsZS50YWJsZS5kaXJlY3RpdmUuanMiLCJkb21haW4vY2F0YWxvZy9kaXJlY3RpdmUvc3dpdGNoLmxhbmd1YWdlLmRpcmVjdGl2ZS5qcyIsImRvbWFpbi9jYXRhbG9nL2RpcmVjdGl2ZS9zeW5jaHJvbml6ZS5oZWlnaHQuZGlyZWN0aXZlLmpzIiwiZG9tYWluL2NhdGFsb2cvZmFjdG9yeS91cmwuYnVpbGRlci5mYWN0b3J5LmpzIiwiZG9tYWluL2NhdGFsb2cvbW9kZWwvY2F0YWxvZy5oZWxwZXIuanMiLCJkb21haW4vY2F0YWxvZy9tb2RlbC9jYXRhbG9nLm1vZGVsLmNvbmZpZy5qcyIsImRvbWFpbi9jYXRhbG9nL21vZGVsL2NhdGFsb2cucmVzb3VyY2UuanMiLCJkb21haW4vY2F0YWxvZy9yb3V0ZS9jYXRhbG9nLnJvdXRlLmNvbmZpZy5qcyIsImRvbWFpbi9jYXRhbG9nL3NlcnZpY2UvYnJlYWRjcnVtYi5zZXJ2aWNlLmpzIiwiZG9tYWluL2NhdGFsb2cvc2VydmljZS9jYXRhbG9nLnNlcnZpY2UuanMiLCJkb21haW4vY2F0YWxvZy9zZXJ2aWNlL21ldGEuc2VydmljZS5qcyIsImRvbWFpbi9jYXRhbG9nL3NlcnZpY2Uvc2VhcmNoLmxpc3RlbmVyLmpzIiwiZG9tYWluL2NhdGFsb2cvc2VydmljZS9zZW8uZnJpZW5kbHkudXJsLmJ1aWxkZXIuanMiLCJkb21haW4vY2F0YWxvZy9zZXJ2aWNlL3VybC5wYXJzZXIuc2VydmljZS5qcyIsImRvbWFpbi9uYXZpZ2F0aW9uL2NvbnRyb2xsZXIvbWVudS5jb250cm9sbGVyLmpzIiwiZG9tYWluL25hdmlnYXRpb24vbW9kZWwvbmF2aWdhdGlvbi5tb2RlbC5jb25maWcuanMiLCJkb21haW4vbmF2aWdhdGlvbi9tb2RlbC9uYXZpZ2F0aW9uLnJlc291cmNlLmpzIiwiZG9tYWluL25hdmlnYXRpb24vc2VydmljZS9tZW51LnNlcnZpY2UuanMiLCJkb21haW4vc2VhcmNoL2NvbnRyb2xsZXIvcXVpY2tzZWFyY2guY29udHJvbGxlci5qcyIsImRvbWFpbi9zZWFyY2gvY29udHJvbGxlci9zZWFyY2guY29udHJvbGxlci5qcyIsImRvbWFpbi9zZWFyY2gvbW9kZWwvc2VhcmNoLm1vZGVsLmNvbmZpZy5qcyIsImRvbWFpbi9zZWFyY2gvbW9kZWwvc2VhcmNoLnJlc291cmNlLmpzIiwiZG9tYWluL3NlYXJjaC9yb3V0ZS9zZWFyY2gucm91dGUuY29uZmlnLmpzIiwiZG9tYWluL3NlYXJjaC9zZXJ2aWNlL2Ntcy5zZWFyY2gubGlzdGVuZXIuanMiLCJkb21haW4vc2VhcmNoL3NlcnZpY2Uvc2VhcmNoLnNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJwZHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyLm1vZHVsZSgncGRzLmVudmlyb25tZW50JywgW10pO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdwcm9kdWN0LWRhdGEtc2VydmljZScsIFsncGRzLmNhdGFsb2cnLCAncGRzLm5hdmlnYXRpb24nLCAncGRzLmVudmlyb25tZW50JywgJ3Bkcy5zZWFyY2gnLCAncGRzLmNvbW1vbicsICd1aS5yb3V0ZXInLCAnbmdTYW5pdGl6ZSddKTtcbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uICgpIHsgXG4gcmV0dXJuIGFuZ3VsYXIubW9kdWxlKFwicGRzLmVudmlyb25tZW50XCIpXG4uY29uc3RhbnQoXCJjb25maWdcIiwge1xuICBcIm1ldGFUYWdzXCI6IHtcbiAgICBcInNpdGVOYW1lXCI6IFwiQnVkZXJ1c1wiXG4gIH0sXG4gIFwidXJsU2NoZW1hXCI6IHtcbiAgICBcInRyYWlsaW5nU2xhc2hcIjogZmFsc2VcbiAgfSxcbiAgXCJwZHNQYXRoUHJlZml4XCI6IFwiL29jc1wiLFxuICBcInBkc1RlbXBsYXRlUGF0aFwiOiBcIi9zcmMvaHRtbFwiLFxuICBcImZvcmNlTGFuZ3VhZ2VcIjogbnVsbCxcbiAgXCJzZWFyY2hcIjoge1xuICAgIFwiZGVmYXVsdEltYWdlXCI6IFwiZGVmYXVsdC1zZWFyY2hcIlxuICB9XG59KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7IFxuIHJldHVybiBhbmd1bGFyLm1vZHVsZShcInBkcy5lbnZpcm9ubWVudFwiKVxuLmNvbnN0YW50KFwiZW52XCIsIHtcbiAgXCJlbmRQb2ludFwiOiB7XG4gICAgXCJwcm9kdWN0RGF0YVNlcnZpY2VcIjogXCJodHRwczovL2RldjAyLnNhZ2l0b24ucGwvY2F0YWxvZy1zZXJ2aWNlLWRldi9cIixcbiAgICBcImNvbnRlbnRTZXJ2aWNlXCI6IFwiaHR0cHM6Ly9kZXYwMi5zYWdpdG9uLnBsL2NvbnRlbnQtc2VydmljZS1kZXYvXCIsXG4gICAgXCJzZWFyY2hTZXJ2aWNlXCI6IFwiaHR0cHM6Ly9zZXJ2aWNlcy5raXR0ZWxiZXJnZXIubmV0L3NlYXJjaC92MS9cIixcbiAgICBcIm9jc01lZGlhRW5kcG9pbnRcIjogXCJodHRwczovL2RldjAyLnNhZ2l0b24ucGwvYXNzZXQtc2VydmljZS1kZXYvYXNzZXQvXCJcbiAgfSxcbiAgXCJzZWFyY2hcIjoge1xuICAgIFwiY21zQ2hhbm5lbERpc2NyaW1pbmF0b3JcIjogXCJkZUNIQ21zRGlzY3JpbWluYXRvclwiLFxuICAgIFwicGRzQ2hhbm5lbERpc2NyaW1pbmF0b3JcIjogXCJidWRlcnVzUGRzRGlzY3JpbWluYXRvclwiXG4gIH1cbn0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5jb21tb24ucm91dGUnLCBbJ3VpLnJvdXRlcicsICduY3ktYW5ndWxhci1icmVhZGNydW1iJywgJ3Bkcy5lbnZpcm9ubWVudCddKTtcbiAgICBhbmd1bGFyLm1vZHVsZSgncGRzLmNvbW1vbi5zZXJ2aWNlJywgW10pO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdwZHMuY29tbW9uLmNvbmZpZycsIFsncGFzY2FscHJlY2h0LnRyYW5zbGF0ZSddKTtcbiAgICBhbmd1bGFyLm1vZHVsZSgncGRzLmNvbW1vbi5jb250cm9sbGVyJywgWyduZ0FuaW1hdGUnLCAnbmdTYW5pdGl6ZScsICdkYXRhdGFibGVzJywgJ2hsLnN0aWNreScsICdkY2JJbWdGYWxsYmFjaycsICdzbGlja0Nhcm91c2VsJ10pO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdwZHMuY29tbW9uLm1vZGVsJywgW10pO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdwZHMuY29tbW9uLmZhY3RvcnknLCBbXSk7XG4gICAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5jb21tb24uZGlyZWN0aXZlJywgW10pO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdwZHMuY29tbW9uLmZpbHRlcicsIFsncGRzLmVudmlyb25tZW50J10pO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdwZHMuY29tbW9uJywgWydwZHMuY29tbW9uLmNvbnRyb2xsZXInLCAncGRzLmNvbW1vbi5yb3V0ZScsICdwZHMuY29tbW9uLnNlcnZpY2UnLCAncGRzLmNvbW1vbi5jb25maWcnLCAncGRzLmNvbW1vbi5tb2RlbCddKTtcbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyLCAkKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY29tbW9uLmNvbmZpZycpXG4gICAgICAgIC5jb25maWcoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICQoJ2EnKVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChpZHgsIGVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gISQoZWwpLmF0dHIoJ3RhcmdldCcpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuYXR0cigndGFyZ2V0JywgJ19zZWxmJyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxufSkoYW5ndWxhciwgJCk7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIsIHdpbmRvdykge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNvbW1vbi5jb25maWcnKVxuICAgICAgICAuY29uZmlnKFsnJHRyYW5zbGF0ZVByb3ZpZGVyJywgZnVuY3Rpb24gKCR0cmFuc2xhdGVQcm92aWRlcikge1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5jbXNUcmFuc2xhdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAkdHJhbnNsYXRlUHJvdmlkZXJcbiAgICAgICAgICAgICAgICAgICAgLnRyYW5zbGF0aW9ucygndGhpcycsIHdpbmRvdy5jbXNUcmFuc2xhdGlvbnMpXG4gICAgICAgICAgICAgICAgICAgIC51c2VTYW5pdGl6ZVZhbHVlU3RyYXRlZ3koJ3Nhbml0aXplJylcbiAgICAgICAgICAgICAgICAgICAgLnByZWZlcnJlZExhbmd1YWdlKCd0aGlzJylcbiAgICAgICAgICAgICAgICAgICAgLnVzZSgndGhpcycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XSk7XG5cbn0pKGFuZ3VsYXIsIHdpbmRvdyk7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jb21tb24uY29uZmlnJylcbiAgICAgICAgLnByb3ZpZGVyKCdsb2NhbGUnLCBMb2NhbGVQcm92aWRlcik7XG5cblxuICAgIGZ1bmN0aW9uIExvY2FsZVByb3ZpZGVyKCkge1xuICAgICAgICB2YXIgZGlzY292ZXJ5TWV0aG9kcyA9IFtdO1xuXG4gICAgICAgIHRoaXMuYWRkRGlzY292ZXJ5TWV0aG9kID0gZnVuY3Rpb24gKG1ldGhvZCkge1xuICAgICAgICAgICAgZGlzY292ZXJ5TWV0aG9kcy5wdXNoKG1ldGhvZCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLiRnZXQgPSBbJ18nLCBmdW5jdGlvbiAoXykge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBMb2NhbGUoXywgZGlzY292ZXJ5TWV0aG9kcyk7XG4gICAgICAgIH1dO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIExvY2FsZShfLCBkaXNjb3ZlcnlNZXRob2RzKSB7XG4gICAgICAgIHZhciBtZXRob2QgPSBfLmZpbmQoZGlzY292ZXJ5TWV0aG9kcywgXy5hdHRlbXB0KTtcbiAgICAgICAgdmFyIHJlc3VsdCA9ICBtZXRob2QgPyBtZXRob2QoKSA6IFtdO1xuICAgICAgICB2YXIgY291bnRyeSA9IHJlc3VsdFsxXTtcbiAgICAgICAgdmFyIGxhbmd1YWdlID0gcmVzdWx0WzJdO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY291bnRyeTogY291bnRyeSxcbiAgICAgICAgICAgIGxhbmd1YWdlOiBsYW5ndWFnZSxcbiAgICAgICAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sYW5ndWFnZS50b0xvd2VyQ2FzZSgpICsgXCJfXCIgKyB0aGlzLmNvdW50cnkudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNvbW1vbi5jb25maWcnKVxuICAgICAgICAuZmFjdG9yeSgnXycsIFsnJHdpbmRvdycsIGZ1bmN0aW9uICgkd2luZG93KSB7XG4gICAgICAgICAgICByZXR1cm4gJHdpbmRvdy5fO1xuICAgICAgICB9XSk7XG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY29tbW9uLmNvbmZpZycpXG4gICAgICAgIC5mYWN0b3J5KCdvY3NDaGFubmVsJywgT2NzQ2hhbm5lbCk7XG5cbiAgICBmdW5jdGlvbiBPY3NDaGFubmVsKCkge1xuICAgICAgICByZXR1cm4gYW5ndWxhci5lbGVtZW50KCdtZXRhW25hbWU9XCJvY3MtY2hhbm5lbFwiXScpLmF0dHIoJ2NvbnRlbnQnKTtcbiAgICB9XG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNvbW1vbi5jb25maWcnKVxuICAgICAgICAuY29uZmlnKFsnbG9jYWxlUHJvdmlkZXInLCBmdW5jdGlvbiAobG9jYWxlUHJvdmlkZXIpIHtcbiAgICAgICAgICAgIHZhciBsb2NhbGVVcmxQYXR0ZXJuID0gL15cXC8oW2EtekEtWl17Mn0pXFwvKFthLXpBLVpdezJ9KS87XG4gICAgICAgICAgICBsb2NhbGVQcm92aWRlci5hZGREaXNjb3ZlcnlNZXRob2QoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsb2NhbGVVcmxQYXR0ZXJuLmV4ZWMobmV3IFVSSSgpLnBhdGgoKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfV0pO1xuXG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY29tbW9uLmNvbmZpZycpXG4gICAgICAgIC5kZWNvcmF0b3IoJyR3aW5kb3cnLCBbJyRkZWxlZ2F0ZScsIFdpbmRvd0RlY29yYXRvcl0pO1xuXG4gICAgZnVuY3Rpb24gV2luZG93RGVjb3JhdG9yKCRkZWxlZ2F0ZSkge1xuICAgICAgICAkZGVsZWdhdGUubmF2aWdhdGUgPSBmdW5jdGlvbiAodXJpKSB7XG4gICAgICAgICAgICBpZiAodXJpLmluZGV4T2YoJy8nKSAhPSAwKSB7XG4gICAgICAgICAgICAgICAgdXJpID0gJy8nLmNvbmNhdCh1cmkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJGRlbGVnYXRlLmxvY2F0aW9uLmhyZWYgPSBnZXRCYXNlUGF0aCgpICsgdXJpO1xuICAgICAgICB9O1xuICAgICAgICAkZGVsZWdhdGUuZ2V0QmFzZVBhdGggPSBmdW5jdGlvbiBnZXRCYXNlUGF0aCgpIHtcbiAgICAgICAgICAgIHZhciBiYXNlUGF0aCA9IGFuZ3VsYXIuZWxlbWVudCgnYmFzZScpLmF0dHIoJ2hyZWYtb3ZlcnJpZGUnKTtcblxuICAgICAgICAgICAgaWYgKCFiYXNlUGF0aClcbiAgICAgICAgICAgICAgICBiYXNlUGF0aCA9IGFuZ3VsYXIuZWxlbWVudCgnYmFzZScpLmF0dHIoJ2hyZWYnKTtcblxuICAgICAgICAgICAgaWYgKGJhc2VQYXRoLmxhc3RJbmRleE9mKCcvJykgPT0gKGJhc2VQYXRoLmxlbmd0aCAtIDEpKSB7XG4gICAgICAgICAgICAgICAgYmFzZVBhdGggPSBiYXNlUGF0aC5zbGljZSgwLCBiYXNlUGF0aC5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBiYXNlUGF0aDtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuICRkZWxlZ2F0ZTtcbiAgICB9XG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNvbW1vbi5jb250cm9sbGVyJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0NvbnRlbnRDb250cm9sbGVyJywgQ29udGVudENvbnRyb2xsZXIpO1xuXG4gICAgQ29udGVudENvbnRyb2xsZXIuJGluamVjdCA9IFsnU3Bpbm5lclNlcnZpY2UnXTtcblxuICAgIGZ1bmN0aW9uIENvbnRlbnRDb250cm9sbGVyKHNwaW5uZXJTZXJ2aWNlKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0uaXNTcGlubmluZyA9IHNwaW5uZXJTZXJ2aWNlLmlzTG9hZGluZztcbiAgICB9XG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY29tbW9uLmNvbnRyb2xsZXInKVxuICAgICAgICAuY29udHJvbGxlcignaGVhZGVyQ29udHJvbGxlcicsIEhlYWRlckNvbnRyb2xsZXIpO1xuXG4gICAgSGVhZGVyQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ2xvY2FsZScsICdjb25maWcnLCAnanNvbkZpbHRlcicsICdfJywgJ0JyZWFkY3J1bWJTZXJ2aWNlJ107XG4gICAgdmFyIGNvbnRlbnRHcm91cHMgPSBbJ1dULmNnX24nLCAnV1QuY2dfcycsICdXVC56X2NnMycsICdXVC56X2NnNCcsICdXVC56X2NnNScsICdXVC56X2NnNicsICdXVC56X2NnNycsICdXVC56X2NnOCcsICdXVC56X2NnOScsICdXVC56X2NnMTAnXTtcblxuICAgIGZ1bmN0aW9uIEhlYWRlckNvbnRyb2xsZXIoJHNjb3BlLCAkbG9jYXRpb24sIGxvY2FsZSwgY29uZmlnLCBqc29uRmlsdGVyLCBfLCBCcmVhZGNydW1iU2VydmljZSkge1xuICAgICAgICB2YXIgcm9vdENvbnRlbnRHcm91cCA9IHtuYW1lOiBjb25maWcubWV0YVRhZ3Muc2l0ZU5hbWV9O1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS51cmwgPSAkbG9jYXRpb24uYWJzVXJsKCk7XG4gICAgICAgIHZtLmxvY2FsZSA9IGxvY2FsZS50b1N0cmluZygpO1xuICAgICAgICB2bS5icmFuZCA9IGNvbmZpZy5tZXRhVGFncy5icmFuZDtcbiAgICAgICAgdm0uY291bnRyeSA9IGxvY2FsZS5jb3VudHJ5O1xuICAgICAgICB2bS5sYW5ndWFnZSA9IGxvY2FsZS5sYW5ndWFnZTtcblxuICAgICAgICAkc2NvcGUuJG9uKCdwZHMuaGVhZGVyLnVwZGF0ZScsIGZ1bmN0aW9uIChldmVudCwgcGFyYW1zKSB7XG4gICAgICAgICAgICB2bS50aXRsZSA9IHBhcmFtcy50aXRsZTtcbiAgICAgICAgICAgIHZtLmRlc2NyaXB0aW9uID0gcGFyYW1zLmRlc2NyaXB0aW9uO1xuICAgICAgICAgICAgdm0uaW1hZ2UgPSBwYXJhbXMuaW1hZ2U7XG4gICAgICAgICAgICB2bS53ZWJUcmVuZHMgPSBwYXJhbXMud2ViVHJlbmRzO1xuICAgICAgICAgICAgdm0uc2l0ZU5hbWUgPSBwYXJhbXMuc2l0ZU5hbWU7XG4gICAgICAgICAgICB2bS5jYW5vbmljYWxVcmwgPSBwYXJhbXMuY2Fub25pY2FsVXJsO1xuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuJG9uKCdwZHMuaGVhZGVyLnVwZGF0ZScsIGZ1bmN0aW9uIChldmVudCwgcGFyYW1zKSB7XG4gICAgICAgICAgICBidWlsZEpzb25MRCh7XG4gICAgICAgICAgICAgICAgXCJAY29udGV4dFwiOiBcImh0dHA6Ly9zY2hlbWEub3JnL1wiLFxuICAgICAgICAgICAgICAgIFwiQHR5cGVcIjogXCJQcm9kdWN0XCIsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCIgOiBwYXJhbXMudGl0bGUsXG4gICAgICAgICAgICAgICAgXCJpbWFnZVwiOiBwYXJhbXMuaW1hZ2UsXG4gICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBwYXJhbXMuZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgXCJicmFuZFwiOiBjb25maWcubWV0YVRhZ3Muc2l0ZU5hbWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuJG9uKCdwZHMuYnJlYWRjcnVtYi51cGRhdGUnLCBmdW5jdGlvbiAoZXZlbnQsIHBhcmFtcykge1xuICAgICAgICAgICAgQnJlYWRjcnVtYlNlcnZpY2VcbiAgICAgICAgICAgICAgICAuYnVpbGQocGFyYW1zLmNhdGFsb2dJZClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoYnJlYWRjcnVtYnMpIHtcbiAgICAgICAgICAgICAgICAgICAgYnVpbGRKc29uTEQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJAY29udGV4dFwiOiBcImh0dHA6Ly9zY2hlbWEub3JnL1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJAdHlwZVwiOiBcIkJyZWFkY3J1bWJMaXN0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIml0ZW1MaXN0RWxlbWVudFwiOiBfLm1hcChicmVhZGNydW1icywgZnVuY3Rpb24gKGNydW1iLCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdAdHlwZSc6ICdMaXN0SXRlbScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0BpZCc6IGNydW1iLnVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGNydW1iLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJlYWRjcnVtYnM7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihidWlsZENvbnRlbnRHcm91cHMpO1xuICAgICAgICB9KTtcblxuICAgICAgICBmdW5jdGlvbiBidWlsZEpzb25MRChtb2RlbCkge1xuICAgICAgICAgICAgYW5ndWxhclxuICAgICAgICAgICAgICAgIC5lbGVtZW50KCc8c2NyaXB0PicpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3R5cGUnLCAnYXBwbGljYXRpb24vbGQranNvbicpXG4gICAgICAgICAgICAgICAgLnRleHQoanNvbkZpbHRlcihtb2RlbCkpXG4gICAgICAgICAgICAgICAgLmFwcGVuZFRvKCdoZWFkJyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBidWlsZENvbnRlbnRHcm91cHModHJlZSkge1xuICAgICAgICAgICAgdHJlZS51bnNoaWZ0KHJvb3RDb250ZW50R3JvdXApO1xuICAgICAgICAgICAgXy5mb3JFYWNoKHRyZWUsIGZ1bmN0aW9uIChlbGVtZW50LCBpZHgpIHtcbiAgICAgICAgICAgICAgICBhZGRNZXRhKGNvbnRlbnRHcm91cHNbaWR4XSwgZWxlbWVudC5uYW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cblxuICAgICAgICBmdW5jdGlvbiBhZGRNZXRhKG5hbWUsIGNvbnRlbnQpIHtcbiAgICAgICAgICAgIGFuZ3VsYXJcbiAgICAgICAgICAgICAgICAuZWxlbWVudCgnbWV0YVtuYW1lPVwiJyArIG5hbWUgKyAnXCInKVxuICAgICAgICAgICAgICAgIC5yZW1vdmUoKTtcbiAgICAgICAgICAgIGFuZ3VsYXJcbiAgICAgICAgICAgICAgICAuZWxlbWVudCgnPG1ldGE+JylcbiAgICAgICAgICAgICAgICAuYXR0cignbmFtZScsIG5hbWUpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2NvbnRlbnQnLCBjb250ZW50KVxuICAgICAgICAgICAgICAgIC5hcHBlbmRUbygnaGVhZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNvbW1vbi5jb250cm9sbGVyJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ2pzb25MZENvbnRyb2xsZXInLCBKc29uTGRDb250cm9sbGVyKTtcblxuICAgIEpzb25MZENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdCcmVhZGNydW1iU2VydmljZScsICdDYXRhbG9nU2VydmljZScsICdqc29uRmlsdGVyJ107XG5cbiAgICBmdW5jdGlvbiBKc29uTGRDb250cm9sbGVyKCRzY29wZSwgJGxvY2F0aW9uLCBCcmVhZGNydW1iU2VydmljZSwgQ2F0YWxvZ1NlcnZpY2UsIGpzb25GaWx0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0udXJsID0gJGxvY2F0aW9uLmFic1VybCgpO1xuXG5cbiAgICB9XG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY29tbW9uLmRpcmVjdGl2ZScpXG4gICAgICAgIC5kaXJlY3RpdmUoJ2NsaXBsaXN0ZXInLCBDbGlwbGlzdGVyRGlyZWN0aXZlKTtcblxuICAgIENsaXBsaXN0ZXJEaXJlY3RpdmUuJGluamVjdCA9IFsnJGZpbHRlcicsICckc2NlJ107XG5cbiAgICBmdW5jdGlvbiBDbGlwbGlzdGVyRGlyZWN0aXZlKCRmaWx0ZXIsICRzY2UpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxkaXYgaWQ9XCJ2aWRlb1wiIHN0eWxlPVwiaGVpZ2h0OjQwMHB4O1wiPjwvZGl2PicsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIHZpZGVvSWQ6ICc9dmlkZW9JZCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICBuZXcgQ2xpcGxpc3RlckNvbnRyb2wuVmlld2VyKHtcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50SWQ6IFwidmlkZW9cIixcbiAgICAgICAgICAgICAgICAgICAgY3VzdG9tZXI6IDE1Nzg5MyxcbiAgICAgICAgICAgICAgICAgICAgYXNzZXRzOiBbc2NvcGUudmlkZW9JZF0sXG4gICAgICAgICAgICAgICAgICAgIGtleVR5cGU6IDEwMDAwLFxuICAgICAgICAgICAgICAgICAgICBmc2s6IDE4LFxuICAgICAgICAgICAgICAgICAgICBhdXRvcGxheTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHBsdWdpbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIElubmVyQ29udHJvbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXllcjogMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2JpbGVEZWZhdWx0Q29udHJvbHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IFwiY29udHJvbHNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibGFja2xpc3Q6IFtcInNoYXJlXCIsXCJxdWFsaXR5XCIsXCJwbGF5YmFjay1zcGVlZFwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImV4dGVybmFsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogXCJodHRwczovL215Y2xpcGxpc3Rlci5jb20vc3RhdGljL3ZpZXdlci9hc3NldHMvc2tpbnMvZGVmYXVsdC9jb250cm9scy5odG1sXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgQ2xpY2thYmxlVmlkZW86IHtsYXllcjogMX0sXG4gICAgICAgICAgICAgICAgICAgICAgICBQbGF5QnV0dG9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IFwicGxheUJ1dHRvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxheWVyOiA3LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlOiBcImh0dHBzOi8vbXljbGlwbGlzdGVyLmNvbS9zdGF0aWMvdmlld2VyL2Fzc2V0cy9za2lucy9kZWZhdWx0L3BsYXlCdXR0b24ucG5nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDEwMFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFByZXZpZXdJbWFnZToge2xheWVyOiA2fVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZVxuICAgICAgICB9XG4gICAgfTtcblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jb21tb24uZGlyZWN0aXZlJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnanNvbmxkJywgSnNvbkxkRGlyZWN0aXZlKTtcblxuICAgIEpzb25MZERpcmVjdGl2ZS4kaW5qZWN0ID0gWyckZmlsdGVyJywgJyRzY2UnXTtcblxuICAgIGZ1bmN0aW9uIEpzb25MZERpcmVjdGl2ZSgkZmlsdGVyLCAkc2NlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8c2NyaXB0IHR5cGU9XCJhcHBsaWNhdGlvbi9sZCtqc29uXCIgbmctYmluZC1odG1sPVwib25HZXRKc29uKClcIj48L3NjcmlwdD4nLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBqc29uOiAnPWpzb24nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICAgICAgc2NvcGUub25HZXRKc29uID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkc2NlLnRydXN0QXNIdG1sKCRmaWx0ZXIoJ2pzb24nKShzY29wZS5qc29uKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWVcbiAgICAgICAgfVxuICAgIH07XG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdwZHMuY29tbW9uLmRpcmVjdGl2ZScpXG4gICAgLmRpcmVjdGl2ZSgnc2ltcGxlU3VibWVudScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgaW5pdE5hdkNvbGxhcHNlKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNvbW1vbi5maWx0ZXInKVxuICAgICAgICAuZmlsdGVyKCdjb252ZXJ0V2hpdGVzcGFjZXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0ICYmIGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxuL2csICc8L2JyPicpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvPCEtLS4qbGFuZ3VhZ2UuKm1pc3NpbmcuKi0tPi9nLCAnJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jb21tb24uZmlsdGVyJylcbiAgICAgICAgLmZpbHRlcignaW1hZ2VVcmwnLCBJbWFnZVVybEZpbHRlcik7XG5cbiAgICBJbWFnZVVybEZpbHRlci4kaW5qZWN0ID0gWydlbnYnLCAnbG9jYWxlJywgJ29jc0NoYW5uZWwnXTtcblxuICAgIHZhciBkZWZhdWx0SW1hZ2VzID0ge1xuICAgICAgICAnaW1nLXNtJzogJy9zcmMvbWVkaWEvZGVmYXVsdC00NjB4NDYwLmpwZycsXG4gICAgICAgICdpbWctbWQnOiAnL3NyYy9tZWRpYS9kZWZhdWx0LTY0MHgzNzIuanBnJyxcbiAgICAgICAgJ2ltZy1sZyc6ICcvc3JjL21lZGlhL2RlZmF1bHQtNjgweDQ0MC5qcGcnLFxuICAgICAgICAnaW1nLXhsZyc6ICcvc3JjL21lZGlhL2RlZmF1bHQtMTYwMHg1NjAuanBnJ1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBJbWFnZVVybEZpbHRlcihlbnYsIGxvY2FsZSwgb2NzQ2hhbm5lbCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1lZGlhT2JqZWN0LCBzaXplKSB7XG4gICAgICAgICAgICByZXR1cm4gbWVkaWFPYmplY3QgPyBlbnYuZW5kUG9pbnQub2NzTWVkaWFFbmRwb2ludCArIG9jc0NoYW5uZWwgKyBcIi9cIiArIGxvY2FsZS50b1N0cmluZygpICsgXCIvXCIgKyBtZWRpYU9iamVjdCA6IGRlZmF1bHRJbWFnZXNbc2l6ZSB8fCAnaW1nLXNtJ107XG4gICAgICAgIH1cbiAgICB9XG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIHZhciBDSEFSQUNURVJfTUFQID0ge1xuICAgICAgICAnXFx1MDAyRSc6ICAgJycsICAvLy5cbiAgICAgICAgJ1xcdTAwMjAnOiAgICctJywgLy9TUEFDRVxuICAgICAgICAnXFx1MDAyQyc6ICAgJy0nLCAvLyxcbiAgICAgICAgJ1xcdTAwMjYnOiAgICctJywgLy8mXG4gICAgICAgICdcXHUwMDVDJzogICAnLScsIC8vXFxcbiAgICAgICAgJ1xcdTIwMUUnOiAgICctJywgLy/igJ5cbiAgICAgICAgJ1xcdTAwMjInOiAgICctJywgLy8nXG4gICAgICAgICdcXHUwMDI3JzogICAnLScsIC8vJ1xuICAgICAgICAnXFx1MDBCNCc6ICAgJy0nLCAvL8K0XG4gICAgICAgICdcXHUwMDYwJzogICAnLScsIC8vYFxuICAgICAgICAnXFx1MDBCQic6ICAgJy0nLCAvL8K7XG4gICAgICAgICdcXHUwMEFCJzogICAnLScsIC8vwqtcbiAgICAgICAgJ1xcdTAwMkYnOiAgICctJywgLy8vXG4gICAgICAgICdcXHUwMDNBJzogICAnLScsIC8vOlxuICAgICAgICAnXFx1MDAyMSc6ICAgJy0nLCAvLyFcbiAgICAgICAgJ1xcdTAwMkEnOiAgICctJywgLy8qXG4gICAgICAgICdcXHUwMDI4JzogICAnLScsIC8vKFxuICAgICAgICAnXFx1MDAyOSc6ICAgJy0nLCAvLylcbiAgICAgICAgJ1xcdTIxMjInOiAgICctJywgLy/ihKJcbiAgICAgICAgJ1xcdTAwQUUnOiAgICctJywgLy/CrlxuICAgICAgICAnXFx1MDBFMSc6ICAgJ2EnLCAvL8OhXG4gICAgICAgICdcXHUwMEYzJzogICAnbycsIC8vw7NcbiAgICAgICAgJ1xcdTAwRUQnOiAgICdpJywgLy/DrVxuICAgICAgICAnXFx1MDBFOSc6ICAgJ2UnLCAvL8OpXG4gICAgICAgICdcXHUwMEU0JzogICAnYWUnLC8vw6RcbiAgICAgICAgJ1xcdTAwRjYnOiAgICdvZScsLy/DtlxuICAgICAgICAnXFx1MDE1MSc6ICAgJ28nLCAvL8WRXG4gICAgICAgICdcXHUwMEZDJzogICAndScsIC8vw7xcbiAgICAgICAgJ1xcdTAwRkEnOiAgICd1JywgLy/DulxuICAgICAgICAnXFx1MDE3MSc6ICAgJ3UnLCAvL8WxXG4gICAgICAgICdcXHUwMERGJzogICAnc3MnLC8vw59cbiAgICAgICAgJ1xcdTAwRUUnOiAgICdpJywgLy/DrlxuICAgICAgICAnXFx1MDBFMic6ICAgJ2EnLCAvL8OiXG4gICAgICAgICdcXHUwMTAzJzogICAnYScsIC8vxINcbiAgICAgICAgJ1xcdTAyMUInOiAgICd0JywgLy/Im1xuICAgICAgICAnXFx1MDE2Myc6ICAgJ3QnLCAvL8WjXG4gICAgICAgICdcXHUwMTVGJzogICAndCcsIC8vxZ9cbiAgICAgICAgJ1xcdTAyMTknOiAgICdzJywgLy/ImVxuICAgICAgICAnXFx1MDE1OSc6ICAgJ3InLCAvL8WZXG4gICAgICAgICdcXHUwMTZmJzogICAndScsIC8vxa9cbiAgICAgICAgJ1xcdTAwRkQnOiAgICd5JywgLy/DvVxuICAgICAgICAnXFx1MDEwRCc6ICAgJ2MnLCAvL8SNXG4gICAgICAgICdcXHUwMTFCJzogICAnZScsIC8vxJtcbiAgICAgICAgJ1xcdTAxN0UnOiAgICd6JywgLy/FvlxuICAgICAgICAnXFx1MDE2MSc6ICAgJ3MnLCAvL8WhXG4gICAgICAgICdcXHUwMTY1JzogICAndCcsIC8vxaVcbiAgICAgICAgJ1xcdTAxNDgnOiAgICduJywgLy/FiFxuICAgICAgICAnXFx1MjAxOSc6ICAgJy0nLCAvL+KAmVxuICAgICAgICAnXFx1MDBlMCc6ICAgJ2EnICAvL8OgXG4gICAgfTtcbiAgICB2YXIgY2hhcmFjdGVyUmVnZXggPSBfXG4gICAgICAgIC5tYXAoQ0hBUkFDVEVSX01BUCwgZnVuY3Rpb24gKHZhbCwga2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gJ1xcXFwnICsga2V5O1xuICAgICAgICB9KVxuICAgICAgICAuam9pbignfCcpO1xuICAgIHZhciByZWdFeHAgPSBuZXcgUmVnRXhwKGNoYXJhY3RlclJlZ2V4LCAnZycpO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY29tbW9uLmZpbHRlcicpXG4gICAgICAgIC5maWx0ZXIoJ3NpbXBsaWZ5Q2hhcmFjdGVycycsIFsnXycsIGZ1bmN0aW9uIChfKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWwgJiYgdmFsXG4gICAgICAgICAgICAgICAgICAgICAgICAudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UocmVnRXhwLCBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gQ0hBUkFDVEVSX01BUFttYXRjaF07XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfV0pXG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jb21tb24ucm91dGUnKVxuICAgICAgICAuY29uZmlnKFJvdXRlQ29uZmlnKTtcblxuICAgIFJvdXRlQ29uZmlnLiRpbmplY3QgPSBbJyRzdGF0ZVByb3ZpZGVyJywgJyRsb2NhdGlvblByb3ZpZGVyJywgJ2NvbmZpZyddO1xuXG4gICAgZnVuY3Rpb24gUm91dGVDb25maWcoJHN0YXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyLCBjb25maWcpIHtcbiAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgICAgICAkc3RhdGVQcm92aWRlci5wZHNSb3V0ZSA9IGZ1bmN0aW9uIChyb3V0ZSkge1xuICAgICAgICAgICAgcm91dGUudXJsID0gdXJsUGF0aChyb3V0ZS51cmwpO1xuICAgICAgICAgICAgcm91dGUudGVtcGxhdGVVcmwgPSBodG1sUGF0aChyb3V0ZS50ZW1wbGF0ZVVybCk7XG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShyb3V0ZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gdXJsUGF0aChwYXRoKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uZmlnLnBkc1BhdGhQcmVmaXggKyAnLycgKyBwYXRoO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaHRtbFBhdGgocGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZy5wZHNUZW1wbGF0ZVBhdGggKyAnLycgKyBwYXRoO1xuICAgICAgICB9XG4gICAgfVxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jb21tb24uc2VydmljZScpXG4gICAgICAgIC5zZXJ2aWNlKCdTcGlubmVyU2VydmljZScsIFNwaW5uZXJTZXJ2aWNlKTtcblxuICAgIFNwaW5uZXJTZXJ2aWNlLiRpbmplY3QgPSBbJyRodHRwJ107XG5cbiAgICBmdW5jdGlvbiBTcGlubmVyU2VydmljZSgkaHR0cCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgc2VsZi5pc0xvYWRpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucGVuZGluZ1JlcXVlc3RzLmxlbmd0aCA+IDA7XG4gICAgICAgIH1cblxuICAgIH1cblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyLm1vZHVsZSgncGRzLmNhdGFsb2cucm91dGUnLCBbJ3Bkcy5jb21tb24ucm91dGUnLCAndWkucm91dGVyJywgJ25jeS1hbmd1bGFyLWJyZWFkY3J1bWInXSk7XG4gICAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5jYXRhbG9nLnNlcnZpY2UnLCBbJ3Bkcy5jb21tb24uZmlsdGVyJ10pO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdwZHMuY2F0YWxvZy5jb25maWcnLCBbJ3Bkcy5lbnZpcm9ubWVudCcsICduZ1Jlc291cmNlJywgJ3Bkcy5jb21tb24uY29uZmlnJ10pO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdwZHMuY2F0YWxvZy5jb250cm9sbGVyJywgWyduZ1Nhbml0aXplJywgJ2RhdGF0YWJsZXMnLCAnaGwuc3RpY2t5JywgJ2RjYkltZ0ZhbGxiYWNrJywgJ3NsaWNrQ2Fyb3VzZWwnLCAncGRzLmNhdGFsb2cuc2VydmljZScsICdwZHMuY2F0YWxvZy5kaXJlY3RpdmUnLCAncGRzLm5hdmlnYXRpb24uc2VydmljZSddKTtcbiAgICBhbmd1bGFyLm1vZHVsZSgncGRzLmNhdGFsb2cubW9kZWwnLCBbXSk7XG4gICAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5jYXRhbG9nLmZhY3RvcnknLCBbJ3Bkcy5jYXRhbG9nLnNlcnZpY2UnXSk7XG4gICAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5jYXRhbG9nLmRpcmVjdGl2ZScsIFtdKTtcbiAgICBhbmd1bGFyLm1vZHVsZSgncGRzLmNhdGFsb2cnLCBbJ3Bkcy5jYXRhbG9nLmNvbnRyb2xsZXInLCAncGRzLmNhdGFsb2cucm91dGUnLCAncGRzLmNhdGFsb2cuc2VydmljZScsICdwZHMuY2F0YWxvZy5jb25maWcnLCAncGRzLmNhdGFsb2cubW9kZWwnXSk7XG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICBhbmd1bGFyLm1vZHVsZSgncGRzLm5hdmlnYXRpb24ucm91dGUnLCBbJ3VpLnJvdXRlciddKTtcbiAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5uYXZpZ2F0aW9uLnNlcnZpY2UnLCBbJ3Bkcy5uYXZpZ2F0aW9uLm1vZGVsJywgJ3Bkcy5jb21tb24uc2VydmljZSddKTtcbiAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5uYXZpZ2F0aW9uLmNvbmZpZycsIFtdKTtcbiAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5uYXZpZ2F0aW9uLmNvbnRyb2xsZXInLCBbJ3Bkcy5uYXZpZ2F0aW9uLnNlcnZpY2UnLCAncGRzLmNvbW1vbi5zZXJ2aWNlJ10pO1xuICBhbmd1bGFyLm1vZHVsZSgncGRzLm5hdmlnYXRpb24ubW9kZWwnLCBbXSk7XG4gIGFuZ3VsYXIubW9kdWxlKCdwZHMubmF2aWdhdGlvbi5kaXJlY3RpdmUnLCBbXSk7XG4gIGFuZ3VsYXIubW9kdWxlKCdwZHMubmF2aWdhdGlvbicsIFsncGRzLm5hdmlnYXRpb24uY29udHJvbGxlcicsICdwZHMubmF2aWdhdGlvbi5yb3V0ZScsICdwZHMubmF2aWdhdGlvbi5zZXJ2aWNlJywgJ3Bkcy5uYXZpZ2F0aW9uLmNvbmZpZycsICdwZHMubmF2aWdhdGlvbi5tb2RlbCddKTtcbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gIGFuZ3VsYXIubW9kdWxlKCdwZHMuc2VhcmNoLnJvdXRlJywgWydwZHMuY29tbW9uLnJvdXRlJywgJ3VpLnJvdXRlciddKTtcbiAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5zZWFyY2guc2VydmljZScsIFsncGRzLm5hdmlnYXRpb24ubW9kZWwnLCAncGRzLmNvbW1vbi5jb25maWcnXSk7XG4gIGFuZ3VsYXIubW9kdWxlKCdwZHMuc2VhcmNoLmNvbmZpZycsIFtdKTtcbiAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5zZWFyY2guY29udHJvbGxlcicsIFsncGRzLnNlYXJjaC5zZXJ2aWNlJywgJ3VpLmJvb3RzdHJhcCddKTtcbiAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5zZWFyY2gubW9kZWwnLCBbXSk7XG4gIGFuZ3VsYXIubW9kdWxlKCdwZHMuc2VhcmNoLmRpcmVjdGl2ZScsIFtdKTtcbiAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5zZWFyY2gnLCBbJ3Bkcy5zZWFyY2guY29udHJvbGxlcicsICdwZHMuc2VhcmNoLnJvdXRlJywgJ3Bkcy5zZWFyY2guc2VydmljZScsICdwZHMuc2VhcmNoLmNvbmZpZycsICdwZHMuc2VhcmNoLm1vZGVsJ10pO1xufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jYXRhbG9nLmNvbmZpZycpXG4gICAgICAgIC5jb25maWcoWyckaHR0cFByb3ZpZGVyJywgSHR0cENvbmZpZ10pO1xuXG4gICAgZnVuY3Rpb24gSHR0cENvbmZpZygkaHR0cFByb3ZpZGVyKSB7XG4gICAgICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goWyckcScsICckaW5qZWN0b3InLCBmdW5jdGlvbiAoJHEsICRpbmplY3Rvcikge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbihyZWplY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgJGluamVjdG9yLmdldCgnJHN0YXRlJykuZ28oJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVqZWN0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1dKTtcbiAgICB9XG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY2F0YWxvZy5jb25maWcnKVxuICAgICAgICAuY29uZmlnKFsnJHNjZURlbGVnYXRlUHJvdmlkZXInLCBTY2VDb25maWddKTtcblxuICAgIGZ1bmN0aW9uIFNjZUNvbmZpZygkc2NlRGVsZWdhdGVQcm92aWRlcikge1xuICAgICAgICAkc2NlRGVsZWdhdGVQcm92aWRlci5yZXNvdXJjZVVybFdoaXRlbGlzdChbXG4gICAgICAgICAgICAnc2VsZicsXG4gICAgICAgICAgICAnaHR0cHM6Ly9wZHMtYm9zY2gtdHQua2l0dGVsYmVyZ2VyLm5ldC8qKicsXG4gICAgICAgICAgICAnaHR0cHM6Ly9zcy1ib3NjaC10dC5raXR0ZWxiZXJnZXIubmV0LyoqJyxcbiAgICAgICAgICAgICdodHRwczovL215Y2xpcGxpc3Rlci5jb20vKionXG4gICAgICAgIF0pO1xuICAgIH1cblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jYXRhbG9nLmNvbnRyb2xsZXInKVxuICAgICAgICAuY29udHJvbGxlcignQnJlYWRjcnVtYkNvbnRyb2xsZXInLCBCcmVhZGNydW1iQ29udHJvbGxlcik7XG5cbiAgICBCcmVhZGNydW1iQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnQnJlYWRjcnVtYlNlcnZpY2UnXTtcblxuICAgIGZ1bmN0aW9uIEJyZWFkY3J1bWJDb250cm9sbGVyKCRzY29wZSwgQnJlYWRjcnVtYlNlcnZpY2UpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAkc2NvcGUuJG9uKCdwZHMuYnJlYWRjcnVtYi51cGRhdGUnLCBmdW5jdGlvbiAoZXZlbnQsIHBhcmFtcykge1xuICAgICAgICAgICAgQnJlYWRjcnVtYlNlcnZpY2VcbiAgICAgICAgICAgICAgICAuYnVpbGQocGFyYW1zLmNhdGVnb3J5SWQpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICB2bS5icmVhZGNydW1icyA9IHJlcztcbiAgICAgICAgICAgICAgICAgICAgaWYgKF8ubGFzdCh2bS5icmVhZGNydW1icykudHlwZSA9PSAncHJvZHVjdF9kZXRhaWxzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KCcjbmF2LWJyZWFkY3J1bWJzJykuYWRkQ2xhc3MoJ2RhcmstYnJlYWRjcnVtYicpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNhdGFsb2cuY29udHJvbGxlcicpXG4gICAgICAgIC5jb250cm9sbGVyKFwiQ2F0YWxvZ0NvbnRyb2xsZXJcIiwgQ2F0YWxvZ0NvbnRyb2xsZXIpO1xuXG4gICAgQ2F0YWxvZ0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAndXJsUGFyc2VyU2VydmljZScsICdfJywgJ01ldGFTZXJ2aWNlJ107XG5cbiAgICBmdW5jdGlvbiBDYXRhbG9nQ29udHJvbGxlcigkc2NvcGUsICRyb290U2NvcGUsIHVybFBhcnNlclNlcnZpY2UsIF8sIE1ldGFTZXJ2aWNlKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZhciBQUk9EVUNUX0NPVU5UX0xBWU9VVF9CUkVBS1BPSU5UID0gNDtcbiAgICAgICAgdm0uY2F0YWxvZ0lkID0gdXJsUGFyc2VyU2VydmljZS5nZXRDYXRhbG9nSWQoKTtcbiAgICAgICAgdm0uYW55UHJvZHVjdEhhc1ZhbHVlID0gYW55UHJvZHVjdEhhc1ZhbHVlO1xuICAgICAgICB2bS50YWJsZURlZmluaXRpb25Db250YWlucyA9IHRhYmxlRGVmaW5pdGlvbkNvbnRhaW5zO1xuICAgICAgICB2bS5yZXNwb25zaXZlQ2hhbmdlID0gcmVzcG9uc2l2ZUNoYW5nZTtcblxuICAgICAgICBNZXRhU2VydmljZS51cGRhdGVNZXRhQnlDYXRlZ29yeSh2bS5jYXRhbG9nSWQpO1xuICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3Bkcy5icmVhZGNydW1iLnVwZGF0ZScsIHtjYXRhbG9nSWQ6IHZtLmNhdGFsb2dJZH0pO1xuXG4gICAgICAgICRzY29wZS4kb24oJ3Bkcy5jYXRhbG9nLmxvYWRlZCcsIGZ1bmN0aW9uIChldmVudCwgcGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5pdENhdGFsb2cocGFyYW1zLmNhdGFsb2cpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuJG9uKCdwZHMuY2F0YWxvZy5sb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBhbmd1bGFyXG4gICAgICAgICAgICAgICAgLmVsZW1lbnQoJyNuYXYtcHJpbWFyeS1jb2xsYXBzZScpXG4gICAgICAgICAgICAgICAgLmZpbmQoJ2xpJylcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgYW5ndWxhclxuICAgICAgICAgICAgICAgIC5lbGVtZW50KCcjb2NzLW5hdicpXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZnVuY3Rpb24gaW5pdENhdGFsb2coY2F0YWxvZykge1xuICAgICAgICAgICAgdm0uY2F0YWxvZyA9IGNhdGFsb2c7XG4gICAgICAgICAgICBpZiAoXy5nZXQodm0uY2F0YWxvZywgJ3JlZGlyZWN0Q2F0ZWdvcnkuaWQnKSA+IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQ2F0YWxvZ1NlcnZpY2UucmVkaXJlY3RUbyh2bS5jYXRhbG9nLnJlZGlyZWN0Q2F0ZWdvcnkuaWQudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdm0uY2F0YWxvZy5lbmVyZ3lFZmZpY2llbmN5ID0gdm0uY2F0YWxvZy5lbmVyZ3lFZmZpY2llbmN5IHx8IHt9O1xuICAgICAgICAgICAgdmFyIHRlY2huaWNhbERhdGFUYWJsZSA9IHZtLmNhdGFsb2cudGVjaG5pY2FsRGF0YVRhYmxlKCk7XG4gICAgICAgICAgICBpZiAodGVjaG5pY2FsRGF0YVRhYmxlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRhYmxlRGVmaW5pdGlvbiA9IHRlY2huaWNhbERhdGFUYWJsZS50YWJsZURlZmluaXRpb247XG4gICAgICAgICAgICAgICAgdGVjaG5pY2FsRGF0YVRhYmxlLnRhYmxlRGVmaW5pdGlvbiA9IF9cbiAgICAgICAgICAgICAgICAgICAgLmNoYWluKHRhYmxlRGVmaW5pdGlvbilcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihhdHRyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGVjaG5pY2FsRGF0YVRhYmxlLnNob3dBdHRyaWJ1dGVzV2l0aE5vVmFsdWVzIHx8IGFueVByb2R1Y3RIYXNWYWx1ZSh0ZWNobmljYWxEYXRhVGFibGUucHJvZHVjdHMsIGF0dHIpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGlzTm90SGVhZGVyQXR0cmlidXRlLmJpbmQodGhpcywgdGVjaG5pY2FsRGF0YVRhYmxlLnByb2R1Y3RzKSlcbiAgICAgICAgICAgICAgICAgICAgLnZhbHVlKCk7XG4gICAgICAgICAgICAgICAgdm0ucmVzcG9uc2l2ZUNoYW5nZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNOb3RIZWFkZXJBdHRyaWJ1dGUocHJvZHVjdHMsIGF0dHIpIHtcbiAgICAgICAgICAgIHJldHVybiAhaXNIZWFkZXJBdHRyaWJ1dGUocHJvZHVjdHMsIGF0dHIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNIZWFkZXJBdHRyaWJ1dGUocHJvZHVjdHMsIGF0dHIpIHtcbiAgICAgICAgICAgIHJldHVybiBfLnNvbWUocHJvZHVjdHMsIGZ1bmN0aW9uIChwcm9kdWN0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb2R1Y3QuaGVhZGVyLmtleSA9PSBhdHRyLmtleTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYW55UHJvZHVjdEhhc1ZhbHVlKHByb2R1Y3RzLCBhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIHJldHVybiBfLnNvbWUocHJvZHVjdHMsIGF0dHJpYnV0ZS5rZXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdGFibGVEZWZpbml0aW9uQ29udGFpbnMoZGVmaW5pdGlvbiwga2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gXy5zb21lKGRlZmluaXRpb24sIHtrZXk6IGtleX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVzcG9uc2l2ZUNoYW5nZShlLCB0YWJsZSwgY29sdW1ucykge1xuICAgICAgICAgICAgdmFyIHRlY2huaWNhbERhdGFUYWJsZSA9IHZtLmNhdGFsb2cudGVjaG5pY2FsRGF0YVRhYmxlKCk7XG4gICAgICAgICAgICB0ZWNobmljYWxEYXRhVGFibGUucGFydGl0aW9ucyA9IF8uY2h1bmsodGVjaG5pY2FsRGF0YVRhYmxlLnByb2R1Y3RzLCBfLmV2ZXJ5KGNvbHVtbnMpID8gUFJPRFVDVF9DT1VOVF9MQVlPVVRfQlJFQUtQT0lOVCA6IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jYXRhbG9nLmNvbnRyb2xsZXInKVxuICAgICAgICAuY29udHJvbGxlcihcIk5ld1Byb2R1Y3RDb250cm9sbGVyXCIsIE5ld1Byb2R1Y3RDb250cm9sbGVyKTtcblxuICAgIE5ld1Byb2R1Y3RDb250cm9sbGVyLiRpbmplY3QgPSBbJ0NhdGFsb2dTZXJ2aWNlJywgJ18nXTtcblxuICAgIGZ1bmN0aW9uIE5ld1Byb2R1Y3RDb250cm9sbGVyKGNhdGFsb2dTZXJ2aWNlLCBfKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0ucHJvZHVjdHNMb2FkZWQgPSBmYWxzZTtcbiAgICAgICAgdm0uc2xpY2tTZXR0aW5ncyA9IHtcbiAgICAgICAgICAgIFwiYXJyb3dzXCI6IGZhbHNlLFxuICAgICAgICAgICAgXCJkb3RzXCI6IHRydWUsXG4gICAgICAgICAgICBcImluZmluaXRlXCI6IGZhbHNlLFxuICAgICAgICAgICAgXCJzcGVlZFwiOiAxMDAwLFxuICAgICAgICAgICAgXCJjc3NFYXNlXCI6IFwiZWFzZS1pbi1vdXRcIixcbiAgICAgICAgICAgIFwic2xpZGVzVG9TaG93XCI6IDQsXG4gICAgICAgICAgICBcInNsaWRlc1RvU2Nyb2xsXCI6IDQsXG4gICAgICAgICAgICBcInJlc3BvbnNpdmVcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJicmVha3BvaW50XCI6IDk5MixcbiAgICAgICAgICAgICAgICAgICAgXCJzZXR0aW5nc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInNsaWRlc1RvU2hvd1wiOiAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzbGlkZXNUb1Njcm9sbFwiOiAyXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJicmVha3BvaW50XCI6IDc2OCxcbiAgICAgICAgICAgICAgICAgICAgXCJzZXR0aW5nc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInNsaWRlc1RvU2hvd1wiOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzbGlkZXNUb1Njcm9sbFwiOiAxXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH07XG5cbiAgICAgICAgY2F0YWxvZ1NlcnZpY2VcbiAgICAgICAgICAgIC5nZXROZXdQcm9kdWN0RmFtaWxpZXMoKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHZtLnByb2R1Y3RGYW1pbGllcyA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICB2bS5wcm9kdWN0c0xvYWRlZCA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIHZhciBWQUxVRV9URU1QTEFURSA9ICc8c3Bhbj57e3ZhbHVlLnZhbHVlIHx8IFxcJy1cXCd9fTwvc3Bhbj4nO1xuICAgIHZhciBJTUFHRV9NRURJQV9URU1QTEFURSA9ICc8aW1nIG5nLXNyYz1cInt7dmFsdWUudmFsdWV9fVwiIGFsdD1cInt7YWx0LnZhbHVlfX1cIiB0aXRsZT1cInt7dGl0bGUudmFsdWV9fVwiLz4nO1xuICAgIHZhciBPVEhFUl9NRURJQV9URU1QTEFURSA9ICc8c3Bhbj48YSBuZy1ocmVmPVwie3t2YWx1ZS52YWx1ZSB8IGltYWdlVXJsfX1cIiB0aXRsZT1cInt7dGl0bGUudmFsdWV9fVwiIHRhcmdldD1cIl9ibGFua1wiPjxzcGFuIHRyYW5zbGF0ZT1cIkRPV05MT0FELk5PV1wiPjwvc3Bhbj4mbmJzcDs8aSBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tZG93bmxvYWQtYWx0XCI+PC9pPjwvYT48L3NwYW4+JztcbiAgICB2YXIgTElTVF9URU1QTEFURSA9ICc8c3BhbiBuZy1yZXBlYXQ9XCJlbCBpbiB2YWx1ZS52YWx1ZVwiPnt7ZWwgKyAoISRsYXN0ID8gXCIsIFwiOiBcIlwiKX19PC9zcGFuPic7XG4gICAgdmFyIElNQUdFX0VYVEVOU0lPTlMgPSBbJy5qcGcnLCAnLnBuZycsICcuanBlZycsICcuZ2lmJ107XG4gICAgdmFyIERPVCA9ICcuJztcblxuICAgIHZhciB0ZW1wbGF0ZVN0cmF0ZWd5ID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICBpc0FwcGxpY2FibGU6IGZ1bmN0aW9uICh2YWwsIHR5cGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZSAmJiB0eXBlLnRvTG93ZXJDYXNlKCkgPT0gJ3N0cmluZycgJiYgSU1BR0VfRVhURU5TSU9OUy5pbmRleE9mKHZhbC5zbGljZSh2YWwubGFzdEluZGV4T2YoRE9UKSkpID49IDA7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGU6IElNQUdFX01FRElBX1RFTVBMQVRFXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlzQXBwbGljYWJsZTogZnVuY3Rpb24gKHZhbCwgdHlwZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlICYmIHR5cGUudG9Mb3dlckNhc2UoKSA9PSAnYXNzZXQnO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlOiBPVEhFUl9NRURJQV9URU1QTEFURVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBpc0FwcGxpY2FibGU6IGZ1bmN0aW9uICh2YWwsIHR5cGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZSAmJiB0eXBlLnRvTG93ZXJDYXNlKCkgPT0gJ2xpc3QnO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlOiBMSVNUX1RFTVBMQVRFXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlzQXBwbGljYWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlOiBWQUxVRV9URU1QTEFURVxuICAgICAgICB9XG4gICAgXTtcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNhdGFsb2cuZGlyZWN0aXZlJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnYXR0cmlidXRlVmFsdWUnLCBbJyRjb21waWxlJywgJyRzY2UnLCBmdW5jdGlvbiAoJGNvbXBpbGUsICRzY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICc9YXR0cmlidXRlVmFsdWUnLFxuICAgICAgICAgICAgICAgICAgICBhbHQ6IFwiPWF0dHJpYnV0ZUFsdFwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI9YXR0cmlidXRlVGl0bGVcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybCkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS4kc2NlID0gJHNjZTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZW1wbGF0ZVN0cmF0ZWd5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2NvcGUudmFsdWUgJiYgdGVtcGxhdGVTdHJhdGVneVtpXS5pc0FwcGxpY2FibGUoc2NvcGUudmFsdWUudmFsdWUsIHNjb3BlLnZhbHVlLnR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQuaHRtbCgkY29tcGlsZSh0ZW1wbGF0ZVN0cmF0ZWd5W2ldLnRlbXBsYXRlKShzY29wZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XSk7XG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY2F0YWxvZy5kaXJlY3RpdmUnKVxuICAgICAgICAuZGlyZWN0aXZlKCdjYXRhbG9nVGVtcGxhdGUnLCBbJ0NhdGFsb2dTZXJ2aWNlJywgJyRyb290U2NvcGUnLCAnXycgLGZ1bmN0aW9uIChDYXRhbG9nU2VydmljZSwgJHJvb3RTY29wZSwgXykge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgICAgICBjYXRhbG9nSWQ6ICc9J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJjYXRhbG9nLXRlbXBsYXRlXCIgbmctdHJhbnNjbHVkZT48L2Rpdj4nLFxuICAgICAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoKCdjYXRhbG9nSWQnLCBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWwgJiYgQ2F0YWxvZ1NlcnZpY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0VGVtcGxhdGUodmFsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChjYXRhbG9nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLiRjYXRhbG9nID0gY2F0YWxvZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdwZHMuY2F0YWxvZy5sb2FkZWQnLCB7Y2F0YWxvZzogY2F0YWxvZ30pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1dKTtcblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIsICQpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jYXRhbG9nLmRpcmVjdGl2ZScpXG4gICAgICAgIC5kaXJlY3RpdmUoJ2VxdWFsaXplVGVhc2VySGVpZ2h0JywgWyckdGltZW91dCcsIEVxdWFsaXplVGVhc2VySGVpZ2h0XSk7XG5cbiAgICBmdW5jdGlvbiBFcXVhbGl6ZVRlYXNlckhlaWdodCgkdGltZW91dCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBbJyRzY29wZScsICckZWxlbWVudCcsICckYXR0cnMnLCBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLiRsYXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1heEhlaWdodCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2FyZEJsb2NrID0gJChcIi5jYXJkIC5jYXJkLWJsb2NrXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkKGNhcmRCbG9jaykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5oZWlnaHQoKSA+IG1heEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhIZWlnaHQgPSAkKHRoaXMpLmhlaWdodCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkKGNhcmRCbG9jaykuaGVpZ2h0KG1heEhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1dXG4gICAgICAgIH1cbiAgICB9XG5cbn0pKGFuZ3VsYXIsIGpRdWVyeSk7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jYXRhbG9nLmRpcmVjdGl2ZScpXG4gICAgICAgIC5kaXJlY3RpdmUoJ29jc0JyZWFkY3J1bWInLCBPY3NCcmVhZGNydW1iKTtcblxuICAgIHZhciBjcnVtYlRlbXBsYXRlID0gXCI8bGkgbmctcmVwZWF0PVxcXCJjcnVtYiBpbiAkYnJlYWRjcnVtYnNcXFwiIG5nLWNsYXNzPVxcXCJ7J2FjdGl2ZSc6ICRsYXN0fVxcXCI+XCJcbiAgICAgICAgICAgICsgXCI8YSBvY3MtbmF2aWdhdGU9XFxcImNydW1iLmlkXFxcIj57e2NydW1iLm5hbWV9fTwvYT5cIlxuICAgICAgICArIFwiPC9saT5cIjtcblxuICAgIGZ1bmN0aW9uIE9jc0JyZWFkY3J1bWIoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgb2NzTmF2aWdhdGU6ICc9J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJyRjb21waWxlJywgJ0JyZWFkY3J1bWJTZXJ2aWNlJywgJ18nLCBCcmVhZGNydW1iQ29udHJvbGxlcl1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIEJyZWFkY3J1bWJDb250cm9sbGVyKCRzY29wZSwgJGNvbXBpbGUsIEJyZWFkY3J1bWJTZXJ2aWNlLCBfKSB7XG4gICAgICAgICRzY29wZS4kb24oJ3Bkcy5icmVhZGNydW1iLnVwZGF0ZScsIGZ1bmN0aW9uIChldmVudCwgcGFyYW1zKSB7XG4gICAgICAgICAgICBCcmVhZGNydW1iU2VydmljZVxuICAgICAgICAgICAgICAgIC5idWlsZChwYXJhbXMuY2F0YWxvZ0lkKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRicmVhZGNydW1icyA9IHJlcyB8fCB7fTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJyZWFkY3J1bWJzID0gJGNvbXBpbGUoY3J1bWJUZW1wbGF0ZSkoJHNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJyZWFkY3J1bWJzQ29udGFpbmVyID0gYW5ndWxhci5lbGVtZW50KCcjbmF2LWJyZWFkY3J1bWJzJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFkY3J1bWJzQ29udGFpbmVyLmZpbmQoJy5kcm9wZG93bi1tZW51JykuYXBwZW5kKGJyZWFkY3J1bWJzKTtcblxuICAgICAgICAgICAgICAgICAgICAvL1RPRE8gTW92ZSB0aGlzIHN0dWZmLCBidXQgd2hlcmUuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgICAgICAgICAgICBpZiAoXy5sYXN0KCRzY29wZS4kYnJlYWRjcnVtYnMpLnR5cGUgPT0gJ1BST0RVQ1RfRkFNSUxZJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWRjcnVtYnNDb250YWluZXIuYWRkQ2xhc3MoJ2RhcmstYnJlYWRjcnVtYicpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgYnJlYWRjcnVtYnNDb250YWluZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCcuZHJvcGRvd24tdG9nZ2xlJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC50ZXh0KF8ubGFzdCgkc2NvcGUuJGJyZWFkY3J1bWJzKS5uYW1lKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNhdGFsb2cuZGlyZWN0aXZlJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnb2NzRGF0YVRhYmxlJywgT2NzRGF0YVRhYmxlKTtcblxuICAgIE9jc0RhdGFUYWJsZS4kaW5qZWN0ID0gWyckdGltZW91dCcsICdfJ107XG5cblxuICAgIGZ1bmN0aW9uIE9jc0RhdGFUYWJsZSgkdGltZW91dCwgXykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIG9jc0RhdGFUYWJsZTogJz0nLFxuICAgICAgICAgICAgICAgIG9kdFJlc3BvbnNpdmVDaGFuZ2U6ICcmJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2goJ29jc0RhdGFUYWJsZScsIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5EYXRhVGFibGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQub2ZmKCdyZXNwb25zaXZlLXJlc2l6ZS5kdCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5vbigncmVzcG9uc2l2ZS1yZXNpemUuZHQnLCBmdW5jdGlvbiAoZSwgdGFibGUsIGNvbHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5vZHRSZXNwb25zaXZlQ2hhbmdlKHskZXZlbnQ6IGUsICR0YWJsZTogdGFibGUsICRjb2x1bW5zOiBjb2xzfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jYXRhbG9nLmRpcmVjdGl2ZScpXG4gICAgICAgIC5kaXJlY3RpdmUoJ29jc05hdmlnYXRlJywgT2NzTmF2aWdhdGVEaXJlY3RpdmUpO1xuXG4gICAgT2NzTmF2aWdhdGVEaXJlY3RpdmUuJGluamVjdCA9IFsnQ2F0YWxvZ1NlcnZpY2UnXTtcblxuICAgIGZ1bmN0aW9uIE9jc05hdmlnYXRlRGlyZWN0aXZlKENhdGFsb2dTZXJ2aWNlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgb2NzTmF2aWdhdGU6ICc9J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJyRlbGVtZW50JywgJyRhdHRycycsIGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2goJ29jc05hdmlnYXRlJywgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICAgICAgICB2YWwgJiYgQ2F0YWxvZ1NlcnZpY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXNvbHZlVXJpRnJvbUhpZXJhcmNoeSh2YWwpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAodXJpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hdHRyKCdocmVmJywgdXJpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmZpbHRlcihmdW5jdGlvbiAoaWR4LCBlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICEkKGVsKS5hdHRyKCd0YXJnZXQnKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ3RhcmdldCcsICdfc2VsZicpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XVxuICAgICAgICB9XG4gICAgfVxuXG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNhdGFsb2cuZGlyZWN0aXZlJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnc2Nyb2xsYWJsZVRhYmxlQ2FyZCcsIFNjcm9sbGFibGVUYWJsZUNhcmQpO1xuXG4gICAgZnVuY3Rpb24gU2Nyb2xsYWJsZVRhYmxlQ2FyZCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogWyckc2NvcGUnLCAnJGVsZW1lbnQnLCAnJGF0dHJzJywgZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgICAgICQoJy5mcy10YWJsZS1zY3JvbGxhYmxlIC5qcy1zbGljay1zbGlkZXInKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgJHRoaXNUYWJsZSA9ICQodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2aWV3cG9ydFdpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJsZVNsaWRlckVsZW1lbnRzID0gJHRoaXNUYWJsZS5maW5kKFwiLmNhcmRcIik7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJsZVNsaWRlckVsZW1lbnRzQW1vdW50ID0gJCh0YWJsZVNsaWRlckVsZW1lbnRzKS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9kZXNrdG9wXG4gICAgICAgICAgICAgICAgICAgIGlmICh2aWV3cG9ydFdpZHRoID4gOTkxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFibGVTbGlkZXJFbGVtZW50c0Ftb3VudCA8IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGhpc1RhYmxlLmFkZENsYXNzKFwianMtZnVsbC13aWR0aC1zbGljay10cmFja1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXNUYWJsZS5yZW1vdmVDbGFzcyhcImpzLWZ1bGwtd2lkdGgtc2xpY2stdHJhY2tcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvL3RhYmxldFxuICAgICAgICAgICAgICAgICAgICBpZiAoKHZpZXdwb3J0V2lkdGggPCA5OTIpICYmICh2aWV3cG9ydFdpZHRoID4gNzY3KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhYmxlU2xpZGVyRWxlbWVudHNBbW91bnQgPCAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXNUYWJsZS5hZGRDbGFzcyhcImpzLWZ1bGwtd2lkdGgtc2xpY2stdHJhY2tcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzVGFibGUucmVtb3ZlQ2xhc3MoXCJqcy1mdWxsLXdpZHRoLXNsaWNrLXRyYWNrXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUuJGxhc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9zY3JvbGxhYmxlIHRhYmxlIHNsaWRlci13cmFwcGVyIGluc3RhbmNlXG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJsZVNsaWRlciA9ICQoXCIuZnMtdGFibGUtc2Nyb2xsYWJsZSAuc2Nyb2xsYWJsZS10YWJsZS13cmFwcGVyXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vc2Nyb2xsYWJsZSB0YWJsZSBzbGlkZXItd3JhcHBlciBpbnN0YW5jZSAoZWxlbWVudClcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlU2xpZGVyRWxlbWVudCA9ICQodGFibGVTbGlkZXIpLmZpbmQoXCIuY2FyZFwiKTtcblxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YWJsZVNsaWRlci5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vbG9vcCB0aHJvdWdoIEFMTCBhdmFpbGFibGUgVGFibGUtRWxlbWVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGFibGVTbGlkZXJFbGVtZW50KS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkdGhpc0VsZW1lbnQgPSAkKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9hZGQgdGFibGUtcm93LVtyb3ctY291bnRdLWNsYXNzIHRvIEFMTCBUYWJsZS1FbGVtZW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzRWxlbWVudC5maW5kKFwidHJcIikuZWFjaChmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkdGhpc1JvdyA9ICQodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzUm93LmFkZENsYXNzKFwidGFibGUtcm93LVwiICsgKGkgKyAxKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2Z1bmN0aW9uIHRvIGVxdWFsaXplIHRhYmxlIHJvd3NcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlcXVhbEhlaWdodHNSb3cgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vbG9vcCB0aHJvdWdoIGFsbCB0YWJsZSBzbGlkZXJzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0YWJsZVNsaWRlcikuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyICR0aGlzU2xpZGVyID0gJCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJvd3NDb3VudCA9ICQodGhpcykuZmluZChcIi5jYXJkOmZpcnN0LW9mLXR5cGUgdHJcIikubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vbG9vcCB0aHJvdWdoIGFtb3VudCBvZiB0YWJsZSByb3dzIGluIHRhYmxlIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDE7IGkgPD0gcm93c0NvdW50OyBpKyspIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyICR0aGlzU2xpZGVyUm93cyA9ICQodGhpcykuZmluZChcInRyLnRhYmxlLXJvdy1cIiArIGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1heEhlaWdodCA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzU2xpZGVyUm93cy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmhlaWdodCgpID4gbWF4SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heEhlaWdodCA9ICQodGhpcykuaGVpZ2h0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzU2xpZGVyUm93cy5oZWlnaHQobWF4SGVpZ2h0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzZXRIZWlnaHRzUm93ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9yZXNldCBoZWlnaHRzIGZvciB3aW5kb3cgY2hhbmdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChcIi5mcy10YWJsZS1zY3JvbGxhYmxlIC5zY3JvbGxhYmxlLXRhYmxlLXdyYXBwZXIgLmNhcmQgdHJcIikuaGVpZ2h0KDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzZXRIZWlnaHRzUm93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcXVhbEhlaWdodHNSb3coKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1dXG4gICAgICAgIH1cbiAgICB9XG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY2F0YWxvZy5kaXJlY3RpdmUnKVxuICAgICAgICAuZGlyZWN0aXZlKCduYXZMYW5nJywgU3dpdGNoTGFuZ3VhZ2UpO1xuXG4gICAgU3dpdGNoTGFuZ3VhZ2UuJGluamVjdCA9IFsndXJsUGFyc2VyU2VydmljZScsICdDYXRhbG9nU2VydmljZScsICdsb2NhbGUnLCAnJHdpbmRvdyddO1xuXG4gICAgZnVuY3Rpb24gU3dpdGNoTGFuZ3VhZ2UodXJsUGFyc2VyU2VydmljZSwgY2F0YWxvZ1NlcnZpY2UsIGxvY2FsZSwgJHdpbmRvdykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQUMnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogWyckc2NvcGUnLCAnJGVsZW1lbnQnLCAnJGF0dHJzJywgZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgICAgIGlmICh1cmxQYXJzZXJTZXJ2aWNlLmlzT0NTKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgLmNoaWxkcmVuKCdsaScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxpbmsgPSBhbmd1bGFyLmVsZW1lbnQoZWwpLmNoaWxkcmVuKCdhJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhbmd1YWdlID0gbGluay5jaGlsZHJlbignc3BhbicpLnRleHQoKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3TG9jYWxlID0gbG9jYWxlLnRvU3RyaW5nKCkucmVwbGFjZShsb2NhbGUubGFuZ3VhZ2UsIGxhbmd1YWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0YWxvZ1NlcnZpY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXNvbHZlVXJpRnJvbUhpZXJhcmNoeShjYXRhbG9nU2VydmljZS5nZXRJZEZyb21Mb2NhdGlvbigpLCBuZXdMb2NhbGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAodXJpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdXJsUGFyc2VyU2VydmljZS5zZXRMYW5ndWFnZSh1cmksIGxhbmd1YWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfV1cbiAgICAgICAgfVxuICAgIH1cblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jYXRhbG9nLmRpcmVjdGl2ZScpXG4gICAgICAgIC5kaXJlY3RpdmUoJ3N5bmNocm9uaXplSGVpZ2h0JywgU3luY2hyb25pemVIZWlnaHQpO1xuXG4gICAgU3luY2hyb25pemVIZWlnaHQuJGluamVjdCA9IFsnJHRpbWVvdXQnXTtcblxuICAgIGZ1bmN0aW9uIFN5bmNocm9uaXplSGVpZ2h0KCR0aW1lb3V0KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5lbGVtZW50KGRvY3VtZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoJy5jYXJkLmNhcmQtY29sdW1uIHRhYmxlIHRyJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5lcShzY29wZS4kaW5kZXggKyAxKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnaGVpZ2h0JywgZWxlbWVudC5jc3MoJ2hlaWdodCcpKTtcbiAgICAgICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY2F0YWxvZy5mYWN0b3J5JylcbiAgICAgICAgLmZhY3RvcnkoJ3VybEJ1aWxkZXInLCBVcmxCdWlsZGVyKTtcblxuICAgIFVybEJ1aWxkZXIuJGluamVjdCA9IFsnJGluamVjdG9yJ107XG5cbiAgICBmdW5jdGlvbiBVcmxCdWlsZGVyKCRpbmplY3Rvcikge1xuICAgICAgICByZXR1cm4gJGluamVjdG9yLmdldCgnc2VvRnJpZW5kbHlVcmxCdWlsZGVyJyk7XG4gICAgfVxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jYXRhbG9nLm1vZGVsJylcbiAgICAgICAgLmZhY3RvcnkoJ0NhdGFsb2dIZWxwZXInLCBDYXRhbG9nSGVscGVyKTtcblxuICAgIGZ1bmN0aW9uIENhdGFsb2dIZWxwZXIoKSB7XG4gICAgICAgIHRoaXMudG9WaWV3ID0gZnVuY3Rpb24gKGNhdGFsb2cpIHtcbiAgICAgICAgICAgIGNhdGFsb2cuZGVzY3JpcHRpb24gPSBjYXRhbG9nLmRlc2NyaXB0aW9uTG9uZztcbiAgICAgICAgICAgIGNhdGFsb2cudGl0bGUgPSBjYXRhbG9nLmRlc2NyaXB0aW9uU2hvcnQ7XG4gICAgICAgICAgICBjYXRhbG9nLmltYWdlID0gY2F0YWxvZy5rZXlWaXN1YWwgfHwgY2F0YWxvZy5wcm9kdWN0aW1hZ2U7XG4gICAgICAgICAgICBjYXRhbG9nLnNob3dJbWFnZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gISFjYXRhbG9nLmtleVZpc3VhbDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjYXRhbG9nLnNob3dUaWxlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2F0YWxvZy5pc1Jvb3RDYXRhbG9nKCkgfHwgY2F0YWxvZy5pc1N1YkNhdGFsb2coKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjYXRhbG9nLnRpbGVzID0gXy5tYXAoY2F0YWxvZy5jaGlsZHJlbiwgZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGNoaWxkLmlkLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBjaGlsZC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogY2hpbGQuaGVhZGxpbmUsXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBjaGlsZC5kZXNjcmlwdGlvblNob3J0LFxuICAgICAgICAgICAgICAgICAgICBpbWFnZTogY2hpbGQuY2F0ZWdvcnlJbWFnZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY2F0YWxvZy5zaG93TGlzdCA9IGNhdGFsb2cuaXNMZWFmQ2F0YWxvZztcbiAgICAgICAgICAgIGNhdGFsb2cubGlzdCA9IF8ubWFwKGNhdGFsb2cuY2hpbGRyZW4sIGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiBjaGlsZC5pZCxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogY2hpbGQubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGNoaWxkLnByb2R1Y3RuYW1lLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZTogY2hpbGQucHJvZHVjdGNhdGVnb3J5aW1hZ2UsXG4gICAgICAgICAgICAgICAgICAgIG5ldzogY2hpbGQubmV3LFxuICAgICAgICAgICAgICAgICAgICBidWxsZXRzOiBfLmhhcyhjaGlsZCwgJ2hpZ2hsaWdodENhdE92ZXJ2aWV3LnZhbHVlLmVsZW1lbnRzJykgJiYgY2hpbGQuaGlnaGxpZ2h0Q2F0T3ZlcnZpZXcudmFsdWUuZWxlbWVudHNcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY2F0YWxvZy5zaG93VGVhc2VyID0gY2F0YWxvZy5pc1Byb2R1Y3RGYW1pbHk7XG4gICAgICAgICAgICBjYXRhbG9nLm5ldyA9IGNhdGFsb2cubmV1aGVpdE9jcztcbiAgICAgICAgICAgIGNhdGFsb2cubmV3SW1hZ2UgPSAnL21lZGlhL25ldy5wbmcnO1xuICAgICAgICAgICAgY2F0YWxvZy5uYW1lID0gY2F0YWxvZy5oZWFkbGluZSB8fCBjYXRhbG9nLnByb2R1Y3RuYW1lO1xuICAgICAgICAgICAgY2F0YWxvZy5lbmVyZ3lFZmZpY2llbmN5ID0ge1xuICAgICAgICAgICAgICAgIGltYWdlOiBjYXRhbG9nLm1haW5FcnBMYWJlbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNhdGFsb2cuc2hvd1RlY2huaWNhbEluZm9ybWF0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfLmhhcyhjYXRhbG9nLCAnaGlnaGxpZ2h0cy52YWx1ZS5lbGVtZW50cycpICYmIGNhdGFsb2cuaGlnaGxpZ2h0cy52YWx1ZS5lbGVtZW50cy5sZW5ndGg7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY2F0YWxvZy50ZWNobmljYWxJbmZvcm1hdGlvbiA9IF8uaGFzKGNhdGFsb2csICdoaWdobGlnaHRzLnZhbHVlLmVsZW1lbnRzJykgICYmIGNhdGFsb2cuaGlnaGxpZ2h0cy52YWx1ZS5lbGVtZW50cztcbiAgICAgICAgICAgIGNhdGFsb2cuc2hvd01vcmVEZXRhaWxzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfLnNpemUoY2F0YWxvZy5zdWJoZWFkbGluZXMpID4gMDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjYXRhbG9nLnN1YmhlYWRsaW5lcyA9IChmdW5jdGlvbiAoY2F0YWxvZykge1xuICAgICAgICAgICAgICAgIHZhciBpID0gMTtcbiAgICAgICAgICAgICAgICB2YXIgc3ViaGVhZGxpbmUgPSBjYXRhbG9nLmRldGFpbHNTdWJoZWFkbGluZTE7XG4gICAgICAgICAgICAgICAgdmFyIGRlc2NyaXB0aW9uID0gY2F0YWxvZy5kZXRhaWxzRGVzY3JpcHRpb24xO1xuICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9IGNhdGFsb2cuZGV0YWlsc0ltYWdlMTtcbiAgICAgICAgICAgICAgICB2YXIgc3ViaGVhZGxpbmVzID0gW107XG4gICAgICAgICAgICAgICAgd2hpbGUoc3ViaGVhZGxpbmUgIT0gbnVsbCB8fCBkZXNjcmlwdGlvbiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YmhlYWRsaW5lcy5wdXNoKHt0aXRsZTogc3ViaGVhZGxpbmUgJiYgc3ViaGVhZGxpbmUudmFsdWUsIGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbiAmJiBkZXNjcmlwdGlvbi52YWx1ZSwgaW1hZ2U6IGltYWdlICYmIGltYWdlLnZhbHVlfSk7XG4gICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb24gPSBjYXRhbG9nWydkZXRhaWxzRGVzY3JpcHRpb24nICsgaV07XG4gICAgICAgICAgICAgICAgICAgIHN1YmhlYWRsaW5lID0gY2F0YWxvZ1snZGV0YWlsc1N1YmhlYWRsaW5lJyArIGldO1xuICAgICAgICAgICAgICAgICAgICBpbWFnZSA9IGNhdGFsb2dbJ2RldGFpbHNJbWFnZScgKyBpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1YmhlYWRsaW5lcztcbiAgICAgICAgICAgIH0pKGNhdGFsb2cpO1xuICAgICAgICAgICAgY2F0YWxvZy5tb3JlRGV0YWlscyA9IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogY2F0YWxvZy5oZWFkbGluZU92ZXJ2aWV3LFxuICAgICAgICAgICAgICAgIGVsZW1lbnRzOiBjYXRhbG9nLnN1YmhlYWRsaW5lc1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY2F0YWxvZy5zaG93VGVjaG5pY2FsVGFibGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhdGFsb2cucHJvZHVjdFRhYmxlRGVmaW5pdGlvbiAmJiBjYXRhbG9nLmNoaWxkcmVuOyAvL0ZJWE1FIFRha2UgbG9naWMgZnJvbSBjb250cm9sbGVyLCBNYWtlIHRoaXMgY3VzdG9taXphYmxlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY2F0YWxvZy5zaG93Rm9vdG5vdGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYXRhbG9nLmZvb3Rub3Rlc1RlY2hEYXRhO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNhdGFsb2cuZm9vdG5vdGVzID0gY2F0YWxvZy5mb290bm90ZXNUZWNoRGF0YTtcbiAgICAgICAgICAgIHJldHVybiBjYXRhbG9nO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMudG9UZW1wbGF0ZVZpZXcgPSBmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBmaW5kU2VjdGlvbihzZWN0aW9ucywgbmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIF8uZmluZChzZWN0aW9ucywge25hbWU6IG5hbWV9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24oYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNhdGFsb2cubW9kZWwnKVxuICAgICAgICAuY29uZmlnKENhdGFsb2dDb25maWcpO1xuXG4gICAgQ2F0YWxvZ0NvbmZpZy4kaW5qZWN0ID0gWydlbnYnLCAnQ2F0YWxvZ1Byb3ZpZGVyJ107XG5cbiAgICBmdW5jdGlvbiBDYXRhbG9nQ29uZmlnKGVudiwgY2F0YWxvZ01vZGVsUHJvdmlkZXIpIHtcbiAgICAgICAgY2F0YWxvZ01vZGVsUHJvdmlkZXJcbiAgICAgICAgICAgIC5wcm9kdWN0RGF0YVNlcnZpY2VFbmRQb2ludChlbnYuZW5kUG9pbnQucHJvZHVjdERhdGFTZXJ2aWNlKVxuICAgICAgICAgICAgLmNvbnRlbnRTZXJ2aWNlRW5kUG9pbnQoZW52LmVuZFBvaW50LmNvbnRlbnRTZXJ2aWNlKTtcbiAgICB9XG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY2F0YWxvZy5tb2RlbCcpXG4gICAgICAgIC5wcm92aWRlcignQ2F0YWxvZycsIGZ1bmN0aW9uIENhdGFsb2dQcm92aWRlcigpIHtcbiAgICAgICAgICAgIHZhciBwZHNVcmwgPSBudWxsO1xuICAgICAgICAgICAgdmFyIGNzVXJsID0gbnVsbDtcblxuICAgICAgICAgICAgdGhpcy5wcm9kdWN0RGF0YVNlcnZpY2VFbmRQb2ludCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHBkc1VybCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5jb250ZW50U2VydmljZUVuZFBvaW50ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgY3NVcmwgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuJGdldCA9IFsnJHJlc291cmNlJywgJyRjYWNoZUZhY3RvcnknLCAnbG9jYWxlJywgJyRodHRwJywgJ18nLCAnQ2F0YWxvZ0hlbHBlcicsIGZ1bmN0aW9uICgkcmVzb3VyY2UsICRjYWNoZUZhY3RvcnksIGxvY2FsZSwgJGh0dHAsIF8sIENhdGFsb2dIZWxwZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENhdGFsb2coJHJlc291cmNlLCAkY2FjaGVGYWN0b3J5LCBsb2NhbGUsIHBkc1VybCwgY3NVcmwsICRodHRwLCBfLCBDYXRhbG9nSGVscGVyKTtcbiAgICAgICAgICAgIH1dO1xuICAgICAgICB9KTtcblxuICAgIGZ1bmN0aW9uIENhdGFsb2coJHJlc291cmNlLCAkY2FjaGVGYWN0b3J5LCBsb2NhbGUsIHBkc1VybCwgY3NVcmwsICRodHRwLCBfLCBjYXRhbG9nSGVscGVyKSB7XG4gICAgICAgIHZhciBjYXRhbG9nQ2FjaGUgPSAkY2FjaGVGYWN0b3J5KFwiY2F0YWxvZ1wiKTtcbiAgICAgICAgdmFyIGN1c3RvbVRyYW5zZm9ybWF0aW9ucyA9IFtyZWRpcmVjdENoaWxkcmVuXTtcbiAgICAgICAgdmFyIHRyYW5zZm9ybWF0aW9ucyA9ICRodHRwLmRlZmF1bHRzLnRyYW5zZm9ybVJlc3BvbnNlLmNvbmNhdChjdXN0b21UcmFuc2Zvcm1hdGlvbnMpO1xuICAgICAgICB2YXIgdHJhbnNmb3JtUmVzcG9uc2UgPSBmdW5jdGlvbiAoZGF0YSwgaGVhZGVycywgc3RhdHVzKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gZGF0YTtcbiAgICAgICAgICAgIF8uZWFjaCh0cmFuc2Zvcm1hdGlvbnMsIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdChyZXN1bHQsIGhlYWRlcnMsIHN0YXR1cyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBDYXRhbG9nUmVzb3VyY2UgPSAkcmVzb3VyY2UocGRzVXJsICsgJzpsb2NhbGUvOnR5cGUvOnF1ZXJ5VHlwZS86aWQnLCBudWxsLCB7XG4gICAgICAgICAgICAgICAgZ2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtczoge2xvY2FsZTogbG9jYWxlLCBxdWVyeVR5cGU6ICdpZCd9LFxuICAgICAgICAgICAgICAgICAgICBjYWNoZTogY2F0YWxvZ0NhY2hlLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1SZXNwb25zZTogZnVuY3Rpb24gKGRhdGEsIGhlYWRlcnMsIHN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRvQ2F0YWxvZ1ZpZXcodHJhbnNmb3JtUmVzcG9uc2UoZGF0YSwgaGVhZGVycywgc3RhdHVzKSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcXVlcnk6IHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgaXNBcnJheTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiB7bG9jYWxlOiBsb2NhbGV9LFxuICAgICAgICAgICAgICAgICAgICBjYWNoZTogY2F0YWxvZ0NhY2hlXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZToge1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBjc1VybCArICdyZXN0L2RvY3VtZW50L2Rpc3BsYXknLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1SZXNwb25zZTogZnVuY3Rpb24gKGRhdGEsIGhlYWRlcnMsIHN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRvQ2F0YWxvZ1RlbXBsYXRlVmlldyh0cmFuc2Zvcm1SZXNwb25zZShkYXRhLCBoZWFkZXJzLCBzdGF0dXMpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICBmdW5jdGlvbiByZWRpcmVjdENoaWxkcmVuKGRhdGEsIGhlYWRlcnMsIHN0YXR1cykge1xuICAgICAgICAgICAgZGF0YS5jaGlsZHJlbiA9IF8ubWFwKGRhdGEuY2hpbGRyZW4sIGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZC5yZWRpcmVjdENhdGVnb3J5ID8gY2hpbGQucmVkaXJlY3RDYXRlZ29yeSA6IGNoaWxkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHRvQ2F0YWxvZ1ZpZXcoY2F0YWxvZykge1xuICAgICAgICAgICAgcmV0dXJuIGNhdGFsb2dIZWxwZXIudG9WaWV3KGNhdGFsb2cpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdG9DYXRhbG9nVGVtcGxhdGVWaWV3KGNhdGFsb2cpIHtcbiAgICAgICAgICAgIHJldHVybiBjYXRhbG9nSGVscGVyLnRvVGVtcGxhdGVWaWV3KGNhdGFsb2cpO1xuICAgICAgICB9XG5cbiAgICAgICAgQ2F0YWxvZ1Jlc291cmNlLnByb3RvdHlwZS5pc0xlYWZDYXRhbG9nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VHlwZSgpID09ICdsZWFmX2NhdGVnb3J5JztcbiAgICAgICAgfTtcblxuICAgICAgICBDYXRhbG9nUmVzb3VyY2UucHJvdG90eXBlLmlzUHJvZHVjdEZhbWlseSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFR5cGUoKSA9PSAncHJvZHVjdF9mYW1pbHknO1xuICAgICAgICB9O1xuXG4gICAgICAgIENhdGFsb2dSZXNvdXJjZS5wcm90b3R5cGUuaXNTdWJDYXRhbG9nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VHlwZSgpID09ICdzdWJfY2F0ZWdvcnknO1xuICAgICAgICB9O1xuXG4gICAgICAgIENhdGFsb2dSZXNvdXJjZS5wcm90b3R5cGUuaXNSb290Q2F0YWxvZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFR5cGUoKSA9PSAncm9vdF9jYXRlZ29yeSc7XG4gICAgICAgIH07XG5cbiAgICAgICAgQ2F0YWxvZ1Jlc291cmNlLnByb3RvdHlwZS5nZXRUeXBlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50eXBlID8gdGhpcy50eXBlLnZhbHVlLnRvTG93ZXJDYXNlKCkgOiBTdHJpbmcoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBDYXRhbG9nUmVzb3VyY2UucHJvdG90eXBlLnRlY2huaWNhbERhdGFUYWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWN0aW9uID0gXy5maW5kKHRoaXMuc2VjdGlvbnMsIHtuYW1lOiAnVEVDSE5JQ0FMX0RBVEFfVEFCTEUnfSk7XG4gICAgICAgICAgICByZXR1cm4gc2VjdGlvbiAmJiBzZWN0aW9uLnBhcmFtcztcbiAgICAgICAgfTtcblxuICAgICAgICBDYXRhbG9nUmVzb3VyY2UuZmFsbGJhY2tUeXBlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICdQUk9EVUNUX0ZBTUlMWSc7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIENhdGFsb2dSZXNvdXJjZTtcbiAgICB9XG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jYXRhbG9nLnJvdXRlJylcbiAgICAgICAgLmNvbmZpZyhSb3V0ZUNvbmZpZyk7XG5cbiAgICBSb3V0ZUNvbmZpZy4kaW5qZWN0ID0gWyckc3RhdGVQcm92aWRlciddO1xuXG4gICAgZnVuY3Rpb24gUm91dGVDb25maWcoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIucGRzUm91dGUoe1xuICAgICAgICAgICAgbmFtZTogJ2NhdGFsb2cnLFxuICAgICAgICAgICAgdXJsOiAne2NhdFVybDouKi1bY3BdWy9dP30nLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjYXRhbG9nMy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDYXRhbG9nQ29udHJvbGxlciBhcyB2bScsXG4gICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgcmVkaXJlY3Q6IFsnTWV0YVNlcnZpY2UnLCBmdW5jdGlvbiAobWV0YVNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1ldGFTZXJ2aWNlLnJlZGlyZWN0T25JbnZhbGlkVXJsKCk7XG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24oYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZShcInBkcy5jYXRhbG9nLnNlcnZpY2VcIilcbiAgICAgICAgLnNlcnZpY2UoXCJCcmVhZGNydW1iU2VydmljZVwiLCBCcmVhZGNydW1iU2VydmljZSk7XG5cbiAgICBCcmVhZGNydW1iU2VydmljZS4kaW5qZWN0ID0gWydDYXRhbG9nU2VydmljZScsICdfJywgJyRxJ107XG5cbiAgICBmdW5jdGlvbiBCcmVhZGNydW1iU2VydmljZShDYXRhbG9nU2VydmljZSwgXywgJHEpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJ1aWxkOiBidWlsZFxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGJ1aWxkKGNhdGVnb3J5SWQpIHtcbiAgICAgICAgICAgIHJldHVybiBDYXRhbG9nU2VydmljZVxuICAgICAgICAgICAgICAgIC50cmF2ZWxVcE5hdmlnYXRpb25IaWVyYXJjaHkoY2F0ZWdvcnlJZClcbiAgICAgICAgICAgICAgICAudGhlbihkZWNvcmF0ZVdpdGhVcmxzKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICh0cmVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2hhaW4odHJlZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogbm9kZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogbm9kZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IG5vZGUudXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBub2RlLnR5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnZhbHVlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkZWNvcmF0ZVdpdGhVcmxzKHRyZWUpIHtcbiAgICAgICAgICAgIHJldHVybiAkcVxuICAgICAgICAgICAgICAgIC5hbGwoXy5tYXAodHJlZSwgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIENhdGFsb2dTZXJ2aWNlXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVzb2x2ZVVyaUZyb21IaWVyYXJjaHkobm9kZS5pZClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLnVybCA9IHVybDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRyZWU7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24oYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZShcInBkcy5jYXRhbG9nLnNlcnZpY2VcIilcbiAgICAgICAgLnNlcnZpY2UoXCJDYXRhbG9nU2VydmljZVwiLCBDYXRhbG9nU2VydmljZSk7XG5cbiAgICBDYXRhbG9nU2VydmljZS4kaW5qZWN0ID0gWyckd2luZG93JywgJ0NhdGFsb2cnLCAnTWVudVNlcnZpY2UnLCAnU2VvRnJpZW5kbHlVcmxCdWlsZGVyJywgJ2NhdGFsb2dTZWFyY2hMaXN0ZW5lcicsICdfJywgJyRxJywgJ2xvY2FsZSddO1xuXG4gICAgZnVuY3Rpb24gQ2F0YWxvZ1NlcnZpY2UoJHdpbmRvdywgQ2F0YWxvZywgbWVudVNlcnZpY2UsIFNlb0ZyaWVuZGx5VXJsQnVpbGRlciwgY2F0YWxvZ1NlYXJjaExpc3RlbmVyLCBfLCAkcSwgbG9jYWxlKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHByb2R1Y3RQcmVmaXggPSAncCc7XG4gICAgICAgIHZhciBjYXRlZ29yeVByZWZpeCA9ICdjJztcblxuICAgICAgICBjYXRhbG9nU2VhcmNoTGlzdGVuZXJcbiAgICAgICAgICAgIC5saXN0ZW4oKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlVXJpRnJvbUhpZXJhcmNoeShwYXJhbXMudGFyZ2V0LnJlc291cmNlSWQpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICh1cmkpIHtcbiAgICAgICAgICAgICAgICAkd2luZG93LmxvY2F0aW9uLmhyZWYgPSB1cmk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZ2V0QnlUYWc6IGdldEJ5VGFnLFxuICAgICAgICAgICAgZ2V0TmV3UHJvZHVjdEZhbWlsaWVzOiBnZXROZXdQcm9kdWN0RmFtaWxpZXMsXG4gICAgICAgICAgICBnZXRCeUlkOiBnZXRCeUlkLFxuICAgICAgICAgICAgZ2V0VGVtcGxhdGU6IGdldFRlbXBsYXRlLFxuICAgICAgICAgICAgZ2V0QnlJZEFuZFR5cGU6IGdldEJ5SWRBbmRUeXBlLFxuICAgICAgICAgICAgcmVkaXJlY3RUbzogbmF2aWdhdGVUbyxcbiAgICAgICAgICAgIG5hdmlnYXRlVG86IG5hdmlnYXRlVG8sXG4gICAgICAgICAgICB0cmF2ZWxVcEhpZXJhcmNoeTogdHJhdmVsVXBIaWVyYXJjaHksXG4gICAgICAgICAgICB0cmF2ZWxVcE5hdmlnYXRpb25IaWVyYXJjaHk6IHRyYXZlbFVwTmF2aWdhdGlvbkhpZXJhcmNoeSxcbiAgICAgICAgICAgIGdldElkRnJvbUxvY2F0aW9uOiBnZXRJZEZyb21Mb2NhdGlvbixcbiAgICAgICAgICAgIHJlc29sdmVVcmk6IHJlc29sdmVVcmksXG4gICAgICAgICAgICByZXNvbHZlVXJpRnJvbUhpZXJhcmNoeTogcmVzb2x2ZVVyaUZyb21IaWVyYXJjaHksXG4gICAgICAgICAgICBnZXRQcm9kdWN0RmFtaWx5OiBnZXRQcm9kdWN0RmFtaWx5XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0QnlUYWcodHlwZSwgdGFnKSB7XG4gICAgICAgICAgICByZXR1cm4gQ2F0YWxvZy5xdWVyeSh7dHlwZTogdHlwZSwgaWQ6IHRhZywgcXVlcnlUeXBlOiAndGFnJ30pLiRwcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0TmV3UHJvZHVjdEZhbWlsaWVzKCkge1xuICAgICAgICAgICAgcmV0dXJuIGdldEJ5VGFnKENhdGFsb2cuZmFsbGJhY2tUeXBlKCksIFwibmV3XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0QnlJZChjYXRlZ29yeUlkKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0VHlwZUZyb21IaWVyYXJjaHkoY2F0ZWdvcnlJZClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAodHlwZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQ2F0YWxvZy5nZXQoe2lkOiBjYXRlZ29yeUlkLCB0eXBlOiB0eXBlfSkuJHByb21pc2U7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRUZW1wbGF0ZShjYXRhbG9nSWQpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRUeXBlRnJvbUhpZXJhcmNoeShjYXRhbG9nSWQpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNhdGFsb2cgPSBuZXcgQ2F0YWxvZyh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZToge25hbWU6IHR5cGV9LFxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWw6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGU6IGxvY2FsZS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5uZWw6IGdldE9DU0NoYW5uZWwoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRhbG9nUmVxdWVzdDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogY2F0YWxvZ0lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFubmVsOiBnZXRPQ1NDaGFubmVsKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHR5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2F0YWxvZy4kdGVtcGxhdGUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldE9DU0NoYW5uZWwoKSB7XG4gICAgICAgICAgICByZXR1cm4gYW5ndWxhci5lbGVtZW50KCdtZXRhW25hbWU9XCJvY3MtY2hhbm5lbFwiXScpLmF0dHIoJ2NvbnRlbnQnKVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0QnlJZEFuZFR5cGUoaWQsIHR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBDYXRhbG9nLmdldCh7aWQ6IGlkLCB0eXBlOiB0eXBlfSkuJHByb21pc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRUeXBlRnJvbUhpZXJhcmNoeShpZCkge1xuICAgICAgICAgICAgcmV0dXJuIG1lbnVTZXJ2aWNlXG4gICAgICAgICAgICAgICAgLmZpbmRJbk5hdmlnYXRpb24oaWQpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGNhdGFsb2cpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhdGFsb2cgPyBjYXRhbG9nLnR5cGUgOiBDYXRhbG9nLmZhbGxiYWNrVHlwZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdHJhdmVsVXBIaWVyYXJjaHkoY2F0ZWdvcnlJZCwgdHJlZSkge1xuICAgICAgICAgICAgdHJlZSA9IHRyZWUgfHwgW107XG4gICAgICAgICAgICByZXR1cm4gZ2V0QnlJZChjYXRlZ29yeUlkKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyZWUucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogZGF0YS5pZC52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGRhdGEudHlwZS52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGRhdGEubmFtZS52YWx1ZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5wYXJlbnRJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRyYXZlbFVwSGllcmFyY2h5KGRhdGEucGFyZW50SWQudmFsdWUsIHRyZWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cmVlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdHJhdmVsVXBOYXZpZ2F0aW9uSGllcmFyY2h5KGNhdGVnb3J5SWQsIGxvY2FsZSkge1xuICAgICAgICAgICAgcmV0dXJuIG1lbnVTZXJ2aWNlXG4gICAgICAgICAgICAgICAgLmZpbmRJbk5hdmlnYXRpb24oY2F0ZWdvcnlJZCwgbG9jYWxlKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0cmVlID0gW107XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlKGl0ZW0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJlZS5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbSA9IG1lbnVTZXJ2aWNlLmZpbmRQYXJlbnRJbk5hdmlnYXRpb24oaXRlbS5pZCwgbG9jYWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEuYWxsKHRyZWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbmF2aWdhdGVUbyhpZCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmVVcmkoaWQpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHVyaSkge1xuICAgICAgICAgICAgICAgICAgICAkd2luZG93LmxvY2F0aW9uLmhyZWYgPSB1cmk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiByZXNvbHZlVXJpKGNhdGVnb3J5SWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cmF2ZWxVcEhpZXJhcmNoeShjYXRlZ29yeUlkKS50aGVuKGJ1aWxkVXJpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGJ1aWxkVXJpKHRyZWUpIHtcbiAgICAgICAgICAgIHZhciBidWlsZGVyID0gbmV3IFNlb0ZyaWVuZGx5VXJsQnVpbGRlcigpO1xuICAgICAgICAgICAgXy5mb3JFYWNoUmlnaHQodHJlZSwgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZnJhZ21lbnRzID0gW25vZGUubmFtZV07XG4gICAgICAgICAgICAgICAgaWYgKHRyZWUuaW5kZXhPZihub2RlKSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGZyYWdtZW50cy5wdXNoKG5vZGUuaWQsIGNhdGVnb3J5UHJlZml4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnVpbGRlci5hZGRQYXRoKGZyYWdtZW50cyk7XG5cbiAgICAgICAgICAgICAgICBpZiAobm9kZS50eXBlID09IENhdGFsb2cuZmFsbGJhY2tUeXBlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgYnVpbGRlci5zZXRQYXRoKFtub2RlLm5hbWUsIG5vZGUuaWQsIHByb2R1Y3RQcmVmaXhdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBidWlsZGVyLmJ1aWxkKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiByZXNvbHZlVXJpRnJvbUhpZXJhcmNoeShjYXRlZ29yeUlkLCBsb2NhbGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0cmF2ZWxVcE5hdmlnYXRpb25IaWVyYXJjaHkoY2F0ZWdvcnlJZCwgbG9jYWxlKS50aGVuKGJ1aWxkVXJpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldElkRnJvbUxvY2F0aW9uKHVyaSkge1xuICAgICAgICAgICAgdXJpID0gdXJpIHx8IG5ldyBVUkkoKS50b1N0cmluZygpO1xuICAgICAgICAgICAgdmFyIHBhcnRzID0gdXJpLnNwbGl0KCctJyk7XG4gICAgICAgICAgICByZXR1cm4gcGFydHNbcGFydHMubGVuZ3RoIC0gMl07XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRQcm9kdWN0RmFtaWx5KHByb2R1Y3QpIHtcbiAgICAgICAgICAgIGlmICghcHJvZHVjdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZXNvbHZlKG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gcHJvZHVjdC5wYXJlbnRJZC52YWx1ZS5lbGVtZW50cyB8fCBbcHJvZHVjdC5wYXJlbnRJZC52YWx1ZV07XG4gICAgICAgICAgICByZXR1cm4gJHFcbiAgICAgICAgICAgICAgICAuYWxsKF8ubWFwKGVsZW1lbnRzLCBmdW5jdGlvbiAocGFyZW50SWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1lbnVTZXJ2aWNlLmZpbmRJbk5hdmlnYXRpb24ocGFyZW50SWQpIHx8IHt9O1xuICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChub2Rlcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXy5maW5kKG5vZGVzLCBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vZGUudHlwZSA9PT0gQ2F0YWxvZy5mYWxsYmFja1R5cGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY2F0YWxvZy5zZXJ2aWNlJylcbiAgICAgICAgLnNlcnZpY2UoJ01ldGFTZXJ2aWNlJywgTWV0YVNlcnZpY2UpO1xuXG4gICAgTWV0YVNlcnZpY2UuJGluamVjdCA9IFsnJHJvb3RTY29wZScsICckcScsICckbG9jYXRpb24nLCAnJHdpbmRvdycsICdDYXRhbG9nU2VydmljZScsICdpbWFnZVVybEZpbHRlcicsICdjb25maWcnLCAndXJsUGFyc2VyU2VydmljZSddO1xuXG4gICAgdmFyIFRJVExFX0RFTElNSVRFUiA9ICcgfCAnO1xuICAgIHZhciBMT0NBTEVfREVMSU1JVEVSID0gJy0nO1xuICAgIHZhciBMT0NBTEVfUFJPUEVSX0RFTElNSVRFUiA9ICdfJztcbiAgICB2YXIgUEFUSF9TRVBBUkFUT1IgPSAnLyc7XG5cbiAgICBmdW5jdGlvbiBNZXRhU2VydmljZSgkcm9vdFNjb3BlLCAkcSwgJGxvY2F0aW9uLCAkd2luZG93LCBDYXRhbG9nU2VydmljZSwgaW1hZ2VVcmxGaWx0ZXIsIGNvbmZpZywgdXJsUGFyc2VyU2VydmljZSkge1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB1cGRhdGVNZXRhQnlDYXRlZ29yeTogdXBkYXRlTWV0YUJ5Q2F0ZWdvcnksXG4gICAgICAgICAgICByZWRpcmVjdE9uSW52YWxpZFVybDogcmVkaXJlY3RPbkludmFsaWRVcmxcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVNZXRhQnlDYXRlZ29yeShjYXRhbG9nSWQpIHtcbiAgICAgICAgICAgIHZhciBleGNsdWRlSHJlZmxhbmdzID0gZmFsc2U7XG4gICAgICAgICAgICBDYXRhbG9nU2VydmljZVxuICAgICAgICAgICAgICAgIC5nZXRUZW1wbGF0ZShjYXRhbG9nSWQpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGN1cnJlbnRDYXRhbG9nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBDYXRhbG9nU2VydmljZVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRyYXZlbFVwTmF2aWdhdGlvbkhpZXJhcmNoeShjYXRhbG9nSWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAodHJlZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyZWVbMF0gPSBjdXJyZW50Q2F0YWxvZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJlZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHRyZWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHEgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudE5vZGUgPSB0cmVlWzBdO1xuICAgICAgICAgICAgICAgICAgICB0cmVlWzBdLm5hbWUgPSB0cmVlWzBdLm5hbWUudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoZWFkZXJUaXRsZSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdHJlZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRyZWVbaV0gJiYgdHJlZVtpXS5uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyVGl0bGUucHVzaCh0cmVlW2ldLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclRpdGxlLnB1c2goY29uZmlnLm1ldGFUYWdzLnNpdGVOYW1lKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSAoY3VycmVudE5vZGUua2V5VmlzdWFsIHx8IGN1cnJlbnROb2RlLnByb2R1Y3RpbWFnZSB8fCB7fSkudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHZhciBldmVudCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBoZWFkZXJUaXRsZS5qb2luKFRJVExFX0RFTElNSVRFUiksXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogKGN1cnJlbnROb2RlLnNlb01ldGFUZXh0IHx8IGN1cnJlbnROb2RlLmRlc2NyaXB0aW9uTG9uZyB8fCBjdXJyZW50Tm9kZS5kZXNjcmlwdGlvblNob3J0IHx8IHt9KS52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlOiBpbWFnZSA/IGltYWdlVXJsRmlsdGVyKGltYWdlKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpdGVOYW1lOiBjb25maWcubWV0YVRhZ3Muc2l0ZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWJUcmVuZHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZ19zOiB0cmVlWzBdID8gdHJlZVswXS5uYW1lIDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB6X2NnMzogdHJlZVsxXSA/IHRyZWVbMV0ubmFtZSA6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgel9jZzQ6IHRyZWVbMl0gPyB0cmVlWzJdLm5hbWUgOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgY2Fub25pY2FsVXJsOiAkbG9jYXRpb24uYWJzVXJsKClcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIShjdXJyZW50Tm9kZS5ibG9ja0Nhbm9uaWNhbFRhZyB8fCB7fSkudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjYW5vbmljYWxSZWYgPSAoY3VycmVudE5vZGUuY2Fub25pY2FsUmVmIHx8IHt9KS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNhbm9uaWNhbFJlZikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4Y2x1ZGVIcmVmbGFuZ3MgPSBjYW5vbmljYWxSZWYgIT0gY2F0YWxvZ0lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENhdGFsb2dTZXJ2aWNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXNvbHZlVXJpRnJvbUhpZXJhcmNoeShjYW5vbmljYWxSZWYpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LmNhbm9uaWNhbFVybCA9IHVybDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHEucmVzb2x2ZShldmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxLnJlc29sdmUoZXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHEucHJvbWlzZTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdwZHMuaGVhZGVyLnVwZGF0ZScsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChleGNsdWRlSHJlZmxhbmdzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJ2xpbmtbaHJlZmxhbmddJykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhclxuICAgICAgICAgICAgICAgICAgICAgICAgLmVsZW1lbnQoJ2xpbmtbaHJlZmxhbmddJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5lYWNoKGZ1bmN0aW9uIChpbmRleCwgbGluaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsaW5rT2JqZWN0ID0gYW5ndWxhci5lbGVtZW50KGxpbmspO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsb2NhbGUgPSBsaW5rT2JqZWN0LmF0dHIoJ2hyZWZsYW5nJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxlID0gbG9jYWxlLnNwbGl0KExPQ0FMRV9ERUxJTUlURVIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENhdGFsb2dTZXJ2aWNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXNvbHZlVXJpRnJvbUhpZXJhcmNoeShjYXRhbG9nSWQsIGxvY2FsZVswXSArIExPQ0FMRV9QUk9QRVJfREVMSU1JVEVSICsgbG9jYWxlWzFdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rT2JqZWN0LmF0dHIoJ2hyZWYnLCB1cmwucmVwbGFjZSgvXFwvW2Etel17Mn1cXC9bYS16XXsyfVxcLy8sIFBBVEhfU0VQQVJBVE9SICsgbG9jYWxlWzFdLnRvTG93ZXJDYXNlKCkgKyBQQVRIX1NFUEFSQVRPUiArIGxvY2FsZVswXS50b0xvd2VyQ2FzZSgpICArIFBBVEhfU0VQQVJBVE9SKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gISF1cmw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQgfHwgbGlua09iamVjdC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlZGlyZWN0T25JbnZhbGlkVXJsKCkge1xuICAgICAgICAgICAgcmV0dXJuIENhdGFsb2dTZXJ2aWNlXG4gICAgICAgICAgICAgICAgLnJlc29sdmVVcmlGcm9tSGllcmFyY2h5KHVybFBhcnNlclNlcnZpY2UuZ2V0Q2F0YWxvZ0lkKCkpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHVybCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZW5jb2RlVVJJKHVybCkgIT0gVVJJKCkudG9TdHJpbmcoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdXJsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY2F0YWxvZy5zZXJ2aWNlJylcbiAgICAgICAgLnNlcnZpY2UoJ2NhdGFsb2dTZWFyY2hMaXN0ZW5lcicsIENhdGFsb2dTZWFyY2hMaXN0ZW5lcik7XG5cbiAgICBDYXRhbG9nU2VhcmNoTGlzdGVuZXIuJGluamVjdCA9IFsnJHJvb3RTY29wZScsICckcScsICdlbnYnXTtcblxuICAgIGZ1bmN0aW9uIENhdGFsb2dTZWFyY2hMaXN0ZW5lcigkcm9vdCwgJHEsIGVudikge1xuICAgICAgICB0aGlzLmxpc3RlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWYgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgJHJvb3QuJG9uKCdwZHMuc2VhcmNoLm5hdmlnYXRlJywgZnVuY3Rpb24gKGV2ZW50LCBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyYW1zLnRhcmdldC5jaGFubmVsRGlzY3JpbWluYXRvciA9PSBlbnYuc2VhcmNoLnBkc0NoYW5uZWxEaXNjcmltaW5hdG9yIHx8IHBhcmFtcy50YXJnZXQucmVzb3VyY2VJZCkge1xuICAgICAgICAgICAgICAgICAgICBkZWYucmVzb2x2ZShwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRlZi5wcm9taXNlO1xuICAgICAgICB9XG4gICAgfVxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIsIFVSSSkge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNhdGFsb2cuc2VydmljZScpXG4gICAgICAgIC5mYWN0b3J5KCdTZW9GcmllbmRseVVybEJ1aWxkZXInLCBTZW9GcmllbmRseVVybEJ1aWxkZXJGYWN0b3J5KTtcblxuICAgIFNlb0ZyaWVuZGx5VXJsQnVpbGRlckZhY3RvcnkuJGluamVjdCA9IFsnJHdpbmRvdycsICdfJywgJ3NpbXBsaWZ5Q2hhcmFjdGVyc0ZpbHRlcicsICdjb25maWcnXTtcblxuICAgIHZhciBmcmFnbWVudFNlcGFyYXRvciA9ICctJztcbiAgICB2YXIgcGF0aFNlcGFyYXRvciA9ICcvJztcblxuICAgIGZ1bmN0aW9uIFNlb0ZyaWVuZGx5VXJsQnVpbGRlckZhY3RvcnkoJHdpbmRvdywgXywgc2ltcGxpZnlDaGFyYWN0ZXJzRmlsdGVyLCBjb25maWcpIHtcbiAgICAgICAgZnVuY3Rpb24gU2VvRnJpZW5kbHlVcmxCdWlsZGVyKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMucGF0aCA9IGJ1aWxkQmFzZVBhdGgoKTtcbiAgICAgICAgICAgIHRoaXMuc2ltcGxpZnlDaGFyYWN0ZXJzRmlsdGVyID0gc2ltcGxpZnlDaGFyYWN0ZXJzRmlsdGVyO1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIFNlb0ZyaWVuZGx5VXJsQnVpbGRlci5wcm90b3R5cGUuYWRkUGF0aCA9IGZ1bmN0aW9uKGZyYWdtZW50cykge1xuICAgICAgICAgICAgaWYgKCFmcmFnbWVudHMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBhcmdzID0gXy5jb21wYWN0KFtdLmNvbmNhdChmcmFnbWVudHMpKTtcbiAgICAgICAgICAgIHRoaXMucGF0aCArPSBwYXRoU2VwYXJhdG9yICsgdGhpcy5zaW1wbGlmeUNoYXJhY3RlcnNGaWx0ZXIoYXJncy5qb2luKGZyYWdtZW50U2VwYXJhdG9yKSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcblxuICAgICAgICBTZW9GcmllbmRseVVybEJ1aWxkZXIucHJvdG90eXBlLnNldFBhdGggPSBmdW5jdGlvbiAoZnJhZ21lbnRzKSB7XG4gICAgICAgICAgICB0aGlzLnBhdGggPSBidWlsZEJhc2VQYXRoKCk7XG4gICAgICAgICAgICB0aGlzLmFkZFBhdGgoZnJhZ21lbnRzKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuXG4gICAgICAgIFNlb0ZyaWVuZGx5VXJsQnVpbGRlci5wcm90b3R5cGUuYnVpbGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXRoICsgKGNvbmZpZy51cmxTY2hlbWEudHJhaWxpbmdTbGFzaCA/ICcvJyA6ICcnKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gU2VvRnJpZW5kbHlVcmxCdWlsZGVyO1xuXG4gICAgICAgIGZ1bmN0aW9uIGJ1aWxkQmFzZVBhdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gVVJJKCkub3JpZ2luKCkgKyAkd2luZG93LmdldEJhc2VQYXRoKCkgKyBjb25maWcucGRzUGF0aFByZWZpeDtcbiAgICAgICAgfVxuICAgIH1cblxuXG59KShhbmd1bGFyLCBVUkkpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jYXRhbG9nLnNlcnZpY2UnKVxuICAgICAgICAuc2VydmljZSgndXJsUGFyc2VyU2VydmljZScsIFVybFBhcnNlcik7XG5cbiAgICBVcmxQYXJzZXIuJGluamVjdCA9IFsnY29uZmlnJ107XG5cbiAgICB2YXIgY291bnRyeU1hdGNoSW5kZXggPSAxO1xuICAgIHZhciBsYW5ndWFnZU1hdGNoSW5kZXggPSAyO1xuICAgIHZhciByb290U2VnbWVudE1hdGNoSW5kZXggPSAzO1xuICAgIHZhciBjYXRhbG9nSWRNYXRjaEluZGV4ID0gNDtcblxuICAgICAgICAgICAgICAgICAgICAgIC8qKiAgezF9ezJ9ICAgezN9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgezR9ICAgICoqL1xuICAgICAgICAgICAgICAgICAgICAgIC8qKiAvY2gvZGUvcmVzaWRlbnRpYWwuaHRtbC9xd2UvYXNkL3F3ZS9hc2QvcG9pdXV5LTEzNDIzMy1jICoqL1xuICAgIHZhciBwYXRoUGF0dGVybiA9IC9eXFwvKFthLXpdezJ9KVxcLyhbYS16XXsyfSlcXC8oPzpvY3NcXC8pPyhbXlxcL10qKSg/OlxcLmh0bWwpP1xcLyg/Oi4qLShbMC05XSopLVtwY11cXC8/JCk/L2k7XG4gICAgdmFyIGxhbmd1YWdlUGF0dGVybiA9IC8oXFwvW2Etel17Mn1cXC8pKFthLXpdezJ9KSguKikvaTtcblxuICAgIGZ1bmN0aW9uIFVybFBhcnNlcihjb25maWcpIHtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgfVxuXG4gICAgVXJsUGFyc2VyLnByb3RvdHlwZS5pc09DUyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLmdldENhdGFsb2dJZCgpO1xuICAgIH07XG5cbiAgICBVcmxQYXJzZXIucHJvdG90eXBlLmdldFJvb3RTZWdtZW50ID0gZnVuY3Rpb24gZ2V0Um9vdFNlZ21lbnQoKSB7XG4gICAgICAgIHJldHVybiBtYXRjaEZvckluZGV4KHJvb3RTZWdtZW50TWF0Y2hJbmRleCkgfHwgdGhpcy5jb25maWcubWV0YVRhZ3Muc2l0ZU5hbWU7XG4gICAgfTtcblxuICAgIFVybFBhcnNlci5wcm90b3R5cGUuZ2V0Q2F0YWxvZ0lkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbWF0Y2hGb3JJbmRleChjYXRhbG9nSWRNYXRjaEluZGV4KTtcbiAgICB9O1xuXG4gICAgVXJsUGFyc2VyLnByb3RvdHlwZS5nZXRMYW5ndWFnZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG1hdGNoRm9ySW5kZXgobGFuZ3VhZ2VNYXRjaEluZGV4KTtcbiAgICB9O1xuXG4gICAgVXJsUGFyc2VyLnByb3RvdHlwZS5zZXRMYW5ndWFnZSA9IGZ1bmN0aW9uICh1cmwsIGxhbmd1YWdlKSB7XG4gICAgICAgIHZhciB1cmkgPSBuZXcgVVJJKHVybCk7XG4gICAgICAgIHVyaS5wYXRoKHVyaS5wYXRoKCkucmVwbGFjZShsYW5ndWFnZVBhdHRlcm4sICckMScgKyBsYW5ndWFnZSArICckMycpKTtcbiAgICAgICAgcmV0dXJuIHVyaS50b1N0cmluZygpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBtYXRjaEZvckluZGV4KGluZGV4KSB7XG4gICAgICAgIHZhciBtYXRjaCA9IG5ldyBVUkkoKS5wYXRoKCkubWF0Y2gocGF0aFBhdHRlcm4pO1xuICAgICAgICByZXR1cm4gbWF0Y2ggJiYgbWF0Y2hbaW5kZXhdO1xuICAgIH1cblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24oYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZShcInBkcy5uYXZpZ2F0aW9uLmNvbnRyb2xsZXJcIilcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJNZW51Q29udHJvbGxlclwiLCBNZW51Q29udHJvbGxlcik7XG5cbiAgICBNZW51Q29udHJvbGxlci4kaW5qZWN0ID0gWydNZW51U2VydmljZScsICdfJywgJ2NvbmZpZyddO1xuXG4gICAgZnVuY3Rpb24gTWVudUNvbnRyb2xsZXIobWVudVNlcnZpY2UsIF8sIGNvbmZpZykge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5pdGVtTGltaXQgPSBjb25maWcubmF2aWdhdGlvbk1heEVsZW1lbnRzO1xuICAgICAgICB2bS5tZW51ID0gdm0ubWVudSB8fCB7XG4gICAgICAgICAgICBuYW1lOiBhbmd1bGFyLmVsZW1lbnQoJyNvY3MtbmF2JykuY2hpbGRyZW4oJ2EnKS50ZXh0KClcbiAgICAgICAgfTtcblxuICAgICAgICBtZW51U2VydmljZVxuICAgICAgICAgICAgLmdldE1lbnUoKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24obWVudSkge1xuICAgICAgICAgICAgICAgIHZtLm1lbnUgPSBtZW51O1xuICAgICAgICAgICAgfSk7XG4gICAgfVxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24oYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLm5hdmlnYXRpb24ubW9kZWwnKVxuICAgICAgICAuY29uZmlnKE5hdmlnYXRpb25Db25maWcpO1xuXG4gICAgTmF2aWdhdGlvbkNvbmZpZy4kaW5qZWN0ID0gWydlbnYnLCAnTmF2aWdhdGlvblByb3ZpZGVyJ107XG5cbiAgICBmdW5jdGlvbiBOYXZpZ2F0aW9uQ29uZmlnKGVudiwgTmF2aWdhdGlvblByb3ZpZGVyKSB7XG4gICAgICAgIE5hdmlnYXRpb25Qcm92aWRlci5uYXZpZ2F0aW9uRW5kcG9pbnQoZW52LmVuZFBvaW50LmNvbnRlbnRTZXJ2aWNlKTtcbiAgICB9XG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMubmF2aWdhdGlvbi5tb2RlbCcpXG4gICAgICAgIC5wcm92aWRlcignTmF2aWdhdGlvbicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB1cmwgPSBudWxsO1xuXG4gICAgICAgICAgICB0aGlzLm5hdmlnYXRpb25FbmRwb2ludCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHVybCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy4kZ2V0ID0gWyckcmVzb3VyY2UnLCAnJGNhY2hlRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UsICRjYWNoZUZhY3RvcnkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IE5hdmlnYXRpb24oJHJlc291cmNlLCAkY2FjaGVGYWN0b3J5LCB1cmwpO1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICBmdW5jdGlvbiBOYXZpZ2F0aW9uKCRyZXNvdXJjZSwgJGNhY2hlRmFjdG9yeSwgdXJsKSB7XG4gICAgICAgIHZhciBjYXRhbG9nQ2FjaGUgPSAkY2FjaGVGYWN0b3J5KFwibmF2aWdhdGlvblwiKTtcbiAgICAgICAgdmFyIG1ldGhvZHMgPSB7XG4gICAgICAgICAgICBnZXQ6IHttZXRob2Q6ICdHRVQnLCBjYWNoZTogY2F0YWxvZ0NhY2hlfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gJHJlc291cmNlKHVybCArICdyZXN0L2RvY3VtZW50L2Rpc3BsYXknLCBudWxsLCBtZXRob2RzKTtcbiAgICB9XG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbihhbmd1bGFyKSB7XG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKFwicGRzLm5hdmlnYXRpb24uc2VydmljZVwiKVxuXHRcdC5zZXJ2aWNlKFwiTWVudVNlcnZpY2VcIiwgTWVudVNlcnZpY2UpO1xuXG5cdE1lbnVTZXJ2aWNlLiRpbmplY3QgPSBbJ3VybFBhcnNlclNlcnZpY2UnLCAnXycsICdOYXZpZ2F0aW9uJywgJ2xvY2FsZScsICckcSddO1xuXG5cdGZ1bmN0aW9uIE1lbnVTZXJ2aWNlKHVybFBhcnNlclNlcnZpY2UsIF8sIE5hdmlnYXRpb24sIGxvY2FsZSwgJHEpIHtcbiAgICAgICAgdmFyIE5BVklHQVRJT05fVEVNUExBVEVfTkFNRSA9ICdDQVRBTE9HX0hJRVJBUkNIWSc7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5jdXJyZW50TG9jYWxlID0gbG9jYWxlLnRvU3RyaW5nKCk7XG4gICAgICAgIHNlbGYuZmxhdE5hdmlnYXRpb24gPSB7fTtcbiAgICAgICAgc2VsZi5nZXRNZW51ID0gZ2V0TWVudTtcbiAgICAgICAgc2VsZi5maW5kSW5OYXZpZ2F0aW9uID0gZmluZEluTmF2aWdhdGlvbjtcbiAgICAgICAgc2VsZi5maW5kUGFyZW50SW5OYXZpZ2F0aW9uID0gZmluZFBhcmVudEluTmF2aWdhdGlvbjtcblxuXHRcdGZ1bmN0aW9uIGdldE1lbnUobG9jYWxlKSB7XG4gICAgICAgICAgICB2YXIgcHJvcGVyTG9jYWxlID0gbG9jYWxlIHx8IHNlbGYuY3VycmVudExvY2FsZTtcbiAgICAgICAgICAgIHZhciBuYXYgPSBuZXcgTmF2aWdhdGlvbih7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogTkFWSUdBVElPTl9URU1QTEFURV9OQU1FLFxuICAgICAgICAgICAgICAgICAgICBjaGFubmVsOiBnZXRPQ1NDaGFubmVsKClcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG1vZGVsOiB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsZTogcHJvcGVyTG9jYWxlLFxuICAgICAgICAgICAgICAgICAgICBjaGFubmVsOiBnZXRPQ1NDaGFubmVsKClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblx0XHRcdHJldHVybiBOYXZpZ2F0aW9uXG4gICAgICAgICAgICAgICAgLmdldCh7cXVlcnk6IG5hdn0pXG4gICAgICAgICAgICAgICAgLiRwcm9taXNlXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIXJlcy5yb290KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5yb290LmNoaWxkcmVuWzBdO1xuXHRcdFx0XHR9KVxuXHRcdH1cblxuXG4gICAgICAgIGZ1bmN0aW9uIGdldE9DU0NoYW5uZWwoKSB7XG4gICAgICAgICAgICByZXR1cm4gYW5ndWxhci5lbGVtZW50KCdtZXRhW25hbWU9XCJvY3MtY2hhbm5lbFwiXScpLmF0dHIoJ2NvbnRlbnQnKVxuICAgICAgICB9XG5cblx0XHRmdW5jdGlvbiBnZXRGbGF0TWVudShsb2NhbGUpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRNZW51KGxvY2FsZSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAobWVudSkge1xuICAgICAgICAgICAgICAgICAgICBsb2NhbGUgPSBsb2NhbGUgfHwgc2VsZi5jdXJyZW50TG9jYWxlO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmZsYXROYXZpZ2F0aW9uW2xvY2FsZV0gPSBzZWxmLmZsYXROYXZpZ2F0aW9uW2xvY2FsZV0gfHwgZmxhdE1lbnUobWVudSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmZsYXROYXZpZ2F0aW9uW2xvY2FsZV07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZsYXRNZW51KG1lbnUsIGZsYXQpIHtcbiAgICAgICAgICAgIGZsYXQgPSBmbGF0IHx8IFtdO1xuICAgICAgICAgICAgZmxhdC5wdXNoKG1lbnUpO1xuICAgICAgICAgICAgXy5lYWNoKG1lbnUuY2hpbGRyZW4sIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgZmxhdE1lbnUoaXRlbSwgZmxhdCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBmbGF0O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmluZEluTmF2aWdhdGlvbihpZCwgbG9jYWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0RmxhdE1lbnUobG9jYWxlKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGZsYXQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF8uZmluZChmbGF0LCB7aWQ6IFN0cmluZyhpZCl9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZpbmRQYXJlbnRJbk5hdmlnYXRpb24oY2hpbGRJZCwgbG9jYWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gXy5maW5kKHNlbGYuZmxhdE5hdmlnYXRpb25bbG9jYWxlIHx8IHNlbGYuY3VycmVudExvY2FsZV0sIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gISFfLmZpbmQodmFsLmNoaWxkcmVuLCB7aWQ6IGNoaWxkSWR9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cdH1cblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24oYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZShcInBkcy5zZWFyY2guY29udHJvbGxlclwiKVxuICAgICAgICAuY29udHJvbGxlcihcIlF1aWNrc2VhcmNoQ29udHJvbGxlclwiLCBRdWlja3NlYXJjaENvbnRyb2xsZXIpO1xuXG4gICAgUXVpY2tzZWFyY2hDb250cm9sbGVyLiRpbmplY3QgPSBbJyRsb2NhdGlvbicsICckc3RhdGUnLCAnJHJvb3RTY29wZScsICdTZWFyY2hTZXJ2aWNlJywgJyR3aW5kb3cnXTtcblxuICAgIGZ1bmN0aW9uIFF1aWNrc2VhcmNoQ29udHJvbGxlcigkbG9jYXRpb24sICRzdGF0ZSwgJHJvb3RTY29wZSwgU2VhcmNoU2VydmljZSwgJHdpbmRvdykge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5zdWdnZXN0ID0gc3VnZ2VzdDtcbiAgICAgICAgdm0uZ29UbyA9IGdvVG87XG4gICAgICAgIHZtLmRvU2VhcmNoID0gZG9TZWFyY2g7XG5cbiAgICAgICAgLy9GSVhNRSBhIGhhY2sgdG8gcHJvY2VlZCB0byBzdGF0ZSBgc2VhcmNoYCBhZnRlciBlbnRlcmluZyBzZWFyY2guaHRtbFxuICAgICAgICB2YXIgcGF0aCA9ICRsb2NhdGlvbi5wYXRoKCk7XG4gICAgICAgIGlmIChwYXRoICYmIHBhdGguaW5kZXhPZignc2VhcmNoLmh0bWwnKSA+IC0xICYmICEkc3RhdGUuaXMoJ3NlYXJjaCcpKSB7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ3NlYXJjaCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc3VnZ2VzdCgpIHtcbiAgICAgICAgICAgIHJldHVybiBTZWFyY2hTZXJ2aWNlXG4gICAgICAgICAgICAgICAgLnN1Z2dlc3Qodm0ucXVpY2tzZWFyY2gpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdm0uYXV0b3N1Z2dlc3QgPSBkYXRhO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ29Ubyh0YXJnZXQpIHtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgncGRzLnNlYXJjaC5uYXZpZ2F0ZScsIHt0YXJnZXQ6IHRhcmdldH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZG9TZWFyY2goJGl0ZW0pIHtcbiAgICAgICAgICAgIGlmICghJGl0ZW0gfHwgJGl0ZW0ud2hpY2ggPT09IDEzKSB7XG4gICAgICAgICAgICAgICAgJHdpbmRvdy5uYXZpZ2F0ZSgnc2VhcmNoLmh0bWw/dGVybXM9JyArIHZtLnF1aWNrc2VhcmNoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoXCJwZHMuc2VhcmNoLmNvbnRyb2xsZXJcIilcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJTZWFyY2hDb250cm9sbGVyXCIsIFNlYXJjaENvbnRyb2xsZXIpO1xuXG4gICAgU2VhcmNoQ29udHJvbGxlci4kaW5qZWN0ID0gWyckYW5jaG9yU2Nyb2xsJywgJ1NlYXJjaFNlcnZpY2UnLCAnY21zU2VhcmNoTGlzdGVuZXInLCAnJHJvb3RTY29wZScsICckbG9jYXRpb24nLCAnJHdpbmRvdycsICdfJywgJ3RyYW5zbGF0ZUZpbHRlciddO1xuXG4gICAgZnVuY3Rpb24gU2VhcmNoQ29udHJvbGxlcigkYW5jaG9yU2Nyb2xsLCBTZWFyY2hTZXJ2aWNlLCBjbXNTZWFyY2hMaXN0ZW5lciwgJHJvb3RTY29wZSwgJGxvY2F0aW9uLCAkd2luZG93LCBfLCB0cmFuc2xhdGVGaWx0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0uZmluYWxTZWFyY2hSZXN1bHRzID0gW107XG4gICAgICAgIHZtLnNlYXJjaFRlcm0gPSAkbG9jYXRpb24uc2VhcmNoKCkudGVybXM7XG4gICAgICAgIHZtLmNvbnRhY3RUZXh0ID0gdHJhbnNsYXRlRmlsdGVyKCdTRUFSQ0guTk8uUkVTVUxULkNIRUNLTElTVC4zJywge2NvbnRhY3RMaW5rOiBcIjxhIGhyZWY9J1wiICsgdHJhbnNsYXRlRmlsdGVyKCdTRUFSQ0guQ09OVEFDVC5VUkwnKSArIFwiJyBjbGFzcz0nbGluay1pbmxpbmUnIHRhcmdldD0nX3NlbGYnPlwiICsgdHJhbnNsYXRlRmlsdGVyKCdTRUFSQ0guQ09OVEFDVCcpICsgXCI8L2E+XCJ9KTtcbiAgICAgICAgdm0ub25TZWFyY2hJbnB1dCA9IG9uU2VhcmNoSW5wdXQ7XG4gICAgICAgIHZtLmdvVG9BbmNob3IgPSBnb1RvQW5jaG9yO1xuICAgICAgICB2bS5nb01vcmUgPSBnb01vcmU7XG5cbiAgICAgICAgY21zU2VhcmNoTGlzdGVuZXJcbiAgICAgICAgICAgIC5saXN0ZW4oKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICAgICAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcGFyYW0udGFyZ2V0LnJlc291cmNlTG9jYXRpb247XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgc2VhcmNoKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gc2VhcmNoKCkge1xuICAgICAgICAgICAgaWYgKCF2bS5zZWFyY2hUZXJtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdm0udG90YWxMZW5ndGggPSBmYWxzZTtcbiAgICAgICAgICAgICRsb2NhdGlvbi5zZWFyY2goJ3Rlcm1zJywgdm0uc2VhcmNoVGVybSk7XG5cbiAgICAgICAgICAgIHJldHVybiBTZWFyY2hTZXJ2aWNlXG4gICAgICAgICAgICAgICAgLnNlYXJjaCh2bS5zZWFyY2hUZXJtKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0udG90YWxMZW5ndGggPSBkYXRhLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgdm0uZmluYWxTZWFyY2hSZXN1bHRzID0gXy5ncm91cEJ5KGRhdGEsICdjaGFubmVsRGlzY3JpbWluYXRvcicpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb25TZWFyY2hJbnB1dChrZXlFdmVudCkge1xuICAgICAgICAgICAgaWYgKGtleUV2ZW50LndoaWNoID09PSAxMykge1xuICAgICAgICAgICAgICAgIHNlYXJjaCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ29Ub0FuY2hvcihpZFRvR28pIHtcbiAgICAgICAgICAgICRsb2NhdGlvbi5oYXNoKGlkVG9Hbyk7XG4gICAgICAgICAgICAkYW5jaG9yU2Nyb2xsLnlPZmZzZXQgPSA4MDtcbiAgICAgICAgICAgICRhbmNob3JTY3JvbGwoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdvTW9yZShwYXJhbSkge1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdwZHMuc2VhcmNoLm5hdmlnYXRlJywge3RhcmdldDogcGFyYW19KTtcbiAgICAgICAgfVxuICAgIH1cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5zZWFyY2gubW9kZWwnKVxuICAgICAgICAuY29uZmlnKFNlYXJjaFByb3ZpZGVyKTtcblxuICAgIFNlYXJjaFByb3ZpZGVyLiRpbmplY3QgPSBbJ2VudicsICdTZWFyY2hQcm92aWRlciddO1xuXG4gICAgZnVuY3Rpb24gU2VhcmNoUHJvdmlkZXIoZW52LCBTZWFyY2hQcm92aWRlcikge1xuICAgICAgICBTZWFyY2hQcm92aWRlci5zZWFyY2hFbmRwb2ludChlbnYuZW5kUG9pbnQuc2VhcmNoU2VydmljZSk7XG4gICAgfVxuXG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLnNlYXJjaC5tb2RlbCcpXG4gICAgICAgIC5wcm92aWRlcignU2VhcmNoJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHVybCA9IG51bGw7XG5cbiAgICAgICAgICAgIHRoaXMuc2VhcmNoRW5kcG9pbnQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB1cmwgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuJGdldCA9IFsnJHJlc291cmNlJywgJ2xvY2FsZScsIGZ1bmN0aW9uICgkcmVzb3VyY2UsIGxvY2FsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU2VhcmNoKCRyZXNvdXJjZSwgbG9jYWxlLCB1cmwpO1xuICAgICAgICAgICAgfV07XG4gICAgICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gU2VhcmNoKCRyZXNvdXJjZSwgbG9jYWxlLCB1cmwpIHtcbiAgICAgICAgdmFyIG1ldGhvZHMgPSB7XG4gICAgICAgICAgICBsb2NhbGl6ZToge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWUsIHBhcmFtczoge3R5cGU6ICdsb2NhbGl6ZSd9fVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gJHJlc291cmNlKHVybCArICcvcmVzb3VyY2UvOnR5cGUvOmxvY2FsZScsIHtsb2NhbGU6IGxvY2FsZX0sIG1ldGhvZHMpO1xuICAgIH1cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5zZWFyY2gucm91dGUnKVxuICAgICAgICAuY29uZmlnKFJvdXRlQ29uZmlnKTtcblxuICAgIFJvdXRlQ29uZmlnLiRpbmplY3QgPSBbJyRzdGF0ZVByb3ZpZGVyJywgJ2NvbmZpZyddO1xuXG4gICAgZnVuY3Rpb24gUm91dGVDb25maWcoJHN0YXRlUHJvdmlkZXIsIGNvbmZpZykge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5wZHNSb3V0ZSh7XG4gICAgICAgICAgICBuYW1lOiAnc2VhcmNoJyxcbiAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgIHRlcm1zOiBudWxsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzZWFyY2guaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnU2VhcmNoQ29udHJvbGxlciBhcyB2bSdcbiAgICAgICAgfSk7XG4gICAgfVxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5zZWFyY2guc2VydmljZScpXG4gICAgICAgIC5zZXJ2aWNlKCdjbXNTZWFyY2hMaXN0ZW5lcicsIENtc1NlYXJjaExpc3RlbmVyKTtcblxuICAgIENtc1NlYXJjaExpc3RlbmVyLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAnJHEnLCAnY29uZmlnJ107XG5cbiAgICBmdW5jdGlvbiBDbXNTZWFyY2hMaXN0ZW5lcigkcm9vdCwgJHEsIGNvbmZpZykge1xuICAgICAgICB0aGlzLmxpc3RlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWYgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgJHJvb3QuJG9uKCdwZHMuc2VhcmNoLm5hdmlnYXRlJywgZnVuY3Rpb24gKGV2ZW50LCBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoISFwYXJhbXMudGFyZ2V0LnJlc291cmNlTG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmLnJlc29sdmUocGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBkZWYucHJvbWlzZTtcbiAgICAgICAgfVxuICAgIH1cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uKGFuZ3VsYXIpIHtcblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoXCJwZHMuc2VhcmNoLnNlcnZpY2VcIilcblx0XHQuc2VydmljZShcIlNlYXJjaFNlcnZpY2VcIiwgU2VhcmNoU2VydmljZSk7XG5cblx0U2VhcmNoU2VydmljZS4kaW5qZWN0ID0gWyckcScsICdTZWFyY2gnLCAnbG9jYWxlJ107XG5cbiAgICB2YXIgTUlOX0FVVE9TVUdHRVNUX1RFUk1fTEVOR1RIID0gMjtcblxuICAgIGZ1bmN0aW9uIFNlYXJjaFNlcnZpY2UoJHEsIFNlYXJjaCwgbG9jYWxlKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHNlYXJjaDogc2VhcmNoLFxuXHRcdFx0c3VnZ2VzdDogc3VnZ2VzdFxuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBzZWFyY2goc2VhcmNoKSB7XG5cdFx0XHRyZXR1cm4gU2VhcmNoLnF1ZXJ5KHtsb2NhbGU6IGxvY2FsZSwgc2VhcmNoVGVybTogc2VhcmNofSkuJHByb21pc2U7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc3VnZ2VzdChzZWFyY2hUZXJtKSB7XG4gICAgICAgICAgICBpZiAoc2VhcmNoVGVybSAmJiBzZWFyY2hUZXJtLmxlbmd0aCA+IE1JTl9BVVRPU1VHR0VTVF9URVJNX0xFTkdUSCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTZWFyY2gubG9jYWxpemUoe2xvY2FsZTogbG9jYWxlLCBzZWFyY2hUZXJtOiBzZWFyY2hUZXJtfSkuJHByb21pc2U7XG4gICAgICAgICAgICB9XG5cdFx0XHRyZXR1cm4gJHEucmVzb2x2ZShbXSk7XG5cdFx0fVxuXG5cdH1cblxufSkoYW5ndWxhcik7XG4iXX0=
